import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// ---------- CORS ----------
const ALLOWED = (process.env.ALLOWED_ORIGINS || "http://127.0.0.1:5500,http://localhost:5500").split(",");
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok = ALLOWED.includes(origin);
      cb(null, ok);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);
app.use(express.json());

// Middleware para webhooks
app.use('/payment_webhook', express.json({ verify: (req, res, buf) => {
  req.rawBody = buf.toString();
}}));

// ---------- Utils ----------
function normalizeBaseUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

function buildBackUrls(baseURL) {
  return {
    success: `${baseURL}/?status=success`,
    failure: `${baseURL}/?status=failure`,
    pending: `${baseURL}/?status=pending`,
  };
}

async function postPreference(pref, token) {
  const r = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pref),
  });
  const text = await r.text();
  return { ok: r.ok, status: r.status, text };
}

// ---------- Health ----------
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---------- Webhook ----------
app.post("/payment_webhook", async (req, res) => {
  try {
    console.log('🔔 Webhook recibido de MercadoPago');
    
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentId = data.id;
      console.log('💰 ID de pago recibido:', paymentId);
      
      // Obtener detalles del pago desde MercadoPago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener pago: ${response.status}`);
      }
      
      const payment = await response.json();
      console.log('📊 Estado del pago:', payment.status);
      
      if (payment.status === 'approved') {
        // ✅ PAGO APROBADO
        console.log('✅ Pago aprobado correctamente');
        // Aquí puedes guardar en base de datos, enviar email, etc.
      }
      
      res.status(200).json({ success: true, message: 'Webhook processed' });
    } else {
      console.log('ℹ️ Webhook de tipo no manejado:', type);
      res.status(200).json({ success: true, message: 'Webhook no manejado' });
    }
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ RUTA GET TEMPORAL PARA PRUEBAS EN NAVEGADOR
app.get("/payment_webhook", (req, res) => {
  res.send('✅ Endpoint de webhook funcionando. Mercado Pago usará POST para los webhooks reales.');
});

// ---------- Crear preference ----------
app.post("/create_preference", async (req, res) => {
  try {
    const { items, metadata } = req.body;

    // 1) Token requerido
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Falta MP_ACCESS_TOKEN en .env" });
    }

    // 2) Base pública (env o fallback)
    const baseFromEnv = normalizeBaseUrl(process.env.PUBLIC_URL);
    const baseURL = baseFromEnv || "http://localhost:3000";

    // 3) back_urls bien formadas
    const back_urls = buildBackUrls(baseURL);

    // 4) Ítems normalizados
    const mpItems = (items || []).map((i) => ({
      title: String(i?.title ?? "Producto").slice(0, 255),
      quantity: Number(i?.quantity) || 1,
      unit_price: Number(i?.unit_price) || 0,
      currency_id: "ARS",
      description: i?.description || "Producto Verdulería José"
    }));
    
    if (!mpItems.length) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    // 5) Preferencia con webhook
    let preference = {
      items: mpItems,
      back_urls,
      auto_return: "approved",
      notification_url: `${baseURL}/payment_webhook`,
      external_reference: "vj_" + Date.now(),
      metadata: metadata || {}
    };

    console.log(">> POST a MP con webhook...");
    let r1 = await postPreference(preference, token);

    // Si vino invalid_auto_return, reintentamos sin auto_return
    if (!r1.ok && /invalid_auto_return|back_url\.success must be defined/i.test(r1.text)) {
      console.warn("!! MP devolvió invalid_auto_return. Reintentando SIN auto_return...");
      preference = { 
        items: mpItems, 
        back_urls,
        notification_url: `${baseURL}/payment_webhook`,
        external_reference: "vj_" + Date.now(),
        metadata: metadata || {}
      };
      let r2 = await postPreference(preference, token);
      if (!r2.ok) {
        console.error("MP ERROR (sin auto_return)", r2.status, r2.text);
        return res.status(500).send(r2.text);
      }
      const data2 = JSON.parse(r2.text);
      console.log("<< Preference creada (sin auto_return):", data2.id);
      return res.json({ id: data2.id, init_point: data2.init_point });
    }

    if (!r1.ok) {
      console.error("MP ERROR", r1.status, r1.text);
      return res.status(500).send(r1.text);
    }

    const data = JSON.parse(r1.text);
    console.log("<< Preference creada:", data.id);
    return res.json({ id: data.id, init_point: data.init_point });
  } catch (e) {
    console.error("Server error:", e);
    return res
      .status(500)
      .json({ error: "Error creando preference", details: String(e?.message || e) });
  }
});

// ✅ RUTA RAIZ PARA PRUEBAS
app.get("/", (req, res) => {
  res.send('✅ Servidor de Mercado Pago funcionando correctamente');
});

// ---------- Arranque ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MP server listo en http://localhost:${PORT}`);
  console.log(`Webhook configurado en: ${(process.env.PUBLIC_URL || ('http://localhost:'+PORT)) + '/payment_webhook'}`);
});
# Verdulería José — E-commerce

Sitio de e-commerce para una verdulería de barrio.  
Permite navegar productos, agregar al carrito y pagar con **Mercado Pago**. El frontend está desplegado en Vercel y el backend en Render.

**Demo en producción:** https://verduleria-front.vercel.app/

---

## Resumen del proyecto

Este proyecto es una tienda online simple (HTML/CSS/JavaScript) con:

- Catálogo de productos (frontend estático dinámico con JS).
- Carrito de compras en el navegador.
- Creación de preferencias de pago con **Mercado Pago** (backend Node.js).
- Webhook para recibir notificaciones de pago y validar estado.
- Despliegue:
  - Frontend: **Vercel** (hosting estático)
  - Backend: **Render** (Web Service Node)

---

## Estructura del repositorio

```
/client                  # Frontend (index.html, css, js, assets)
  /media                 # HTML, CSS, imágenes públicas
  /js                    # Scripts del frontend (cart.js, products.js, ...)
/server                  # Backend Node.js (index.js, package.json)
  .env.example
README.md
vercel.json              # (opcional) rewrite / → /media/
```

---

## Tecnologías

- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: Node.js + Express (o servidor HTTP mínimo)
- Pagos: Mercado Pago (modo TEST y modo PRODUCCIÓN)
- Hosting: Vercel (front) y Render (backend)

---

## Requisitos locales

- Node.js (v14+ recomendado) — solo para el backend local
- Git + GitHub Desktop (o línea de comandos)
- Navegador moderno

---

## Variables de entorno (backend — Render / local)

Crea un archivo `.env` local o configura las variables en Render:

- `MP_ACCESS_TOKEN` = **Access token** de Mercado Pago (TEST o PROD)
- `ALLOWED_ORIGINS` = orígenes permitidos para CORS (ej.: `http://127.0.0.1:5500,http://localhost:5500,https://verduleria-front.vercel.app`)
- `PUBLIC_URL` = URL pública del frontend (ej.: `https://verduleria-front.vercel.app`)

> No subas `.env` a GitHub. Usa `.env.example` para documentar las variables.

---

## Ejecutar localmente

### Backend
1. En la carpeta `server`:
```bash
npm install
npm run start        # o `node index.js`
```
2. API disponible en `http://localhost:3000` (o el puerto que use `process.env.PORT`).

### Frontend
- Abrir `client/media/index.html` con Live Server (VSCode) o con `http-server` / abrirlo directamente con `file://` (mejor con un servidor local para evitar problemas CORS).

---

## Configurar Mercado Pago (modo TEST)

1. Crear cuenta en Mercado Pago (o usar cuenta existente).
2. Obtener:
   - **Public Key (TEST)** → poner en `client/media/index.html` como `window.MP_PUBLIC_KEY = "TEST-...";`
   - **Access Token (TEST)** → configurar en backend (`MP_ACCESS_TOKEN`).
3. Para pruebas, usar tarjetas de prueba oficiales de Mercado Pago.

---

## Deploy (resumen)

### Backend — Render
1. Crear nuevo **Web Service** en Render.
2. Conectar GitHub y seleccionar el repo `verduleria-api` (o la carpeta `server`).
3. Start command: `npm run start`
4. Environment variables: configurar `MP_ACCESS_TOKEN`, `ALLOWED_ORIGINS`, `PUBLIC_URL`.
5. Deploy → copiar URL pública del servicio (ej.: `https://verduleria-api.onrender.com`).

### Frontend — Vercel
1. Importar repo `verduleria-front` en Vercel.
2. Root directory: `media` **o** raíz (si usas `vercel.json` con rewrites).
3. Build command: vacío, Output directory: `.`
4. Deploy → copiar dominio (ej.: `https://verduleria-front.vercel.app`).
5. Actualizar `ALLOWED_ORIGINS` y `PUBLIC_URL` en Render con el dominio de Vercel y redeploy del backend.

---

## Probar flujo de pago (fin a fin)
1. Abrir el dominio de Vercel.
2. Agregar producto(s) al carrito y hacer "Finalizar compra".
3. Mercado Pago abrirá (widget o init_point). Completar con tarjeta de prueba.
4. Al aprobar: el backend recibe la notificación `payment_webhook` y consulta el pago para confirmar `approved`.
5. El front muestra el popup de éxito y se vacía el carrito.

---

## Buenas prácticas y recomendaciones

- Mantener `MP_ACCESS_TOKEN` solo en el backend (nunca en el frontend).
- Usar claves **TEST** para pruebas y cambiar a **PROD** en producción.
- Guardar pedidos confirmados en una base de datos (Supabase/Mongo/Sheets) desde el webhook para trazabilidad.
- Añadir logs y verificación idempotente (guardar `payment_id` procesados) para evitar duplicados.
- Añadir `robots.txt`, `sitemap.xml` y meta tags para SEO si se hace público.

---

## Links útiles
- App frontend: https://verduleria-front.vercel.app/

---


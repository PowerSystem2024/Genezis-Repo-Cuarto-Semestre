// client/js/cart.js
import { PRODUCTS } from "./products.js";

const STORAGE_KEY = "vj_cart";
const API_URL = (window.API_URL || "https://verduleria-api.onrender.com");

export function findProduct(id){ return PRODUCTS.find(p=>p.id===id); }
function formatPrice(n){ return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS"}).format(n); }
function $(s){ return document.querySelector(s); }

function resetCheckoutUI(){
  const mp = $("#mp-button"); if(mp) mp.innerHTML = "";
  const valueProp = $("#mp-value-prop"); if (valueProp) valueProp.remove();
  const ck = $("#checkout");
  if (ck) { ck.style.display=""; ck.disabled=false; ck.textContent="Finalizar compra"; }
  // No removemos iframes internos del SDK (para no cortar navegación)
  sessionStorage.removeItem("vj_mp_pending");
}
window.vjResetCheckoutUI = resetCheckoutUI;

function loadCart(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))??[] }catch{ return [] } }
function saveCart(c){ localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); }

export function getCart(){ return loadCart(); }
export function getCartCount(){ return loadCart().reduce((a,i)=>a+i.qty,0); }
export function getCartTotal(){
  return loadCart().reduce((s,i)=>{ const p=findProduct(i.id); return p? s+p.price*i.qty : s; },0);
}
export function addToCart(id){
  const c=loadCart(); const i=c.findIndex(x=>x.id===id);
  if(i>=0) c[i].qty+=1; else c.push({id,qty:1});
  saveCart(c); renderCart();
}
export function removeFromCart(id){
  saveCart(loadCart().filter(i=>i.id!==id)); renderCart();
}
export function changeQty(id,d){
  const c=loadCart(); const it=c.find(i=>i.id===id); if(!it) return;
  it.qty+=d; const cc = it.qty<=0? c.filter(i=>i.id!==id):c; saveCart(cc); renderCart();
}
export function clearCart(){ localStorage.setItem(STORAGE_KEY,"[]"); renderCart(); }

function initializeCart(){
  try{
    const c=localStorage.getItem(STORAGE_KEY);
    if(c===null) localStorage.setItem(STORAGE_KEY,"[]");
    else JSON.parse(c);
  }catch{ localStorage.setItem(STORAGE_KEY,"[]"); }
}

export function renderCart(){
  const box=$("#cartItems"), total=$("#cartTotal"), count=$("#cartCount");
  if(!box||!total){ if(count) count.textContent=getCartCount(); return; }

  const cart=loadCart();
  if(!cart.length){
    box.innerHTML=`<div class="muted" style="padding:12px">Tu carrito está vacío.</div>`;
    total.textContent=formatPrice(0);
    if(count) count.textContent=0;
    resetCheckoutUI();
    return;
  }

  let sum=0;
  box.innerHTML = cart.map(it=>{
    const p=findProduct(it.id); if(!p) return "";
    const line=p.price*it.qty; sum+=line;
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" style="width:42px;height:42px;object-fit:cover;border-radius:8px">
        <div>
          <div><strong>${p.name}</strong></div>
          <div class="muted">${p.unit} • ${formatPrice(p.price)}</div>
          <div class="qty" style="margin-top:6px">
            <button type="button" data-action="dec" data-id="${it.id}">−</button>
            <span>${it.qty}</span>
            <button type="button" data-action="inc" data-id="${it.id}">+</button>
            <button type="button" class="danger" data-action="del" data-id="${it.id}">Eliminar</button>
          </div>
        </div>
        <div class="line-total">${formatPrice(line)}</div>
      </div>`;
  }).join("");

  total.textContent=formatPrice(sum);
  if(count) count.textContent=getCartCount();

  box.querySelectorAll("button[data-action]").forEach(b=>{
    const id=b.dataset.id, a=b.dataset.action;
    b.addEventListener("click",()=>{
      if(a==="inc") changeQty(id,1);
      if(a==="dec") changeQty(id,-1);
      if(a==="del") removeFromCart(id);
    });
  });
}

function wireCartUI(){
  const open=$("#openCart"), close=$("#closeCart"), dialog=$("#cartDialog"), clear=$("#clearCart"), wrap=dialog?.querySelector(".cart-box");
  if(open&&dialog) open.addEventListener("click", ()=>{
    resetCheckoutUI();
    renderCart();
    if(dialog.showModal) dialog.showModal(); else dialog.classList.add("open");
    document.body.classList.add("modal-open");
  });
  function closeDlg(){
    if(dialog?.open&&dialog.close) dialog.close(); else dialog?.classList.remove("open");
    document.body.classList.remove("modal-open");
    setTimeout(resetCheckoutUI, 200);
  }
  if(close&&dialog) close.addEventListener("click",(e)=>{ e.preventDefault(); closeDlg(); });
  if(dialog) dialog.addEventListener("click",(e)=>{
    const r=wrap?.getBoundingClientRect();
    const out=r&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom);
    if(out) closeDlg();
  });
  if(clear) clear.addEventListener("click", clearCart);
}

/* Crea preferencia con back_urls para volver a ESTA página, vaciar, y luego redirigir */
async function createPreferenceFromCart(){
  const cart=getCart(); if(!cart.length){ alert("Agregá productos primero."); return null; }
  const items=cart.map(it=>{
    const p=findProduct(it.id);
    return { title:p.name, quantity:it.qty, unit_price:p.price, description:`${p.name} - ${p.unit}` };
  });

  // URL de retorno a esta misma vista (para poder vaciar y luego redirigir)
  const here = window.location.origin + window.location.pathname;

  const resp=await fetch(`${API_URL}/create_preference`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      items,
      // ⚠️ Tu backend debe traspasar estos campos a la creación de la preferencia de MP
      back_urls: {
        success: `${here}?status=success`,
        failure: `${here}?status=failure`,
        pending: `${here}?status=pending`
      },
      auto_return: "approved",
      metadata:{ cart_items:cart.map(x=>({id:x.id,qty:x.qty})), timestamp:new Date().toISOString() }
    })
  });

  const txt=await resp.text(); let data={}; try{ data=JSON.parse(txt); }catch{}
  if(!resp.ok){
    console.error("Server error:",txt);
    alert("No se pudo crear la orden:\n"+txt);
    return null;
  }
  return data; // { id, init_point, ... }
}

/* Render del botón oficial (solo logo) y flujo de navegación correcto */
function setupCheckoutButton(){
  const checkoutBtn=$("#checkout");
  const container=$("#mp-button");
  const dialog=$("#cartDialog");
  if(!checkoutBtn) return;

  checkoutBtn.addEventListener("click", async ()=>{
    checkoutBtn.disabled=true;
    checkoutBtn.textContent="Creando orden...";

    try{
      const pref=await createPreferenceFromCart();
      if(!pref || !pref.id) { alert("No se pudo crear la preferencia."); return; }

      if (window.MercadoPago && window.MP_PUBLIC_KEY && container) {
        container.innerHTML = "";

        const mp = new MercadoPago(window.MP_PUBLIC_KEY, { locale: "es-AR" });
        mp.checkout({
          preference: { id: pref.id },
          render: { container: "#mp-button" } // sin 'label' => solo logo
        });

        // Value prop (opcional)
        let valueProp = document.getElementById("mp-value-prop");
        if (!valueProp) {
          valueProp = document.createElement("p");
          valueProp.id = "mp-value-prop";
          valueProp.className = "mercadopago-secure-text";
          valueProp.textContent = "Pagá de forma segura";
          container.insertAdjacentElement("afterend", valueProp);
        }

        // Ocultar "Finalizar compra"
        checkoutBtn.style.display = "none";

        // Cerrar modal un poco después del click (no antes)
        container.addEventListener("click", () => {
          setTimeout(() => {
            if (dialog?.open && dialog.close) dialog.close();
            document.body.classList.remove("modal-open");
          }, 300);
        }, { once: true });

        container.scrollIntoView({ behavior:"smooth", block:"center" });
        return;
      }

      // Fallback: sin SDK, redirijo al init_point
      if (pref.init_point) {
        if (dialog?.open && dialog.close) dialog.close();
        document.body.classList.remove("modal-open");
        window.location.href = pref.init_point;
      } else {
        alert("No se pudo iniciar el pago (faltan datos de preferencia).");
      }

    }catch(err){
      console.error("Checkout error:",err);
      alert("Error conectando con Mercado Pago.");
      setTimeout(resetCheckoutUI, 300);
    }finally{
      checkoutBtn.disabled=false;
      checkoutBtn.textContent="Finalizar compra";
    }
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  initializeCart();
  wireCartUI();
  renderCart();
  setupCheckoutButton();
});

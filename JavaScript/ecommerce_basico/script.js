const PRODUCTS = [
  { id: 'ford-galaxy', brand: 'Ford', model: 'Galaxy 2.0 GLI', year: 1994, price: 3500000, img: 'img/galaxy.jpg', desc: 'Motor 2.0, 4 puertas, aire acondicionado, dirección hidráulica.' },
  { id: 'ford-kuga', brand: 'Ford', model: 'Kuga Hybrid', year: 2023, price: 24500000, img: 'img/ford_kuga.jpg', desc: 'SUV híbrida, motor 2.5, tecnología y seguridad de última generación.' },
  { id: 'toyota-etios', brand: 'Toyota', model: 'Etios 1.5', year: 2021, price: 9500000, img: 'img/etios.jpg', desc: 'Motor 1.5, 5 puertas, bajo consumo, ideal para ciudad.' },
  { id: 'mercedes-sprinter', brand: 'Mercedes-Benz', model: 'Sprinter', year: 2020, price: 18500000, img: 'img/sprinter.jpg', desc: 'Furgón, motor diesel, gran capacidad de carga, ideal para trabajo.' },
  { id: 'ford-transit', brand: 'Ford', model: 'Transit', year: 2022, price: 19500000, img: 'img/transit.jpg', desc: 'Van moderna, motor 2.2 diesel, espacio para 12 pasajeros.' },
  { id: 'toyota-corolla', brand: 'Toyota', model: 'Corolla XEi', year: 2022, price: 14500000, img: 'img/corolla.jpg', desc: 'Sedán, motor 2.0, caja automática, excelente confort y seguridad.' },
  { id: 'fiat-argo', brand: 'Fiat', model: 'Argo Drive', year: 2020, price: 8200000, img: 'img/fiat.jpg', desc: 'Hatchback, motor 1.3, bajo mantenimiento, ideal para jóvenes.' },
  { id: 'honda-moto', brand: 'Honda', model: 'CBR 500R', year: 2023, price: 9800000, img: 'img/honda_moto.jpg', desc: 'Moto deportiva, motor 500cc, ABS, ideal para ciudad y ruta.' },
  { id: 'yamaha-moto', brand: 'Yamaha', model: 'MT-03', year: 2022, price: 8700000, img: 'img/yamaha.jpg', desc: 'Moto naked, motor 321cc, diseño moderno, muy ágil.' }
];

const state = { cart: {} };

function fmt(n) { return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }); }

function renderProductos() {
  const cont = document.getElementById('productos');
  cont.innerHTML = '';
  PRODUCTS.forEach(p => {
    const div = document.createElement('div');
    div.style = 'border:1px solid #ddd; margin:1em 0; padding:1em; border-radius:8px; background:#fff;';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.brand} ${p.model}" style="width:120px;vertical-align:middle;">
      <b>${p.brand} ${p.model}</b> (${p.year})<br>
      <span>${fmt(p.price)}</span><br>
      <small>${p.desc}</small><br>
      <button>Agregar al carrito</button>
    `;
    div.querySelector('button').onclick = () => addToCart(p.id);
    cont.appendChild(div);
  });
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
  bumpCount();
  showToast('Agregado al carrito');
}

function removeFromCart(id) {
  if (!state.cart[id]) return;
  state.cart[id]--;
  if (state.cart[id] <= 0) delete state.cart[id];
  renderCart();
  bumpCount();
}

function deleteFromCart(id) {
  delete state.cart[id];
  renderCart();
  bumpCount();
}

function renderCart() {
  const wrap = document.getElementById('cartItems');
  wrap.innerHTML = '';
  let total = 0;
  for (const [id, qty] of Object.entries(state.cart)) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) continue;
    total += p.price * qty;
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${p.img}" alt="${p.brand}" style="width:60px;">
      ${p.brand} ${p.model} x${qty} = <b>${fmt(p.price * qty)}</b>
      <button>-</button>
      <button>+</button>
      <button>Quitar</button>
    `;
    const [minus, plus, del] = div.querySelectorAll('button');
    minus.onclick = () => removeFromCart(id);
    plus.onclick = () => addToCart(id);
    del.onclick = () => deleteFromCart(id);
    wrap.appendChild(div);
  }
  document.getElementById('total').textContent = fmt(total);
}

function bumpCount() {
  document.getElementById('count').textContent = Object.values(state.cart).reduce((a, b) => a + b, 0);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 7000);
}


document.getElementById('openCart').onclick = () => {
  document.getElementById('carrito').style.display = 'block';
  renderCart();
};
document.getElementById('closeCart').onclick = () => {
  document.getElementById('carrito').style.display = 'none';
};
document.getElementById('empty').onclick = () => {
  state.cart = {};
  renderCart();
  bumpCount();
};
document.getElementById('checkout').onclick = () => {
  if (Object.keys(state.cart).length === 0) {
    showToast('El carrito está vacío');
    return;
  }
  showToast('¡Compra confirmada! Que lo disfrutes, tus vehículos serán entregados pronto 🚗🚚🏍️');
  setTimeout(() => {
    state.cart = {};
    renderCart();
    bumpCount();
    document.getElementById('carrito').style.display = 'none';
  }, 7000);
};

const carrito = document.getElementById('carrito');
const header = document.getElementById('carritoHeader');
const minBtn = document.getElementById('minCarrito');
let offsetX = 0, offsetY = 0, isDragging = false;
let isMinimized = false;

header.addEventListener('mousedown', function(e) {
  if (e.target === minBtn) return; 
  isDragging = true;
  offsetX = e.clientX - carrito.offsetLeft;
  offsetY = e.clientY - carrito.offsetTop;
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  carrito.style.left = (e.clientX - offsetX) + 'px';
  carrito.style.top = (e.clientY - offsetY) + 'px';
  carrito.style.right = 'auto';
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  document.body.style.userSelect = '';
});


minBtn.onclick = () => {
  isMinimized = !isMinimized;
  if (isMinimized) {
    carrito.style.height = '48px';
    carrito.style.overflow = 'hidden';
    minBtn.textContent = '⬆';
    
    Array.from(carrito.children).forEach((el, i) => { if (i > 0) el.style.display = 'none'; });
  } else {
    carrito.style.height = '';
    carrito.style.overflow = '';
    minBtn.textContent = '_';
    Array.from(carrito.children).forEach((el, i) => { if (i > 0) el.style.display = ''; });
  }
};

renderProductos();
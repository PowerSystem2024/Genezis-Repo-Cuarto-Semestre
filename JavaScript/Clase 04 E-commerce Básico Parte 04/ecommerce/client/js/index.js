// client/js/index.js
import { PRODUCTS } from "./products.js";
import { addToCart, getCartCount } from "./cart.js";

const $ = (s) => document.querySelector(s);

function renderProducts(list) {
  const grid = $("#productGrid");
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = `<p class="muted">No se encontraron productos.</p>`;
    return;
  }

  for (const p of list) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img class="product-img" src="${p.image}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <p class="muted">${p.category} • ${p.unit}</p>
        <p class="price">$${p.price}</p>
        <button class="btn add-btn" data-id="${p.id}">Agregar</button>
      </div>
    `;
    grid.appendChild(card);
  }

  grid.querySelectorAll(".add-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      addToCart(e.currentTarget.dataset.id);
      updateCartCount();
    })
  );
}

function applyFilters() {
  let result = [...PRODUCTS];

  const q = $("#q")?.value.trim().toLowerCase() || "";
  if (q) result = result.filter((p) => p.name.toLowerCase().includes(q));

  const cat = $("#cat")?.value || "";
  if (cat) result = result.filter((p) => p.category === cat);

  const sort = $("#sort")?.value || "name-asc";
  switch (sort) {
    case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "price-asc": result.sort((a, b) => a.price - b.price); break;
    case "price-desc": result.sort((a, b) => b.price - a.price); break;
  }

  renderProducts(result);
}

function updateCartCount() {
  const el = $("#cartCount");
  if (el) el.textContent = getCartCount();
}

function init() {
  applyFilters();
  updateCartCount();
  $("#q")?.addEventListener("input", applyFilters);
  $("#cat")?.addEventListener("change", applyFilters);
  $("#sort")?.addEventListener("change", applyFilters);
}

document.addEventListener("DOMContentLoaded", init);


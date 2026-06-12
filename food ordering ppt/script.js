/**
 * FeastRush — script.js
 * Handles: Auth, Menu, Cart, Checkout, Form Validation, localStorage
 */

/* ============================================================
   DATA — Food Menu Items
   ============================================================ */
const MENU_DATA = [
  {
    id: 1, name: "Paneer Butter Masala", category: "Veg", price: 299, originalPrice: 349,
    rating: 4.7, time: "25 min",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
    tag: "veg"
  },
  {
    id: 2, name: "Chicken Biryani", category: "Non-Veg", price: 349, originalPrice: 399,
    rating: 4.8, time: "35 min",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
    tag: "nonveg"
  },
  {
    id: 3, name: "Margherita Pizza", category: "Pizza", price: 279, originalPrice: 320,
    rating: 4.5, time: "30 min",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
    tag: "veg"
  },
  {
    id: 4, name: "Zinger Burger", category: "Burgers", price: 199, originalPrice: 249,
    rating: 4.4, time: "20 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    tag: "nonveg"
  },
  {
    id: 5, name: "Mango Lassi", category: "Drinks", price: 89, originalPrice: 110,
    rating: 4.6, time: "10 min",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
    tag: "veg"
  },
  {
    id: 6, name: "Gulab Jamun", category: "Desserts", price: 149, originalPrice: 180,
    rating: 4.9, time: "15 min",
    image: "https://images.unsplash.com/photo-1666113781283-829f45a41bc8?w=400&q=80",
    tag: "veg"
  },
  {
    id: 7, name: "Chicken Hakka Noodles", category: "Chinese", price: 249, originalPrice: 299,
    rating: 4.3, time: "25 min",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
    tag: "nonveg"
  },
  {
    id: 8, name: "Dal Makhani", category: "Veg", price: 249, originalPrice: 299,
    rating: 4.6, time: "30 min",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&q=80",
    tag: "veg"
  },
  {
    id: 9, name: "BBQ Chicken Pizza", category: "Pizza", price: 349, originalPrice: 420,
    rating: 4.7, time: "35 min",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    tag: "nonveg"
  },
  {
    id: 10, name: "Veg Fried Rice", category: "Chinese", price: 199, originalPrice: 239,
    rating: 4.2, time: "20 min",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
    tag: "veg"
  },
  {
    id: 11, name: "Classic Cheeseburger", category: "Burgers", price: 229, originalPrice: 269,
    rating: 4.5, time: "20 min",
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&q=80",
    tag: "nonveg"
  },
  {
    id: 12, name: "Cold Coffee", category: "Drinks", price: 129, originalPrice: 160,
    rating: 4.4, time: "10 min",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
    tag: "veg"
  },
  {
    id: 13, name: "Chocolate Brownie", category: "Desserts", price: 169, originalPrice: 199,
    rating: 4.8, time: "15 min",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    tag: "veg"
  },
  {
    id: 14, name: "Butter Chicken", category: "Non-Veg", price: 329, originalPrice: 379,
    rating: 4.9, time: "30 min",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
    tag: "nonveg"
  },
  {
    id: 15, name: "Masala Dosa", category: "Veg", price: 179, originalPrice: 219,
    rating: 4.5, time: "20 min",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80",
    tag: "veg"
  },
  {
    id: 16, name: "Strawberry Shake", category: "Drinks", price: 149, originalPrice: 179,
    rating: 4.6, time: "10 min",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
    tag: "veg"
  }
];

/* ============================================================
   STATE
   ============================================================ */
let cart          = loadCart();       // { id: { ...item, qty } }
let currentFilter = "All";
let currentSearch = "";
let promoApplied  = false;
let currentUser   = null;

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Check if already logged in
  const saved = sessionStorage.getItem("fr_user");
  if (saved) {
    currentUser = JSON.parse(saved);
    bootApp();
  }

  // Form submissions
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("register-form").addEventListener("submit", handleRegister);

  // Payment option styling
  document.querySelectorAll(".pay-option input").forEach(inp => {
    inp.addEventListener("change", () => {
      document.querySelectorAll(".pay-option").forEach(o => o.classList.remove("active"));
      inp.closest(".pay-option").classList.add("active");
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
  });

  // Close user dropdown on outside click
  document.addEventListener("click", e => {
    const userEl = document.querySelector(".nav-user");
    if (userEl && !userEl.contains(e.target)) {
      document.getElementById("user-dropdown").classList.remove("open");
    }
  });

  updateCartBadge();
});

/* ============================================================
   AUTH HELPERS
   ============================================================ */
function showPage(id) {
  document.querySelectorAll(".auth-page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function togglePass(inputId, btn) {
  const inp = document.getElementById(inputId);
  const icon = btn.querySelector("i");
  if (inp.type === "password") {
    inp.type = "text";
    icon.className = "bi bi-eye-slash";
  } else {
    inp.type = "password";
    icon.className = "bi bi-eye";
  }
}

/* ============================================================
   LOGIN
   ============================================================ */
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  let valid   = true;

  clearErrors(["login-email-err", "login-pass-err"]);

  if (!validateEmail(email)) {
    showError("login-email-err", "Please enter a valid email address.");
    markError("login-email");
    valid = false;
  }
  if (pass.length < 6) {
    showError("login-pass-err", "Password must be at least 6 characters.");
    markError("login-pass");
    valid = false;
  }

  if (!valid) return;

  // Simulate login (replace with API call later)
  currentUser = { name: email.split("@")[0], email };
  sessionStorage.setItem("fr_user", JSON.stringify(currentUser));
  bootApp();
}

/* ============================================================
   REGISTER
   ============================================================ */
function handleRegister(e) {
  e.preventDefault();
  const name    = document.getElementById("reg-name").value.trim();
  const email   = document.getElementById("reg-email").value.trim();
  const phone   = document.getElementById("reg-phone").value.trim();
  const pass    = document.getElementById("reg-pass").value;
  const confirm = document.getElementById("reg-confirm").value;
  let valid     = true;

  clearErrors(["reg-name-err","reg-email-err","reg-phone-err","reg-pass-err","reg-confirm-err"]);

  if (name.length < 2) {
    showError("reg-name-err", "Please enter your full name."); markError("reg-name"); valid = false;
  }
  if (!validateEmail(email)) {
    showError("reg-email-err", "Please enter a valid email."); markError("reg-email"); valid = false;
  }
  if (!/^\+?[\d\s\-]{8,15}$/.test(phone)) {
    showError("reg-phone-err", "Enter a valid phone number."); markError("reg-phone"); valid = false;
  }
  if (pass.length < 6) {
    showError("reg-pass-err", "Password must be at least 6 characters."); markError("reg-pass"); valid = false;
  }
  if (pass !== confirm) {
    showError("reg-confirm-err", "Passwords do not match."); markError("reg-confirm"); valid = false;
  }

  if (!valid) return;

  currentUser = { name, email, phone };
  sessionStorage.setItem("fr_user", JSON.stringify(currentUser));
  bootApp();
}

/* ============================================================
   APP BOOTSTRAP
   ============================================================ */
function bootApp() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("app-section").classList.remove("hidden");
  document.getElementById("nav-username").textContent = currentUser.name;
  renderMenu(MENU_DATA);
  updateCartBadge();
  showSection("home");
}

function logout() {
  sessionStorage.removeItem("fr_user");
  currentUser = null;
  cart = {};
  saveCart();
  location.reload();
}

/* ============================================================
   SECTION NAVIGATION
   ============================================================ */
function showSection(name) {
  document.querySelectorAll(".app-section").forEach(s => s.classList.add("hidden"));
  document.getElementById(`${name}-section`).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (name === "cart")     renderCart();
  if (name === "checkout") renderCheckout();
}

/* ============================================================
   MENU RENDERING
   ============================================================ */
function renderMenu(items) {
  const grid = document.getElementById("menu-grid");
  const noRes = document.getElementById("no-results");
  const count = document.getElementById("result-count");

  grid.innerHTML = "";

  if (items.length === 0) {
    grid.classList.add("hidden");
    noRes.classList.remove("hidden");
    count.textContent = "";
    return;
  }

  grid.classList.remove("hidden");
  noRes.classList.add("hidden");
  count.textContent = `(${items.length} items)`;

  items.forEach((item, idx) => {
    const inCart = cart[item.id];
    const card   = document.createElement("div");
    card.className = "food-card";
    card.style.animationDelay = `${idx * 0.04}s`;
    card.innerHTML = `
      <div class="food-card-img">
        <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200?text=Food'"/>
        <span class="food-badge badge-${item.tag}">${item.tag === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}</span>
      </div>
      <div class="food-card-body">
        <div class="food-name" title="${item.name}">${item.name}</div>
        <div class="food-meta">
          <span class="food-rating"><i class="bi bi-star-fill"></i>${item.rating}</span>
          <span class="food-time"><i class="bi bi-clock"></i> ${item.time}</span>
        </div>
        <div class="food-footer">
          <div class="food-price">₹${item.price}<span>₹${item.originalPrice}</span></div>
          <div id="card-action-${item.id}">
            ${inCart
              ? `<div class="qty-control">
                   <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
                   <span class="qty-num">${inCart.qty}</span>
                   <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
                 </div>`
              : `<button class="add-btn" onclick="addToCart(${item.id})">
                   <i class="bi bi-plus"></i> Add
                 </button>`
            }
          </div>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function getFilteredItems() {
  return MENU_DATA.filter(item => {
    const matchCat  = currentFilter === "All" || item.category === currentFilter;
    const matchName = item.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchCat && matchName;
  });
}

function filterCategory(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderMenu(getFilteredItems());
}

function handleSearch(val) {
  currentSearch = val;
  renderMenu(getFilteredItems());
}

/* ============================================================
   CART — add / remove / qty
   ============================================================ */
function addToCart(id) {
  const item = MENU_DATA.find(i => i.id === id);
  if (!item) return;

  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { ...item, qty: 1 };
  }
  saveCart();
  updateCardAction(id);
  updateCartBadge(true);
  showToast(`${item.name} added to cart!`);
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  updateCardAction(id);
  updateCartBadge();

  // If cart section open, re-render
  if (!document.getElementById("cart-section").classList.contains("hidden")) renderCart();
}

function removeFromCart(id) {
  const name = cart[id] ? cart[id].name : "";
  delete cart[id];
  saveCart();
  updateCardAction(id);
  updateCartBadge();
  renderCart();
  if (name) showToast(`${name} removed from cart.`);
}

function updateCardAction(id) {
  const el = document.getElementById(`card-action-${id}`);
  if (!el) return;
  const inCart = cart[id];
  el.innerHTML = inCart
    ? `<div class="qty-control">
         <button class="qty-btn" onclick="changeQty(${id},-1)">−</button>
         <span class="qty-num">${inCart.qty}</span>
         <button class="qty-btn" onclick="changeQty(${id},1)">+</button>
       </div>`
    : `<button class="add-btn" onclick="addToCart(${id})"><i class="bi bi-plus"></i> Add</button>`;
}

function updateCartBadge(pop = false) {
  const total = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  ["cart-count","cart-count-mob"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = total;
      if (pop) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
    }
  });
}

/* ============================================================
   RENDER CART
   ============================================================ */
function renderCart() {
  const items   = Object.values(cart);
  const empty   = document.getElementById("cart-empty");
  const content = document.getElementById("cart-content");
  const list    = document.getElementById("cart-items-list");

  if (items.length === 0) {
    empty.classList.remove("hidden");
    content.classList.add("hidden");
    return;
  }

  empty.classList.add("hidden");
  content.classList.remove("hidden");
  list.innerHTML = "";

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/90x80?text=Food'"/>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-cat">${item.category}</div>
        <div class="cart-item-footer">
          <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
          <div class="d-flex align-items-center gap-2">
            <div class="qty-control">
              <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove"><i class="bi bi-trash3"></i></button>
          </div>
        </div>
      </div>`;
    list.appendChild(row);
  });

  updateSummary();
}

function updateSummary() {
  const { subtotal, delivery, discount, total } = calcTotals();
  document.getElementById("sum-subtotal").textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById("sum-delivery").textContent = `₹${delivery}`;
  document.getElementById("sum-discount").textContent = `-₹${discount.toLocaleString()}`;
  document.getElementById("sum-total").textContent    = `₹${total.toLocaleString()}`;
}

function calcTotals() {
  const subtotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const discount = promoApplied ? Math.round(subtotal * 0.10) : 0;
  const total    = subtotal + delivery - discount;
  return { subtotal, delivery, discount, total };
}

/* ============================================================
   PROMO CODE
   ============================================================ */
function applyPromo() {
  const code  = document.getElementById("promo-input").value.trim().toUpperCase();
  const msgEl = document.getElementById("promo-msg");
  if (code === "FEAST10") {
    promoApplied = true;
    msgEl.textContent = "✅ Promo applied! 10% discount added.";
    msgEl.style.color = "#16a34a";
    showToast("Promo code applied! 10% off.");
    updateSummary();
  } else {
    msgEl.textContent = "❌ Invalid promo code. Try FEAST10.";
    msgEl.style.color = "#ef4444";
  }
}

/* ============================================================
   RENDER CHECKOUT
   ============================================================ */
function renderCheckout() {
  const items = Object.values(cart);
  const list  = document.getElementById("checkout-items-list");
  list.innerHTML = "";

  items.forEach(item => {
    const el = document.createElement("div");
    el.className = "co-item";
    el.innerHTML = `
      <div class="co-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/52x48?text=Food'"/>
      </div>
      <div class="co-item-info">
        <div class="co-item-name">${item.name}</div>
        <div class="co-item-qty">× ${item.qty}</div>
      </div>
      <div class="co-item-price">₹${(item.price * item.qty).toLocaleString()}</div>`;
    list.appendChild(el);
  });

  const { subtotal, discount, total } = calcTotals();
  document.getElementById("co-subtotal").textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById("co-discount").textContent = `-₹${discount.toLocaleString()}`;
  document.getElementById("co-total").textContent    = `₹${total.toLocaleString()}`;

  // Prefill name from user
  if (currentUser) {
    const nameEl = document.getElementById("co-name");
    if (nameEl && !nameEl.value) nameEl.value = currentUser.name || "";
  }
}

/* ============================================================
   PLACE ORDER
   ============================================================ */
function placeOrder() {
  const fields = [
    { id: "co-name",   err: "co-name-err",   msg: "Please enter your name.",          test: v => v.trim().length >= 2 },
    { id: "co-phone",  err: "co-phone-err",  msg: "Enter a valid phone number.",       test: v => /^\+?[\d\s\-]{8,15}$/.test(v) },
    { id: "co-street", err: "co-street-err", msg: "Please enter your street address.", test: v => v.trim().length >= 4 },
    { id: "co-city",   err: "co-city-err",   msg: "Please enter your city.",           test: v => v.trim().length >= 2 },
    { id: "co-state",  err: "co-state-err",  msg: "Please enter your state.",          test: v => v.trim().length >= 2 },
    { id: "co-pin",    err: "co-pin-err",    msg: "Enter a valid PIN code.",           test: v => /^\d{6}$/.test(v.trim()) }
  ];

  let valid = true;
  clearErrors(fields.map(f => f.err));
  fields.forEach(f => {
    const val = document.getElementById(f.id)?.value || "";
    if (!f.test(val)) {
      showError(f.err, f.msg);
      document.getElementById(f.id)?.classList.add("error");
      valid = false;
    } else {
      document.getElementById(f.id)?.classList.remove("error");
    }
  });

  if (!valid) { showToast("Please fill in all required fields.", true); return; }

  // Clear cart
  cart = {};
  saveCart();
  promoApplied = false;
  updateCartBadge();

  showSection("success");
}

function backToHome() {
  // Reset menu card actions
  document.querySelectorAll("[id^='card-action-']").forEach(el => {
    const id = parseInt(el.id.replace("card-action-",""));
    el.innerHTML = `<button class="add-btn" onclick="addToCart(${id})"><i class="bi bi-plus"></i> Add</button>`;
  });
  showSection("home");
}

/* ============================================================
   NAVBAR UTILS
   ============================================================ */
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const btn  = document.getElementById("hamburger-btn");
  const open = menu.classList.toggle("open");
  btn.querySelector("i").className = open ? "bi bi-x" : "bi bi-list";
}

function toggleUserMenu() {
  document.getElementById("user-dropdown").classList.toggle("open");
}

/* ============================================================
   FORM VALIDATION HELPERS
   ============================================================ */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(errId, msg) {
  const el = document.getElementById(errId);
  if (el) el.textContent = msg;
}

function clearErrors(errIds) {
  errIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

function markError(inputId) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const wrap = inp.closest(".input-wrap");
  if (wrap) {
    wrap.classList.add("error");
    inp.addEventListener("input", () => wrap.classList.remove("error"), { once: true });
  }
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
let toastTimer = null;
function showToast(msg, isError = false) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-msg");
  const icon  = toast.querySelector("i");

  msgEl.textContent = msg;
  icon.className    = isError ? "bi bi-exclamation-circle-fill" : "bi bi-check-circle-fill";
  icon.style.color  = isError ? "#f87171" : "#4ade80";
  toast.classList.remove("hidden");
  // Trigger reflow for transition
  void toast.offsetWidth;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 320);
  }, 2500);
}

/* ============================================================
   LOCAL STORAGE
   ============================================================ */
function saveCart() {
  try { localStorage.setItem("fr_cart", JSON.stringify(cart)); } catch(e) {}
}

function loadCart() {
  try {
    const data = localStorage.getItem("fr_cart");
    return data ? JSON.parse(data) : {};
  } catch(e) { return {}; }
}

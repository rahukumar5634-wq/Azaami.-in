const products = [
  {
    id: 1,
    name: "Smart Watch",
    category: "Electronics",
    price: 3499,
    originalPrice: 4999,
    emoji: "⌚",
    badge: "Hot"
  },
  {
    id: 2,
    name: "Sneakers",
    category: "Fashion",
    price: 2499,
    originalPrice: 3299,
    emoji: "👟",
    badge: "New"
  },
  {
    id: 3,
    name: "Coffee Maker",
    category: "Home",
    price: 2899,
    originalPrice: 3999,
    emoji: "☕",
    badge: "Popular"
  },
  {
    id: 4,
    name: "Cosmetic Kit",
    category: "Beauty",
    price: 1199,
    originalPrice: 1599,
    emoji: "💄",
    badge: "Best"
  },
  {
    id: 5,
    name: "Laptop Stand",
    category: "Office",
    price: 1699,
    originalPrice: 2199,
    emoji: "💻",
    badge: "Pro"
  },
  {
    id: 6,
    name: "Gaming Chair",
    category: "Furniture",
    price: 6899,
    originalPrice: 8999,
    emoji: "🪑",
    badge: "Top"
  },
  {
    id: 7,
    name: "Backpack",
    category: "Travel",
    price: 1999,
    originalPrice: 2799,
    emoji: "🎒",
    badge: "Sale"
  },
  {
    id: 8,
    name: "Yoga Mat",
    category: "Sports",
    price: 999,
    originalPrice: 1499,
    emoji: "🧘",
    badge: "Fresh"
  }
];

const categories = ["All", ...new Set(products.map((item) => item.category))];

let selectedCategory = "All";
let searchTerm = "";
let cart = [];

const productGrid = document.getElementById("productGrid");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalEl = document.getElementById("subtotal");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function formatPrice(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getFilteredProducts() {
  return products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderFilters() {
  categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-pill ${category === selectedCategory ? "active" : ""}" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".filter-pill").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderFilters();
      renderProducts();
    });
  });
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  renderCart();
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <span class="badge">${product.badge}</span>
            <span>${product.emoji}</span>
          </div>
          <div class="product-info">
            <div class="product-row">
              <h3 class="product-name">${product.name}</h3>
              <span class="product-rating">★ 4.8</span>
            </div>
            <p class="product-category">${product.category}</p>
            <div class="price-row">
              <div class="price">${formatPrice(product.price)} <small>${formatPrice(product.originalPrice)}</small></div>
              <button data-id="${product.id}">Add</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".product-card button").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function renderCart() {
  const cartProductMap = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return { ...product, qty: item.qty };
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!cartProductMap.length) {
    cartItems.innerHTML = '<div class="empty-state">Your cart is empty.</div>';
    subtotalEl.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = cartProductMap
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-meta">
            <div class="cart-item-thumb">${item.emoji}</div>
            <div>
              <h4>${item.name}</h4>
              <p>Qty: ${item.qty}</p>
            </div>
          </div>
          <div class="cart-price">
            <div>${formatPrice(item.price * item.qty)}</div>
          </div>
        </div>
      `
    )
    .join("");

  const total = cartProductMap.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotalEl.textContent = formatPrice(total);
}

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

document.querySelector(".cart-toggle").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("visible");
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("visible");
});

cartOverlay.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("visible");
});

renderFilters();
renderProducts();
renderCart();


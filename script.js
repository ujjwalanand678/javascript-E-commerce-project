// DOM Elements
const products = document.querySelector(".products");
const all = document.querySelector(".all");
const menClothing = document.querySelector(".men-clothing");
const womenClothing = document.querySelector(".women-clothing");
const jewelery = document.querySelector(".jewelery");
const electronics = document.querySelector(".electronics");
const navLinkOne = document.querySelectorAll(".nav-bar-3 .btn-1");
const navLinkTwo = document.querySelectorAll(".nav-bar-4 .btn-2");

// Load products from API and render
async function loadProducts(input) {
  const productsContainer = products;
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    let products = await response.json();

    productsContainer.innerHTML = "";

    if (input !== undefined && input !== null && input !== "all") {
      products = products.filter((data) => data.category === input);
    }

    products.forEach((prod) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${prod.image}" alt="${prod.title}">
        <h4 class="title">${prod.title}</h4>
        <p class="description">${prod.description}</p>
        <hr class="card-divider">
        <p class="price">$${prod.price.toFixed(2)}</p>
        <hr class="card-divider">
        <div class="actions">
          <button class="details">Details</button>
          <button class="add-to-cart">Add to cart</button>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Fetch error:", err);
    productsContainer.textContent = "Failed to load products.";
  }
}

// Event delegation for Add to Cart
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const card = event.target.closest(".product-card");
    const title = card.querySelector(".title").textContent;
    const price = parseFloat(
      card.querySelector(".price").textContent.replace("$", "")
    );
    const image = card.querySelector("img").src;

    let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existing = cartItems.find((item) => item.title === title);

    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ title, price, image, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
    
  }
});

// Update cart count in nav
function updateCartCount() {
  const count = JSON.parse(localStorage.getItem("cartItems") || "[]").reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count;
}

// Filter button styles
const filterButtons = [all, menClothing, womenClothing, jewelery, electronics];

function clearButtonStyles() {
  filterButtons.forEach((btn) => {
    if (btn) {
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    }
  });
}

function styleActiveButton(btn) {
  if (btn) {
    btn.style.backgroundColor = "#000";
    btn.style.color = "#fff";
    btn.style.borderColor = "#000";
  }
}

// Nav highlighting
document.addEventListener("DOMContentLoaded", () => {
  navLinkOne.forEach((link) => {
    if (link.href === window.location.href) {
      link.style.color = "black";
    }
  });
  navLinkTwo.forEach((link) => {
    if (link.href === window.location.href) {
      link.style.backgroundColor = "black";
      link.style.color = "#f2f2f2";
      link.style.borderColor = "black";
    }
  });
});

// Filter listeners
if (all) {
  all.addEventListener("click", () => {
    loadProducts("all");
    clearButtonStyles();
    styleActiveButton(all);
  });
}

if (menClothing) {
  menClothing.addEventListener("click", () => {
    loadProducts("men's clothing");
    clearButtonStyles();
    styleActiveButton(menClothing);
  });
}

if (womenClothing) {
  womenClothing.addEventListener("click", () => {
    loadProducts("women's clothing");
    clearButtonStyles();
    styleActiveButton(womenClothing);
  });
}

if (jewelery) {
  jewelery.addEventListener("click", () => {
    loadProducts("jewelery");
    clearButtonStyles();
    styleActiveButton(jewelery);
  });
}

if (electronics) {
  electronics.addEventListener("click", () => {
    loadProducts("electronics");
    clearButtonStyles();
    styleActiveButton(electronics);
  });
}

// Cart Page Renderer
function renderCartItems() {
  const itemList = document.querySelector(".item-list");
  const orderSummary = document.querySelector(".order");

  if (!itemList || !orderSummary) return;

  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  itemList.innerHTML = "";
  let total = 0;
  let count = 0;

  cartItems.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");
    const subtotal = item.price * item.quantity;
    total += subtotal;
    count += item.quantity;

    itemCard.innerHTML = `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-img"/>
        <div class="cart-details">
          <h4>${item.title}</h4>
          <div class="qty-row">
            <button class="qty-btn decrease" data-title="${
              item.title
            }">−</button>
            <span>${item.quantity}</span>
            <button class="qty-btn increase" data-title="${
              item.title
            }">+</button>
          </div>
          <p>${item.quantity} × $${item.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    itemList.appendChild(itemCard);
  });

  orderSummary.innerHTML = `
    <h3>Order Summary</h3>
    <p>Products (${count}) <span>$${total.toFixed(2)}</span></p>
    <p>Shipping <span>$30</span></p>
    <p><strong>Total amount</strong> <span><strong>$${(total + 30).toFixed(
      2
    )}</strong></span></p>
    <button class="checkout-btn">Go to checkout</button>
  `;
}

// Quantity change handling
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("increase") ||
    e.target.classList.contains("decrease")
  ) {
    const title = e.target.dataset.title;
    let cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const item = cart.find((i) => i.title === title);
    if (!item) return;

    if (e.target.classList.contains("increase")) {
      item.quantity += 1;
    } else {
      item.quantity = Math.max(1, item.quantity - 1);
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
  }
});

// Init on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (products) {
    loadProducts("all");
    clearButtonStyles();
    styleActiveButton(all);
  }
  renderCartItems();
});

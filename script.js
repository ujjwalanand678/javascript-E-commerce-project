const products = document.querySelector(".products");
const all = document.querySelector(".all");
const menClothing = document.querySelector(".men-clothing");
const womenClothing = document.querySelector(".women-clothing");
const jewelery = document.querySelector(".jewelery");
const electronics = document.querySelector(".electronics");
const navLinkOne = document.querySelectorAll(".nav-bar-3 .btn-1");
const navLinkTwo = document.querySelectorAll(".nav-bar-4 .btn-2");
const itemList = document.querySelector(".item-list");
const orderSummary = document.querySelector(".order");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartLink = document.querySelector('.nav-bar-4 a[href="./cart.html"]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartLink.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Cart (${totalItems})`;
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  updateCartCount();
}

// Load and display products
async function loadProducts(input) {
  const productsContainer = products;
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    let productList = await res.json();

    if (input && input !== "all") {
      productList = productList.filter((p) => p.category === input);
    }

    productsContainer.innerHTML = "";
    productList.forEach((prod) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.dataset.id = prod.id;
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

    setupAddToCartButtons();
  } catch (err) {
    console.error("Error loading products:", err);
    productsContainer.textContent = "Failed to load products.";
  }
}

function setupAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productCard = btn.closest(".product-card");
      const productId = parseInt(productCard.dataset.id);
      addToCart(productId);
    });
  });
}

// Category filter handlers
function clearButtonStyles() {
  [all, menClothing, womenClothing, jewelery, electronics].forEach((btn) => {
    btn.style.backgroundColor = "";
    btn.style.color = "";
    btn.style.borderColor = "";
  });
}

function styleActiveButton(btn) {
  btn.style.backgroundColor = "#000";
  btn.style.color = "#fff";
  btn.style.borderColor = "#000";
}

all?.addEventListener("click", () => {
  loadProducts("all");
  clearButtonStyles();
  styleActiveButton(all);
});

menClothing?.addEventListener("click", () => {
  loadProducts("men's clothing");
  clearButtonStyles();
  styleActiveButton(menClothing);
});

womenClothing?.addEventListener("click", () => {
  loadProducts("women's clothing");
  clearButtonStyles();
  styleActiveButton(womenClothing);
});

jewelery?.addEventListener("click", () => {
  loadProducts("jewelery");
  clearButtonStyles();
  styleActiveButton(jewelery);
});

electronics?.addEventListener("click", () => {
  loadProducts("electronics");
  clearButtonStyles();
  styleActiveButton(electronics);
});

document.addEventListener("DOMContentLoaded", () => {
  if (products) {
    loadProducts("all");
    clearButtonStyles();
    styleActiveButton(all);
  }
  updateCartCount();
  highlightNavLink();
  if (itemList && orderSummary) {
    renderCart();
  }
});

function highlightNavLink() {
  navLinkOne.forEach((link) => {
    if (link.href === window.location.href) link.style.color = "black";
  });
  navLinkTwo.forEach((link) => {
    if (link.href === window.location.href) {
      link.style.backgroundColor = "black";
      link.style.color = "#f2f2f2";
      link.style.borderColor = "black";
    }
  });
}

// Render cart page from localStorage
async function renderCart() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const allProducts = await res.json();
    itemList.innerHTML = "";

    let totalAmount = 0;
    let itemCount = 0;

    for (const item of cart) {
      const product = allProducts.find((p) => p.id === item.id);
      if (!product) continue;

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      itemCount += item.quantity;

      const itemCard = document.createElement("div");
      itemCard.classList.add("item-card");
      itemCard.innerHTML = `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.title}" class="cart-img"/>
          <div class="cart-details">
            <h4>${product.title}</h4>
            <div class="qty-row">
              <span>Quantity: ${item.quantity}</span>
            </div>
            <p>${item.quantity} × $${product.price.toFixed(2)}</p>
          </div>
        </div>
      `;
      itemList.appendChild(itemCard);
    }

    orderSummary.innerHTML = `
      <h3>Order Summary</h3>
      <p>Products (${itemCount}) <span>$${totalAmount.toFixed(2)}</span></p>
      <p>Shipping <span>$30</span></p>
      <p><strong>Total</strong> <span><strong>$${(totalAmount + 30).toFixed(
        2
      )}</strong></span></p>
      <button class="checkout-btn">Go to checkout</button>
    `;
  } catch (error) {
    console.error("Cart rendering error:", error);
    itemList.innerHTML = "<p>Failed to load cart.</p>";
  }
}

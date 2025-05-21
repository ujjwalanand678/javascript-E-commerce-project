// Select HTML elements once and store references in variables
// This makes it easy to work with these elements later in the script
const products = document.querySelector(".products"); // Container where product cards will go
const all = document.querySelector(".all"); // "All" filter button
const menClothing = document.querySelector(".men-clothing");
const womenClothing = document.querySelector(".women-clothing");
const jewelery = document.querySelector(".jewelery");
const electronics = document.querySelector(".electronics");
const navLinkOne = document.querySelectorAll(".nav-bar-3 .btn-1");
const navLinkTwo = document.querySelectorAll(".nav-bar-4 .btn-2")
const addToCart = document.querySelectorAll(".actions .add-to-cart");

// 1. Define an async function to load products from the API and display them
async function loadProducts(input) {
  // 2. Grab the container element where we'll insert product cards
  const productsContainer = products;

  try {
    // 3. Fetch the product list from the API
    //    We use "await" to pause until the request completes
    const response = await fetch("https://fakestoreapi.com/products");

    // 3a. Check for HTTP errors (status codes other than 200–299)
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // 3b. Parse the JSON response into a JavaScript array
    let products = await response.json();

    // 4. Clear any existing content in the container
    productsContainer.innerHTML = "";

    // 5. Apply category filter if needed
    //    If "input" is defined and not "all", filter the array
    if (input !== undefined && input !== null && input !== "all") {
      products = products.filter((data) => data.category === input);
    }

    // 6. Loop through the (filtered) products and create a card for each
    products.forEach((prod) => {
      // Create a new <div> element for the card
      const card = document.createElement("div");
      card.classList.add("product-card"); // Add CSS class for styling

      // Fill the card with HTML, using template literals for easy insertion
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

      // Add the completed card into the container
      productsContainer.appendChild(card);
    });
  } catch (err) {
    // 7. Error handling: log any problems and show a message
    console.error("Fetch error:", err);
    productsContainer.textContent = "Failed to load products.";
  }
}

// 8. Listen for page load, then fetch all products by default
//    "DOMContentLoaded" event ensures HTML is ready
document.addEventListener("DOMContentLoaded", () => loadProducts("all"));

// 9. Set up click handlers for each filter button
//    When clicked, they call loadProducts() with the appropriate category
// 9.1. Grab your filter buttons into an array
const filterButtons = [all, menClothing, womenClothing, jewelery, electronics];

// 9.2. Helpers to clear & set active styles
function clearButtonStyles() {
  filterButtons.forEach(btn => {
    // reset inline styles completely
    btn.style.backgroundColor = '';
    btn.style.color           = '';
    btn.style.borderColor     = '';
  });
}

function styleActiveButton(btn) {
  // for example: black background, white text, black border
  btn.style.backgroundColor = '#000';
  btn.style.color           = '#fff';
  btn.style.borderColor     = '#000';
}


// Highlight current nav link on load
document.addEventListener("DOMContentLoaded", () => {
  navLinkOne.forEach((link) => {
    if (link.href === window.location.href) {
      link.style.color = "black";
      
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  navLinkTwo.forEach((link) => {
    if (link.href === window.location.href) {
      link.style.backgroundColor = "black";
      link.style.color = "#f2f2f2";
      link.style.borderColor = "black";
    }
  });
});
// filter button style highlight on clicking
all.addEventListener("click", () => {
  loadProducts("all");
  clearButtonStyles();
  styleActiveButton(all);
});

menClothing.addEventListener("click", () => {
  loadProducts("men's clothing");
  clearButtonStyles();
  styleActiveButton(menClothing);
});

womenClothing.addEventListener("click", () => {
  loadProducts("women's clothing");
  clearButtonStyles();
  styleActiveButton(womenClothing);
});

jewelery.addEventListener("click", () => {
  loadProducts("jewelery");
  clearButtonStyles();
  styleActiveButton(jewelery);
});

electronics.addEventListener("click", () => {
  loadProducts("electronics");
  clearButtonStyles();
  styleActiveButton(electronics);
});

// 9.4. Optionally, mark “All” active on initial load:
document.addEventListener("DOMContentLoaded", () => {
  loadProducts("all");
  clearButtonStyles();
  styleActiveButton(all);
});


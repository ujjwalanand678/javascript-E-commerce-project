const products = document.querySelector(".products");
// 1 Define an async function that does your work
async function loadProducts() {
  // 2 Grab the container once
  const productsContainer = products;

  try {
    // 3 Fetch & await the JSON in two simple lines
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const products = await response.json();

    // 4 Clear any existing placeholder HTML
    productsContainer.innerHTML = "";

    // 5 Loop & append each card
    products.forEach((prod) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
          <img src="${prod.image}" alt="${prod.title}">
          <h4 class= "title">${prod.title}</h4>
          <P class ="description">${prod.description}</p>
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
  }
}

// 6 Wait for the DOM to be ready, then run your loader
document.addEventListener("DOMContentLoaded", loadProducts);

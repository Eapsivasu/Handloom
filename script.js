const products = [
  {
    id: "ashram-red",
    name: "The Ashram Red",
    region: "Kanchipuram",
    price: "₹18,900",
    amount: 18900,
    image: "https://images.unsplash.com/photo-1717835806988-3739f9e55926?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    alt: "Red and gold Kanchipuram silk saree",
    description: "A deep vermilion drape with a luminous gold border, made for celebrations that become family stories.",
    weave: "Pure mulberry silk, woven in Kanchipuram with a traditional zari border. Each saree is finished by hand."
  },
  {
    id: "garden-emerald",
    name: "Garden Emerald",
    region: "Chanderi",
    price: "₹9,400",
    amount: 9400,
    image: "https://images.unsplash.com/photo-1745482036066-5d215ed6b910?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    alt: "Green Chanderi saree with a delicate, airy drape",
    description: "An easy, garden-toned layer with a soft sheen, light enough for long afternoons and late dinners.",
    weave: "Handwoven Chanderi silk-cotton with a fine, translucent texture and a softly finished border."
  },
  {
    id: "turmeric-tussar",
    name: "Turmeric Tussar",
    region: "Bhagalpur",
    price: "₹12,200",
    amount: 12200,
    image: "https://images.unsplash.com/photo-1609748341642-ae4c6562bf3d?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    alt: "Golden turmeric Tussar saree with a natural silk texture",
    description: "Warm turmeric tones meet the quiet texture of Tussar, with an unfussy drape that only gets better with wear.",
    weave: "Bhagalpur Tussar silk, prized for its naturally textured finish and breathable feel. Woven in small batches."
  },
  {
    id: "street-silk",
    name: "Street Silk",
    region: "Varanasi",
    price: "₹24,500",
    amount: 24500,
    image: "https://images.unsplash.com/photo-1743015346338-24d9627085b2?fm=jpg&q=80&w=1400&auto=format&fit=crop",
    alt: "Contemporary Varanasi silk saree with a rich woven pattern",
    description: "A vivid Varanasi silk with a little city spirit: intricate at the edges, effortless everywhere else.",
    weave: "Banarasi silk woven in Varanasi with traditional brocade detailing and a hand-finished pallu."
  }
];

const shopPage = document.querySelector("#shop");
const shopHeading = document.querySelector("#shop-heading");
const productGrid = document.querySelector("#shop-products");
const productDetail = document.querySelector("#product-detail");
const bagView = document.querySelector("#bag-view");
const cartContent = document.querySelector("#cart-content");
const bagCount = document.querySelector("#bag-count");
const navBag = document.querySelector("#nav-bag");
const bagItems = {};

function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function updateBagCount() {
  const count = Object.values(bagItems).reduce((total, quantity) => total + quantity, 0);
  bagCount.textContent = count;
  navBag.setAttribute("aria-label", `Open bag, ${count} ${count === 1 ? "item" : "items"}`);
}

function renderProducts() {
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card" data-product="${product.id}" tabindex="0" aria-label="View details for ${product.name}">
      <div class="product-image"><img src="${product.image}" alt="${product.alt}" loading="lazy"></div>
      <div class="product-copy">
        <p class="eyebrow">${product.region}</p>
        <div class="product-title-row">
          <h2>${product.name}</h2>
          <span class="product-price">${product.price}</span>
        </div>
        <button class="product-open" type="button">View Details</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const cartProducts = products.filter((product) => bagItems[product.id] > 0);
  const count = cartProducts.reduce((total, product) => total + bagItems[product.id], 0);
  const total = cartProducts.reduce((sum, product) => sum + product.amount * bagItems[product.id], 0);
  updateBagCount();

  if (count === 0) {
    cartContent.innerHTML = `
      <div class="cart-empty">
        <h2>Your bag is empty.</h2>
        <p>Explore the edit to discover our handwoven sarees.</p>
        <div class="cart-summary-row"><span>Subtotal</span><strong>${formatPrice(0)}</strong></div>
        <div class="cart-summary-row cart-summary-total"><span>Total</span><strong>${formatPrice(0)}</strong></div>
        <a class="cart-explore" href="#shop">Explore the Edit</a>
      </div>
    `;
    return;
  }

  cartContent.innerHTML = `
    <div class="cart-list">
      ${cartProducts.map((product) => {
        const quantity = bagItems[product.id];
        return `
          <article class="cart-item">
            <div class="cart-item-image"><img src="${product.image}" alt="${product.alt}"></div>
            <div class="cart-item-copy">
              <p class="eyebrow">${product.region}</p>
              <h2>${product.name}</h2>
              <p class="cart-item-price">${product.price}</p>
            </div>
            <div class="cart-item-controls">
              <div class="cart-quantity" role="group" aria-label="Quantity for ${product.name}">
                <button type="button" data-cart-action="decrease" data-product="${product.id}" aria-label="Decrease ${product.name} quantity">−</button>
                <span aria-live="polite">${quantity}</span>
                <button type="button" data-cart-action="increase" data-product="${product.id}" aria-label="Increase ${product.name} quantity">+</button>
              </div>
              <p class="cart-line-subtotal">${formatPrice(product.amount * quantity)}</p>
            </div>
          </article>
        `;
      }).join("")}
    </div>
    <div class="cart-summary">
      <div class="cart-summary-row"><span>Subtotal (${count} ${count === 1 ? "item" : "items"})</span><strong>${formatPrice(total)}</strong></div>
      <div class="cart-summary-row cart-summary-total"><span>Total</span><strong>${formatPrice(total)}</strong></div>
    </div>
  `;
}

function renderDetail(product) {
  const count = bagItems[product.id] || 0;
  shopHeading.hidden = true;
  productGrid.hidden = true;
  productDetail.hidden = false;
  productDetail.innerHTML = `
    <div class="detail-image"><img src="${product.image}" alt="${product.alt}"></div>
    <div class="detail-copy">
      <p class="eyebrow">The Edit</p>
      <h1>${product.name}</h1>
      <p class="detail-region">${product.region}</p>
      <p class="detail-price">${product.price}</p>
      <p class="detail-description">${product.description}</p>
      <p class="detail-weave"><strong>Weave &amp; material</strong>${product.weave}</p>
      <div class="detail-actions">
        <button class="detail-add" type="button">${count ? `Added to Bag (${count})` : "Add to Bag"}</button>
        <a class="detail-back" href="#shop">Back to Shop</a>
      </div>
      <p class="bag-feedback" role="status" aria-live="polite">${count ? `${count} ${count === 1 ? "saree" : "sarees"} added to your bag.` : ""}</p>
    </div>
  `;

  productDetail.querySelector(".detail-add").addEventListener("click", (event) => {
    bagItems[product.id] = (bagItems[product.id] || 0) + 1;
    updateBagCount();
    event.currentTarget.textContent = `Added to Bag (${bagItems[product.id]})`;
    productDetail.querySelector(".bag-feedback").textContent = `${bagItems[product.id]} ${bagItems[product.id] === 1 ? "saree" : "sarees"} added to your bag.`;
  });
}

function showShop() {
  document.body.classList.add("shop-view");
  shopPage.hidden = false;
  shopHeading.hidden = false;
  productGrid.hidden = false;
  productDetail.hidden = true;
  bagView.hidden = true;
}

function showBag() {
  document.body.classList.add("shop-view");
  shopPage.hidden = false;
  shopHeading.hidden = true;
  productGrid.hidden = true;
  productDetail.hidden = true;
  bagView.hidden = false;
  renderCart();
}

function showHome() {
  document.body.classList.remove("shop-view");
  shopPage.hidden = true;
}

function routeFromHash() {
  const hash = window.location.hash;
  if (hash === "#shop") {
    showShop();
    return;
  }

  if (hash === "#bag") {
    showBag();
    return;
  }

  if (hash.startsWith("#saree/")) {
    const product = products.find((item) => item.id === hash.slice("#saree/".length));
    if (product) {
      showShop();
      renderDetail(product);
      return;
    }
    window.location.hash = "shop";
    return;
  }

  showHome();
}

renderProducts();
productGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-product]");
  if (card) window.location.hash = `saree/${card.dataset.product}`;
});
productGrid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-product]")) {
    event.preventDefault();
    window.location.hash = `saree/${event.target.dataset.product}`;
  }
});
cartContent.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;

  const productId = button.dataset.product;
  if (button.dataset.cartAction === "increase") {
    bagItems[productId] = (bagItems[productId] || 0) + 1;
  } else if (bagItems[productId] <= 1) {
    delete bagItems[productId];
  } else {
    bagItems[productId] -= 1;
  }

  renderCart();
});
navBag.addEventListener("click", () => {
  window.location.hash = "bag";
});
window.addEventListener("hashchange", routeFromHash);
updateBagCount();
routeFromHash();

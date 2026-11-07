// Get HTML elements
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartBtn = document.getElementById("cartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Store products and cart items
let products = [];
let cart = [];

// Fetch products from JSON file
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productContainer.innerHTML =
            "<p>Products could not be loaded. Please run the project using Live Server.</p>";

        console.error(error);

    }
}

// Display products dynamically
function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =
            "<p class='loading'>No products found!</p>";

        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <p class="rating">
                    ★★★★★ (${product.rating})
                </p>

                <div class="product-bottom">

                    <span class="price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                        class="add-btn"
                        data-id="${product.id}">
                        Add to Cart
                    </button>

                </div>

            </div>

        `;

        productContainer.appendChild(card);

    });

}

// Search products
function searchProducts() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(filteredProducts);

}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("input", searchProducts);

// Add products to cart
productContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-btn")) {

        const productId = Number(event.target.dataset.id);

        const selectedProduct = products.find(
            product => product.id === productId
        );

        if (!selectedProduct) return;

        const existingItem = cart.find(
            item => item.id === productId
        );

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                ...selectedProduct,
                quantity: 1
            });

        }

        updateCart();

    }

});

// Update cart information
function updateCart() {

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(item => {

        totalQuantity += item.quantity;

        totalPrice += item.price * item.quantity;

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent =
        "₹" + totalPrice.toLocaleString("en-IN");

    displayCartItems();

}

// Display cart items
function displayCartItems() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p class='empty-cart'>Your cart is empty.</p>";

        return;
    }

    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div>

                <h4>${item.name}</h4>

                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                </p>

                <div class="quantity-controls">

                    <button
                        data-action="decrease"
                        data-id="${item.id}">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-btn"
                data-action="remove"
                data-id="${item.id}">
                Remove
            </button>

        `;

        cartItems.appendChild(cartItem);

    });

}

// Increase, decrease and remove cart products
cartItems.addEventListener("click", function(event) {

    const action = event.target.dataset.action;
    const productId = Number(event.target.dataset.id);

    if (!action) return;

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity === 0) {

            cart = cart.filter(
                product => product.id !== productId
            );

        }

    }

    else if (action === "remove") {

        cart = cart.filter(
            product => product.id !== productId
        );

    }

    updateCart();

});

// Open cart
cartBtn.addEventListener("click", function() {

    cartOverlay.classList.add("active");

});

// Close cart
closeCart.addEventListener("click", function() {

    cartOverlay.classList.remove("active");

});

// Close cart when clicking outside the panel
cartOverlay.addEventListener("click", function(event) {

    if (event.target === cartOverlay) {

        cartOverlay.classList.remove("active");

    }

});

// Checkout button
checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    alert("Thank you for shopping with ShopZone!");

    cart = [];

    updateCart();

    cartOverlay.classList.remove("active");

});

// Load products when page opens
loadProducts();
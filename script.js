
let products = [];
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];  // Initialize cart from localStorage or an empty array

async function fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    const productcontainer = document.getElementById('product_container');
    productcontainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title.substring(0, 11)}...</h3>
            <p>${product.description.substring(0, 100)}...</p><hr>
            <p>$${product.price}</p><hr>
            <span class="button-container">
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button  onclick="viewDetails(${product.id})">Details</button></span>`;
        productcontainer.appendChild(productCard);
    });
}

// Add product to the cart
function addToCart(productId) {
    // Correctly find the product using the productId passed to the function
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found');
        return;
    }

    const existingProduct = cart.find(p => p.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;  // Increase quantity if product already in cart
    } else {
        cart.push({ ...product, quantity: 1 });  // Add new product to cart with quantity
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));  // Update cart in localStorage
    updateCartCount();  // Update cart count in header
    displayCartItems(); // Display the cart items immediately after adding
}

// Update the cart count in the header
function updateCartCount() {
    const cartButton = document.querySelector("a[href='./cart.html'] span#cart-count");
    const cartCount = cart.length;  // Calculate the count based on the number of unique items in the cart
    if (cartButton) {
        cartButton.textContent = cartCount;  // Update the cart count inside the span
    }
}

// Filter products by category
function filterproduct(category) {
    if (category === 'all') {
        displayProducts(products);  // Show all products if 'all' is selected
    } else {
        const filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
        displayProducts(filteredProducts);  // Display only the filtered products
    }
}

// Event listener for DOMContentLoaded to fetch products when the page loads

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();  // Fetch products only after DOM is loaded
    updateCartCount();  // Update the cart count based on localStorage
});

const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let total = 0;

document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();  // Display cart items on page load
    updateCartCount();   // Update cart count on page load
});

// Display cart items in table format

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();  // Fetch products on load
    displayCartItems();  // Display cart items
    updateCartCount();   // Update cart count
});

function displayCartItems() {
    const cartedItems = document.getElementById('cartedItems');
    cartedItems.innerHTML = '';  // Clear existing cart items
    total = 0;  // Reset total to calculate dynamically

    if (cartItems.length === 0) {
        cartedItems.innerHTML = `
            <div id="cartdiv">
                <p id="cartpara">Your Cart is <b>Empty</b></p><br><br>
                <a href="./index.html"><button><i class="fa-solid fa-arrow-left"></i> Continue Shopping</button></a>
            </div>`;
        document.getElementById('ordereddescription').innerHTML = ''; // Clear order summary
        return;
    }

    const table = document.createElement('table');
    table.classList.add('cart-table');

    const tableHeader = `
        <thead>
            <tr>
                <th colspan="4">Itemlist</th>
            </tr>

             <tr>
                <th>Product Image</th>
                <th>Product Details</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>

        </thead>
        <tbody></tbody>
    `;
    table.innerHTML = tableHeader;

    cartItems.forEach((item, index) => {
        const quantity = item.quantity;
        const price = parseFloat(item.price);
        const subtotal = quantity * price;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.title}" class="product-image"></td>
            <td>${item.title}</td>
            <td>
                <div class="quantity-control">
                    <span class="decrement" onclick="decrement(${index})">&#8722;</span>
                    <span id='quantity-${index}'>${quantity}</span>
                    <span class="increment" onclick="increment(${index})">&#43;</span>
                </div>
            </td>
            <td>$${subtotal.toFixed(2)}</td>
        `;
        table.querySelector('tbody').appendChild(row);
    });

    cartedItems.appendChild(table);
    displayOrderSummary();  // Call the function to display the order summary
}

function displayOrderSummary() {
    const orderedDescription = document.getElementById('ordereddescription');
    orderedDescription.innerHTML = ''; // Clear existing order summary

    const orderDetails = document.createElement('div');
    orderDetails.classList.add('order-details');
    orderDetails.innerHTML = `
        <h2>Order Summary</h2>
        <table>
            <tr><td>Products (${cartItems.reduce((sum, item) => sum + item.quantity, 0)}) <span class="spn">$${total.toFixed(2)}</span></td></tr>
            <tr><td>Shipping <p>$30</p></td></tr>
            <tr><td>Total Amount <b><span class="spn">$${(total + 30).toFixed(2)}</span></b></td></tr>
        </table>
        <div class="checkout-btn-container">
            <button id="checkoutButton" class="checkout-btn">Go to Checkout</button>
        </div>
    `;
    orderedDescription.appendChild(orderDetails);
}

// Increment quantity in cart
function increment(index) {
    cartItems[index].quantity += 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();  // Re-render cart items
    updateCartCount();   // Update cart count
}

// Decrement quantity in cart
function decrement(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
    } else {
        cartItems.splice(index, 1);  // Remove item if quantity becomes 0
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();  // Re-render cart items
    updateCartCount();   // Update cart count
}


'use strict';

// Sample Product Data
const products = [
    { id: 1, name: 'Wireless Headphones', category: 'electronics', price: 79.99, description: 'High-quality sound with noise cancellation', emoji: '🎧' },
    { id: 2, name: 'Smart Watch', category: 'electronics', price: 199.99, description: 'Track your fitness and stay connected', emoji: '⌚' },
    { id: 3, name: 'USB-C Cable', category: 'electronics', price: 12.99, description: 'Fast charging and data transfer', emoji: '🔌' },
    { id: 4, name: 'Cotton T-Shirt', category: 'clothing', price: 24.99, description: 'Comfortable everyday wear', emoji: '👕' },
    { id: 5, name: 'Denim Jeans', category: 'clothing', price: 59.99, description: 'Classic style and comfort', emoji: '👖' },
    { id: 6, name: 'Winter Jacket', category: 'clothing', price: 129.99, description: 'Stay warm in style', emoji: '🧥' },
    { id: 7, name: 'JavaScript Guide', category: 'books', price: 34.99, description: 'Master modern JavaScript', emoji: '📖' },
    { id: 8, name: 'Web Design Book', category: 'books', price: 44.99, description: 'Create beautiful websites', emoji: '📚' },
    { id: 9, name: 'CSS Mastery', category: 'books', price: 39.99, description: 'Advanced CSS techniques', emoji: '📕' }
];

// Cart Storage
let cart = [];
let currentUser = null;

// Load user data from localStorage
function loadUserData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateAuthButton();
    }
}

// Initialize Products on Page Load
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    displayProducts(products);
    loadCartFromLocalStorage();
});

// Display Products
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filter Products
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchInput) || 
                            product.description.toLowerCase().includes(searchInput);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
}

// Add to Cart
function addToCart(productId) {
    if (!currentUser) {
        alert('Please login or sign up first to add items to cart.');
        openAuthModal();
        return;
    }

    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartToLocalStorage();
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Display Cart Items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart">Your cart is empty. <a href="#products" onclick="closeCartModal()">Continue shopping</a></div>';
        document.getElementById('cart-total').textContent = '0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div>Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    updateCartCount();
    displayCartItems();
}

// Save Cart to LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Open Cart Modal
document.getElementById('cart')?.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cart-modal').classList.add('show');
    displayCartItems();
});

// Close Cart Modal
function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('show');
}

// Checkout
function checkout() {
    if (!currentUser) {
        alert('Please login first.');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase, ${currentUser.name}! Total: $${total.toFixed(2)}\n\nThis is a demo. In a real store, you would proceed to payment.`);
    
    // Clear cart after checkout
    cart = [];
    saveCartToLocalStorage();
    updateCartCount();
    closeCartModal();
    displayCartItems();
}

// Open Auth Modal
function openAuthModal() {
    document.getElementById('auth-modal').classList.add('show');
}

// Close Auth Modal
function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('show');
}

// Toggle Auth Form (Login <-> Sign Up)
function toggleAuthForm() {
    document.getElementById('login-form').classList.toggle('active');
    document.getElementById('signup-form').classList.toggle('active');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simple validation (in real app, validate against server)
    if (email && password) {
        const userData = {
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toLocaleString()
        };

        currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('users', JSON.stringify([userData]));
        
        alert(`Welcome back, ${userData.name}!`);
        closeAuthModal();
        updateAuthButton();
        
        // Clear form
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

// Handle Sign Up
function handleSignUp(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (name && email && password) {
        const userData = {
            name: name,
            email: email,
            password: password,
            signupTime: new Date().toLocaleString()
        };

        currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('users', JSON.stringify([userData]));
        
        alert(`Welcome, ${name}! Your account has been created successfully.`);
        closeAuthModal();
        updateAuthButton();
        
        // Clear form
        document.getElementById('signup-name').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-confirm-password').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

// Update Auth Button
function updateAuthButton() {
    const authBtn = document.getElementById('auth-btn');
    if (currentUser) {
        authBtn.textContent = `👤 ${currentUser.name} (Logout)`;
        authBtn.onclick = logout;
    } else {
        authBtn.textContent = 'Login/Sign Up';
        authBtn.onclick = openAuthModal;
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthButton();
    alert('You have been logged out.');
    cart = [];
    saveCartToLocalStorage();
    updateCartCount();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const authModal = document.getElementById('auth-modal');
    const cartModal = document.getElementById('cart-modal');
    
    if (event.target === authModal) {
        closeAuthModal();
    }
    if (event.target === cartModal) {
        closeCartModal();
    }
}
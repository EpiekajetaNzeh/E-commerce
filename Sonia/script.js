// Product Data
const products = [
    {
        id: 'headphones-pro',
        name: 'Premium Wireless Headphones',
        price: 20.000,
        originalPrice: 39.100,
        category: 'headphones',
        description: 'Experience crystal-clear audio with our latest noise-cancelling technology',
        
    },
    {
        id: 'speaker-bluetooth',
        name: 'Portable Bluetooth Speaker',
        price: 55.777,
        originalPrice:90.00 ,
        category: 'speakers',
        description: 'Powerful sound in a compact design with 20-hour battery life',
        
    },
    {
        id: 'smartwatch-ultra',
        name: 'Ultra Smart Watch',
        price: 399.99,
        originalPrice: 499.99,
        category: 'watches',
        description: 'Track your fitness and stay connected with our advanced smartwatch',
        
    },
    {
        id: 'phone-pro',
        name: 'Smartphone Pro Max',
        price: 999.99,
        originalPrice: 1299.99,
        category: 'phones',
        description: 'Latest flagship smartphone with advanced camera system',
        
    },
    {
        id: 'headphones-sport',
        name: 'Sport Wireless Earbuds',
        price: 149.99,
        originalPrice: 199.99,
        category: 'headphones',
        description: 'Perfect for workouts with sweat-resistant design and secure fit',
        
    },
    {
        id: 'speaker-home',
        name: 'Home Smart Speaker',
        price: 199.99,
        originalPrice: 249.99,
        category: 'speakers',
        description: 'Voice-controlled smart speaker with premium sound quality',
        
    },
    {
        id: 'watch-fitness',
        name: 'Fitness Tracker Watch',
        price: 79.99,
        originalPrice: 99.99,
        category: 'watches',
        description: 'Monitor your health and fitness goals with precision tracking',
        
    },
    {
        id: 'phone-budget',
        name: 'Budget Smartphone',
        price: 299.99,
        originalPrice: 399.99,
        category: 'phones',
        description: 'Great value smartphone with essential features and reliable performance',
        
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();
    setActiveNavigation();
    initializeSmoothScroll();
    
    // Load featured products on homepage
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
    
    // Load all products on products page
    if (document.getElementById('all-products')) {
        loadAllProducts();
    }
});

// Load products
function loadProducts() {
    // Products are already defined in the products array
}

// Load featured products (first 4 products)
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    const featuredProducts = products.slice(0, 4);
    
    featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load all products
function loadAllProducts() {
    const allProductsContainer = document.getElementById('all-products');
    allProductsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.price}
                    ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">$${product.originalPrice}</span>` : ''}
                </div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Add product to cart
function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${productName} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update cart items display
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
        }
    }
}

// Create cart item HTML
function createCartItemHTML(item) {
    const product = products.find(p => p.id === item.id);
    return `
        <div class="cart-item">
            <img src="${product ? product.image : ''}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">XAF{item.name}</div>
                <div class="cart-item-price">XAF{item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('{item.id}', -1)">-</button>
                    <span>{item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('{item.id}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart('{item.id}')">Remove</button>
                </div>
            </div>
        </div>
    `;
}

// Update cart total
function updateCartTotal() {
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (confirm(`Proceed to checkout?\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}`)) {
        // Clear cart after successful checkout
        cart = [];
        saveCart();
        updateCartUI();
        toggleCart();
        showNotification('Order placed successfully! Thank you for your purchase.');
    }
}

// Filter products
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const allProductsContainer = document.getElementById('all-products');
    
    if (!allProductsContainer) return;
    
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    allProductsContainer.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Show no results message if needed
    const noResults = document.getElementById('no-results');
    if (noResults) {
        noResults.style.display = filteredProducts.length === 0 ? 'block' : 'none';
    }
}

// Sort products
function sortProducts() {
    const sortBy = document.getElementById('sort-filter').value;
    const allProductsContainer = document.getElementById('all-products');
    
    if (!allProductsContainer) return;
    
    let sortedProducts = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Keep original order
            break;
    }
    
    allProductsContainer.innerHTML = sortedProducts.map(product => createProductCard(product)).join('');
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const allProductsContainer = document.getElementById('all-products');
    
    if (!allProductsContainer) return;
    
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    allProductsContainer.innerHTML = searchResults.map(product => createProductCard(product)).join('');
    
    // Show no results message if needed
    const noResults = document.getElementById('no-results');
    if (noResults) {
        noResults.style.display = searchResults.length === 0 ? 'block' : 'none';
    }
}

// Handle escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Close cart
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
        
        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('mobile-menu-overlay');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (navMenu && hamburger && overlay) {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const page = link.getAttribute('data-page');
        
        if ((page === 'home' && (currentPage === 'index.html' || currentPage === '')) ||
            (page === 'products' && currentPage === 'products.html')) {
            link.classList.add('active');
        }
    });
}

// Initialize smooth scrolling
function initializeSmoothScroll() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Handle navigation links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // Add loading state
                this.style.opacity = '0.7';
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Handle scroll effects
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navbar.style.background = '#fff';
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobile-menu-overlay');
    
    // Close mobile menu on desktop resize
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (cartSidebar && cartBtn) {
        if (!cartSidebar.contains(event.target) && !cartBtn.contains(event.target)) {
            cartSidebar.classList.remove('active');
        }
    }
});

function constructor() {
    // Initialize cart from sessionStorage or create new
    this.cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    this.updateCartDisplay();
}

function addToCart(item) {
    // Check if item already exists in cart
    const existingItem = this.cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        // Increment quantity if item exists
        existingItem.quantity += 1;
    } else {
        // Add new item with quantity
        this.cart.push({
            ...item,
            quantity: 1
        });
    }

    this.saveCart();
    this.updateCartDisplay();
}

function removeFromCart(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
}

function saveCart() {
    // Save cart to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
}

function updateCartDisplay() {
    const cartCountElement = document.getElementById('cart-count');
    const totalQuantity = this.cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCountElement) {
        cartCountElement.textContent = totalQuantity;
        cartCountElement.classList.toggle('hidden', totalQuantity === 0);
    }

    this.renderCartDetails();
}

document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();

    // Attach add to cart listeners to existing buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                id: this.getAttribute('data-part-id'),
                name: this.getAttribute('data-part-name'),
                price: parseFloat(this.getAttribute('data-part-price') || '0'),
                image: this.getAttribute('data-part-image') || ''
            };
            window.cartManager.addToCart(item);
        });
    });
});
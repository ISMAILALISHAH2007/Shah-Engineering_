document.addEventListener('DOMContentLoaded', function () {
  let cart = [];

  // Load and validate cart from localStorage
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      cart = JSON.parse(cartData);
      if (!Array.isArray(cart)) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  } catch (e) {
    console.error('Error loading cart:', e);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // DOM Elements
  const cartItemsContainer = document.getElementById('cart-items');
  const itemCountElement = document.getElementById('item-count');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');
  const checkoutBtn = document.getElementById('checkout-btn');

  function validateCartItems(cartArray) {
    return cartArray.filter(item => {
      return item &&
        typeof item === 'object' &&
        'id' in item &&
        'name' in item &&
        'price' in item &&
        'quantity' in item;
    });
  }

  function renderCart() {
    cart = validateCartItems(cart);
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      localStorage.setItem('cart', JSON.stringify([]));
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      itemCountElement.textContent = '0 items';
      subtotalElement.textContent = '$0.00';
      totalElement.textContent = '$0.00';
      checkoutBtn.disabled = true;
      updateCartCount();
      return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
      item.quantity = Math.max(1, parseInt(item.quantity) || 1);
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <img src="${item.image || 'images/generators/default-generator.jpg'}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.name}</h3>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          ${item.specs ? `<p class="cart-item-specs">${item.specs}</p>` : ''}
        </div>
        <div class="cart-item-actions">
          <div class="quantity-selector">
            <button class="quantity-btn minus" data-index="${index}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
            <button class="quantity-btn plus" data-index="${index}">+</button>
          </div>
          <button class="remove-item" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItemElement);
    });

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    itemCountElement.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;
    checkoutBtn.disabled = false;

    setupCartEventListeners();
  }

  function setupCartEventListeners() {
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(this.dataset.index);
        if (!isNaN(index) && cart[index] && cart[index].quantity > 1) {
          cart[index].quantity--;
          updateCart();
        }
      });
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(this.dataset.index);
        if (!isNaN(index) && cart[index]) {
          cart[index].quantity++;
          updateCart();
        }
      });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', function () {
        const index = parseInt(this.dataset.index);
        const newQuantity = parseInt(this.value);
        if (!isNaN(index) && !isNaN(newQuantity) && cart[index]) {
          cart[index].quantity = Math.max(1, newQuantity);
          updateCart();
        } else if (!isNaN(index)) {
          this.value = cart[index].quantity;
        }
      });

      input.addEventListener('keydown', function (e) {
        if (['-', 'e', 'E'].includes(e.key)) {
          e.preventDefault();
        }
      });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(this.dataset.index);
        if (!isNaN(index) && cart[index]) {
          cart.splice(index, 1);
          updateCart();
        }
      });
    });
  }

  function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
    });
  }

  checkoutBtn.addEventListener('click', function () {
    if (cart.length === 0) return;
    alert('Redirecting to checkout - this would go to payment processor in production');
    // window.location.href = 'checkout.html';
  });

  renderCart();
});

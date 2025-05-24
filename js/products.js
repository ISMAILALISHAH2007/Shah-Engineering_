document.addEventListener('DOMContentLoaded', function() {
  // Quick View Modal functionality
  const quickViewButtons = document.querySelectorAll('.quick-view');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
  // Quick View handler
  quickViewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const productCard = this.closest('.product-card');
      
      // Get product details for quick view
      const productDetails = {
        name: productCard.querySelector('.product-name').textContent,
        price: productCard.querySelector('.current-price').textContent,
        image: productCard.querySelector('.product-image img').src,
        specs: productCard.querySelector('.product-specs')?.textContent || ''
      };
      
      // In a real implementation, show modal with productDetails
      alert(`Quick view for ${productDetails.name}\nPrice: ${productDetails.price}\nSpecs: ${productDetails.specs}`);
    });
  });
  
  // Add to Cart handler
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const productCard = this.closest('.product-card');
      
      // Get all required product data
      const productData = {
        id: productId,
        name: productCard.querySelector('.product-name').textContent,
        price: parseFloat(productCard.querySelector('.current-price').textContent.replace(/[^\d.]/g, '')),
        quantity: 1,
        image: productCard.querySelector('.product-image img').src,
        specs: productCard.querySelector('.product-specs')?.textContent || ''
      };
      
      addToCart(productData);
    });
  });
  
  // Add to Cart function
  function addToCart(product) {
    // Validate product data
    if (!product || !product.id || isNaN(product.price)) {
      console.error('Invalid product data', product);
      showToast('Error adding to cart', 'error');
      return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item with timestamp
      product.addedAt = new Date().getTime();
      cart.push(product);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      showToast('Added to cart!');
    } catch (e) {
      console.error('Failed to save cart:', e);
      showToast('Failed to save cart', 'error');
    }
  }
  
  // Toast notification system
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `cart-toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      ${message}
    `;
    
    // Remove existing toasts
    document.querySelectorAll('.cart-toast').forEach(el => el.remove());
    
    document.body.appendChild(toast);
    
    // Animation handling
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  // Update cart count in header
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = totalItems;
    });
  }
  
  // Initialize cart count on page load
  updateCartCount();
});
document.addEventListener('DOMContentLoaded', function() {
  // Configuration object
  const config = {
    model: null,
    power: 15,
    fuel: 'diesel',
    noise: 'standard',
    features: [],
    basePrice: 0,
    featuresPrice: 0
  };

  // DOM Elements
  const steps = document.querySelectorAll('.builder-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const modelOptions = document.querySelectorAll('.model-option');
  const powerRange = document.getElementById('power-range');
  const powerValue = document.getElementById('power-value');
  const fuelOptions = document.querySelectorAll('.fuel-option');
  const noiseOptions = document.querySelectorAll('input[name="noise"]');
  const featureCheckboxes = document.querySelectorAll('.feature-checkbox');
  const addToCartBtn = document.getElementById('add-to-cart-final');
  const previewImage = document.getElementById('generator-preview');
  const finalPreview = document.getElementById('final-preview');

  // Model data
  const modelData = {
    portable: {
      image: 'images/generators/custom-portable.png',
      price: 1499,
      name: 'Portable Series',
      minPower: 5,
      maxPower: 10
    },
    standby: {
      image: 'images/generators/custom-standby.png',
      price: 2499,
      name: 'Standby Series',
      minPower: 15,
      maxPower: 50
    },
    industrial: {
      image: 'images/generators/custom-industrial.png',
      price: 5499,
      name: 'Industrial Series',
      minPower: 75,
      maxPower: 500
    }
  };

  // Feature data
  const featurePrices = {
    'feature-remote': 199,
    'feature-auto': 349,
    'feature-weather': 249,
    'feature-emergency': 179
  };

  // Noise level prices
  const noisePrices = {
    'standard': 0,
    'quiet': 299,
    'silent': 999
  };

  // Initialize builder
  function initBuilder() {
    // Model selection
    modelOptions.forEach(option => {
      option.addEventListener('click', function() {
        const model = this.getAttribute('data-model');
        selectModel(model, this);
      });
    });

    // Power range slider
    powerRange.addEventListener('input', updatePowerValue);
    updatePowerValue();

    // Fuel type selection
    fuelOptions.forEach(option => {
      option.addEventListener('click', function() {
        const fuel = this.getAttribute('data-fuel');
        selectFuel(fuel, this);
      });
    });

    // Noise level selection
    noiseOptions.forEach(option => {
      option.addEventListener('change', function() {
        if (this.checked) {
          config.noise = this.id.replace('noise-', '');
          updateReview();
        }
      });
    });

    // Feature selection
    featureCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const featureId = this.id;
        if (this.checked) {
          config.features.push(featureId);
        } else {
          config.features = config.features.filter(id => id !== featureId);
        }
        updateReview();
      });
    });

    // Navigation buttons
    nextButtons.forEach(button => {
      button.addEventListener('click', nextStep);
    });

    prevButtons.forEach(button => {
      button.addEventListener('click', prevStep);
    });

    // Add to cart
    addToCartBtn.addEventListener('click', addToCart);

    // Initialize cart count
    updateCartCount();
  }

  // Select model function
  function selectModel(model, element) {
    config.model = model;
    config.basePrice = modelData[model].price;
    
    // Update power range
    powerRange.min = modelData[model].minPower;
    powerRange.max = modelData[model].maxPower;
    powerRange.value = modelData[model].minPower;
    updatePowerValue();

    // Update UI
    modelOptions.forEach(option => {
      option.classList.remove('selected');
      const btn = option.querySelector('.select-model');
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
      btn.textContent = 'Select';
    });

    element.classList.add('selected');
    const selectedBtn = element.querySelector('.select-model');
    selectedBtn.classList.remove('btn-outline');
    selectedBtn.classList.add('btn-primary');
    selectedBtn.textContent = 'Selected';

    // Update preview images
    previewImage.src = modelData[model].image;
    finalPreview.src = modelData[model].image;

    // Enable next button
    document.getElementById('next-step-1').disabled = false;
    
    // Update review
    updateReview();
  }

  // Update power value display
  function updatePowerValue() {
    config.power = parseInt(powerRange.value);
    powerValue.textContent = `${config.power}kW`;
    updateReview();
  }

  // Select fuel type
  function selectFuel(fuel, element) {
    config.fuel = fuel;
    
    fuelOptions.forEach(option => {
      option.classList.remove('active');
    });
    
    element.classList.add('active');
    updateReview();
  }

  // Navigate to next step
  function nextStep() {
    const currentStep = document.querySelector('.builder-step.active');
    const currentIndex = Array.from(steps).indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      if (currentIndex === 0 && !config.model) {
        showToast('Please select a base model first');
        return;
      }

      currentStep.classList.remove('active');
      steps[currentIndex + 1].classList.add('active');
      progressSteps[currentIndex + 1].classList.add('active');

      if (currentIndex + 1 === 3) {
        updateReview();
      }
    }
  }

  // Navigate to previous step
  function prevStep() {
    const currentStep = document.querySelector('.builder-step.active');
    const currentIndex = Array.from(steps).indexOf(currentStep);
    
    if (currentIndex > 0) {
      currentStep.classList.remove('active');
      steps[currentIndex - 1].classList.add('active');
      progressSteps[currentIndex].classList.remove('active');
    } else {
      window.location.href = 'products.html';
    }
  }

  // Update review section
  function updateReview() {
    if (!config.model) return;

    // Update configuration details
    document.getElementById('review-model').textContent = modelData[config.model].name;
    document.getElementById('review-power').textContent = `${config.power}kW`;
    
    const fuelName = config.fuel.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    document.getElementById('review-fuel').textContent = fuelName;
    
    // Update noise level
    let noiseText = '';
    switch(config.noise) {
      case 'standard': noiseText = 'Standard (68-72dB)'; break;
      case 'quiet': noiseText = 'Quiet Package (+$299)'; break;
      case 'silent': noiseText = 'Silent Enclosure (+$999)'; break;
    }
    document.getElementById('review-noise').textContent = noiseText;

    // Update features
    const featuresList = document.getElementById('review-features');
    featuresList.innerHTML = '';
    
    if (config.features.length > 0) {
      config.features.forEach(featureId => {
        const li = document.createElement('li');
        const featureName = document.querySelector(`label[for="${featureId}"] h3`).textContent;
        li.textContent = featureName;
        featuresList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'None';
      featuresList.appendChild(li);
    }

    // Calculate prices
    const basePrice = config.basePrice;
    const noisePrice = noisePrices[config.noise] || 0;
    const featuresPrice = config.features.reduce((total, featureId) => {
      return total + (featurePrices[featureId] || 0);
    }, 0);

    const totalPrice = basePrice + noisePrice + featuresPrice;

    // Update price displays
    document.getElementById('base-price').textContent = `$${basePrice.toFixed(2)}`;
    document.getElementById('features-price').textContent = `$${(featuresPrice + noisePrice).toFixed(2)}`;
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
    document.getElementById('final-price').textContent = `$${totalPrice.toFixed(2)}`;
  }

  // Add to cart
  function addToCart() {
    if (!config.model) {
      showToast('Please complete your configuration first');
      return;
    }

    const noisePrice = noisePrices[config.noise] || 0;
    const featuresPrice = config.features.reduce((total, featureId) => {
      return total + (featurePrices[featureId] || 0);
    }, 0);

    const totalPrice = config.basePrice + noisePrice + featuresPrice;

    // Create cart item
    const cartItem = {
      id: `custom-${Date.now()}`,
      name: `Custom ${modelData[config.model].name}`,
      model: config.model,
      power: config.power,
      fuel: config.fuel,
      noise: config.noise,
      features: [...config.features],
      price: totalPrice,
      quantity: 1,
      custom: true,
      image: modelData[config.model].image
    };

    // Add to cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    showToast('Custom generator added to cart!');
    updateCartCount();

    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 2000);
  }

  // Update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = totalItems;
    });
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Initialize the builder
  initBuilder();
});
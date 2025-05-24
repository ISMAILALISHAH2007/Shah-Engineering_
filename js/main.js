// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const closeMobileNav = document.getElementById('close-mobile-nav');
const loadingScreen = document.getElementById('loading-screen');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Mobile Menu Functionality
function toggleMobileMenu() {
  mobileNav.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
  
  // Toggle overlay
  const overlay = document.querySelector('.mobile-nav-overlay') || createMobileOverlay();
  overlay.classList.toggle('active');
}

function createMobileOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  overlay.addEventListener('click', toggleMobileMenu);
  document.body.appendChild(overlay);
  return overlay;
}

// Theme Management
function initTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);
  applyThemeToMobileMenu(currentTheme); // Apply theme to mobile menu on load
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcons(newTheme);
  applyThemeToMobileMenu(newTheme); // Apply theme when toggled
}

function applyThemeToMobileMenu(theme) {
  if (mobileNav) {
    mobileNav.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  }
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('#theme-toggle i, #mobile-theme-toggle i');
  icons.forEach(icon => {
    icon.classList.toggle('fa-moon', theme === 'light');
    icon.classList.toggle('fa-sun', theme === 'dark');
  });
}

// Cart Management
function updateCartCount() {
  const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

// Loading Screen
function hideLoadingScreen() {
  loadingScreen.classList.add('hidden');
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 500);
}

// Event Listeners
function setupEventListeners() {
  // Theme toggles
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
  
  // Mobile menu
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  if (closeMobileNav) closeMobileNav.addEventListener('click', toggleMobileMenu);
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && 
        e.target !== mobileMenuBtn && 
        !e.target.closest('.mobile-menu-btn')) {
      mobileNav.classList.remove('active');
      document.body.classList.remove('no-scroll');
      const overlay = document.querySelector('.mobile-nav-overlay');
      if (overlay) overlay.classList.remove('active');
    }
  });
}

// Initialize Animations
function initAnimations() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }
}

// Initialize Floating Action Button
function initFAB() {
  const fabContainer = document.getElementById('fab-container');
  if (!fabContainer) return;
  
  const fabMain = document.getElementById('fab-main');
  fabMain.addEventListener('click', () => {
    fabContainer.classList.toggle('active');
  });
}

// Main Initialization
function init() {
  initTheme();
  updateCartCount();
  initAnimations();
  initFAB();
  setupEventListeners();
  
  // Hide loading screen when everything is loaded
  window.addEventListener('load', () => {
    setTimeout(hideLoadingScreen, 1000);
  });
}

// Start the app
init();
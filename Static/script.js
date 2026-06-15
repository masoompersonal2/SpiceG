// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  initializeAnimations();
});

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

// Navbar Scroll and Mobile Menu logic
document.addEventListener("DOMContentLoaded", () => {
  const mainNav = document.getElementById('main-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.getElementById('nav-links');
  const orderOnlineBtn = document.getElementById('order-online-btn');

  // Scroll effect for navbar
  const handleScroll = () => {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
      navLinks.classList.remove('text-gray-400');
      navLinks.classList.add('text-white');
      orderOnlineBtn.classList.add('text-white');
    } else {
      mainNav.classList.remove('scrolled');
      navLinks.classList.add('text-gray-400');
      navLinks.classList.remove('text-white');
      orderOnlineBtn.classList.remove('text-white');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initialize on load

  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-y-[-100%]');
    mobileMenu.classList.add('translate-y-0');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    mobileMenu.classList.remove('translate-y-0');
    mobileMenu.classList.add('translate-y-[-100%]');
    document.body.style.overflow = '';
  };

  mobileCloseBtn.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Video Scroll Scaling
  const videoContainer = document.querySelector('.video-container');
  if (videoContainer) {
    window.addEventListener('scroll', () => {
      const rect = videoContainer.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top / window.innerHeight);
      
      // Scale from 0.85 to 1
      let scale = 0.85 + (scrollProgress * 0.15);
      if (scale < 0.85) scale = 0.85;
      if (scale > 1) scale = 1;
      
      videoContainer.style.transform = `scale(${scale})`;
    });
  }
});

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

function initializeAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right');
  animatedElements.forEach(el => observer.observe(el));
}

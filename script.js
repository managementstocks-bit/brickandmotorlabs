// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.navbar__hamburger');
  const menu = document.querySelector('.navbar__menu');

  if (hamburger && menu) {
    const closeMenu = () => {
      hamburger.classList.remove('navbar__hamburger--active');
      menu.classList.remove('navbar__menu--open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
      const open = menu.classList.toggle('navbar__menu--open');
      hamburger.classList.toggle('navbar__hamburger--active', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu when clicking a link
    menu.querySelectorAll('.navbar__link, .navbar__cta').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape (restore focus to the toggle button)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('navbar__menu--open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('navbar__menu--open') && !e.target.closest('.navbar')) {
        closeMenu();
      }
    });
  }

  // Age filter functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const sortSelect = document.querySelector('.sort-select');
  const productGrid = document.querySelector('.product-grid');

  let currentFilter = 'all';

  function applyFilter() {
    productCards.forEach(card => {
      card.style.display = (currentFilter === 'all' || card.dataset.age === currentFilter) ? '' : 'none';
    });
  }

  function applySort() {
    const sortValue = sortSelect.value;
    const visibleCards = Array.from(productCards).filter(card => card.style.display !== 'none');

    visibleCards.sort((a, b) => {
      if (sortValue === 'price-low-high') {
        return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
      }
      if (sortValue === 'price-high-low') {
        return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
      }
      return parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10);
    });

    visibleCards.forEach(card => productGrid.appendChild(card));
  }

  productCards.forEach((card, i) => {
    card.dataset.index = i;
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      currentFilter = btn.dataset.filter;
      applyFilter();
      applySort();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', applySort);
  }

  // Set active filter button
  const defaultFilter = document.querySelector('.filter-btn[data-filter="all"]');
  if (defaultFilter) {
    defaultFilter.classList.add('filter-btn--active');
  }

  // Apply sort on initial load
  if (sortSelect) {
    applySort();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form -> Google Forms submission with validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const iframe = contactForm.querySelector('iframe[name="hidden_iframe"]');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');
    const emailInput = document.getElementById('contact-email');
    let submitting = false;
    let loadTimeout = null;

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', (e) => {
      status.hidden = true;
      status.classList.remove('form-alert--success', 'form-alert--error');

      if (emailInput && !validateEmail(emailInput.value)) {
        e.preventDefault();
        status.textContent = 'Please enter a valid email address.';
        status.classList.add('form-alert--error');
        status.hidden = false;
        emailInput.focus();
        return;
      }

      submitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      loadTimeout = setTimeout(() => {
        submitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        status.textContent = 'Sorry, your message couldn\'t be sent. Please check your connection and try again, or email us at brickandmotorlabs@gmail.com.';
        status.classList.add('form-alert--error');
        status.hidden = false;
      }, 12000);
    });

    iframe.addEventListener('load', () => {
      if (!submitting) return;
      clearTimeout(loadTimeout);
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';

      contactForm.reset();
      status.textContent = 'Thank you! Your message has been sent. We\'ll get back to you within 24 hours.';
      status.classList.add('form-alert--success');
      status.hidden = false;
    });
  }

  // FAQ accordion - only one open at a time
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // Scroll reveal animations (skipped when the user prefers reduced motion;
  // the reduced-motion CSS block keeps cards visible without any movement)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.product-card, .feature-card, .testimonial-card, .event-card, .faq-item, .video-card').forEach(el => {
      observer.observe(el);
    });
  }
});

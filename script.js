// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.navbar__hamburger');
  const menu = document.querySelector('.navbar__menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('navbar__hamburger--active');
      menu.classList.toggle('navbar__menu--open');
    });

    // Close menu when clicking a link
    menu.querySelectorAll('.navbar__link, .navbar__cta').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('navbar__hamburger--active');
        menu.classList.remove('navbar__menu--open');
      });
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

  // Contact form -> Google Forms submission
    const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const iframe = contactForm.querySelector('iframe[name="hidden_iframe"]');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');
    let submitting = false;
    let loadTimeout = null;

    contactForm.addEventListener('submit', () => {
      submitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      status.hidden = true;
      status.classList.remove('form-alert--success', 'form-alert--error');

      loadTimeout = setTimeout(() => {
        submitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        status.textContent = 'Sorry, your message couldn\'t be sent. Please check your connection and try again, or email us at hello@brickandmotorlabs.com.';
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
      status.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
      status.classList.add('form-alert--success');
      status.hidden = false;
    });
  }
});

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

// === Cart & Checkout ===
(() => {
  const CATALOG = {
    'bike':                 { name: 'Blix Minis - Bike',            price: 12.78,  img: 'Blix_Minis_Bike.png',            age: 5 },
    'ferris-wheel':         { name: 'Blix Minis - Ferris Wheel',    price: 12.78,  img: 'Blix_Minis_Ferris_Wheel.png',    age: 5 },
    'queaky-charge':        { name: 'Queaky Charge - Sleepy',       price: 24.99,  img: 'BlixQueakyCharge-Sleepy1.png',   age: 3 },
    'buddy':                { name: 'Blix Buddy',                   price: 28.40,  img: 'blix_buddy.jpg',                age: 5 },
    'crawlers':             { name: 'Crawlers',                     price: 49.70,  img: 'Crawlers.jpg',                  age: 8 },
    'rover':                { name: 'Rover',                        price: 53.96,  img: 'Rover.1.jpg',                   age: 8 },
    'gear-box':             { name: 'Gear Box',                     price: 69.57,  img: 'Gear-box.jpg',                  age: 8 },
    'forklift-power':       { name: 'Forklift Power',               price: 76.68,  img: 'Blix_Forklift_Power.png',       age: 8 },
    'power-screw':          { name: 'Power Screw',                  price: 80.93,  img: 'power-screw_1.jpg',             age: 8 },
    'marble-run-2':         { name: 'Blix Marble Run 2',            price: 107.92, img: 'Marble_Run_2.png',              age: 8 },
    'rc-explorers':         { name: 'RC Explorers',                 price: 115.02, img: 'Blix_RC_Explorers.png',         age: 8 },
    'rc-rover':             { name: 'RC Rover',                     price: 115.02, img: 'Blix_RC_Rover_1.png',           age: 8 },
    'amusement-park':       { name: 'Amusement Park',               price: 115.02, img: 'Amusement_Park_1.jpg',          age: 8 },
    'discovering-motions':  { name: 'Discovering Motions',          price: 134.90, img: 'Discovering_Motions.png',       age: 8 },
    'rc-megastructures':    { name: 'RC Megastructures',            price: 268.38, img: 'Rc_Megastructure.jpg',          age: 8 },
  };

  const API_BASE = (typeof window.BML_API_BASE !== 'undefined')
    ? window.BML_API_BASE
    : 'https://brickandmotorlabs-checkout.brickandmotorlabs.workers.dev/api';
  const CART_KEY = 'bml_cart';
  const IMG = location.pathname.includes('/builds/') ? '../images/' : 'images/';
  const fmt = (n) => '$' + n.toFixed(2) + ' CAD';

  let cart = loadCart();
  let rateOptions = [];
  let selectedRate = null;
  let ratesFetching = false;
  let ratesPostal = '';
  let ratesPromise = null;
  let stock = {};

  function applyStockBadges() {
    document.querySelectorAll('.product-card').forEach(card => {
      const slug = card.dataset.slug;
      if (!slug) return;
      if (stock[slug] === 0) {
        card.classList.add('product-card--soldout');
        const priceBtn = card.querySelector('.product-card__price-btn');
        if (priceBtn) priceBtn.disabled = true;
        const media = card.querySelector('.product-card__image');
        if (media && !media.querySelector('.product-card__badge')) {
          const badge = document.createElement('span');
          badge.className = 'product-card__badge';
          badge.textContent = 'Sold out';
          media.appendChild(badge);
        }
      }
    });
  }

  async function loadStock() {
    try {
      const res = await fetch(API_BASE + '/stock');
      if (res.ok) {
        stock = await res.json();
        applyStockBadges();
      }
    } catch (e) {
      console.warn('stock fetch failed', e);
    }
  }

  async function loadCanonicalPrices() {
    try {
      const res = await fetch(API_BASE + '/prices');
      if (!res.ok) return;
      const amounts = await res.json(); // {slug: cents}
      if (!amounts || typeof amounts !== 'object') return;
      let changed = false;
      for (const [slug, cents] of Object.entries(amounts)) {
        const p = CATALOG[slug];
        if (p && Number.isFinite(cents) && cents > 0) {
          const dollars = cents / 100;
          if (dollars !== p.price) { p.price = dollars; changed = true; }
        }
      }
      if (!changed) return;
      updateCount();
      const drawerOpen = document.querySelector('.cart-drawer--open');
      if (drawerOpen) renderCart();
      // update any visible static price elements keyed by slug (preserve injected cart icon)
      document.querySelectorAll('.product-card').forEach((card) => {
        const slug = card.dataset.slug;
        const el = card.querySelector('.product-card__price');
        if (slug && el && CATALOG[slug]) {
          const icon = el.querySelector('.price-cart-icon');
          el.textContent = fmt(CATALOG[slug].price);
          if (icon) el.appendChild(icon);
        }
      });
    } catch (e) {
      console.warn('prices fetch failed', e);
    }
  }

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY));
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
      const out = {};
      for (const [slug, qty] of Object.entries(raw)) {
        if (!CATALOG[slug]) continue;
        const n = parseInt(qty, 10);
        if (Number.isFinite(n) && n >= 1 && n <= 99) out[slug] = n;
      }
      return out;
    } catch (e) { return {}; }
  }
  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function subtotal() {
    return Object.entries(cart).reduce((sum, [slug, qty]) => {
      const p = CATALOG[slug];
      const n = parseInt(qty, 10);
      return sum + (p && Number.isFinite(n) ? p.price * n : 0);
    }, 0);
  }

  function updateCount() {
    const badge = document.querySelector('.cart-count');
    if (!badge) return;
    const n = cartCount();
    badge.textContent = n;
    badge.hidden = n === 0;
  }

  function buildDrawer() {
    if (document.querySelector('.cart-drawer')) return;

    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.addEventListener('click', closeDrawer);

    const drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Shopping cart');
    drawer.innerHTML = `
      <div class="cart-drawer__header">
        <h3 class="cart-drawer__title">Your Cart</h3>
        <div class="cart-drawer__actions">
          <button class="cart-clear">Clear</button>
          <button class="cart-drawer__close" aria-label="Close cart">&times;</button>
        </div>
      </div>
      <div class="cart-items"></div>
      <div class="cart-drawer__footer">
        <div class="cart-subtotal">Subtotal: <strong>${fmt(subtotal())}</strong></div>
        <p class="cart-note">Shipping is calculated to your postal code.</p>
        <label class="cart-age-check">
          <input type="checkbox" class="cart-age-confirm">
          <span>I confirm the recipient is at least <strong>${maxCartAge()}+</strong> years old — small parts, choking hazard.</span>
        </label>
        <div class="cart-shipping">
          <label class="cart-shipping__label" for="cart-postal">Ship to (Canadian postal code)</label>
          <div class="cart-postal-row">
            <input type="text" id="cart-postal" class="cart-postal" placeholder="A1A 1A1" maxlength="7" autocomplete="postal-code" aria-label="Postal code">
            <button class="btn btn--ghost cart-getrates" type="button">Get rates</button>
          </div>
          <div class="cart-rate-options" hidden></div>
        </div>
        <button class="btn btn--primary cart-checkout" style="width:100%;justify-content:center;">Proceed to Checkout</button>
        <p class="cart-note">Prefer to pay by Interac e-Transfer? <a href="#" class="cart-etransfer">Order by email instead</a>.</p>
        <p class="cart-error" hidden></p>
      </div>`;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    drawer.querySelector('.cart-drawer__close').addEventListener('click', closeDrawer);
    drawer.querySelector('.cart-clear').addEventListener('click', () => {
      cart = {};
      saveCart();
      updateCount();
      renderCart();
      updateSubtotal();
    });
    drawer.querySelector('.cart-checkout').addEventListener('click', checkout);
    drawer.querySelector('.cart-etransfer').addEventListener('click', (e) => { e.preventDefault(); emailOrder(); });
    drawer.querySelector('.cart-getrates').addEventListener('click', getRates);
    drawer.querySelector('.cart-postal').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); getRates(); }
    });
    drawer.querySelector('.cart-postal').addEventListener('input', () => {
      ratesPostal = '';
      selectedRate = null;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.cart-overlay--open')) {
        closeDrawer();
        const toggle = document.querySelector('.cart-toggle');
        if (toggle) toggle.focus();
      }
    });
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function renderCart() {
    const box = document.querySelector('.cart-items');
    if (!box) return;
    const entries = Object.entries(cart).filter(([slug]) => CATALOG[slug]);
    if (!entries.length) {
      box.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      document.querySelector('.cart-drawer__footer').style.display = 'none';
      return;
    }
    document.querySelector('.cart-drawer__footer').style.display = '';
    box.innerHTML = entries.map(([slug, qty]) => {
      const p = CATALOG[slug];
      const q = parseInt(qty, 10);
      const qtySafe = Number.isFinite(q) ? q : 1;
      return `
        <div class="cart-item" data-slug="${esc(slug)}">
          <img class="cart-item__img" src="${IMG}${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">
          <div class="cart-item__info">
            <span class="cart-item__name">${esc(p.name)}</span>
            <span class="cart-item__price">${fmt(p.price)}</span>
            <div class="cart-item__qty">
              <button class="cart-item__step" data-delta="-1" aria-label="Decrease quantity">-</button>
              <span class="cart-item__count">${qtySafe}</span>
              <button class="cart-item__step" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item__remove" aria-label="Remove ${esc(p.name)}">&times;</button>
        </div>`;
    }).join('');

    box.querySelectorAll('.cart-item__step').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.closest('.cart-item').dataset.slug;
        const delta = parseInt(btn.dataset.delta, 10);
        cart[slug] = Math.max(1, Math.min(99, (cart[slug] || 0) + delta));
        if (cart[slug] <= 0) delete cart[slug];
        saveCart(); updateCount(); renderCart(); updateSubtotal();
      });
    });
    box.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.closest('.cart-item').dataset.slug;
        delete cart[slug];
        saveCart(); updateCount(); renderCart(); updateSubtotal();
      });
    });
  }

  function updateSubtotal() {
    const el = document.querySelector('.cart-subtotal strong');
    if (el) el.textContent = fmt(subtotal());
    const ageEl = document.querySelector('.cart-age-confirm ~ span strong');
    if (ageEl) ageEl.textContent = maxCartAge() + '+';
  }

  function openDrawer() {
    buildDrawer();
    renderCart();
    updateSubtotal();
    document.querySelector('.cart-overlay').classList.add('cart-overlay--open');
    document.querySelector('.cart-drawer').classList.add('cart-drawer--open');
    const toggle = document.querySelector('.cart-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    const overlay = document.querySelector('.cart-overlay');
    const drawer = document.querySelector('.cart-drawer');
    if (overlay) overlay.classList.remove('cart-overlay--open');
    if (drawer) drawer.classList.remove('cart-drawer--open');
    const toggle = document.querySelector('.cart-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function setCartError(msg) {
    const el = document.querySelector('.cart-error');
    if (!el) return;
    el.textContent = msg;
    el.hidden = !msg;
  }

  function normalizePostalCode(value) {
    return (value || '').replace(/[^a-z0-9]/gi, '').toUpperCase();
  }

  function validPostalCode(value) {
    return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(value);
  }

  function postalInput() {
    return document.querySelector('.cart-postal');
  }

  async function getRates() {
    ratesPromise = (async () => {
    const items = Object.entries(cart).map(([slug, quantity]) => ({ slug, quantity }));
    if (!items.length) return;
    const pc = normalizePostalCode(postalInput() && postalInput().value);
    if (!validPostalCode(pc)) {
      setCartError('Enter a valid Canadian postal code (e.g. A1A 1A1).');
      postalInput() && postalInput().focus();
      return;
    }
    ratesFetching = true;
    ratesPostal = pc;
    rateOptions = [];
    selectedRate = null;
    renderRateOptions();
    setRatesLoading(true);
    setCartError('');
    const btn = document.querySelector('.cart-getrates');
    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Getting rates…';
    try {
      const res = await fetch(API_BASE + '/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, postalCode: pc }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not get shipping rates');
      rateOptions = data.options || [];
      selectedRate = null;
      renderRateOptions();
      if (rateOptions.length === 1) {
        selectedRate = rateOptions[0];
        setCartError('Shipping: ' + rateDisplay(selectedRate));
      } else if (rateOptions.length > 1) {
        selectedRate = rateOptions.find((o) => o.id !== 'HAND.DELIVERY') || rateOptions[0];
        renderRateOptions();
        setCartError('');
      } else {
        setCartError('No shipping options available for this postal code.');
      }
    } catch (e) {
      console.error('rates error', e);
      rateOptions = [];
      selectedRate = null;
      ratesPostal = '';
      renderRateOptions();
      setCartError('Could not get shipping rates (' + (e && e.message ? e.message : 'unknown error') + '). Try again, or order by email.');
    } finally {
      ratesFetching = false;
      setRatesLoading(false);
      btn.disabled = false;
      btn.textContent = old;
    }
    })();
    return ratesPromise;
  }

  function setRatesLoading(loading) {
    const box = document.querySelector('.cart-rate-options');
    if (box) box.classList.toggle('cart-rate-options--loading', loading);
    const chk = document.querySelector('.cart-checkout');
    if (chk) chk.disabled = loading;
    const boxEl = document.querySelector('.cart-rate-options');
    if (boxEl && loading) {
      boxEl.hidden = false;
      boxEl.innerHTML = '<p class="cart-rate-loading">Getting shipping options…</p>';
    }
  }

  function rateDisplay(opt) {
    const days = opt.minDays ? ' · ' + opt.minDays + (opt.maxDays && opt.maxDays !== opt.minDays ? '–' + opt.maxDays : '') + ' business days' : '';
    return opt.name + ' ' + fmt(opt.amount / 100) + days;
  }

  function renderRateOptions() {
    const box = document.querySelector('.cart-rate-options');
    if (!box) return;
    if (!rateOptions.length) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    box.hidden = false;
    box.innerHTML = rateOptions.map((opt) => `
      <label class="cart-rate-option">
        <input type="radio" name="cart-rate" value="${esc(opt.id)}" ${selectedRate && selectedRate.id === opt.id ? 'checked' : ''}>
        <span>${esc(rateDisplay(opt))}</span>
      </label>`).join('');
    box.querySelectorAll('input[name="cart-rate"]').forEach((input) => {
      input.addEventListener('change', () => {
        selectedRate = rateOptions.find((o) => o.id === input.value) || null;
        setCartError('');
      });
    });
  }

  function maxCartAge() {
    return Object.entries(cart).reduce((max, [slug, qty]) => {
      const p = CATALOG[slug];
      return p ? Math.max(max, p.age || 3) : max;
    }, 3);
  }

  function ageConfirmed() {
    const box = document.querySelector('.cart-age-confirm');
    return box ? box.checked : true;
  }

  async function checkout() {
    const items = Object.entries(cart).map(([slug, quantity]) => ({ slug, quantity }));
    if (!items.length) return;
    if (!ageConfirmed()) {
      setCartError('Please confirm the recipient meets the minimum age requirement (choking hazard) before proceeding.');
      return;
    }
    const pc = normalizePostalCode(postalInput() && postalInput().value);
    if (!validPostalCode(pc)) {
      setCartError('Enter your Canadian postal code and get shipping rates first.');
      postalInput() && postalInput().focus();
      return;
    }
    if (ratesFetching && ratesPromise) {
      await ratesPromise;
    }
    if (!rateOptions.length || ratesPostal !== pc) {
      await getRates();
      if (ratesFetching && ratesPromise) {
        await ratesPromise;
      }
    }
    if (!selectedRate) {
      if (!rateOptions.length) return;
      setCartError('Select a shipping option above.');
      return;
    }
    const btn = document.querySelector('.cart-checkout');
    btn.disabled = true;
    btn.textContent = 'Starting checkout...';
    setCartError('');
    try {
      const res = await fetch(API_BASE + '/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, postalCode: pc, serviceCode: selectedRate.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.out && data.out.length) {
        for (const slug of data.out) delete cart[slug];
        saveCart();
        updateCount();
        renderCart();
        updateSubtotal();
        applyStockBadges();
        btn.disabled = false;
        btn.textContent = 'Proceed to Checkout';
        setCartError('Some items in your cart just sold out and were removed. Please review and try again.');
        return;
      }
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e) {
      console.error('checkout error', e);
      btn.disabled = false;
      btn.textContent = 'Proceed to Checkout';
      setCartError('Could not start checkout (' + (e && e.message ? e.message : 'unknown error') + '). Try again, or order by email.');
    }
  }

  function emailOrder() {
    if (!ageConfirmed()) {
      setCartError('Please confirm the recipient meets the minimum age requirement (choking hazard) before proceeding.');
      return;
    }
    const lines = Object.entries(cart)
      .filter(([slug]) => CATALOG[slug])
      .map(([slug, qty]) => `- ${qty} x ${CATALOG[slug].name} (${fmt(CATALOG[slug].price)})`);
    const subject = encodeURIComponent('Order request: BrickAndMotorLabs');
    const body = encodeURIComponent(
      'Hi BrickAndMotorLabs,\n\nI would like to order:\n' + lines.join('\n') +
      '\n\nSubtotal: ' + fmt(subtotal()) +
      '\n\nI prefer to pay by Interac e-Transfer. Please send the details.'
    );
    window.location.href = 'mailto:brickandmotorlabs@gmail.com?subject=' + subject + '&body=' + body;
  }

  function addToCart(slug, btn) {
    if (!CATALOG[slug]) return;
    if (stock[slug] === 0) return;
    cart[slug] = Math.min(99, (cart[slug] || 0) + 1);
    saveCart(); updateCount();
    if (btn) {
      const t = btn.innerHTML;
      btn.innerHTML = 'Added!';
      setTimeout(() => { btn.innerHTML = t; }, 1200);
    }
    openDrawer();
  }

  function injectNavCart() {
    const menu = document.querySelector('.navbar__menu');
    if (!menu || menu.querySelector('.navbar__cart-item')) return;
    const li = document.createElement('li');
    li.className = 'navbar__cart-item';
    li.innerHTML = `
      <button class="cart-toggle" aria-label="Open cart" aria-expanded="false">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span class="cart-count" hidden>0</span>
      </button>`;
    menu.appendChild(li);
    li.querySelector('.cart-toggle').addEventListener('click', openDrawer);
  }

  function injectCardButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
      const link = card.querySelector('.product-card__link');
      if (!link) return;
      const m = link.getAttribute('href').match(/([a-z0-9-]+)\.html$/);
      if (!m) return;
      const slug = m[1];
      if (!CATALOG[slug]) return;
      card.dataset.slug = slug;
      const footer = card.querySelector('.product-card__footer');
      if (!footer || footer.querySelector('.product-card__etransfer')) return;

      const price = footer.querySelector('.product-card__price');
      if (price) {
        const priceBtn = document.createElement('button');
        priceBtn.type = 'button';
        priceBtn.className = price.className + ' product-card__price-btn';
        priceBtn.setAttribute('aria-label', 'Add ' + CATALOG[slug].name + ' to cart');
        priceBtn.innerHTML = price.innerHTML + '<svg class="price-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
        priceBtn.addEventListener('click', () => addToCart(slug, priceBtn));
        price.replaceWith(priceBtn);
      }

      const etransfer = document.createElement('a');
      etransfer.href = 'contact.html';
      etransfer.className = 'product-card__etransfer';
      etransfer.textContent = 'Interac e-Transfer';
      footer.appendChild(etransfer);
    });
  }

  function injectBuildButton() {
    if (!document.querySelector('.build-hero')) return;
    const m = location.pathname.match(/builds\/([a-z0-9-]+)\.html$/);
    if (!m) return;
    const slug = m[1];
    if (!CATALOG[slug]) return;
    const cta = document.querySelector('.build-cta .container');
    if (!cta || cta.querySelector('.add-to-cart')) return;
    const btn = document.createElement('button');
    btn.className = 'btn btn--accent add-to-cart';
    btn.textContent = 'Add to Cart';
    btn.addEventListener('click', () => addToCart(slug, btn));
    cta.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectNavCart();
    injectCardButtons();
    injectBuildButton();
    updateCount();
    loadStock();
    loadCanonicalPrices();
  });
})();

/**
 * GAZE INTERIORS - Modern Interactive Architecture & Experience Scripts
 * Location: Bavdhan, Pune, Maharashtra
 */

document.addEventListener('DOMContentLoaded', () => {
  initOperatingStatus();
  initComparisonSlider();
  initCostEstimator();
  initPortfolioFilter();
  initLightbox();
  initContactForm();
  initMobileNav();
  initScrollSpy();
  initScrollReveal();
});

/* ==========================================================================
   1. Live Operating Hours & Studio Status
   ========================================================================== */
function initOperatingStatus() {
  const statusEl = document.getElementById('liveStatusIndicator');
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 5 is Friday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  // Friday is closed (day 5)
  // Other days: 11:00 AM to 6:00 PM (18:00)
  const isFriday = day === 5;
  const isOpenHours = !isFriday && currentTime >= 11 && currentTime < 18;

  if (statusEl) {
    if (isFriday) {
      statusEl.innerHTML = `
        <span class="status-pulse closed"></span>
        <span>Studio Closed Today (Fridays) • WhatsApp & Enquiries Open</span>
      `;
    } else if (isOpenHours) {
      statusEl.innerHTML = `
        <span class="status-pulse"></span>
        <span>Studio Open Now in Bavdhan • Closes at 6:00 PM</span>
      `;
    } else {
      statusEl.innerHTML = `
        <span class="status-pulse closed"></span>
        <span>Studio Closed Now • Opens at 11:00 AM</span>
      `;
    }
  }

  // Highlight today's row in timing table
  const daysMap = [
    'timing-sun', // 0
    'timing-mon', // 1
    'timing-tue', // 2
    'timing-wed', // 3
    'timing-thu', // 4
    'timing-fri', // 5
    'timing-sat'  // 6
  ];

  const todayRowId = daysMap[day];
  const row = document.getElementById(todayRowId);
  if (row) {
    row.classList.add('today-row');
    const dayCell = row.querySelector('td:first-child');
    if (dayCell) {
      dayCell.innerHTML += ' <span style="font-size: 0.72rem; padding: 2px 6px; background: rgba(212, 175, 55, 0.2); border-radius: 4px; margin-left: 6px; color: var(--gold-light);">TODAY</span>';
    }
  }
}

/* ==========================================================================
   2. Interactive Before & After Renovation Comparison Slider
   ========================================================================== */
function initComparisonSlider() {
  const container = document.getElementById('renovationComparison');
  if (!container) return;

  const overlayWrap = container.querySelector('.comparison-overlay-wrap');
  const handle = container.querySelector('.slider-handle');
  let isDragging = false;

  function updateSliderPosition(xPos) {
    const rect = container.getBoundingClientRect();
    let offsetX = xPos - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    overlayWrap.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse events
  handle.addEventListener('mousedown', () => { isDragging = true; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  // Touch events for mobile
  handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches.length) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  // Click anywhere on container to move handle
  container.addEventListener('click', (e) => {
    updateSliderPosition(e.clientX);
  });
}

/* ==========================================================================
   3. Interactive Interior Cost Estimator
   ========================================================================== */
function initCostEstimator() {
  const spaceBtns = document.querySelectorAll('.space-opt-btn');
  const tierBtns = document.querySelectorAll('.tier-opt-btn');
  const checkboxes = document.querySelectorAll('.scope-checkbox');
  const resultPrice = document.getElementById('calcResultPrice');
  const resultType = document.getElementById('calcResultType');
  const resultTimeline = document.getElementById('calcResultTimeline');
  const resultWarranty = document.getElementById('calcResultWarranty');
  const whatsappQuoteBtn = document.getElementById('calcWhatsAppBtn');

  // Base configurations (in Lakhs INR)
  const spaceBase = {
    '1bhk': { base: 4.8, area: '450 - 650 sq.ft', timeline: '30 - 40 Days' },
    '2bhk': { base: 7.5, area: '750 - 1050 sq.ft', timeline: '40 - 50 Days' },
    '3bhk': { base: 11.2, area: '1200 - 1650 sq.ft', timeline: '45 - 60 Days' },
    '4bhk': { base: 16.5, area: '1800 - 2600 sq.ft', timeline: '60 - 75 Days' },
    'kitchen': { base: 3.2, area: 'Custom Dimensions', timeline: '25 - 35 Days' },
    'renovation': { base: 9.0, area: 'Full Turnkey Makeover', timeline: '45 - 65 Days' }
  };

  const tierMultiplier = {
    'essential': 1.0,
    'premium': 1.35,
    'bespoke': 1.85
  };

  let selectedSpace = '3bhk';
  let selectedTier = 'premium';

  function calculateEstimate() {
    const spaceData = spaceBase[selectedSpace] || spaceBase['3bhk'];
    const multiplier = tierMultiplier[selectedTier] || 1.35;
    let basePrice = spaceData.base * multiplier;

    // Additional scope additions
    let scopeBonus = 0;
    let selectedScopes = [];
    checkboxes.forEach(cb => {
      if (cb.checked) {
        scopeBonus += parseFloat(cb.dataset.price || 0.4);
        selectedScopes.push(cb.dataset.label);
      }
    });

    const totalEstimate = basePrice + scopeBonus;
    const lowerRange = (totalEstimate * 0.92).toFixed(1);
    const upperRange = (totalEstimate * 1.08).toFixed(1);

    if (resultPrice) {
      resultPrice.innerHTML = `₹${lowerRange} - ₹${upperRange} <span style="font-size: 1.2rem; font-weight: 500; color: var(--gold-primary);">Lakhs</span>`;
    }

    if (resultType) {
      resultType.textContent = `${selectedSpace.toUpperCase()} • ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Finish`;
    }

    if (resultTimeline) {
      resultTimeline.textContent = spaceData.timeline;
    }

    if (resultWarranty) {
      resultWarranty.textContent = selectedTier === 'bespoke' ? '10 Years Flat' : '7 - 10 Years';
    }

    // Update WhatsApp prefilled message
    if (whatsappQuoteBtn) {
      const msg = encodeURIComponent(
        `Hello Gaze Interiors! I just calculated an interior estimate on your website for my ${selectedSpace.toUpperCase()} with ${selectedTier.toUpperCase()} finishes (Estimated: ₹${lowerRange} - ₹${upperRange} Lakhs). I'd love to schedule a free 3D design consultation at your Bavdhan studio.`
      );
      whatsappQuoteBtn.href = `https://wa.me/918888895662?text=${msg}`;
    }
  }

  // Event Listeners for Space selection
  spaceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      spaceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSpace = btn.dataset.space;
      calculateEstimate();
    });
  });

  // Event Listeners for Tier selection
  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTier = btn.dataset.tier;
      calculateEstimate();
    });
  });

  // Checkboxes
  checkboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  // Initial calculation
  calculateEstimate();
}

/* ==========================================================================
   4. Portfolio Category Filtering
   ========================================================================== */
function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.portfolio-tab-btn');
  const items = document.querySelectorAll('.portfolio-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      items.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('portfolioLightbox');
  const modalImg = document.getElementById('lightboxImage');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.portfolio-item');

  if (!modal || !modalImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.portfolio-item-title')?.textContent || '';
      const loc = item.querySelector('.portfolio-item-loc')?.textContent || '';

      modalImg.src = img.src;
      modalCaption.textContent = `${title} — ${loc}`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Contact Consultation Form & WhatsApp Redirect
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('studioContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const propertyType = document.getElementById('contactPropertyType')?.value;
    const location = document.getElementById('contactLocation')?.value.trim();
    const message = document.getElementById('contactNotes')?.value.trim();

    if (!name || !phone) {
      showToast('Please enter your name and contact phone number.');
      return;
    }

    const waText = encodeURIComponent(
      `Hello Gaze Interiors!\nI would like to book an interior design consultation.\n\nName: ${name}\nPhone: ${phone}\nProject Type: ${propertyType}\nLocation: ${location || 'Pune'}\nDetails: ${message || 'Looking for modern 3D designs and quotation'}`
    );

    showToast('Consultation request registered! Redirecting to studio WhatsApp...');
    
    setTimeout(() => {
      window.open(`https://wa.me/918888895662?text=${waText}`, '_blank');
      form.reset();
    }, 1200);
  });
}

function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   7. Mobile Navigation & Smooth Scroll
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('mainNavLinks');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  // Close menu on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. Scroll-Triggered Reveal Animations (Every section except Section 1)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger');

  function checkReveal() {
    const triggerPoint = window.innerHeight * 0.90;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= triggerPoint) {
        el.classList.add('is-revealed');
      }
    });
  }

  // Dual-engine: Active scroll and resize listeners
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal, { passive: true });

  // Modern IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05
    });

    elements.forEach(el => observer.observe(el));
  }

  // Initial check
  setTimeout(checkReveal, 80);
}


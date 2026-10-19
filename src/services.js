/**
 * AI Automation Labs - Services Portfolio Interactions
 * Handles dynamic category filtering, prefilled modal inquiries, and glow effects.
 */

import { setupThemeSwitcher, setupFloatingWhatsApp, submitLeadToGoogleSheets, showToast } from './interactive-components.js';

document.addEventListener('DOMContentLoaded', () => {
  setupThemeSwitcher();
  setupSpotlightGlow();
  setupCategoryFilter();
  setupServiceModals();
  setupMobileNav();
  setupFloatingWhatsApp();
  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);
});

function setupSpotlightGlow() {
  const bgSpotlight = document.getElementById('bg-mouse-spotlight');
  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (bgSpotlight) {
          bgSpotlight.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }

    const cards = document.querySelectorAll('.glow-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

function setupCategoryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

function setupServiceModals() {
  const modal = document.getElementById('audit-modal');
  const modalClose = document.getElementById('audit-modal-close');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const serviceSelect = document.getElementById('enquiry-challenge');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name');
      if (serviceName && serviceSelect) {
        // Find matching option or set value
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.includes(serviceName) || serviceSelect.options[i].value.includes(serviceName)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle form submission
  const form = document.getElementById('modal-enquiry-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Submit';

      const nameEl = form.querySelector('#enquiry-name');
      const emailEl = form.querySelector('#enquiry-email');
      const phoneEl = form.querySelector('#enquiry-phone');
      const companyEl = form.querySelector('#enquiry-company');
      const challengeEl = form.querySelector('#enquiry-challenge');
      const notesEl = form.querySelector('#enquiry-notes');

      const challengeText = challengeEl ? challengeEl.value : '';
      const notesText = notesEl ? notesEl.value.trim() : '';

      const payload = {
        name: nameEl ? nameEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
        phone: phoneEl ? phoneEl.value.trim() : '',
        company: companyEl ? companyEl.value.trim() : '',
        requirement: notesText ? `${challengeText} — ${notesText}` : challengeText,
        source: 'Services Consultation Modal (AI Automation Labs)'
      };

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle;"></span> Submitting...';
      }

      try {
        await submitLeadToGoogleSheets(payload);

        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '✓ Submitted';
          btn.style.background = '#10b981';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#ffffff';
        }

        showToast(
          'Form Submitted Successfully',
          'Your requirement was recorded. Our solutions architect will review and connect with you shortly.',
          'success'
        );

        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }

        form.reset();
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
          }
        }, 3500);
      } catch (error) {
        console.error('Service modal submission error:', error);
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }

        showToast(
          'Submission Error',
          error.message || 'Unable to connect to Google Sheets Web App. Please check Apps Script permissions.',
          'error'
        );
      }
    });
  }
}

function setupMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('header-nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      toggleBtn.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
      });
    });
  }
}

function handleHashNavigation() {
  const hash = window.location.hash;
  if (!hash) return;

  try {
    const targetEl = document.querySelector(hash);
    if (!targetEl) return;

    if (targetEl.classList.contains('service-card')) {
      const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allFilterBtn && !allFilterBtn.classList.contains('active')) {
        allFilterBtn.click();
      }
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEl.classList.add('card-highlight');
        setTimeout(() => targetEl.classList.remove('card-highlight'), 2600);
      }, 150);
    }
  } catch (e) {
    // ignore invalid selector in hash
  }
}

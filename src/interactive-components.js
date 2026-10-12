/**
 * AI Automation Labs - Enterprise Interactive Components
 * Handles Modals, Tabs, Before/After Slider, FAQs, Form Validation,
 * Toast Notifications, and Mouse Radial Glow Spotlight.
 */

export function setupInteractiveComponents() {
  setupThemeSwitcher();
  setupSpotlightGlow();
  setupLayersTabs();
  setupBeforeAfterToggle();
  setupCaseStudiesModal();
  setupFaqAccordion();
  setupModals();
  setupEnquiryForm();
  setupScrollAnimations();
  setupMobileNav();
  setupContactTopicPrefill();
  setupFloatingWhatsApp();
}

/**
 * Ambient mouse radial glow following cursor across glassmorphic cards
 */
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

/**
 * Section 3: Operational Layers Interactive Tabs
 */
function setupLayersTabs() {
  const tabs = document.querySelectorAll('.layer-tab-btn');
  const panels = document.querySelectorAll('.layer-content-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-layer-target');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(targetId);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

/**
 * Section 4: Before vs After Transformation Toggle
 */
function setupBeforeAfterToggle() {
  const toggleBtns = document.querySelectorAll('[data-workflow-view]');
  const legacyCard = document.getElementById('workflow-legacy-view');
  const unifiedCard = document.getElementById('workflow-unified-view');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-workflow-view');
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (view === 'legacy') {
        if (legacyCard) legacyCard.style.display = 'block';
        if (unifiedCard) unifiedCard.style.display = 'none';
      } else {
        if (legacyCard) legacyCard.style.display = 'none';
        if (unifiedCard) unifiedCard.style.display = 'block';
      }
    });
  });
}

/**
 * Section 6: Case Studies Detail Modal
 */
const caseStudiesData = {
  'glam-luxe': {
    client: 'GLAM LUXE',
    tagline: 'Multi-Location Retail Operations & Centralized Inventory Control',
    industry: 'Consumer Goods & Multi-Branch Retail',
    scale: '25+ Operating Outlets',
    challenge: 'Branch managers were updating inventory on fragmented local spreadsheets. Central procurement faced 72-hour visibility delays, resulting in frequent stockouts at high-volume outlets and bloated working capital in secondary stores.',
    solution: 'Engineered an omnichannel event-driven middleware connecting point-of-sale systems with central ERP and automated restocking triggers. Deployed a live executive telemetry control tower for leadership.',
    metrics: [
      { label: 'Inventory Sync Latency', before: '72 Hours', after: '< 2.4 Seconds' },
      { label: 'Stockout Reduction', before: 'High (18%)', after: 'Down to 1.2%' },
      { label: 'Procurement Efficiency', before: '14 hrs/week', after: 'Automated Real-time' }
    ],
    architecture: 'PostgreSQL Event Store → Real-time Kafka / Webhook Pipeline → Central ERP Bi-directional Sync → Multi-Device Manager Portal'
  },
  'raw-pastel': {
    client: 'RAW PASTEL',
    tagline: 'From Manual Spreadsheet Chaos to Unified Enterprise CRM & ERP',
    industry: 'Apparel Manufacturing & Enterprise B2B Supply',
    scale: '₹140Cr Annual Throughput',
    challenge: 'Order tracking, fabric lot allocation, and client communication were split across 40+ disparate Google Sheets and WhatsApp groups. Critical production orders were missed during peak seasonal volume.',
    solution: 'Replaced manual spreadsheet dependency with an integrated custom CRM & Production ERP backbone. Automated order state transitions, cutting-table job cards, and automated client WhatsApp dispatch alerts.',
    metrics: [
      { label: 'Order Processing Speed', before: '5 Business Days', after: 'Same-day Automated' },
      { label: 'Manual Data Entry', before: '320+ hrs/month', after: '94% Eliminated' },
      { label: 'On-time Dispatch Rate', before: '71%', after: '98.6%' }
    ],
    architecture: 'Custom Next/Node ERP Engine → WhatsApp Business Cloud API Integration → Fabric Inventory Ledger → Real-time Invoice Automation'
  },
  'know-my-health': {
    client: 'KNOW MY HEALTH',
    tagline: 'Mission-Critical Digital Health Infrastructure & Secure Data Pipelines',
    industry: 'Diagnostic Logistics & Healthtech',
    scale: '80,000+ Monthly Tests',
    challenge: 'Diagnostic sample chain-of-custody, lab machine integration, and patient report generation were bottlenecked by manual transcription, creating turnaround latency and strict compliance risks.',
    solution: 'Architected an automated HL7/FHIR compliant data pipeline connecting lab analyzer hardware directly to automated PDF report generation and secure multi-channel delivery within seconds of test validation.',
    metrics: [
      { label: 'Report Delivery Time', before: '4 to 6 Hours', after: '< 45 Seconds' },
      { label: 'Transcription Error Rate', before: '2.8%', after: '0.00% (Zero Touch)' },
      { label: 'System Uptime', before: '96.2%', after: '99.99% Cloud Architecture' }
    ],
    architecture: 'Secure Analyzer Edge Gateways → HIPAA/HL7 Microservices → Automated Cryptographic Watermarking → Multi-channel Delivery Engine'
  }
};

function setupCaseStudiesModal() {
  const caseButtons = document.querySelectorAll('[data-case-slug]');
  const modal = document.getElementById('case-modal');
  const closeBtn = document.getElementById('case-modal-close');

  if (!modal) return;

  caseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = btn.getAttribute('data-case-slug');
      const data = caseStudiesData[slug];
      if (!data) return;

      document.getElementById('case-modal-title').textContent = data.client;
      document.getElementById('case-modal-tagline').textContent = data.tagline;
      document.getElementById('case-modal-industry').textContent = data.industry;
      document.getElementById('case-modal-scale').textContent = data.scale;
      document.getElementById('case-modal-challenge').textContent = data.challenge;
      document.getElementById('case-modal-solution').textContent = data.solution;
      document.getElementById('case-modal-arch').textContent = data.architecture;

      // Render metrics
      const metricsContainer = document.getElementById('case-modal-metrics');
      if (metricsContainer) {
        metricsContainer.innerHTML = data.metrics.map(m => `
          <div class="metric-comparison-box">
            <span class="metric-label">${m.label}</span>
            <div class="metric-val-row">
              <span class="val-before">Legacy: ${m.before}</span>
              <span class="val-arrow">→</span>
              <span class="val-after">Delivered: ${m.after}</span>
            </div>
          </div>
        `).join('');
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Section 10: FAQs Accordion
 */
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

/**
 * Audit & Consultation Modals
 */
function setupModals() {
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const auditModal = document.getElementById('audit-modal');
  const auditModalClose = document.getElementById('audit-modal-close');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = btn.getAttribute('data-open-modal');
      if (auditModal) {
        // Pre-configure heading if user clicked "Explore Audit" vs "Discuss Transformation"
        const modalTitle = document.getElementById('modal-heading');
        const modalSub = document.getElementById('modal-subheading');
        if (modalType === 'audit' && modalTitle) {
          modalTitle.textContent = 'Explore the Transformation Audit';
          modalSub.textContent = 'A structured 14-day diagnostic sprint to uncover system bottlenecks and model your future-state architecture.';
        } else if (modalTitle) {
          modalTitle.textContent = 'Discuss Your Transformation';
          modalSub.textContent = 'Schedule a strategic confidential discussion with our enterprise systems engineering team.';
        }
        auditModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (auditModalClose && auditModal) {
    auditModalClose.addEventListener('click', () => {
      auditModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (auditModal) {
    auditModal.addEventListener('click', (e) => {
      if (e.target === auditModal) {
        auditModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
}

export const APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzAJOWeMoX0r6QQ10SeeUHRXxgLDc2SrZFMfVqzNgN3EmK1KwPK7pUh3VIx942EaWlW/exec';

/**
 * Submits lead payload to Google Sheets Apps Script Web App
 * Field Mapping: name, email, phone, company, requirement, source
 */
export async function submitLeadToGoogleSheets(payload) {
  try {
    const response = await fetch(APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 401) {
      throw new Error('Google Apps Script HTTP 401: Unauthorized. In Google Apps Script, change "Who has access" to "Anyone" and redeploy.');
    }

    if (!response.ok) {
      throw new Error(`Google Apps Script HTTP ${response.status}: ${response.statusText || 'Request failed'}`);
    }

    const text = await response.text();
    let result = null;
    try {
      result = JSON.parse(text);
    } catch (e) {
      result = { status: 'success', raw: text };
    }

    if (result && (result.status === 'error' || result.result === 'error')) {
      throw new Error(result.message || 'Google Sheets script reported an error.');
    }

    return result;
  } catch (error) {
    console.error('Google Sheets lead submission error:', error);
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      throw new Error('Google Apps Script blocked the request (401 Unauthorized / CORS). Change "Who has access" to "Anyone" in Google Apps Script and redeploy.');
    }
    throw error;
  }
}

/**
 * Enquiry Form Submission & Toast
 */
function setupEnquiryForm() {
  const forms = [
    document.getElementById('hero-enquiry-form'),
    document.getElementById('modal-enquiry-form'),
    document.getElementById('footer-enquiry-form')
  ];

  forms.forEach(form => {
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      // 1. Extract and map fields according to the form ID
      let payload = {};
      const isHero = form.id === 'hero-enquiry-form';

      if (isHero) {
        const nameEl = form.querySelector('#lead-name');
        const emailEl = form.querySelector('#lead-email');
        const phoneEl = form.querySelector('#lead-phone');
        const companyEl = form.querySelector('#lead-company');
        const challengeEl = form.querySelector('#lead-challenge');
        const notesEl = form.querySelector('#lead-notes');

        const challengeText = challengeEl && challengeEl.selectedIndex >= 0 ? challengeEl.options[challengeEl.selectedIndex].text : '';
        const notesText = notesEl ? notesEl.value.trim() : '';

        payload = {
          name: nameEl ? nameEl.value.trim() : '',
          email: emailEl ? emailEl.value.trim() : '',
          phone: phoneEl ? phoneEl.value.trim() : '',
          company: companyEl ? companyEl.value.trim() : '',
          requirement: notesText ? `${challengeText} — ${notesText}` : challengeText,
          source: 'Homepage Contact Section (AI Automation Labs)'
        };
      } else {
        const nameEl = form.querySelector('#enquiry-name');
        const emailEl = form.querySelector('#enquiry-email');
        const phoneEl = form.querySelector('#enquiry-phone');
        const companyEl = form.querySelector('#enquiry-company');
        const challengeEl = form.querySelector('#enquiry-challenge');
        const notesEl = form.querySelector('#enquiry-notes');

        const challengeText = challengeEl ? challengeEl.value : '';
        const notesText = notesEl ? notesEl.value.trim() : '';

        payload = {
          name: nameEl ? nameEl.value.trim() : '',
          email: emailEl ? emailEl.value.trim() : '',
          phone: phoneEl ? phoneEl.value.trim() : '',
          company: companyEl ? companyEl.value.trim() : '',
          requirement: notesText ? `${challengeText} — ${notesText}` : challengeText,
          source: 'Transformation Audit Modal (AI Automation Labs)'
        };
      }

      // 2. Set loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle;"></span> Submitting...';
      }

      // 3. Submit to Apps Script
      try {
        await submitLeadToGoogleSheets(payload);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '✓ Submitted';
          submitBtn.style.background = '#10b981';
          submitBtn.style.borderColor = '#10b981';
          submitBtn.style.color = '#ffffff';
        }

        showToast(
          'Form Submitted Successfully',
          'Your message has been received. Our team will get back to you shortly.',
          'success'
        );

        // Close modal if open
        const auditModal = document.getElementById('audit-modal');
        if (auditModal) {
          auditModal.classList.remove('active');
          document.body.style.overflow = '';
        }

        form.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.style.color = '';
          }
        }, 3500);
      } catch (error) {
        console.error('Submission failed:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
        }

        showToast(
          'Submission Error',
          error.message || 'Unable to connect to Google Sheets Web App. Please check Apps Script permissions.',
          'error'
        );
      }
    });
  });
}

export function showToast(title, message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const isError = type === 'error';
  const icon = isError ? '✕' : '✓';
  const toast = document.createElement('div');
  toast.className = `toast-card ${isError ? 'toast-error' : ''}`;
  if (isError) {
    toast.style.borderColor = 'rgba(239, 68, 68, 0.55)';
    toast.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.25)';
  }

  toast.innerHTML = `
    <div class="toast-icon" style="${isError ? 'background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.5);' : ''}">${icon}</div>
    <div class="toast-content">
      <h4 class="toast-title" style="${isError ? 'color: #f87171;' : ''}">${title}</h4>
      <p class="toast-desc">${message}</p>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('visible');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 6500);
}

/**
 * Scroll Animations using IntersectionObserver
 */
function setupScrollAnimations() {
  const elements = document.querySelectorAll('.fade-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

/**
 * Mobile Navigation Toggle
 */
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('header-nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      toggleBtn.classList.toggle('open');
    });

    // Close menu when clicking nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        toggleBtn.classList.remove('open');
      });
    });
  }
}

/**
 * Auto-selects topic in Contact Us form when coming from Transformation Ladder and Capability buttons
 */
function setupContactTopicPrefill() {
  const topicLinks = document.querySelectorAll('[data-contact-topic]');
  topicLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close any open modals
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';

      const topic = link.getAttribute('data-contact-topic');
      const select = document.getElementById('lead-challenge');
      if (select && topic) {
        select.value = topic;
      }

      // Smooth scroll to contact
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const leadName = document.getElementById('lead-name');
          if (leadName) leadName.focus();
        }, 500);
      }
    });
  });
}

/**
 * Theme Switcher (Deep Blue vs Crisp White)
 */
export function setupThemeSwitcher() {
  let currentTheme = localStorage.getItem('aal_theme') || 'blue';
  
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('aal_theme', theme);

    // Update single toggle button icon & state
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('data-current-theme', theme);
      btn.setAttribute('aria-label', theme === 'blue' ? 'Switch to White Theme' : 'Switch to Deep Blue Theme');
      btn.setAttribute('title', theme === 'blue' ? 'Switch to White Theme (☀️)' : 'Switch to Deep Blue Theme (🌙)');
    });

    // Support legacy dual pill buttons if present
    document.querySelectorAll('.theme-btn').forEach(btn => {
      if (btn.getAttribute('data-theme-val') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Set initial theme state
  applyTheme(currentTheme);

  // Bind single toggle button
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextTheme = currentTheme === 'blue' ? 'white' : 'blue';
      applyTheme(nextTheme);
    });
  });

  // Bind legacy dual buttons if present
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const theme = btn.getAttribute('data-theme-val');
      if (theme) applyTheme(theme);
    });
  });
}

/**
 * Floating WhatsApp Widget Interactions
 */
export function setupFloatingWhatsApp() {
  const closeBtn = document.getElementById('whatsapp-close-btn');
  const bubble = document.getElementById('whatsapp-callout-bubble');
  const btn = document.getElementById('floating-whatsapp-btn');

  if (!bubble || !btn) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      bubble.classList.add('hidden');
      sessionStorage.setItem('aal_wa_bubble_closed', 'true');
    });
  }

  // If user previously closed in session, keep closed initially
  if (sessionStorage.getItem('aal_wa_bubble_closed') === 'true') {
    bubble.classList.add('hidden');
  }

  // Hovering the WhatsApp icon smoothly reveals the prompt card if dismissed
  btn.addEventListener('mouseenter', () => {
    bubble.classList.remove('hidden');
  });
}



import { SystemVisualizer } from './system-visualizer.js';
import { setupInteractiveComponents } from './interactive-components.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Signature Canvas Visualizer
  const visualizer = new SystemVisualizer('signature-canvas', 'signature-canvas-container');

  // Connect Mode Selector Buttons
  document.querySelectorAll('[data-viz-mode]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.currentTarget.getAttribute('data-viz-mode');
      if (visualizer) {
        visualizer.setMode(mode);
      }
    });
  });

  // 2. Initialize Interactive UI Components
  setupInteractiveComponents();

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 5. Live Telemetry Metric Animation on Hero
  animateMetricCounters();
});

function animateMetricCounters() {
  const statNumbers = document.querySelectorAll('.counter-val');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const decimals = parseInt(entry.target.getAttribute('data-decimals') || '0', 10);
        const duration = 1800;
        const startTime = performance.now();

        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = (target * easeOut).toFixed(decimals);
          entry.target.textContent = `${prefix}${current}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            entry.target.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          }
        };
        requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

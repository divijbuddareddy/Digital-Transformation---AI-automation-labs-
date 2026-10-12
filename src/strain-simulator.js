/**
 * AI Automation Labs - Interactive Operational Strain & Transformation ROI Simulator
 * Tailored for decision-makers at established manufacturing & enterprise businesses (₹100Cr–₹1,000Cr)
 */

export class StrainSimulator {
  constructor() {
    this.revSlider = document.getElementById('sim-revenue');
    this.plantsSlider = document.getElementById('sim-plants');
    this.stackSelect = document.getElementById('sim-stack');

    this.revValDisplay = document.getElementById('sim-revenue-val');
    this.plantsValDisplay = document.getElementById('sim-plants-val');

    this.hoursOutput = document.getElementById('sim-out-hours');
    this.leakageOutput = document.getElementById('sim-out-leakage');
    this.velocityOutput = document.getElementById('sim-out-velocity');
    this.paybackOutput = document.getElementById('sim-out-payback');

    this.blueprintBtn = document.getElementById('sim-generate-blueprint');

    if (this.revSlider && this.plantsSlider) {
      this.init();
    }
  }

  init() {
    const update = () => this.calculate();

    this.revSlider.addEventListener('input', () => {
      this.revValDisplay.textContent = `₹${this.revSlider.value} Cr`;
      update();
    });

    this.plantsSlider.addEventListener('input', () => {
      this.plantsValDisplay.textContent = `${this.plantsSlider.value} Units`;
      update();
    });

    if (this.stackSelect) {
      this.stackSelect.addEventListener('change', update);
    }

    if (this.blueprintBtn) {
      this.blueprintBtn.addEventListener('click', () => {
        const rev = this.revSlider.value;
        const plants = this.plantsSlider.value;
        const stack = this.stackSelect ? this.stackSelect.value : 'legacy';

        // Pre-fill consultation modal
        const challengeInput = document.getElementById('enquiry-challenge');
        const notesInput = document.getElementById('enquiry-notes');
        const modal = document.getElementById('audit-modal');

        if (challengeInput) {
          challengeInput.value = 'Connect disconnected applications';
        }
        if (notesInput) {
          notesInput.value = `Simulated Profile: ₹${rev}Cr turnover, ${plants} operating units, current environment: ${stack}. Interested in system audit.`;
        }

        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    // Initial calculation
    this.calculate();
  }

  calculate() {
    const rev = parseFloat(this.revSlider.value) || 300;
    const plants = parseInt(this.plantsSlider.value) || 3;
    const stackFactor = this.stackSelect ? parseFloat(this.stackSelect.value) : 1.35;

    // Formula grounded in manufacturing operational metrics:
    // Base manual data re-entry: ~42 hours per week per plant/dept + revenue scale factor
    const baseWeeklyHours = 38 * plants * (1 + (rev - 100) / 900 * 0.85);
    const totalAnnualHours = Math.round(baseWeeklyHours * 50 * stackFactor);

    // Revenue leakage / coordination friction cost: ~0.8% - 1.4% of turnover in manual latency
    const leakageCrores = ((rev * 0.0092 * (plants / 3) * stackFactor)).toFixed(2);

    // Velocity drag percentage
    const velocityDrag = Math.min(Math.round(28 + (plants * 2.5) + (rev / 40) * stackFactor), 78);

    // Payback period in months
    const paybackMonths = Math.max((2.8 + (plants * 0.2) / stackFactor).toFixed(1), 2.2);

    // Animate numbers
    this.animateCount(this.hoursOutput, totalAnnualHours, ' hrs/yr');
    this.animateCount(this.leakageOutput, `₹${leakageCrores}`, ' Cr');
    this.animateCount(this.velocityOutput, `${velocityDrag}%`, ' Lag');
    this.animateCount(this.paybackOutput, `${paybackMonths}`, ' Mos');
  }

  animateCount(element, targetVal, suffix = '') {
    if (!element) return;
    element.textContent = `${targetVal}${suffix}`;
  }
}

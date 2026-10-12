/**
 * AI Automation Labs - Signature System Visualization Engine
 * Communicates: Fragmented Systems -> Connected Operations -> Intelligent Execution
 * High-performance HTML5 Canvas with Particle Physics, Glowing Bezier Data Highways,
 * Interactive Node Inspection, Connected Link Highlighting, Particle Bursts,
 * and Web Audio cyber-tones.
 */

export class SystemVisualizer {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    if (!this.canvas || !this.container) return;

    this.ctx = this.canvas.getContext('2d');
    this.mode = 'connected'; // 'fragmented' | 'connected' | 'intelligent'
    this.time = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = 800;
    this.height = 480;
    this.hoveredNode = null;
    this.draggedNode = null;
    this.mouse = { x: -1000, y: -1000, isDown: false };
    this.particles = [];
    this.maxParticles = 80;
    this.bursts = []; // Click particle bursts
    this.audioEnabled = false;

    // Node Definitions
    this.nodes = [
      {
        id: 'erp',
        name: 'Enterprise ERP',
        sub: 'SAP / Oracle / Tally',
        layer: 'Core Business',
        icon: 'database',
        pos: {
          fragmented: { x: 0.18, y: 0.28, jitter: 1.2 },
          connected: { x: 0.24, y: 0.35, jitter: 0 },
          intelligent: { x: 0.22, y: 0.32, jitter: 0 }
        },
        curr: { x: 0, y: 0, vx: 0, vy: 0 },
        radius: 36,
        color: '#38bdf8',
        stats: { protocol: 'REST / OData', sync: '12ms', reliability: '99.98%' },
        fragStatus: '🚨 Sync delay: 48h | Reconciled manually'
      },
      {
        id: 'crm',
        name: 'Sales & CRM',
        sub: 'Salesforce / Leads',
        layer: 'Revenue Ops',
        icon: 'users',
        pos: {
          fragmented: { x: 0.82, y: 0.22, jitter: 1.5 },
          connected: { x: 0.76, y: 0.35, jitter: 0 },
          intelligent: { x: 0.78, y: 0.32, jitter: 0 }
        },
        curr: { x: 0, y: 0, vx: 0, vy: 0 },
        radius: 34,
        color: '#818cf8',
        stats: { protocol: 'Webhook Event Bus', sync: 'Real-time', pipeline: '₹34Cr' },
        fragStatus: '⚠️ Disconnected from manufacturing schedule'
      },
      {
        id: 'mes',
        name: 'Production & MES',
        sub: 'Shop Floor / IoT',
        layer: 'Operations',
        icon: 'cpu',
        pos: {
          fragmented: { x: 0.20, y: 0.78, jitter: 1.8 },
          connected: { x: 0.26, y: 0.72, jitter: 0 },
          intelligent: { x: 0.24, y: 0.74, jitter: 0 }
        },
        curr: { x: 0, y: 0, vx: 0, vy: 0 },
        radius: 34,
        color: '#34d399',
        stats: { protocol: 'MQTT / OPC-UA', latency: '4ms', telemetry: '1,420 sensors' },
        fragStatus: '❌ Logged on paper & whiteboards'
      },
      {
        id: 'scm',
        name: 'Supply Chain & WMS',
        sub: 'Logistics / Stock',
        layer: 'Supply Chain',
        icon: 'truck',
        pos: {
          fragmented: { x: 0.82, y: 0.78, jitter: 1.4 },
          connected: { x: 0.74, y: 0.72, jitter: 0 },
          intelligent: { x: 0.76, y: 0.74, jitter: 0 }
        },
        curr: { x: 0, y: 0, vx: 0, vy: 0 },
        radius: 34,
        color: '#fbbf24',
        stats: { protocol: 'EDI / Webhook', accuracy: '99.9%', dispatch: 'Automated' },
        fragStatus: '⚠️ Stockouts detected 3 days late'
      },
      {
        id: 'fin',
        name: 'Finance & Ledger',
        sub: 'Cash Flow / Tax',
        layer: 'Finance Control',
        icon: 'coins',
        pos: {
          fragmented: { x: 0.50, y: 0.14, jitter: 1.1 },
          connected: { x: 0.50, y: 0.18, jitter: 0 },
          intelligent: { x: 0.50, y: 0.16, jitter: 0 }
        },
        curr: { x: 0, y: 0, vx: 0, vy: 0 },
        radius: 32,
        color: '#a78bfa',
        stats: { protocol: 'Automated Audit Trail', latency: '< 1s', integrity: '100%' },
        fragStatus: '❌ Monthly closing takes 12 business days'
      },
      {
        id: 'bi',
        name: 'Executive BI Tower',
        sub: 'Control Tower',
        layer: 'Data & Intel',
        icon: 'chart',
        pos: {
          fragmented: { x: 0.50, y: 0.88, jitter: 1.6 },
          connected: { x: 0.50, y: 0.84, jitter: 0 },
          intelligent: { x: 0.50, y: 0.86, jitter: 0 }
        },
        curr: { x: 0, y: 0, vx: 0, vy: 0 },
        radius: 34,
        color: '#38bdf8',
        stats: { protocol: 'Streaming OLAP', refresh: 'Continuous', kpis: '48 tracked' },
        fragStatus: '⚠️ Lagging 2-week PDF spreadsheets'
      },
      {
        id: 'hub',
        name: 'Enterprise Neural Core',
        sub: 'Unified Data Backbone',
        layer: 'Platform Core',
        icon: 'activity',
        pos: {
          fragmented: { x: 0.50, y: 0.50, jitter: 0 },
          connected: { x: 0.50, y: 0.50, jitter: 0 },
          intelligent: { x: 0.50, y: 0.50, jitter: 0 }
        },
        curr: { x: 0, y: 0, vx: 0, vy: 0 },
        radius: 46,
        color: '#00f2fe',
        stats: { status: 'Orchestrating 12 Services', throughput: '18,400 msg/sec' },
        fragStatus: '❌ NO CENTRAL SYSTEM - 100% Silonized'
      }
    ];

    // Connection definitions
    this.connections = [
      { from: 'hub', to: 'erp' },
      { from: 'hub', to: 'crm' },
      { from: 'hub', to: 'mes' },
      { from: 'hub', to: 'scm' },
      { from: 'hub', to: 'fin' },
      { from: 'hub', to: 'bi' },
      { from: 'erp', to: 'fin' },
      { from: 'crm', to: 'erp' },
      { from: 'mes', to: 'scm' },
      { from: 'scm', to: 'erp' }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Initialize node positions
    this.nodes.forEach(node => {
      const p = node.pos[this.mode];
      node.curr.x = p.x * this.width;
      node.curr.y = p.y * this.height;
    });

    this.initParticles();
    this.setupInteractivity();
    this.setupAudio();
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width > 0 ? rect.width : (this.container.clientWidth || 900);
    this.height = rect.height > 0 ? rect.height : 480;
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before re-applying scale
    this.ctx.scale(this.dpr, this.dpr);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
      this.particles.push({
        conn,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        size: 2 + Math.random() * 2.5,
        color: Math.random() > 0.5 ? '#00f2fe' : '#7928ca'
      });
    }
  }

  setupAudio() {
    // Subtle Web Audio API sound feedback
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      this.audioCtx = null;
    }
  }

  playTone(freq = 440, type = 'sine', duration = 0.12) {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (err) {
      // Ignore audio policy issues
    }
  }

  setMode(mode) {
    if (['fragmented', 'connected', 'intelligent'].includes(mode)) {
      this.mode = mode;
      this.updateUIModeButtons();
      this.updateStatusReadout();
      if (mode === 'fragmented') this.playTone(220, 'sawtooth', 0.2);
      if (mode === 'connected') this.playTone(523.25, 'sine', 0.18);
      if (mode === 'intelligent') this.playTone(659.25, 'triangle', 0.25);
    }
  }

  updateUIModeButtons() {
    document.querySelectorAll('[data-viz-mode]').forEach(btn => {
      if (btn.getAttribute('data-viz-mode') === this.mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateStatusReadout() {
    const statusText = document.getElementById('viz-status-text');
    const statusBadge = document.getElementById('viz-status-badge');
    const throughputVal = document.getElementById('viz-stat-throughput');
    const latencyVal = document.getElementById('viz-stat-latency');
    const reliabilityVal = document.getElementById('viz-stat-reliability');

    if (!statusText || !statusBadge) return;

    if (this.mode === 'fragmented') {
      statusBadge.className = 'status-pill status-danger';
      statusBadge.innerHTML = '<span class="status-dot pulse-red"></span> FRAGMENTED SILOS';
      statusText.textContent = 'Data locked in manual silos. High reconciliation errors, multi-day reporting lag, and operational friction.';
      if (throughputVal) throughputVal.textContent = '12 ops/hr (Manual)';
      if (latencyVal) latencyVal.textContent = '48 - 72 Hours';
      if (reliabilityVal) reliabilityVal.textContent = '74.2% (Error Prone)';
    } else if (this.mode === 'connected') {
      statusBadge.className = 'status-pill status-cyan';
      statusBadge.innerHTML = '<span class="status-dot pulse-cyan"></span> CONNECTED BACKBONE';
      statusText.textContent = 'Unified bidirectional API mesh. ERP, CRM, and shop floor synced in real-time with zero manual data re-entry.';
      if (throughputVal) throughputVal.textContent = '18,400 msg/s';
      if (latencyVal) latencyVal.textContent = '< 32 ms';
      if (reliabilityVal) reliabilityVal.textContent = '99.98% High-Avail';
    } else if (this.mode === 'intelligent') {
      statusBadge.className = 'status-pill status-purple';
      statusBadge.innerHTML = '<span class="status-dot pulse-purple"></span> AUTONOMOUS AGENTS';
      statusText.textContent = 'Self-healing workflows & AI agentic orchestration. Predictive supply chain replenishment and automated executive insights.';
      if (throughputVal) throughputVal.textContent = '94,200 ops/s';
      if (latencyVal) latencyVal.textContent = '< 6 ms';
      if (reliabilityVal) reliabilityVal.textContent = '99.999% Autonomous';
    }
  }

  setupInteractivity() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    this.canvas.addEventListener('mousemove', (e) => {
      const pos = getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;

      if (this.draggedNode) {
        this.draggedNode.curr.x = pos.x;
        this.draggedNode.curr.y = pos.y;
        return;
      }

      const prevHovered = this.hoveredNode;
      this.hoveredNode = null;
      for (const node of this.nodes) {
        if (this.mode === 'fragmented' && node.id === 'hub') continue;
        const dx = pos.x - node.curr.x;
        const dy = pos.y - node.curr.y;
        if (Math.hypot(dx, dy) <= node.radius + 8) {
          this.hoveredNode = node;
          this.canvas.style.cursor = 'grab';
          if (!prevHovered) {
            this.playTone(440, 'sine', 0.05);
          }
          break;
        }
      }
      if (!this.hoveredNode) {
        this.canvas.style.cursor = 'default';
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = getPos(e);
      this.mouse.isDown = true;
      for (const node of this.nodes) {
        if (this.mode === 'fragmented' && node.id === 'hub') continue;
        const dx = pos.x - node.curr.x;
        const dy = pos.y - node.curr.y;
        if (Math.hypot(dx, dy) <= node.radius + 8) {
          this.draggedNode = node;
          this.canvas.style.cursor = 'grabbing';
          this.createBurst(pos.x, pos.y, node.color);
          this.playTone(587.33, 'triangle', 0.1);
          break;
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
      this.draggedNode = null;
      if (this.hoveredNode) {
        this.canvas.style.cursor = 'grab';
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.hoveredNode = null;
      this.draggedNode = null;
      this.canvas.style.cursor = 'default';
    });

    // Mobile touch
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = touch.clientX - rect.left;
        this.mouse.y = touch.clientY - rect.top;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = touch.clientX - rect.left;
        this.mouse.y = touch.clientY - rect.top;
      }
    }, { passive: true });
  }

  createBurst(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 / 14) * i + Math.random() * 0.2;
      const speed = 2 + Math.random() * 3.5;
      this.bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.02,
        color
      });
    }
  }

  animate() {
    this.time += 0.016;

    // Guard against 0 width during early layout
    if (this.width <= 0) {
      this.resize();
    }

    this.updateNodes();
    this.updateBursts();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  updateBursts() {
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life -= b.decay;
      if (b.life <= 0) {
        this.bursts.splice(i, 1);
      }
    }
  }

  updateNodes() {
    const spring = 0.07;
    const damping = 0.82;

    this.nodes.forEach(node => {
      if (this.draggedNode === node) return;

      const targetDef = node.pos[this.mode];
      let targetX = targetDef.x * this.width;
      let targetY = targetDef.y * this.height;

      // Jitter in fragmented mode
      if (this.mode === 'fragmented' && targetDef.jitter > 0) {
        const jitterFreq = this.time * 2.2 + node.radius;
        targetX += Math.sin(jitterFreq) * 9 * targetDef.jitter;
        targetY += Math.cos(jitterFreq * 1.3) * 7 * targetDef.jitter;
      } else if (this.mode === 'intelligent') {
        const breath = Math.sin(this.time * 1.6 + node.radius) * 3.5;
        targetX += (targetDef.x - 0.5) * breath;
        targetY += (targetDef.y - 0.5) * breath;
      }

      const ax = (targetX - node.curr.x) * spring;
      const ay = (targetY - node.curr.y) * spring;

      node.curr.vx = (node.curr.vx + ax) * damping;
      node.curr.vy = (node.curr.vy + ay) * damping;

      node.curr.x += node.curr.vx;
      node.curr.y += node.curr.vy;
    });
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawCyberGrid();
    this.drawConnections();

    if (this.mode !== 'fragmented') {
      this.drawParticles();
    } else {
      this.drawFragmentedErrors();
    }

    this.drawBursts();
    this.drawNodes();

    if (this.hoveredNode) {
      this.drawNodeTooltip(this.hoveredNode);
    }
  }

  drawCyberGrid() {
    const ctx = this.ctx;
    const spacing = 44;
    const isWhite = document.documentElement.getAttribute('data-theme') === 'white';
    ctx.save();
    ctx.strokeStyle = isWhite ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;

    for (let x = 0; x < this.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawConnections() {
    const ctx = this.ctx;
    const nodeMap = {};
    this.nodes.forEach(n => { nodeMap[n.id] = n; });

    this.connections.forEach(conn => {
      const fromNode = nodeMap[conn.from];
      const toNode = nodeMap[conn.to];
      if (!fromNode || !toNode) return;

      const isConnectedToHovered = this.hoveredNode && (this.hoveredNode === fromNode || this.hoveredNode === toNode);

      if (this.mode === 'fragmented') {
        if (conn.from === 'hub' || conn.to === 'hub') return; // Core offline!

        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(fromNode.curr.x, fromNode.curr.y);
        ctx.lineTo(toNode.curr.x, toNode.curr.y);
        ctx.stroke();
        ctx.restore();
      } else {
        const isIntel = this.mode === 'intelligent';
        ctx.save();

        const grad = ctx.createLinearGradient(
          fromNode.curr.x, fromNode.curr.y,
          toNode.curr.x, toNode.curr.y
        );

        if (isConnectedToHovered) {
          grad.addColorStop(0, '#00f2fe');
          grad.addColorStop(0.5, '#ffffff');
          grad.addColorStop(1, '#a855f7');
          ctx.lineWidth = 3.2;
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 12;
        } else if (isIntel) {
          grad.addColorStop(0, 'rgba(121, 40, 202, 0.6)');
          grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.85)');
          grad.addColorStop(1, 'rgba(0, 245, 160, 0.7)');
          ctx.lineWidth = 2.4;
        } else {
          grad.addColorStop(0, 'rgba(0, 242, 254, 0.45)');
          grad.addColorStop(1, 'rgba(59, 130, 246, 0.3)');
          ctx.lineWidth = 1.8;
        }

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(fromNode.curr.x, fromNode.curr.y);

        const midX = (fromNode.curr.x + toNode.curr.x) / 2;
        const midY = (fromNode.curr.y + toNode.curr.y) / 2;
        const curveOffset = (fromNode.id === 'hub' || toNode.id === 'hub') ? 0 : 20;

        ctx.quadraticCurveTo(midX + curveOffset, midY - curveOffset, toNode.curr.x, toNode.curr.y);
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  drawParticles() {
    const ctx = this.ctx;
    const nodeMap = {};
    this.nodes.forEach(n => { nodeMap[n.id] = n; });

    const isIntel = this.mode === 'intelligent';
    const speedMultiplier = isIntel ? 1.7 : 1.0;

    this.particles.forEach(p => {
      const fromNode = nodeMap[p.conn.from];
      const toNode = nodeMap[p.conn.to];
      if (!fromNode || !toNode) return;

      p.progress += p.speed * speedMultiplier;
      if (p.progress > 1) {
        p.progress = 0;
        p.conn = this.connections[Math.floor(Math.random() * this.connections.length)];
      }

      const x = fromNode.curr.x + (toNode.curr.x - fromNode.curr.x) * p.progress;
      const y = fromNode.curr.y + (toNode.curr.y - fromNode.curr.y) * p.progress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, p.size * (isIntel ? 1.3 : 1), 0, Math.PI * 2);

      ctx.shadowColor = isIntel ? '#a855f7' : '#00f2fe';
      ctx.shadowBlur = isIntel ? 14 : 9;
      ctx.fillStyle = isIntel ? '#f472b6' : '#38bdf8';
      ctx.fill();
      ctx.restore();
    });
  }

  drawFragmentedErrors() {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
    ctx.textAlign = 'center';

    const warningPoints = [
      { x: this.width * 0.45, y: this.height * 0.35, text: '⚠️ [ERROR: CSV SYNC FAILED]' },
      { x: this.width * 0.65, y: this.height * 0.55, text: '❌ [ERP DATA OUT OF DATE]' },
      { x: this.width * 0.32, y: this.height * 0.52, text: '⏳ [MANUAL AUDIT REQUIRED]' }
    ];

    warningPoints.forEach((w, idx) => {
      const pulse = Math.sin(this.time * 3 + idx) * 3;
      ctx.fillText(w.text, w.x, w.y + pulse);
    });
    ctx.restore();
  }

  drawBursts() {
    const ctx = this.ctx;
    this.bursts.forEach(b => {
      ctx.save();
      ctx.globalAlpha = Math.max(b.life, 0);
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 2.5 * b.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawNodes() {
    const ctx = this.ctx;

    this.nodes.forEach(node => {
      const isHub = node.id === 'hub';

      if (this.mode === 'fragmented' && isHub) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.curr.x, node.curr.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 24, 33, 0.8)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText('NO INTEGRATION', node.curr.x, node.curr.y - 4);
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('CORE OFFLINE', node.curr.x, node.curr.y + 10);
        ctx.restore();
        return;
      }

      ctx.save();

      const isHovered = this.hoveredNode === node;
      const isIntel = this.mode === 'intelligent';
      const pulse = Math.sin(this.time * 2 + (isHub ? 0 : 1)) * (isHub ? 6 : 3);
      const outerRadius = node.radius + (isHovered ? 8 : 4) + pulse;

      // Glow halo
      ctx.beginPath();
      ctx.arc(node.curr.x, node.curr.y, outerRadius, 0, Math.PI * 2);
      ctx.fillStyle = isHub
        ? (isIntel ? 'rgba(121, 40, 202, 0.2)' : 'rgba(0, 242, 254, 0.16)')
        : 'rgba(255, 255, 255, 0.04)';
      ctx.fill();

      // Node Body
      ctx.beginPath();
      ctx.arc(node.curr.x, node.curr.y, node.radius, 0, Math.PI * 2);
      const bgGrad = ctx.createRadialGradient(
        node.curr.x, node.curr.y, 2,
        node.curr.x, node.curr.y, node.radius
      );
      bgGrad.addColorStop(0, '#161e2e');
      bgGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Node Border
      ctx.lineWidth = isHub ? 2.6 : 1.8;
      ctx.strokeStyle = isHub
        ? (isIntel ? '#c084fc' : '#00f2fe')
        : (isHovered ? '#38bdf8' : (this.mode === 'fragmented' ? '#f87171' : 'rgba(255, 255, 255, 0.2)'));
      ctx.shadowColor = isHub ? (isIntel ? '#9333ea' : '#00f2fe') : node.color;
      ctx.shadowBlur = isHovered || isHub ? 16 : 4;
      ctx.stroke();

      // Node Labels
      ctx.shadowBlur = 0;
      if (isHub) {
        ctx.fillStyle = isIntel ? '#c084fc' : '#00f2fe';
        ctx.beginPath();
        ctx.arc(node.curr.x, node.curr.y - 10, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(isIntel ? 'AI AGENTS' : 'AI LABS', node.curr.x, node.curr.y + 6);
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fillText(isIntel ? 'AUTONOMOUS' : 'BACKBONE', node.curr.x, node.curr.y + 18);
      } else {
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.curr.x, node.curr.y - 2);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = this.mode === 'fragmented' ? '#fca5a5' : '#94a3b8';
        ctx.fillText(this.mode === 'fragmented' ? 'SILO' : node.sub.split('/')[0], node.curr.x, node.curr.y + 12);
      }

      ctx.restore();
    });
  }

  drawNodeTooltip(node) {
    const ctx = this.ctx;
    const padding = 12;
    const boxWidth = 230;
    const boxHeight = 100;

    let x = node.curr.x + node.radius + 12;
    let y = node.curr.y - boxHeight / 2;

    if (x + boxWidth > this.width - 15) {
      x = node.curr.x - node.radius - boxWidth - 12;
    }
    if (y < 15) y = 15;
    if (y + boxHeight > this.height - 15) y = this.height - boxHeight - 15;

    ctx.save();
    ctx.fillStyle = 'rgba(10, 14, 23, 0.94)';
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 20;

    this.roundRect(ctx, x, y, boxWidth, boxHeight, 8);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';

    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText(node.name, x + padding, y + 20);

    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(node.layer + ' · ' + node.sub, x + padding, y + 36);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(x + padding, y + 44);
    ctx.lineTo(x + boxWidth - padding, y + 44);
    ctx.stroke();

    ctx.font = '10px "JetBrains Mono", monospace';
    if (this.mode === 'fragmented') {
      ctx.fillStyle = '#f87171';
      ctx.fillText(node.fragStatus || 'Manual data lag', x + padding, y + 62);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('Action: Needs Architecture Audit', x + padding, y + 80);
    } else {
      ctx.fillStyle = '#34d399';
      const statKeys = Object.keys(node.stats);
      if (statKeys.length >= 2) {
        ctx.fillText(`${statKeys[0]}: ${node.stats[statKeys[0]]}`, x + padding, y + 62);
        ctx.fillText(`${statKeys[1]}: ${node.stats[statKeys[1]]}`, x + padding, y + 80);
      } else {
        ctx.fillText(node.stats[statKeys[0]] || 'Status: Operational', x + padding, y + 70);
      }
    }

    ctx.restore();
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

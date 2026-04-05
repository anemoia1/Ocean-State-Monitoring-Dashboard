// parallax.js — Lightweight, clamped parallax + particle canvas

(function() {
  'use strict';

  // --- Parallax ---
  const PARALLAX_SPEED = {
    back: 0.15,
    mid: 0.3,
    front: 0.5
  };

  function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    let ticking = false;

    function updateParallax() {
      const sy = window.scrollY;
      layers.forEach(layer => {
        const speed = layer.classList.contains('layer-back')  ? PARALLAX_SPEED.back
                    : layer.classList.contains('layer-mid')   ? PARALLAX_SPEED.mid
                    : PARALLAX_SPEED.front;
        const offset = sy * speed;
        // Clamp to prevent infinite drift
        const clamped = Math.max(-120, Math.min(120, offset));
        layer.style.transform = `translateY(${clamped}px)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Particle Canvas ---
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Resize
    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    });

    // Particle count based on scroll depth
    function getDepthFactor() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      return maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    }

    // Create particles
    const BASE_COUNT = 55;
    const MAX_EXTRA = 45;

    const particles = [];

    function createParticle(i) {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.35 + 0.1),
        alpha: Math.random() * 0.4 + 0.1,
        hue: 195 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.008 + 0.003,
      };
    }

    for (let i = 0; i < BASE_COUNT + MAX_EXTRA; i++) {
      particles.push(createParticle(i));
    }

    let lastTime = 0;
    function animate(ts) {
      const dt = ts - lastTime;
      lastTime = ts;

      ctx.clearRect(0, 0, W, H);

      const depth = getDepthFactor();
      const visibleCount = Math.floor(BASE_COUNT + depth * MAX_EXTRA);

      // Depth-based color: cyan at surface → purple/biolum at depth
      const hueBase = 195 - depth * 60;
      const satBase = 70 + depth * 20;
      const biolumChance = depth * 0.3;

      for (let i = 0; i < visibleCount; i++) {
        const p = particles[i];

        p.phase += p.phaseSpeed;
        p.x += p.vx + Math.sin(p.phase) * 0.15;
        p.y += p.vy;

        // Wrap
        if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 5;
        if (p.x > W + 10) p.x = -5;

        const hue = i < visibleCount * (1 - biolumChance)
          ? hueBase + (i % 20)
          : 140 + (i % 40);  // biolum green

        const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, ${satBase}%, 70%, ${alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // --- Scroll-based background depth tinting ---
  function initDepthColor() {
    const overlay = document.getElementById('depth-color-overlay');
    if (!overlay) return;

    function update() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      // Transition from transparent → deep blue overlay as depth increases
      const alpha = pct * 0.22;
      overlay.style.background = `rgba(0, 5, 15, ${alpha})`;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // --- Waveform bars ---
  function initWaveform() {
    const wrap = document.querySelector('.hero-waveform');
    if (!wrap) return;
    const BARS = 40;
    const heights = [8,12,18,24,20,14,10,16,22,28,20,14,8,12,18,24,32,24,18,12,8,14,20,28,22,16,10,14,20,26,18,12,8,16,22,30,22,14,10,8];
    for (let i = 0; i < BARS; i++) {
      const bar = document.createElement('div');
      bar.className = 'waveform-bar';
      bar.style.setProperty('--h', (heights[i] || 12) + 'px');
      bar.style.setProperty('--dur', (0.8 + Math.random() * 1.2) + 's');
      bar.style.animationDelay = (Math.random() * -2) + 's';
      wrap.appendChild(bar);
    }
  }

  // --- Init ---
  function init() {
    initParallax();
    initParticles();
    initDepthColor();
    initWaveform();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

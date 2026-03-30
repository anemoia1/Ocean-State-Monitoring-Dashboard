// scroll.js — Scroll-driven animations, reveal, depth tracker

(function() {
  'use strict';

  // --- Depth progress bar ---
  function initDepthBar() {
    const fill = document.getElementById('depth-bar-fill');
    if (!fill) return;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.height = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // --- Section depth tracker ---
  const SECTIONS = ['sky', 'surface', 'shallow', 'mid', 'deep', 'floor'];
  const DEPTH_LABELS = {
    sky: '0 m  |  Sky',
    surface: '0–200 m  |  Epipelagic',
    shallow: '200–1000 m  |  Mesopelagic',
    mid: '1000–4000 m  |  Bathypelagic',
    deep: '4000–6000 m  |  Abyssopelagic',
    floor: '6000+ m  |  Hadalpelagic'
  };

  function initDepthTracker() {
    const navDepth = document.getElementById('nav-depth-label');
    const pressureNodes = document.querySelectorAll('.pressure-node');

    const sections = SECTIONS.map(id => document.getElementById('section-' + id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id.replace('section-', '');
        // Update nav depth label
        if (navDepth) navDepth.textContent = DEPTH_LABELS[id] || '';
        // Update pressure nodes
        pressureNodes.forEach((node, i) => {
          node.classList.toggle('active', i === SECTIONS.indexOf(id));
        });
      });
    }, { threshold: 0.4 });

    sections.forEach(sec => observer.observe(sec));
  }

  // --- Intersection Observer for reveal ---
  function initReveal() {
    const targets = document.querySelectorAll('.blurb-card, .reveal, .insight-block');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve so stagger works on re-entry
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => io.observe(el));
  }

  // --- Sticky nav scroll effect ---
  function initNavScroll() {
    const nav = document.querySelector('.ocean-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --- Smooth section scrolling via pressure nodes ---
  function initPressureNodes() {
    document.querySelectorAll('.pressure-node').forEach((node, i) => {
      node.addEventListener('click', () => {
        const sec = document.getElementById('section-' + SECTIONS[i]);
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // --- Active nav links ---
  function initActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    const page = window.location.pathname.split('/').pop();
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // --- Init ---
  function init() {
    initDepthBar();
    initDepthTracker();
    initReveal();
    initNavScroll();
    initPressureNodes();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

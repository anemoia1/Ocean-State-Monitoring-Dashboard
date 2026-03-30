// loader.js — Page loader/intro animation

(function() {
  'use strict';

  const LOADER_DELAY = 1600;

  function hideLoader() {
    const loader = document.getElementById('ocean-loader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';
      document.body.classList.add('loaded');
    }, 700);
  }

  function initLoader() {
    const loader = document.getElementById('ocean-loader');
    if (!loader) return;

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Animate loader text
    const texts = [
      'Initializing Ocean State…',
      'Calibrating sensors…',
      'Loading depth data…',
      'Ready.'
    ];
    const textEl = document.getElementById('loader-status-text');
    if (textEl) {
      let i = 0;
      const textInterval = setInterval(() => {
        i++;
        if (i < texts.length) {
          textEl.textContent = texts[i];
        } else {
          clearInterval(textInterval);
        }
      }, LOADER_DELAY / (texts.length + 1));
    }

    // Hide loader after delay
    setTimeout(() => {
      document.body.style.overflow = '';
      hideLoader();
    }, LOADER_DELAY);
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();

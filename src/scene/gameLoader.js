// Rockstar Games Style Intro & Logo Reveal Sequence
// Stage 1: Police siren color strobe (blue, red, gold)
// Stage 2: Iconic L★ emblem slam reveal with heavy bass thud
// Stage 3: Hyperspeed "Go in" zoom plunge directly into the portfolio

import { sound } from '../lib/sound.js';

export function initGameLoader({ onComplete } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const urlParams = new URLSearchParams(window.location.search);
  const skipRequested = urlParams.has('skip') || urlParams.has('fast');

  // Always clear previous session blocks so it displays reliably on every refresh
  sessionStorage.removeItem('portfolio_loader_completed');
  sessionStorage.removeItem('mech_boot_completed');

  if (skipRequested) {
    if (typeof onComplete === 'function') {
      onComplete({ visitorName: 'LOKESH', skipped: true });
    }
    return {
      updateProgress: () => {},
      setReady: () => {},
      bypass: () => {},
    };
  }

  let isDone = false;
  let isZooming = false;
  let currentProgress = 20;

  // 1. Build and inject DOM
  const container = document.createElement('div');
  container.id = 'gameLoader';
  container.className = 'is-strobing';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', 'Rockstar Games Style Intro');

  container.innerHTML = `
    <!-- Fullscreen White Flash for Zoom Plunge -->
    <div class="rs-flash" id="rsFlash" aria-hidden="true"></div>

    <!-- Police Siren Color Strobes (Red, Blue, Gold) -->
    <div class="rs-strobe-bg" aria-hidden="true"></div>

    <!-- Atmospheric Overlays -->
    <div class="rs-scanlines" aria-hidden="true"></div>
    <div class="rs-vignette" aria-hidden="true"></div>

    <!-- Top Bar -->
    <header class="rs-top-bar">
      <div class="rs-top-brand">
        LOKESH KUMAR S. <span>// iOS DEVELOPER</span>
      </div>

      <div class="rs-top-actions">
        <button type="button" class="rs-btn-audio" id="rsAudioBtn" aria-label="Toggle sound">
          <span>AUDIO: OFF</span>
        </button>
        <button type="button" class="rs-btn-skip" id="rsSkipBtn" aria-label="Skip intro">
          <span>SKIP</span>
          <kbd>ESC</kbd>
        </button>
      </div>
    </header>

    <!-- Center Stage: The Iconic L★ Rockstar-Style Logo in Portfolio Crimson Theme -->
    <main class="rs-center-stage">
      <div class="rs-logo-box" id="rsLogoBox">
        <div class="rs-badge">
          <span class="rs-badge__letter">L</span>
          <svg class="rs-badge__star" viewBox="0 0 24 24">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </div>

        <h1 class="rs-logo-title">LOKESH KUMAR S.</h1>
        <p class="rs-logo-sub">••• IOS DEVELOPER • SWIFT &amp; SWIFTUI • MOBILE ARCHITECTURE •••</p>
        <p class="rs-logo-loc">VELLORE, TAMIL NADU, INDIA</p>

        <div class="rs-logo-cue" id="rsLogoCue">
          <span>• TAP OR PRESS ENTER TO ENTER •</span>
        </div>
      </div>
    </main>

    <!-- Bottom Telemetry Bar -->
    <footer class="rs-bottom-bar">
      <div class="rs-loading-text" id="rsStatusText">
        NATIVE SYSTEMS INITIALIZING <span id="rsPercentText">20%</span>
      </div>

      <div class="rs-star-loader">
        <svg class="rs-spinner-star" viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>

        <div class="rs-meter-line">
          <div class="rs-meter-fill" id="rsMeterFill"></div>
        </div>
      </div>
    </footer>
  `;

  document.body.appendChild(container);

  // Audio warm up on interaction
  const armSound = () => {
    sound.init();
    container.removeEventListener('pointerdown', armSound);
    container.removeEventListener('keydown', armSound);
  };
  container.addEventListener('pointerdown', armSound, { once: true });
  container.addEventListener('keydown', armSound, { once: true });

  // Sound Toggle Button
  const audioBtn = document.getElementById('rsAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const active = sound.toggle();
      audioBtn.querySelector('span').textContent = active ? 'AUDIO: ON' : 'AUDIO: OFF';
      audioBtn.classList.toggle('is-active', active);
    });
  }

  // Play Siren Strobe Sound at start and second wave
  setTimeout(() => {
    sound.playSirenStrobe();
  }, 100);
  setTimeout(() => {
    sound.playSirenStrobe();
  }, 1200);

  // Stage 1 -> Stage 2: Reveal the Logo Slam at 2.4s
  const revealTimer = setTimeout(() => {
    if (isDone || isZooming) return;
    container.classList.remove('is-strobing');
    container.classList.add('is-revealed');
    sound.playRockstarBass();
  }, reduced ? 100 : 2400);

  // Progress update hooks
  const fillEl = document.getElementById('rsMeterFill');
  const percentEl = document.getElementById('rsPercentText');
  const statusEl = document.getElementById('rsStatusText');

  // Progressive meter ticker over the 5-7 second load window
  const meterTicker = setInterval(() => {
    if (isDone || isZooming) {
      clearInterval(meterTicker);
      return;
    }
    if (currentProgress < 95) {
      currentProgress += Math.floor(Math.random() * 8) + 6;
      if (currentProgress > 95) currentProgress = 95;
      if (fillEl) fillEl.style.width = `${currentProgress}%`;
      if (percentEl) percentEl.textContent = `${currentProgress}%`;
    }
  }, 420);

  function updateProgress(fraction, message) {
    if (isDone) return;
    const target = Math.round(Math.min(100, Math.max(0, fraction * 100)));
    if (target > currentProgress) {
      currentProgress = target;
    }
    if (fillEl) fillEl.style.width = `${currentProgress}%`;
    if (percentEl) percentEl.textContent = `${currentProgress}%`;
    if (message && statusEl) {
      statusEl.innerHTML = `${message.toUpperCase()} <span id="rsPercentText">${currentProgress}%</span>`;
    }
  }

  function setReady() {
    updateProgress(1.0, 'EXPERIENCE READY');
  }

  // Stage 3: "GO IN" — Hyperspeed Zoom Tunnel Plunge
  function goIn(skipped = false) {
    if (isDone || isZooming) return;
    isZooming = true;
    clearTimeout(revealTimer);
    clearTimeout(autoGoInTimer);
    clearInterval(meterTicker);
    window.removeEventListener('keydown', keyHandler);

    if (skipped) {
      isDone = true;
      container.classList.add('is-dismissed');
      if (typeof onComplete === 'function') {
        onComplete({ visitorName: 'LOKESH', skipped: true });
      }
      setTimeout(() => container.remove(), 400);
      return;
    }

    // Trigger Hyperspeed Zoom Plunge
    container.classList.remove('is-strobing');
    container.classList.add('is-revealed', 'is-zooming-in');
    sound.playRockstarBass();
    sound.playWhoosh();

    setTimeout(() => {
      isDone = true;
      container.classList.add('is-dismissed');
      if (typeof onComplete === 'function') {
        onComplete({ visitorName: 'LOKESH', skipped: false });
      }
      setTimeout(() => container.remove(), 800);
    }, 950);
  }

  // Automatic "Go in" after 6.4 seconds (within 5-7 second loading window)
  const autoGoInTimer = setTimeout(() => {
    goIn(false);
  }, reduced ? 300 : 6400);

  // Click anywhere to plunge in immediately
  container.addEventListener('click', (e) => {
    if (e.target.closest('#rsAudioBtn') || e.target.closest('#rsSkipBtn')) return;
    goIn(false);
  });

  // Skip button
  const skipBtn = document.getElementById('rsSkipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goIn(true);
    });
  }

  // Keyboard controls: ESC to skip, ENTER or SPACE to go in
  const keyHandler = (e) => {
    if (isDone) return;
    if (e.key === 'Escape') {
      goIn(true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goIn(false);
    }
  };
  window.addEventListener('keydown', keyHandler);

  return {
    updateProgress,
    setReady,
    bypass: () => goIn(true),
  };
}

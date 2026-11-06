// Original cinematic portfolio entry sequence.
// The visual language is inspired by premium game launch screens, without
// using Rockstar/GTA branding, logos, police strobes, or copied artwork.

import { sound } from '../lib/sound.js';

const MIN_DISPLAY_MS = 4200;
const EXIT_MS = 620;

export function initGameLoader({ onComplete } = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startedAt = performance.now();
  let progress = 0;
  let ready = false;
  let finished = false;
  let skipRequested = false;
  let completionTimer = 0;

  const container = document.createElement('section');
  container.id = 'gameLoader';
  container.className = 'game-loader';
  container.setAttribute('aria-label', 'Portfolio loading screen');
  container.innerHTML = `
    <div class="game-loader__backdrop" aria-hidden="true"></div>
    <div class="game-loader__grain" aria-hidden="true"></div>
    <div class="game-loader__shade" aria-hidden="true"></div>

    <header class="game-loader__top">
      <a class="game-loader__brand" href="#" aria-label="Lokesh Kumar home">
        <span class="game-loader__brand-mark">L<span>.</span></span>
        <span class="game-loader__brand-copy">
          <strong>LOKESH KUMAR S.</strong>
          <small>INDEPENDENT DEVELOPER · PORTFOLIO 2026</small>
        </span>
      </a>
      <div class="game-loader__top-right">
        <span class="game-loader__edition">DIGITAL EXPERIENCE</span>
        <button class="game-loader__sound" id="gameLoaderSound" type="button" aria-pressed="false">SOUND OFF</button>
        <button class="game-loader__skip" id="gameLoaderSkip" type="button">SKIP INTRO <kbd>ESC</kbd></button>
      </div>
    </header>

    <main class="game-loader__main">
      <p class="game-loader__eyebrow"><span></span> AN INTERACTIVE PORTFOLIO EXPERIENCE</p>
      <div class="game-loader__title-wrap">
        <p class="game-loader__pretitle">CREATIVE TECHNOLOGIST / iOS ENGINEER</p>
        <h1 class="game-loader__title">BUILT TO<br><em>CREATE.</em></h1>
      </div>
      <div class="game-loader__caption">
        <span class="game-loader__caption-line"></span>
        <p id="gameLoaderMessage">INITIALIZING THE EXPERIENCE</p>
      </div>
      <button class="game-loader__enter" id="gameLoaderEnter" type="button" disabled>
        <span>ENTER PORTFOLIO</span><b aria-hidden="true">↗</b>
      </button>
    </main>

    <footer class="game-loader__bottom">
      <div class="game-loader__location">
        <span>01</span>
        <span>VELLORE, INDIA</span>
      </div>
      <div class="game-loader__progress">
        <div class="game-loader__progress-meta">
          <span id="gameLoaderStatus" role="status" aria-live="polite">PREPARING DIGITAL ENVIRONMENT</span>
          <span id="gameLoaderPercent">00%</span>
        </div>
        <div class="game-loader__track" role="progressbar" aria-label="Portfolio loading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="gameLoaderBar">
          <span id="gameLoaderFill"></span>
        </div>
      </div>
      <div class="game-loader__signature">SWIFT · SWIFTUI · WEBGL</div>
    </footer>
  `;

  document.body.appendChild(container);

  const message = container.querySelector('#gameLoaderMessage');
  const status = container.querySelector('#gameLoaderStatus');
  const percent = container.querySelector('#gameLoaderPercent');
  const fill = container.querySelector('#gameLoaderFill');
  const bar = container.querySelector('#gameLoaderBar');
  const enter = container.querySelector('#gameLoaderEnter');
  const skip = container.querySelector('#gameLoaderSkip');
  const audio = container.querySelector('#gameLoaderSound');

  function renderProgress(value, label) {
    progress = Math.max(progress, Math.min(100, Math.round(value)));
    fill.style.width = `${progress}%`;
    percent.textContent = `${String(progress).padStart(2, '0')}%`;
    bar.setAttribute('aria-valuenow', String(progress));
    if (label) {
      const clean = String(label).replace(/<[^>]*>/g, '').trim();
      status.textContent = clean.toUpperCase();
      message.textContent = clean.toUpperCase();
    }
  }

  function complete(skipped = false) {
    if (finished || !ready) return;
    finished = true;
    window.clearTimeout(completionTimer);
    window.removeEventListener('keydown', onKeyDown);
    container.classList.add('is-exiting');
    window.setTimeout(() => {
      container.remove();
      if (typeof onComplete === 'function') {
        onComplete({ visitorName: 'LOKESH', skipped });
      }
    }, reducedMotion ? 0 : EXIT_MS);
  }

  function requestSkip() {
    if (finished) return;
    skipRequested = true;
    if (ready) {
      complete(true);
    } else {
      status.textContent = 'FINISHING ESSENTIAL STARTUP — THEN ENTERING';
      message.textContent = 'ALMOST THERE. PREPARING YOUR EXPERIENCE.';
      skip.textContent = 'WAITING…';
      skip.disabled = true;
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      requestSkip();
    } else if ((event.key === 'Enter' || event.key === ' ') && ready) {
      event.preventDefault();
      complete(false);
    }
  }

  skip.addEventListener('click', requestSkip);
  enter.addEventListener('click', () => complete(false));
  window.addEventListener('keydown', onKeyDown);

  // Sound is opt-in and is initialized only after a deliberate user gesture.
  audio.addEventListener('click', () => {
    const active = sound.toggle();
    audio.textContent = active ? 'SOUND ON' : 'SOUND OFF';
    audio.setAttribute('aria-pressed', String(active));
    audio.classList.toggle('is-active', active);
  });

  function updateProgress(fraction, label) {
    if (finished || ready) return;
    const numeric = Number(fraction);
    if (!Number.isFinite(numeric)) return;
    renderProgress(numeric * 100, label);
  }

  function setReady() {
    if (finished || ready) return;
    ready = true;
    renderProgress(100, 'EXPERIENCE READY');
    enter.disabled = false;
    container.classList.add('is-ready');
    message.textContent = 'YOUR NEXT EXPERIENCE STARTS HERE.';
    if (skipRequested) {
      complete(true);
      return;
    }
    const remaining = Math.max(0, MIN_DISPLAY_MS - (performance.now() - startedAt));
    completionTimer = window.setTimeout(() => complete(false), reducedMotion ? 0 : remaining);
  }

  if (reducedMotion) container.classList.add('is-reduced-motion');

  return {
    updateProgress,
    setReady,
    bypass: requestSkip,
  };
}

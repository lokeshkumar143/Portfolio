// Cinematic Gaming Loading Screen — Original Portfolio Identity
// Inspired by high-end cinematic gaming interfaces with Ken Burns artwork,
// editorial typography, real-time asset telemetry, and seamless hero reveal.

import { sound } from '../lib/sound.js';

export function initGameLoader({ onComplete } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const urlParams = new URLSearchParams(window.location.search);
  const forceBoot = urlParams.has('intro') || urlParams.has('boot') || urlParams.has('reset');
  if (forceBoot) {
    sessionStorage.removeItem('portfolio_loader_completed');
    sessionStorage.removeItem('portfolio_visitor_name');
  }
  const isReturning = !forceBoot && sessionStorage.getItem('portfolio_loader_completed') === 'true';

  if (isReturning) {
    const savedName = sessionStorage.getItem('portfolio_visitor_name') || 'GUEST OPERATOR';
    if (typeof onComplete === 'function') {
      onComplete({ visitorName: savedName, skipped: true });
    }
    return {
      updateProgress: () => {},
      setReady: () => {},
      bypass: () => {},
    };
  }

  let visitorName = 'GUEST OPERATOR';
  let isDone = false;
  let isAssetsReady = false;
  let currentProgress = 10;
  let activeSlide = 0;

  const slidesData = [
    {
      img: 'public/media/hero.jpg',
      kicker: 'CHAPTER 01 // NATIVE ARCHITECTURE',
      title: 'BUILDING NATIVE EXPERIENCES.',
      sub: 'LOKESH KUMAR S. · SWIFT & SWIFTUI',
      desc: 'Crafting fluid 120Hz ProMotion user interfaces, high-concurrency native architectures, and seamless Apple platform integrations.',
    },
    {
      img: 'public/media/device_showcase.jpg',
      kicker: 'CHAPTER 02 // APPLIED AI',
      title: 'ENGINEERING INTELLIGENT APPLICATIONS.',
      sub: 'COREML & APPLE SILICON NEURAL ENGINE',
      desc: 'Executing sub-4ms on-device machine learning models, acoustic signal processing, and private local neural inference.',
    },
    {
      img: 'public/media/gallery_stage.jpg',
      kicker: 'CHAPTER 03 // DIGITAL HORIZONS',
      title: 'DESIGNING BEYOND BOUNDARIES.',
      sub: 'SPATIAL COMPUTING & CREATIVE SYSTEMS',
      desc: 'Bridging engineering rigor with cinematic aesthetics, tactile interaction mechanics, and scalable production platforms.',
    },
    {
      img: 'public/media/chrono_chamber.jpg',
      kicker: 'CHAPTER 04 // EXPEDITION',
      title: 'CREATING DIGITAL EXPERIENCES.',
      sub: 'END-TO-END MOBILE ENGINEERING',
      desc: 'Transforming complex algorithmic requirements into delightful, responsive, and impactful human experiences.',
    },
  ];

  const telemetryMessages = [
    'Initializing Experience...',
    'Loading Visual Engine...',
    'Preparing Interactive Scenes...',
    'Synchronizing Digital Environment...',
    'Preparing Portfolio...',
    'Experience Ready.',
  ];

  // 1. Create and inject DOM
  const container = document.createElement('div');
  container.id = 'gameLoader';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', 'Cinematic Gaming Loading Experience');

  container.innerHTML = `
    <!-- Cinematic White Flash Transition -->
    <div class="gl-flash" id="glFlash" aria-hidden="true"></div>

    <!-- Atmospheric Overlays -->
    <div class="gl-vignette" aria-hidden="true"></div>
    <div class="gl-grid" aria-hidden="true"></div>
    <div class="gl-scanlines" aria-hidden="true"></div>

    <!-- Full-Bleed Artwork Slides (Ken Burns Parallax) -->
    <div class="gl-art-wrap" id="glArtWrap" aria-hidden="true">
      <div class="gl-art-tint"></div>
      ${slidesData.map((s, idx) => `
        <div class="gl-art-slide ${idx === 0 ? 'is-active' : ''}" style="background-image: url('${s.img}');" data-index="${idx}"></div>
      `).join('')}
    </div>

    <!-- Top Bar: Original Wordmark & Navigation -->
    <header class="gl-header">
      <div class="gl-brand">
        <span class="gl-brand__mark">LOKESH<span>.</span></span>
        <div class="gl-brand__divider" aria-hidden="true"></div>
        <div class="gl-brand__meta">
          <span class="gl-brand__label">DIGITAL EXPERIENCE</span>
          <span class="gl-brand__version">PORTFOLIO // 2026</span>
        </div>
      </div>

      <div class="gl-header__right">
        <button type="button" class="gl-btn-audio" id="glAudioBtn" aria-label="Toggle audio">
          <span>AUDIO: OFF</span>
        </button>
        <button type="button" class="gl-btn-skip" id="glSkipBtn" aria-label="Skip loading intro">
          <span>SKIP INTRO</span>
          <kbd>ESC</kbd>
        </button>
      </div>
    </header>

    <!-- Center Stage: Narrative Card & Operator Access -->
    <main class="gl-stage">
      <div class="gl-card" id="glCard">
        <div class="gl-card__kicker">
          <span class="gl-card__kicker-dot" aria-hidden="true"></span>
          <span id="glCardKicker">${slidesData[0].kicker}</span>
        </div>

        <h1 class="gl-card__title" id="glCardTitle">${slidesData[0].title}</h1>
        <div class="gl-card__sub" id="glCardSub">${slidesData[0].sub}</div>
        <p class="gl-card__desc" id="glCardDesc">${slidesData[0].desc}</p>

        <!-- Access Box -->
        <form class="gl-access-box" id="glAccessForm" onsubmit="return false;">
          <div class="gl-input-row">
            <input
              type="text"
              class="gl-input"
              id="glNameInput"
              placeholder="ENTER VISITOR CODENAME..."
              maxlength="30"
              autocomplete="name"
              spellcheck="false"
              aria-label="Visitor Name"
            />
          </div>

          <div class="gl-actions">
            <button type="submit" class="gl-btn-enter" id="glEnterBtn">
              <span>ENTER EXPERIENCE</span>
              <span aria-hidden="true">▶</span>
            </button>
            <button type="button" class="gl-btn-quick" id="glQuickBtn">
              QUICK START [ENTER]
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Bottom Bar: Real-Time Telemetry & Loading Meter -->
    <footer class="gl-footer">
      <div class="gl-telemetry">
        <div class="gl-telemetry__tag">SYSTEM TELEMETRY</div>
        <div class="gl-telemetry__message" id="glTelemetryMsg">${telemetryMessages[0]}</div>
      </div>

      <div class="gl-progress-block">
        <div class="gl-progress-hdr">
          <span class="gl-progress-status" id="glStatusText">LOADING ASSETS<span>...</span></span>
          <span class="gl-progress-percent" id="glPercentText">10%</span>
        </div>

        <div class="gl-meter">
          <div class="gl-meter__fill" id="glMeterFill"></div>
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
  const audioBtn = document.getElementById('glAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = sound.toggle();
      audioBtn.querySelector('span').textContent = active ? 'AUDIO: ON' : 'AUDIO: OFF';
      audioBtn.classList.toggle('is-active', active);
    });
  }

  // Keypress audio feedback
  const nameInput = document.getElementById('glNameInput');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      sound.playKeyBeep();
    });
  }

  // Slide Rotation (every 4.5s)
  const slideEls = container.querySelectorAll('.gl-art-slide');
  const kickerEl = document.getElementById('glCardKicker');
  const titleEl = document.getElementById('glCardTitle');
  const subEl = document.getElementById('glCardSub');
  const descEl = document.getElementById('glCardDesc');
  const cardEl = document.getElementById('glCard');

  let slideInterval;
  if (!reduced) {
    slideInterval = setInterval(() => {
      if (isDone) return;
      activeSlide = (activeSlide + 1) % slidesData.length;
      slideEls.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === activeSlide);
      });

      if (cardEl) {
        cardEl.style.opacity = '0';
        cardEl.style.transform = 'translateY(10px)';

        setTimeout(() => {
          const s = slidesData[activeSlide];
          if (kickerEl) kickerEl.textContent = s.kicker;
          if (titleEl) titleEl.textContent = s.title;
          if (subEl) subEl.textContent = s.sub;
          if (descEl) descEl.textContent = s.desc;

          cardEl.style.opacity = '1';
          cardEl.style.transform = 'translateY(0)';
        }, 320);
      }
    }, 4800);
  }

  // Telemetry Elements
  const msgEl = document.getElementById('glTelemetryMsg');
  const fillEl = document.getElementById('glMeterFill');
  const percentEl = document.getElementById('glPercentText');
  const statusEl = document.getElementById('glStatusText');
  const enterBtn = document.getElementById('glEnterBtn');

  // Smooth Progress Updater
  function updateProgress(fraction, message) {
    if (isDone) return;
    const target = Math.round(clamp(fraction, 0, 1) * 100);
    if (target > currentProgress) {
      currentProgress = target;
    }
    if (fillEl) fillEl.style.width = `${currentProgress}%`;
    if (percentEl) percentEl.textContent = `${currentProgress}%`;
    if (message && msgEl) {
      msgEl.textContent = message;
    }
  }

  // Set Ready when all critical assets are ready
  function setReady() {
    if (isDone) return;
    isAssetsReady = true;
    currentProgress = 100;
    if (fillEl) fillEl.style.width = '100%';
    if (percentEl) percentEl.textContent = '100%';
    if (statusEl) statusEl.textContent = 'EXPERIENCE READY';
    if (msgEl) msgEl.textContent = 'All Visual Engines & Neural Systems Synchronized. Ready for Entry.';
    if (enterBtn) {
      enterBtn.classList.add('is-ready');
    }
    sound.playChime(4);
  }

  // Trigger Exit / Enter Experience
  function triggerEntry(name, skipped = false) {
    if (isDone) return;
    isDone = true;
    visitorName = name || 'GUEST OPERATOR';

    clearInterval(slideInterval);
    window.removeEventListener('keydown', keyHandler);

    sessionStorage.setItem('portfolio_loader_completed', 'true');
    sessionStorage.setItem('portfolio_visitor_name', visitorName);

    // Screen flash and smooth transition
    container.classList.add('is-entering');
    sound.playRockstarBass();

    setTimeout(() => {
      container.classList.remove('is-entering');
      container.classList.add('is-dismissed');

      if (typeof onComplete === 'function') {
        onComplete({ visitorName, skipped });
      }

      setTimeout(() => {
        container.remove();
      }, 900);
    }, skipped ? 80 : 400);
  }

  // Skip button
  const skipBtn = document.getElementById('glSkipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => triggerEntry('GUEST OPERATOR', true));
  }

  // Form submission
  const accessForm = document.getElementById('glAccessForm');
  const quickBtn = document.getElementById('glQuickBtn');

  if (accessForm) {
    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = nameInput ? nameInput.value.trim() : '';
      triggerEntry(val, false);
    });
  }

  if (quickBtn) {
    quickBtn.addEventListener('click', () => {
      triggerEntry('GUEST OPERATOR', false);
    });
  }

  // Keyboard navigation: ESC to skip, ENTER to enter
  const keyHandler = (e) => {
    if (isDone) return;
    if (e.key === 'Escape') {
      triggerEntry('GUEST OPERATOR', true);
    } else if (e.key === 'Enter' && document.activeElement !== nameInput) {
      const val = nameInput ? nameInput.value.trim() : '';
      triggerEntry(val, false);
    }
  };
  window.addEventListener('keydown', keyHandler);

  return {
    updateProgress,
    setReady,
    bypass: () => triggerEntry('GUEST OPERATOR', true),
  };
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}


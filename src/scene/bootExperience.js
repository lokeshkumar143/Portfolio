// Rockstar Games Style Cinematic Loading & Identity Experience
// Features iconic L★ emblem intro, GTA V style slideshow with Ken Burns parallax,
// rotating hints ticker, spinning star loading wheel, and dramatic story mode transition.

import { sound } from '../lib/sound.js';

export function initBootExperience({ onComplete, onAssetProgress } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const urlParams = new URLSearchParams(window.location.search);
  const forceBoot = urlParams.has('intro') || urlParams.has('boot') || urlParams.has('reset');
  if (forceBoot) {
    sessionStorage.removeItem('mech_boot_completed');
    sessionStorage.removeItem('mech_visitor_name');
  }
  const isReturning = !forceBoot && sessionStorage.getItem('mech_boot_completed') === 'true';

  if (isReturning) {
    const savedName = sessionStorage.getItem('mech_visitor_name') || 'GUEST OPERATOR';
    if (typeof onComplete === 'function') {
      onComplete({ visitorName: savedName, skipped: true });
    }
    return { container: null, bypass: () => {} };
  }

  let visitorName = 'GUEST OPERATOR';
  let isDone = false;
  let activeSlide = 0;

  const slidesData = [
    {
      img: 'public/media/hero.jpg',
      kicker: 'CHAPTER 01 // ARCHITECTURE',
      title: 'LOKESH KUMAR S.',
      sub: 'NATIVE iOS DEVELOPER · SWIFT & SWIFTUI',
      desc: 'Architecting high-frequency 120Hz ProMotion interfaces, zero-allocation runtime concurrency, and responsive native Apple platforms.',
    },
    {
      img: 'public/media/device_showcase.jpg',
      kicker: 'CHAPTER 02 // APPLIED AI',
      title: 'COREML & A18 PRO',
      sub: 'SUB-4MS ON-DEVICE NEURAL INFERENCE',
      desc: 'Real-time acoustic analysis, edge machine learning, and hardware-accelerated computer vision with complete user privacy.',
    },
    {
      img: 'public/media/gallery_stage.jpg',
      kicker: 'CHAPTER 03 // PRODUCTION',
      title: 'FEATURED ARSENAL',
      sub: 'END-TO-END MOBILE SYSTEMS & QA',
      desc: 'Scalable production applications, automated continuous integration pipelines, and high-concurrency client architectures.',
    },
  ];

  const rockstarHints = [
    'HINT: Swift 6 data-race safety prevents background thread corruption in real-time camera pipelines.',
    'HINT: CoreML models execute entirely on-device with zero network latency or cloud dependence.',
    'HINT: 120Hz ProMotion animations require strict zero-allocation loops on the main thread.',
    'HINT: Press [ENTER] or click [ENTER STORY MODE] to jump straight into the portfolio.',
    'HINT: Acoustic uroflowmetry algorithms process sound frequencies offline for total privacy.',
  ];

  // 1. Build DOM Container
  const container = document.createElement('div');
  container.id = 'mechBoot';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', 'Rockstar Games Loading Screen');

  container.innerHTML = `
    <!-- Screen Flash (GTA Camera Shutter Flash) -->
    <div class="rs-flash" id="rsFlash" aria-hidden="true"></div>

    <!-- Atmospheric Overlays -->
    <div class="rs-vignette" aria-hidden="true"></div>
    <div class="rs-scanlines" aria-hidden="true"></div>

    <!-- Phase 1: Iconic Rockstar L★ Logo Intro Splash -->
    <div class="rs-logo-splash" id="rsLogoSplash" aria-hidden="true">
      <div class="rs-emblem">
        <span class="rs-emblem__letter">L</span>
        <svg class="rs-emblem__star" viewBox="0 0 24 24">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </div>
      <h1 class="rs-logo-splash__title">ROCKSTAR CREATIVE STUDIOS</h1>
      <p class="rs-logo-splash__sub">LOKESH KUMAR S. PRESENTS · iOS DIVISION</p>
    </div>

    <!-- Phase 2: Full-Bleed Slideshow Backgrounds -->
    <div class="rs-slides-wrap" id="rsSlidesWrap" aria-hidden="true">
      ${slidesData.map((s, idx) => `
        <div class="rs-slide ${idx === 0 ? 'is-active' : ''}" style="background-image: url('${s.img}');" data-index="${idx}"></div>
      `).join('')}
    </div>

    <!-- Top Telemetry Header -->
    <header class="rs-header">
      <div class="rs-header__brand">
        <svg class="rs-mini-star" viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
        <span class="rs-header__title">PORTFOLIO // <span>STORY MODE</span></span>
      </div>

      <div class="rs-header__controls">
        <button type="button" class="rs-btn-audio" id="rsAudioBtn" aria-label="Toggle sound">
          <span>AUDIO: OFF</span>
        </button>
        <button type="button" class="rs-btn-skip" id="rsSkipBtn" aria-label="Bypass intro">
          <span>BYPASS</span>
          <kbd>ESC</kbd>
        </button>
      </div>
    </header>

    <!-- Main Character / Feature Card -->
    <main class="rs-stage">
      <div class="rs-card" id="rsCard">
        <div class="rs-card__kicker" id="rsCardKicker">
          <span>★</span>
          <span id="rsKickerText">${slidesData[0].kicker}</span>
        </div>

        <h2 class="rs-card__title" id="rsCardTitle">${slidesData[0].title}</h2>
        <div class="rs-card__sub" id="rsCardSub">${slidesData[0].sub}</div>
        <p class="rs-card__desc" id="rsCardDesc">${slidesData[0].desc}</p>

        <!-- Identity Entry Form -->
        <form class="rs-auth-form" id="rsAuthForm" onsubmit="return false;">
          <div class="rs-auth-input-wrap">
            <input
              type="text"
              class="rs-auth-input"
              id="rsNameInput"
              placeholder="ENTER OPERATOR CODENAME..."
              maxlength="30"
              autocomplete="name"
              spellcheck="false"
              aria-label="Visitor Name"
            />
          </div>

          <div class="rs-auth-actions">
            <button type="submit" class="rs-btn-enter" id="rsEnterBtn">
              <span>ENTER STORY MODE</span>
              <span aria-hidden="true">▶</span>
            </button>
            <button type="button" class="rs-btn-quick" id="rsQuickBtn">
              QUICK START [ENTER]
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Bottom Rockstar Hints & Rotating Star Spinner -->
    <footer class="rs-footer">
      <div class="rs-hints">
        <div class="rs-hints__tag">DEVELOPER INTEL</div>
        <div class="rs-hints__text" id="rsHintsText">${rockstarHints[0]}</div>
      </div>

      <div class="rs-loader-block">
        <div class="rs-spinner-wrap" aria-hidden="true">
          <svg class="rs-star-spinner" viewBox="0 0 24 24">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </div>

        <div class="rs-loader-info">
          <div class="rs-loader-status" id="rsStatusText">LOADING STORY MODE<span>...</span></div>
          <div class="rs-meter">
            <div class="rs-meter__fill" id="rsMeterFill"></div>
          </div>
        </div>
      </div>
    </footer>
  `;

  document.body.appendChild(container);

  // Sound warm-up
  const armSound = () => {
    sound.init();
    container.removeEventListener('pointerdown', armSound);
    container.removeEventListener('keydown', armSound);
  };
  container.addEventListener('pointerdown', armSound, { once: true });
  container.addEventListener('keydown', armSound, { once: true });

  // Play Rockstar Bass on start
  setTimeout(() => {
    sound.playRockstarBass();
  }, 100);

  // Audio Toggle Button
  const audioBtn = document.getElementById('rsAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = sound.toggle();
      audioBtn.querySelector('span').textContent = active ? 'AUDIO: ON' : 'AUDIO: OFF';
      audioBtn.classList.toggle('is-active', active);
    });
  }

  // Key sound on input
  const nameInput = document.getElementById('rsNameInput');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      sound.playKeyBeep();
    });
  }

  // Phase 1 to Phase 2 Transition (Dismiss Logo Splash after 1.8s)
  const logoSplash = document.getElementById('rsLogoSplash');
  setTimeout(() => {
    if (logoSplash) logoSplash.classList.add('is-hidden');
  }, reduced ? 200 : 1800);

  // Slide Rotation every 4.5 seconds
  const slideEls = container.querySelectorAll('.rs-slide');
  const kickerEl = document.getElementById('rsKickerText');
  const titleEl = document.getElementById('rsCardTitle');
  const subEl = document.getElementById('rsCardSub');
  const descEl = document.getElementById('rsCardDesc');
  const cardEl = document.getElementById('rsCard');

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
        cardEl.style.transform = 'translateX(-15px)';
        sound.playRockstarShutter();

        setTimeout(() => {
          const s = slidesData[activeSlide];
          if (kickerEl) kickerEl.textContent = s.kicker;
          if (titleEl) titleEl.textContent = s.title;
          if (subEl) subEl.textContent = s.sub;
          if (descEl) descEl.textContent = s.desc;

          cardEl.style.opacity = '1';
          cardEl.style.transform = 'translateX(0)';
        }, 300);
      }
    }, 5000);
  }

  // Hints Rotation every 3.8 seconds
  const hintsEl = document.getElementById('rsHintsText');
  let currentHint = 0;
  const hintInterval = setInterval(() => {
    if (isDone) return;
    currentHint = (currentHint + 1) % rockstarHints.length;
    if (hintsEl) {
      hintsEl.style.opacity = '0';
      setTimeout(() => {
        hintsEl.textContent = rockstarHints[currentHint];
        hintsEl.style.opacity = '1';
      }, 250);
    }
  }, 4200);

  // Progress Bar Simulation
  const fillEl = document.getElementById('rsMeterFill');
  const statusEl = document.getElementById('rsStatusText');
  let progress = 25;
  const progressTimer = setInterval(() => {
    if (isDone) return;
    if (progress < 95) {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 95) progress = 95;
      if (fillEl) fillEl.style.width = `${progress}%`;
    }
  }, 500);

  // Bypass / Unlock Action
  const triggerUnlock = (name, skipped = false) => {
    if (isDone) return;
    isDone = true;
    visitorName = name || 'GUEST OPERATOR';

    clearInterval(slideInterval);
    clearInterval(hintInterval);
    clearInterval(progressTimer);
    window.removeEventListener('keydown', keyHandler);

    sessionStorage.setItem('mech_boot_completed', 'true');
    sessionStorage.setItem('mech_visitor_name', visitorName);

    if (fillEl) fillEl.style.width = '100%';
    if (statusEl) statusEl.innerHTML = 'LAUNCHING STORY MODE<span>...</span>';

    // Iconic GTA Camera White Flash
    container.classList.add('is-flashing');
    sound.playRockstarBass();

    setTimeout(() => {
      container.classList.remove('is-flashing');
      container.classList.add('is-dismissed');

      if (typeof onComplete === 'function') {
        onComplete({ visitorName, skipped });
      }

      setTimeout(() => {
        container.remove();
      }, 800);
    }, skipped ? 80 : 450);
  };

  // Skip / Bypass Button
  const skipBtn = document.getElementById('rsSkipBtn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => triggerUnlock('GUEST OPERATOR', true));
  }

  // Keyboard Navigation: ESC to bypass, ENTER to start
  const keyHandler = (e) => {
    if (isDone) return;
    if (e.key === 'Escape') {
      triggerUnlock('GUEST OPERATOR', true);
    } else if (e.key === 'Enter' && document.activeElement !== nameInput) {
      triggerUnlock(nameInput ? nameInput.value.trim() : '', false);
    }
  };
  window.addEventListener('keydown', keyHandler);

  // Form Submission
  const authForm = document.getElementById('rsAuthForm');
  const quickBtn = document.getElementById('rsQuickBtn');

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = nameInput ? nameInput.value.trim() : '';
      triggerUnlock(val, false);
    });
  }

  if (quickBtn) {
    quickBtn.addEventListener('click', () => {
      triggerUnlock('GUEST OPERATOR', false);
    });
  }

  return {
    container,
    bypass: () => triggerUnlock('GUEST OPERATOR', true),
  };
}

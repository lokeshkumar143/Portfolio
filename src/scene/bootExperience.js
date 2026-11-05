// Cinematic Mechanical Startup & Visitor Identity Access Experience
// Coordinates industrial machine activation, concentric reactor spin, diagnostics,
// visitor welcome input, and pneumatic blast doors opening into Lokesh Kumar S.'s portfolio.

import { sound } from '../lib/sound.js';

export function initBootExperience({ onComplete, onAssetProgress } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isReturning = sessionStorage.getItem('mech_boot_completed') === 'true';

  let currentStage = 1; // 1: Activation, 2: Diagnostics, 3: Identity, 4: Granted
  let visitorName = 'GUEST OPERATOR';
  let isDone = false;

  // 1. Build and inject DOM
  const container = document.createElement('div');
  container.id = 'mechBoot';
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', 'System Activation and Identity Access');

  container.innerHTML = `
    <!-- Split Mechanical Blast Doors -->
    <div class="mech-doors" aria-hidden="true">
      <div class="mech-door mech-door--left">
        <div class="mech-door__seam"></div>
        <div class="mech-door__hazard"></div>
      </div>
      <div class="mech-door mech-door--right">
        <div class="mech-door__seam"></div>
        <div class="mech-door__hazard"></div>
      </div>
    </div>

    <!-- Atmospheric & Grid Optics -->
    <div class="mech-grid" aria-hidden="true"></div>
    <div class="mech-vignette" aria-hidden="true"></div>
    <div class="mech-scanline" aria-hidden="true"></div>

    <!-- Top Telemetry Header -->
    <header class="mech-hdr">
      <div class="mech-hdr__brand">
        <span class="mech-hdr__icon" aria-hidden="true"></span>
        <span class="mech-hdr__title">SIMATS R&amp;D LAB <span>// CORE-OS 2.6</span></span>
      </div>

      <div class="mech-hdr__center" aria-hidden="true">
        <span class="mech-hdr__badge" id="mechHdrBadge">REACTOR // ARMED</span>
      </div>

      <div class="mech-hdr__right">
        <button type="button" class="mech-btn-audio" id="mechAudioBtn" aria-label="Toggle sound">
          <span>AUDIO: OFF</span>
        </button>
        <button type="button" class="mech-btn-skip" id="mechSkipBtn" aria-label="Bypass intro protocol">
          <span>BYPASS</span>
          <kbd>ESC</kbd>
        </button>
      </div>
    </header>

    <!-- Center Stage: Mechanical Reactor & Control Terminal -->
    <main class="mech-stage">
      <div class="mech-reactor-wrap" aria-hidden="true">
        <svg class="mech-svg" viewBox="0 0 400 400">
          <defs>
            <radialGradient id="laserGrad" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
              <stop offset="30%" stop-color="#ff4830" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#ff4830" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff6040"/>
              <stop offset="50%" stop-color="#302025"/>
              <stop offset="100%" stop-color="#ff4025"/>
            </linearGradient>
          </defs>

          <!-- Outer Caliper Tick Ring (360 deg ticks) -->
          <g class="mech-ring--outer">
            <circle cx="200" cy="200" r="182" fill="none" stroke="rgba(255, 75, 45, 0.22)" stroke-width="1.5" stroke-dasharray="4 8" />
            <circle cx="200" cy="200" r="176" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
            <line x1="200" y1="14" x2="200" y2="28" stroke="#ff4830" stroke-width="2"/>
            <line x1="200" y1="372" x2="200" y2="386" stroke="#ff4830" stroke-width="2"/>
            <line x1="14" y1="200" x2="28" y2="200" stroke="#ff4830" stroke-width="2"/>
            <line x1="372" y1="200" x2="386" y2="200" stroke="#ff4830" stroke-width="2"/>
            <text x="200" y="38" fill="rgba(255, 80, 50, 0.7)" font-size="8" font-family="monospace" text-anchor="middle">000°</text>
            <text x="365" y="203" fill="rgba(255, 80, 50, 0.7)" font-size="8" font-family="monospace" text-anchor="middle">090°</text>
            <text x="200" y="368" fill="rgba(255, 80, 50, 0.7)" font-size="8" font-family="monospace" text-anchor="middle">180°</text>
            <text x="35" y="203" fill="rgba(255, 80, 50, 0.7)" font-size="8" font-family="monospace" text-anchor="middle">270°</text>
          </g>

          <!-- Middle Industrial Gear Ring -->
          <g class="mech-ring--gears">
            <circle cx="200" cy="200" r="148" fill="none" stroke="rgba(255, 255, 255, 0.14)" stroke-width="7" stroke-dasharray="12 18" />
            <circle cx="200" cy="200" r="142" fill="none" stroke="rgba(255, 60, 40, 0.3)" stroke-width="1.5" />
          </g>

          <!-- Segmented HUD Coordinate Ring -->
          <g class="mech-ring--hud">
            <circle cx="200" cy="200" r="118" fill="none" stroke="#ff4830" stroke-width="2.5" stroke-dasharray="75 35 45 20 90 25" />
            <circle cx="200" cy="200" r="112" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
          </g>

          <!-- Reticle Aperture Ring -->
          <g class="mech-ring--iris">
            <circle cx="200" cy="200" r="82" fill="none" stroke="rgba(255, 120, 70, 0.6)" stroke-width="2" stroke-dasharray="24 12 8 12" />
            <circle cx="200" cy="200" r="76" fill="none" stroke="rgba(255, 75, 45, 0.25)" stroke-width="1" />
          </g>

          <!-- Rotating Red Laser Beam -->
          <g class="mech-laser-beam">
            <line x1="200" y1="200" x2="380" y2="200" stroke="url(#laserGrad)" stroke-width="2.5"/>
            <circle cx="376" cy="200" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #ff4830)"/>
          </g>
        </svg>

        <!-- Pulsing Crimson Core Energy Orb -->
        <div class="mech-core-orb"></div>
      </div>

      <!-- Main Interaction Panel -->
      <div class="mech-panel">
        <!-- Stage 1 & 2: System Diagnostics Readout -->
        <div class="mech-diag" id="mechDiagView">
          <div class="mech-diag__header">
            <span class="mech-diag__kicker">
              <span class="mech-hdr__icon"></span>
              <span id="mechStatusText">INITIALIZING SYSTEM ARCHITECTURE...</span>
            </span>
            <span class="mech-diag__percent" id="mechPercentText">0%</span>
          </div>

          <div class="mech-diag__meter">
            <div class="mech-diag__fill" id="mechMeterFill"></div>
          </div>

          <ul class="mech-diag__list" id="mechDiagList">
            <li class="mech-diag__item" data-step="0">
              <span class="mech-diag__itemLabel">
                <i class="mech-diag__itemDot"></i>
                <span>POWER CORE ONLINE</span>
              </span>
              <span class="mech-diag__itemTag">[PENDING]</span>
            </li>
            <li class="mech-diag__item" data-step="1">
              <span class="mech-diag__itemLabel">
                <i class="mech-diag__itemDot"></i>
                <span>VISUAL ENGINE INITIALIZED</span>
              </span>
              <span class="mech-diag__itemTag">[PENDING]</span>
            </li>
            <li class="mech-diag__item" data-step="2">
              <span class="mech-diag__itemLabel">
                <i class="mech-diag__itemDot"></i>
                <span>NEURAL INTERFACE CONNECTED</span>
              </span>
              <span class="mech-diag__itemTag">[PENDING]</span>
            </li>
            <li class="mech-diag__item" data-step="3">
              <span class="mech-diag__itemLabel">
                <i class="mech-diag__itemDot"></i>
                <span>IDENTITY SCANNER READY</span>
              </span>
              <span class="mech-diag__itemTag">[PENDING]</span>
            </li>
            <li class="mech-diag__item" data-step="4">
              <span class="mech-diag__itemLabel">
                <i class="mech-diag__itemDot"></i>
                <span>ACCESS PROTOCOL ACTIVE</span>
              </span>
              <span class="mech-diag__itemTag">[PENDING]</span>
            </li>
          </ul>
        </div>

        <!-- Stage 3: Visitor Identity Access Form -->
        <form class="mech-auth" id="mechAuthForm" onsubmit="return false;">
          <h2 class="mech-auth__title">IDENTITY REQUIRED</h2>
          <p class="mech-auth__sub">ENTER YOUR NAME TO ACCESS THE EXPERIENCE</p>

          <div class="mech-auth__field">
            <span class="mech-auth__fieldIcon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              type="text"
              class="mech-auth__input"
              id="mechNameInput"
              placeholder="YOUR NAME OR CODENAME..."
              maxlength="30"
              autocomplete="name"
              spellcheck="false"
              aria-label="Visitor Name"
            />
          </div>

          <div class="mech-auth__actions">
            <button type="submit" class="mech-btn-access" id="mechSubmitBtn">
              <span>ACCESS SYSTEM</span>
              <span aria-hidden="true">▶</span>
            </button>
            <button type="button" class="mech-btn-guest" id="mechGuestBtn">
              SKIP &amp; ENTER AS GUEST [ENTER]
            </button>
          </div>
        </form>

        <!-- Stage 4: Access Granted Confirmation Banner -->
        <div class="mech-granted" id="mechGrantedView">
          <h2 class="mech-granted__title">ACCESS GRANTED</h2>
          <p class="mech-granted__welcome" id="mechWelcomeName">WELCOME, OPERATOR</p>
          <span class="mech-granted__tag">NEURAL LINK CONFIRMED // DECOMPRESSING AIRLOCK</span>
        </div>
      </div>
    </main>
  `;

  document.body.appendChild(container);

  // Audio Toggle Button
  const audioBtn = document.getElementById('mechAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = sound.toggle();
      audioBtn.querySelector('span').textContent = active ? 'AUDIO: ON' : 'AUDIO: OFF';
      audioBtn.classList.toggle('is-active', active);
    });
  }

  // Sound warm up on any click/key inside container
  const armSound = () => {
    sound.init();
    container.removeEventListener('pointerdown', armSound);
    container.removeEventListener('keydown', armSound);
  };
  container.addEventListener('pointerdown', armSound, { once: true });
  container.addEventListener('keydown', armSound, { once: true });

  // Input keystroke sounds
  const inputEl = document.getElementById('mechNameInput');
  if (inputEl) {
    inputEl.addEventListener('input', () => {
      sound.playKeyBeep();
    });
  }

  // Skip / Bypass Button
  const skipBtn = document.getElementById('mechSkipBtn');
  const triggerBypass = () => {
    if (isDone) return;
    executeUnlock('GUEST OPERATOR', true);
  };

  if (skipBtn) {
    skipBtn.addEventListener('click', triggerBypass);
  }

  // Keyboard shortcut: ESC to bypass, ENTER to submit
  const keyHandler = (e) => {
    if (isDone) return;
    if (e.key === 'Escape') {
      triggerBypass();
    }
  };
  window.addEventListener('keydown', keyHandler);

  // --------------------------------------------------------------------------
  // Stage Execution
  // --------------------------------------------------------------------------

  const fillEl = document.getElementById('mechMeterFill');
  const percentEl = document.getElementById('mechPercentText');
  const statusEl = document.getElementById('mechStatusText');
  const badgeEl = document.getElementById('mechHdrBadge');
  const diagItems = container.querySelectorAll('.mech-diag__item');

  // Stage 1: Machine activation sound & initial pulse
  sound.playMechanicalBoot();

  // Stage 2: Diagnostics step runner
  const diagnosticTasks = [
    { label: 'POWER CORE ONLINE', tag: '[SYS.PWR // 100%]' },
    { label: 'VISUAL ENGINE INITIALIZED', tag: '[GL.STAGE // READY]' },
    { label: 'NEURAL INTERFACE CONNECTED', tag: '[COREML // SYNCED]' },
    { label: 'IDENTITY SCANNER READY', tag: '[BIOMETRIC // ARMED]' },
    { label: 'ACCESS PROTOCOL ACTIVE', tag: '[SEC.LVL // 04]' },
  ];

  let currentDiag = 0;
  const diagInterval = reduced ? 80 : 320;

  const runDiagnostics = () => {
    if (currentDiag < diagnosticTasks.length) {
      const item = diagItems[currentDiag];
      if (item) {
        item.classList.add('is-active');
        sound.playDiagnosticTick(740 + currentDiag * 110);

        setTimeout(() => {
          item.classList.remove('is-active');
          item.classList.add('is-done');
          const tag = item.querySelector('.mech-diag__itemTag');
          if (tag) tag.textContent = diagnosticTasks[currentDiag].tag;

          currentDiag++;
          const progress = Math.round((currentDiag / diagnosticTasks.length) * 100);
          if (fillEl) fillEl.style.width = `${progress}%`;
          if (percentEl) percentEl.textContent = `${progress}%`;

          runDiagnostics();
        }, diagInterval);
      }
    } else {
      // Diagnostics 100% complete — Transition to Stage 3 (Identity Input)
      setTimeout(transitionToIdentity, 300);
    }
  };

  setTimeout(runDiagnostics, reduced ? 100 : 500);

  // Transition from Stage 2 to Stage 3
  function transitionToIdentity() {
    if (isDone) return;
    currentStage = 3;

    if (badgeEl) badgeEl.textContent = 'IDENTITY // REQUIRED';
    const diagView = document.getElementById('mechDiagView');
    const authForm = document.getElementById('mechAuthForm');

    if (diagView) diagView.style.display = 'none';
    if (authForm) {
      authForm.classList.add('is-active');
      if (inputEl) {
        setTimeout(() => inputEl.focus(), 150);
      }
    }
  }

  // Handle Form Submission (Stage 3 -> Stage 4)
  const authForm = document.getElementById('mechAuthForm');
  const guestBtn = document.getElementById('mechGuestBtn');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isDone) return;

    const rawName = inputEl ? inputEl.value.trim() : '';
    const finalName = rawName || 'GUEST OPERATOR';
    executeUnlock(finalName, false);
  };

  if (authForm) authForm.addEventListener('submit', handleSubmit);
  if (guestBtn) guestBtn.addEventListener('click', () => executeUnlock('GUEST OPERATOR', false));

  // --------------------------------------------------------------------------
  // Stage 4: Access Granted & Mechanical Reveal
  // --------------------------------------------------------------------------
  function executeUnlock(name, skipped = false) {
    if (isDone) return;
    isDone = true;
    visitorName = name;
    currentStage = 4;

    sessionStorage.setItem('mech_boot_completed', 'true');
    sessionStorage.setItem('mech_visitor_name', visitorName);
    window.removeEventListener('keydown', keyHandler);

    if (badgeEl) {
      badgeEl.textContent = 'ACCESS // GRANTED';
      badgeEl.style.borderColor = 'rgba(0, 255, 136, 0.6)';
      badgeEl.style.color = '#00ff88';
    }

    const authForm = document.getElementById('mechAuthForm');
    const grantedView = document.getElementById('mechGrantedView');
    const welcomeName = document.getElementById('mechWelcomeName');

    if (authForm) authForm.style.display = 'none';
    if (welcomeName) welcomeName.textContent = `WELCOME, ${visitorName.toUpperCase()}`;
    if (grantedView) grantedView.classList.add('is-active');

    // Accelerated reactor hyper-spin
    container.classList.add('is-warping');

    if (!skipped) {
      sound.playAccessGranted();
    }

    // Part the mechanical blast doors with hydraulic release hiss
    setTimeout(() => {
      sound.playBlastDoorsOpen();
      container.classList.add('doors-open');

      // Coordinate with portfolio main.js to begin hero sequence
      if (typeof onComplete === 'function') {
        onComplete({ visitorName, skipped });
      }

      // Smoothly dismiss the mechanical overlay after doors clear viewport
      setTimeout(() => {
        container.classList.add('is-dismissed');
        setTimeout(() => {
          container.remove();
        }, 800);
      }, 1250);
    }, skipped ? 80 : 800);
  }

  return {
    container,
    bypass: triggerBypass,
  };
}


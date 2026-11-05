// Apple-Style Interactive Device Showcase for iOS Applications
import { sound } from '../lib/sound.js';
import { openProjectModal } from './projectModal.js';

export const DEVICE_APPS = {
  recovfit: {
    id: 'p01_timeless',
    name: 'RecovFit',
    category: 'Healthcare & Patient Recovery · Live on App Store',
    tagline: 'Dual-Portal Patient & Doctor iOS Ecosystem',
    tech: 'Swift · SwiftUI · WebRTC Video Calling · AI Chatbot · PHP · MySQL',
    appStoreUrl: 'https://apps.apple.com/in/app/recovfit/id6753745934',
    appId: '6753745934',
    description: 'Official Apple App Store application empowering post-operative patients with guided rehabilitation protocols, real-time exercise compliance monitoring, encrypted doctor appointment video consultations, and conversational AI guidance.',
    features: [
      'Official Apple App Store Release (App ID: 6753745934)',
      'Patient portal with tailored recovery plans and daily rehab exercises',
      'Doctor dashboard for clinical progress monitoring and oversight',
      'Built-in video calling system for real-time scheduled consultations',
      'AI clinical chatbot for instant patient query guidance',
      'Authenticated PHP/MySQL cloud database synchronization'
    ],
    statusPill: ' App Store Live',
    accentColor: '#30d158',
    screenshots: [
      'public/projects/recovfit/screen1.jpg',
      'public/projects/recovfit/screen2.jpg',
      'public/projects/recovfit/screen3.jpg',
      'public/projects/recovfit/screen4.jpg',
      'public/projects/recovfit/screen5.jpg'
    ],
    screenHtml: `
      <div class="ios-screen ios-screen--recovfit">
        <div class="ios-app-header">
          <div>
            <span class="ios-eyebrow">RECOVFIT HEALTH</span>
            <h4 class="ios-app-title">Recovery Plan</h4>
          </div>
          <span class="ios-avatar">LK</span>
        </div>
        <div class="ios-card ios-card--primary">
          <div class="ios-card__badge">NEXT APPOINTMENT</div>
          <div class="ios-card__row">
            <div>
              <p class="ios-card__main">Dr. A. Sharma</p>
              <p class="ios-card__sub">Orthopedic Rehabilitation · 10:30 AM</p>
            </div>
            <span class="ios-pill ios-pill--green">Confirmed</span>
          </div>
        </div>
        <div class="ios-metrics-grid">
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Knee Flexion</span>
            <span class="ios-stat-card__val">114°</span>
            <div class="ios-progress-bar"><i style="width: 78%;"></i></div>
          </div>
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Weekly Adherence</span>
            <span class="ios-stat-card__val">94%</span>
            <div class="ios-progress-bar"><i style="width: 94%;"></i></div>
          </div>
        </div>
        <div class="ios-card">
          <span class="ios-card__badge">TODAY'S PRESCRIBED REHAB</span>
          <p class="ios-card__main">Isometric Quad Contractions</p>
          <p class="ios-card__sub">Set 3 of 4 · 12 repetitions with angle sensor</p>
        </div>
        <div class="ios-tab-bar">
          <span class="is-active">Plan</span>
          <span>Exercises</span>
          <span>Consult</span>
          <span>Profile</span>
        </div>
      </div>
    `
  },
  urosonic: {
    id: 'p02_game',
    name: 'Urosonic / UroFlow',
    category: 'Acoustic AI & Medical Diagnostics',
    tagline: 'Smartphone-Based Non-Invasive Uroflowmetry',
    tech: 'Acoustic Signal Processing · Python · SwiftUI',
    description: 'Transforms standard smartphone microphones into clinical diagnostic flowmeters by capturing acoustic urine sound signatures and modeling clinical continuous flow rate curves.',
    features: [
      'Acoustic signal acquisition via smartphone microphone',
      'Advanced environmental noise filtering and FFT analysis',
      'Continuous volumetric flow rate curve reconstruction',
      'Automated clinical Qmax (peak flow) calculation'
    ],
    statusPill: 'Audio Sensor Armed',
    accentColor: '#0a84ff',
    screenHtml: `
      <div class="ios-screen ios-screen--urosonic">
        <div class="ios-app-header">
          <div>
            <span class="ios-eyebrow">UROSONIC AI</span>
            <h4 class="ios-app-title">Flow Diagnostic</h4>
          </div>
          <span class="ios-mic-indicator"><i class="ios-mic-pulse"></i> Mic Active</span>
        </div>
        <div class="ios-card ios-card--graph">
          <div class="ios-card__badge">REAL-TIME FLOW CURVE (mL/s)</div>
          <div class="ios-flow-chart">
            <svg viewBox="0 0 240 75" class="ios-chart-svg">
              <path d="M0,70 Q40,68 70,55 Q100,10 130,8 Q165,12 195,50 Q220,68 240,70" fill="none" stroke="#0a84ff" stroke-width="2.5" />
              <path d="M0,70 Q40,68 70,55 Q100,10 130,8 Q165,12 195,50 Q220,68 240,70 L240,75 L0,75 Z" fill="rgba(10, 132, 255, 0.15)" />
              <circle cx="130" cy="8" r="4" fill="#64d2ff" />
            </svg>
            <span class="ios-chart-marker" style="left: 54%; top: 6px;">Qmax: 24.6 mL/s</span>
          </div>
        </div>
        <div class="ios-metrics-grid">
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Peak Flow (Qmax)</span>
            <span class="ios-stat-card__val" style="color: #64d2ff;">24.6 <small>mL/s</small></span>
            <span class="ios-stat-card__tag">Optimal Curve</span>
          </div>
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Voided Volume</span>
            <span class="ios-stat-card__val">342 <small>mL</small></span>
            <span class="ios-stat-card__tag">Benchmark 350mL</span>
          </div>
        </div>
        <div class="ios-card">
          <span class="ios-card__badge">CLINICAL CLASSIFICATION</span>
          <p class="ios-card__main" style="color: #30d158;">Bell-Shaped Normal Void</p>
          <p class="ios-card__sub">No intermittent obstruction or hesitation detected</p>
        </div>
        <div class="ios-tab-bar">
          <span class="is-active">Test</span>
          <span>History</span>
          <span>Doctor Report</span>
        </div>
      </div>
    `
  },
  dsa: {
    id: 'p05_ideas',
    name: 'Gamified DSA',
    category: 'EdTech & Interactive Algorithms',
    tagline: 'Duolingo-Inspired Coding Experience with Phoenix',
    tech: 'Swift · SwiftUI · Canvas Animation · Algorithms',
    description: 'Transforms abstract computer science algorithms and data structures into bite-sized visual gamified challenges with motivational mascot feedback.',
    features: [
      'Interactive Phoenix mascot providing animated guidance',
      'Duolingo-style streaks, XP progression, and achievement rewards',
      'Real-time Canvas tree, heap, and graph visualizers',
      'Hands-on interactive edge-case code puzzles'
    ],
    statusPill: '14 Day Streak 🔥',
    accentColor: '#ff9f0a',
    screenHtml: `
      <div class="ios-screen ios-screen--dsa">
        <div class="ios-app-header">
          <div>
            <span class="ios-eyebrow">DSA MASTERY</span>
            <h4 class="ios-app-title">Binary Search Tree</h4>
          </div>
          <span class="ios-streak-pill">🔥 14 Days</span>
        </div>
        <div class="ios-mascot-card">
          <div class="ios-mascot-avatar">🐦‍🔥</div>
          <div class="ios-mascot-speech">
            <p><strong>Phoenix Guide:</strong> In-order traversal visits nodes in ascending sorted order!</p>
          </div>
        </div>
        <div class="ios-card ios-card--tree">
          <div class="ios-card__badge">VISUAL TREE CANVAS</div>
          <div class="ios-tree-vis">
            <div class="tree-node tree-node--root">50</div>
            <div class="tree-branches">
              <div class="tree-node">30</div>
              <div class="tree-node is-active">70</div>
            </div>
            <div class="tree-branches tree-branches--sub">
              <div class="tree-node">20</div>
              <div class="tree-node">40</div>
              <div class="tree-node">60</div>
              <div class="tree-node">80</div>
            </div>
          </div>
        </div>
        <div class="ios-card">
          <span class="ios-card__badge">NEXT CHALLENGE</span>
          <p class="ios-card__main">Balance the AVL Tree</p>
          <p class="ios-card__sub">+50 XP · Practice Left-Right double rotations</p>
        </div>
        <div class="ios-tab-bar">
          <span class="is-active">Trees</span>
          <span>Graphs</span>
          <span>Streaks</span>
          <span>Rank</span>
        </div>
      </div>
    `
  },
  ulcer: {
    id: 'p03_build',
    name: 'Smart Ulcer Predictor',
    category: 'Medical AI & Computer Vision · Live on App Store',
    tagline: 'Deep Learning Clinical Wound Diagnostic Tool',
    tech: 'Swift · SwiftUI · CoreML · Deep Learning · Vision Framework',
    appStoreUrl: 'https://apps.apple.com/in/app/smart-ulcer-predictor/id6755873140',
    appId: '6755873140',
    description: 'Official Apple App Store AI-powered medical support tool for iPad and iPhone. Uses state-of-the-art deep learning image recognition models to analyze skin ulcer photos and deliver instant predictions: Healing, Not Healing, or Normal Skin.',
    features: [
      'Official Apple App Store Release (App ID: 6755873140)',
      'Advanced deep learning image recognition for skin ulcer classification',
      'Instant clinical predictive states: Healing, Not Healing, Normal Skin',
      'High-resolution camera capture with adaptive boundary delineation',
      'Longitudinal healing progression monitoring for patients and clinicians',
      'Engineered natively in Swift & SwiftUI optimized for iPadOS & iOS'
    ],
    statusPill: ' App Store Live',
    accentColor: '#ff375f',
    screenshots: [
      'public/projects/smart_ulcer/screen1.jpg',
      'public/projects/smart_ulcer/screen2.jpg',
      'public/projects/smart_ulcer/screen3.jpg',
      'public/projects/smart_ulcer/screen4.jpg',
      'public/projects/smart_ulcer/ipad1.jpg'
    ],
    screenHtml: `
      <div class="ios-screen ios-screen--ulcer">
        <div class="ios-app-header">
          <div>
            <span class="ios-eyebrow">SMART ULCER AI</span>
            <h4 class="ios-app-title">Tissue Assessment</h4>
          </div>
          <span class="ios-pill ios-pill--red">Vision + CoreML</span>
        </div>
        <div class="ios-ulcer-card">
          <div class="ios-ulcer-frame">
            <div class="ios-ulcer-thermal"></div>
            <div class="ios-ulcer-reticle"></div>
            <span class="ios-ulcer-label">Scan: Heel Locus Δ 1.4°C</span>
          </div>
        </div>
        <div class="ios-metrics-grid">
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Braden Score</span>
            <span class="ios-stat-card__val" style="color: #ff375f;">18 <small>/ 23</small></span>
            <span class="ios-stat-card__tag">Low Risk Stage</span>
          </div>
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Erythema Index</span>
            <span class="ios-stat-card__val">12.4%</span>
            <span class="ios-stat-card__tag">Local Baseline</span>
          </div>
        </div>
        <div class="ios-card">
          <span class="ios-card__badge">CLINICAL RECOMMENDATION</span>
          <p class="ios-card__main" style="color: #30d158;">Repositioning Protocol Armed</p>
          <p class="ios-card__sub">Schedule 2-hour lateral turns · Pressure relief boot active</p>
        </div>
        <div class="ios-tab-bar">
          <span class="is-active">Assess</span>
          <span>Thermal</span>
          <span>History</span>
          <span>Triage</span>
        </div>
      </div>
    `
  },
  dental: {
    id: 'p04_driven',
    name: 'Dental AI',
    category: 'Computer Vision & Deep Learning',
    tagline: 'Radiographic Panoramic Image Segmentation',
    tech: 'Python · PyTorch · OpenCV · Deep Learning',
    description: 'Deep neural network trained to detect and delineate dental anatomical structures, root canals, and bone loss margins on panoramic dental radiographs.',
    features: [
      'OpenCV adaptive CLAHE contrast and noise reduction filtering',
      'PyTorch U-Net segmentation architecture delineating tooth boundaries',
      'Quantitative validation using Dice coefficient (91.4%) and IoU (84.2%)',
      'Exportable radiographic diagnostic reports assisting dentists'
    ],
    statusPill: 'Model IoU: 84.2%',
    accentColor: '#bf5af2',
    screenHtml: `
      <div class="ios-screen ios-screen--dental">
        <div class="ios-app-header">
          <div>
            <span class="ios-eyebrow">DENTAL VISION AI</span>
            <h4 class="ios-app-title">Radiograph Scan</h4>
          </div>
          <span class="ios-pill ios-pill--purple">PyTorch U-Net</span>
        </div>
        <div class="ios-xray-card">
          <div class="ios-xray-frame">
            <div class="ios-xray-scanline"></div>
            <div class="ios-xray-mask">
              <span class="ios-xray-tooth"></span>
              <span class="ios-xray-tooth is-target"></span>
              <span class="ios-xray-tooth"></span>
            </div>
            <span class="ios-xray-label">Segmented Panoramic Locus</span>
          </div>
        </div>
        <div class="ios-metrics-grid">
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Dice Coefficient</span>
            <span class="ios-stat-card__val" style="color: #bf5af2;">0.914</span>
            <span class="ios-stat-card__tag">Test Split Benchmark</span>
          </div>
          <div class="ios-stat-card">
            <span class="ios-stat-card__label">Intersection over Union</span>
            <span class="ios-stat-card__val">0.842</span>
            <span class="ios-stat-card__tag">Cross-Validated</span>
          </div>
        </div>
        <div class="ios-card">
          <span class="ios-card__badge">PATHOLOGY ANALYSIS</span>
          <p class="ios-card__main">Alveolar Bone Margin Intact</p>
          <p class="ios-card__sub">No periapical radiolucency detected in quadrant 3</p>
        </div>
        <div class="ios-tab-bar">
          <span class="is-active">Segmentation</span>
          <span>Metrics</span>
          <span>Export</span>
        </div>
      </div>
    `
  }
};

export function initDeviceShowcase() {
  const container = document.getElementById('deviceShowcase');
  if (!container) return;

  const phoneFrame = container.querySelector('.dev-phone');
  const screenContainer = container.querySelector('.dev-phone__screen');
  const dynamicIsland = container.querySelector('.dev-phone__island-pill');
  const appTabs = document.querySelectorAll('.dev-tab');
  const titleEl = container.querySelector('.dev-details__title');
  const catEl = container.querySelector('.dev-details__category');
  const descEl = container.querySelector('.dev-details__desc');
  const techEl = container.querySelector('.dev-details__tech');
  const featsEl = container.querySelector('.dev-details__features');
  const caseBtn = container.querySelector('.dev-details__caseBtn');

  // Mode pill buttons outside the phone screen
  const modeBar = document.getElementById('devPhoneModeBar');
  const modePills = modeBar ? modeBar.querySelectorAll('.dev-mode-pill') : [];
  let viewMode = 'shots';

  let currentApp = 'recovfit';
  let shotIdx = 0;

  function updateScreen() {
    const data = DEVICE_APPS[currentApp];
    if (!data || !screenContainer) return;

    if (viewMode === 'shots' && data.screenshots && data.screenshots.length > 0) {
      shotIdx = Math.min(shotIdx, data.screenshots.length - 1);
      screenContainer.innerHTML = `
        <div class="ios-shots-view">
          <div class="ios-shots-img-wrap">
            <img src="${data.screenshots[shotIdx]}" class="ios-shots-img" alt="${data.name} screenshot ${shotIdx + 1}">
          </div>
          <div class="ios-shots-nav">
            <button type="button" class="ios-shots-btn ios-shots-prev" aria-label="Previous screenshot">‹</button>
            <div class="ios-shots-dots">
              ${data.screenshots.map((_, i) => `<i class="${i === shotIdx ? 'is-active' : ''}"></i>`).join('')}
            </div>
            <span class="ios-shots-counter">${shotIdx + 1} / ${data.screenshots.length}</span>
            <button type="button" class="ios-shots-btn ios-shots-next" aria-label="Next screenshot">›</button>
          </div>
        </div>
      `;

      // Advance on image click
      screenContainer.querySelector('.ios-shots-img')?.addEventListener('click', () => {
        shotIdx = (shotIdx + 1) % data.screenshots.length;
        sound.playHapticClick();
        updateScreen();
      });

      // Navigation chevrons
      screenContainer.querySelector('.ios-shots-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        shotIdx = (shotIdx - 1 + data.screenshots.length) % data.screenshots.length;
        sound.playHapticClick();
        updateScreen();
      });

      screenContainer.querySelector('.ios-shots-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        shotIdx = (shotIdx + 1) % data.screenshots.length;
        sound.playHapticClick();
        updateScreen();
      });

      // Dot click
      screenContainer.querySelectorAll('.ios-shots-dots i').forEach((dot, idx) => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          shotIdx = idx;
          sound.playHapticClick();
          updateScreen();
        });
      });
    } else {
      screenContainer.innerHTML = data.screenHtml;
      screenContainer.querySelectorAll('.ios-tab-bar span').forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          screenContainer.querySelectorAll('.ios-tab-bar span').forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');
          sound.playHapticClick();
        });
      });
    }
  }

  // Mode switcher listeners
  modePills.forEach(pill => {
    pill.addEventListener('click', () => {
      viewMode = pill.dataset.mode || 'shots';
      modePills.forEach(p => p.classList.toggle('is-active', p.dataset.mode === viewMode));
      sound.playHapticClick();
      updateScreen();
    });
  });

  function renderApp(appKey) {
    const data = DEVICE_APPS[appKey];
    if (!data) return;
    currentApp = appKey;
    shotIdx = 0;

    // Update details side
    if (titleEl) titleEl.textContent = data.name;
    if (catEl) catEl.textContent = data.category;
    if (descEl) descEl.textContent = data.description;
    if (techEl) techEl.textContent = data.tech;

    // Update dynamic island
    if (dynamicIsland) {
      dynamicIsland.textContent = data.statusPill || ' App Store Live';
    }

    // Update App Store button
    const appStoreBtn = container.querySelector('#devShowcaseAppStore');
    if (appStoreBtn) {
      if (data.appStoreUrl) {
        appStoreBtn.href = data.appStoreUrl;
        appStoreBtn.style.display = 'inline-flex';
      } else {
        appStoreBtn.style.display = 'none';
      }
    }

    // Update features list
    if (featsEl) {
      featsEl.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    }

    // Update tabs active state
    appTabs.forEach(tab => {
      const isCur = tab.dataset.app === appKey;
      tab.classList.toggle('is-active', isCur);
      tab.setAttribute('aria-selected', String(isCur));
    });

    // Update Case Study button
    if (caseBtn) {
      caseBtn.dataset.projectId = data.id;
    }

    // Render screen
    updateScreen();
  }

  // Initial render
  renderApp('recovfit');

  // Tab click listeners
  appTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const appKey = tab.dataset.app;
      if (appKey && appKey !== currentApp) {
        sound.playClick(true);
        renderApp(appKey);
      }
    });
    tab.addEventListener('mouseenter', () => sound.playHover());
  });

  // Case study button listener
  if (caseBtn) {
    caseBtn.addEventListener('click', () => {
      const data = DEVICE_APPS[currentApp];
      if (data && data.id) {
        sound.playClick(true);
        openProjectModal(data.id);
      }
    });
  }

  // 3D gyroscopic tilt on phone
  if (phoneFrame && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let px = 0, py = 0, tx = 0, ty = 0;
    container.addEventListener('pointermove', (e) => {
      const r = container.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    }, { passive: true });

    container.addEventListener('pointerleave', () => {
      tx = 0;
      ty = 0;
    });

    const tiltLoop = () => {
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      const rotY = (px * 14).toFixed(2);
      const rotX = (-py * 12).toFixed(2);
      phoneFrame.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(10px)`;
      requestAnimationFrame(tiltLoop);
    };
    requestAnimationFrame(tiltLoop);
  }
}


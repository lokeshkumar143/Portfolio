/**
 * Apple-Style Interactive Device Showcase for iOS Applications
 */
import { sound } from '../lib/sound.js';
import { openProjectModal } from './projectModal.js';

export interface DeviceApp {
  id: string;
  name: string;
  category: string;
  tagline: string;
  tech: string;
  appStoreUrl?: string;
  appId?: string;
  description: string;
  features: string[];
  statusPill: string;
  accentColor: string;
  screenshots?: string[];
  screenHtml: string;
}

export const DEVICE_APPS: Record<string, DeviceApp> = {
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
      '/projects/recovfit/screen1.jpg',
      '/projects/recovfit/screen2.jpg',
      '/projects/recovfit/screen3.jpg',
      '/projects/recovfit/screen4.jpg',
      '/projects/recovfit/screen5.jpg'
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
      '/projects/smart_ulcer/screen1.jpg',
      '/projects/smart_ulcer/screen2.jpg',
      '/projects/smart_ulcer/screen3.jpg',
      '/projects/smart_ulcer/screen4.jpg',
      '/projects/smart_ulcer/ipad1.jpg'
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
};
;

export function initDeviceShowcase(): void {
  const container = document.getElementById('deviceShowcase');
  if (!container) return;

  const containerEl: HTMLElement = container;
  const phoneFrame = containerEl.querySelector('.dev-phone') as HTMLElement | null;
  const screenContainer = containerEl.querySelector('.dev-phone__screen') as HTMLElement | null;
  const dynamicIsland = containerEl.querySelector('.dev-phone__island-pill') as HTMLElement | null;
  const appTabs = document.querySelectorAll('.dev-tab') as NodeListOf<HTMLButtonElement>;
  const titleEl = containerEl.querySelector('.dev-details__title') as HTMLElement | null;
  const catEl = containerEl.querySelector('.dev-details__category') as HTMLElement | null;
  const descEl = containerEl.querySelector('.dev-details__desc') as HTMLElement | null;
  const techEl = containerEl.querySelector('.dev-details__tech') as HTMLElement | null;
  const featsEl = containerEl.querySelector('.dev-details__features') as HTMLElement | null;
  const caseBtn = containerEl.querySelector('.dev-details__caseBtn') as HTMLButtonElement | null;

  // Mode pill buttons outside the phone screen
  const modeBar = document.getElementById('devPhoneModeBar') as HTMLElement | null;
  const modePills = modeBar ? modeBar.querySelectorAll('.dev-mode-pill') as NodeListOf<HTMLButtonElement> : [];
  let viewMode = 'shots';

  let currentApp = 'recovfit';
  let shotIdx = 0;

  function updateScreen(): void {
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
        shotIdx = (shotIdx + 1) % data.screenshots!.length;
        sound.playHapticClick();
        updateScreen();
      });

      // Navigation chevrons
      screenContainer.querySelector('.ios-shots-prev')?.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        shotIdx = (shotIdx - 1 + data.screenshots!.length) % data.screenshots!.length;
        sound.playHapticClick();
        updateScreen();
      });

      screenContainer.querySelector('.ios-shots-next')?.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        shotIdx = (shotIdx + 1) % data.screenshots!.length;
        sound.playHapticClick();
        updateScreen();
      });

      // Dot click
      screenContainer.querySelectorAll('.ios-shots-dots i').forEach((dot, idx) => {
        (dot as HTMLElement).style.cursor = 'pointer';
        dot.addEventListener('click', (e: Event) => {
          e.stopPropagation();
          shotIdx = idx;
          sound.playHapticClick();
          updateScreen();
        });
      });
    } else {
      screenContainer.innerHTML = data.screenHtml;
      screenContainer.querySelectorAll('.ios-tab-bar span').forEach(tab => {
        tab.addEventListener('click', (e: Event) => {
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

  function renderApp(appKey: string): void {
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
    const appStoreBtn = containerEl.querySelector('#devShowcaseAppStore') as HTMLAnchorElement | null;
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
    container.addEventListener('pointermove', (e: PointerEvent) => {
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
      phoneFrame!.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(10px)`;
      requestAnimationFrame(tiltLoop);
    };
    requestAnimationFrame(tiltLoop);
  }

  // Live video background playback & reactive ambient lighting
  const section = document.getElementById('devices');
  const film = document.getElementById('deviceFilm') as HTMLVideoElement | null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (section && film) {
    new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          if (!reduced) film.play().catch(() => {});
        } else {
          film.pause();
        }
      }
    }, { threshold: 0.12 }).observe(section);

    section.addEventListener('pointermove', (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
      const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
      section.style.setProperty('--dev-glow-x', `${x}%`);
      section.style.setProperty('--dev-glow-y', `${y}%`);
    }, { passive: true });
  }
}
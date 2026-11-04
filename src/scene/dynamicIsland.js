// Apple Dynamic Island: Interactive Neural Engine & Spatial Mission Control
import { sound } from '../lib/sound.js';
import { toggleSpatialHUD } from './spatialHUD.js';

export function initDynamicIsland() {
  const island = document.getElementById('dynamicIsland');
  if (!island) return;

  const closeBtn = document.getElementById('diCloseBtn');
  const spatialBtn = island.querySelector('.js-toggle-spatial');
  const devBtn = island.querySelector('.js-goto-devices');
  const contactBtn = island.querySelector('.js-open-contact');
  const waveform = document.getElementById('diWaveform');

  let isExpanded = false;
  let statusInterval = null;

  const statuses = [
    { title: ' Apple Silicon · CoreML Active', badge: 'Swift 6.0' },
    { title: '● RecovFit · PoseNet 60 FPS', badge: 'Accelerate' },
    { title: '◈ Urosonic · Acoustic AI', badge: 'CoreAudio' },
    { title: '❖ Native iOS · ProMotion 120Hz', badge: 'SwiftUI' },
  ];
  let statusIdx = 0;

  function cycleStatus() {
    if (isExpanded) return;
    statusIdx = (statusIdx + 1) % statuses.length;
    const titleEl = island.querySelector('.di-title');
    const badgeEl = island.querySelector('.di-badge');
    if (titleEl && badgeEl) {
      titleEl.style.opacity = '0';
      badgeEl.style.opacity = '0';
      setTimeout(() => {
        titleEl.textContent = statuses[statusIdx].title;
        badgeEl.textContent = statuses[statusIdx].badge;
        titleEl.style.opacity = '1';
        badgeEl.style.opacity = '1';
      }, 250);
    }
  }

  statusInterval = setInterval(cycleStatus, 4500);

  function setExpanded(expanded) {
    if (isExpanded === expanded) return;
    isExpanded = expanded;
    island.classList.toggle('is-expanded', expanded);
    island.setAttribute('aria-expanded', String(expanded));

    if (expanded) {
      sound.playHapticClick();
    } else {
      sound.playClick(true);
    }
  }

  // Toggle on idle pill click
  const idleEl = island.querySelector('.di-idle');
  if (idleEl) {
    idleEl.addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(!isExpanded);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(false);
    });
  }

  if (spatialBtn) {
    spatialBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(false);
      toggleSpatialHUD(true);
    });
  }

  if (devBtn) {
    devBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(false);
      const devices = document.getElementById('devices');
      if (devices) devices.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(false);
      const modal = document.getElementById('devModal');
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
      }
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isExpanded && !island.contains(e.target)) {
      setExpanded(false);
    }
  });

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isExpanded) {
      setExpanded(false);
    }
  });

  // Animated procedural waveform equalizer bars in expanded island
  if (waveform) {
    const bars = waveform.querySelectorAll('i');
    let t = 0;
    function animateWaveform() {
      t += 0.08;
      const active = sound.isAudioActive();
      bars.forEach((bar, i) => {
        const speed = 1.2 + i * 0.4;
        const wave = Math.sin(t * speed + i * 0.8) * 0.5 + 0.5;
        const h = active ? 4 + wave * 14 : 3 + wave * 6;
        bar.style.height = `${h.toFixed(1)}px`;
      });
      requestAnimationFrame(animateWaveform);
    }
    requestAnimationFrame(animateWaveform);
  }
}


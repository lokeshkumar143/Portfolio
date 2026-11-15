/**
 * Apple Dynamic Island: Interactive Neural Engine & Spatial Mission Control
 */
import { sound } from '../lib/sound.js';
import { toggleSpatialHUD } from './spatialHUD.js';

export function initDynamicIsland(): void {
  const island = document.getElementById('dynamicIsland');
  if (!island) return;

  const islandEl: HTMLElement = island;
  const closeBtn = document.getElementById('diCloseBtn') as HTMLButtonElement | null;
  const spatialBtn = islandEl.querySelector('.js-toggle-spatial') as HTMLButtonElement | null;
  const devBtn = islandEl.querySelector('.js-goto-devices') as HTMLButtonElement | null;
  const contactBtn = islandEl.querySelector('.js-open-contact') as HTMLButtonElement | null;
  const waveform = document.getElementById('diWaveform') as HTMLElement | null;

  let isExpanded = false;
  let statusInterval: ReturnType<typeof setInterval> | null = null;

  const statuses = [
    { title: ' Apple Silicon · CoreML Active', badge: 'Swift 6.0' },
    { title: '● RecovFit · PoseNet 60 FPS', badge: 'Accelerate' },
    { title: '◈ Urosonic · Acoustic AI', badge: 'CoreAudio' },
    { title: '❖ Native iOS · ProMotion 120Hz', badge: 'SwiftUI' },
  ];
  let statusIdx = 0;

  function cycleStatus(): void {
    if (isExpanded) return;
    statusIdx = (statusIdx + 1) % statuses.length;
    const titleEl = islandEl.querySelector('.di-title') as HTMLElement | null;
    const badgeEl = islandEl.querySelector('.di-badge') as HTMLElement | null;
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

  function setExpanded(expanded: boolean): void {
    if (isExpanded === expanded) return;
    isExpanded = expanded;
    islandEl.classList.toggle('is-expanded', expanded);
    islandEl.setAttribute('aria-expanded', String(expanded));

    if (expanded) {
      sound.playHapticClick();
    } else {
      sound.playClick(true);
    }
  }

  // Toggle on idle pill click
  const idleEl = islandEl.querySelector('.di-idle') as HTMLElement | null;
  if (idleEl) {
    idleEl.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      setExpanded(!isExpanded);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      setExpanded(false);
    });
  }

  if (spatialBtn) {
    spatialBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      setExpanded(false);
      toggleSpatialHUD(true);
    });
  }

  if (devBtn) {
    devBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      setExpanded(false);
      const devices = document.getElementById('devices');
      if (devices) devices.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      setExpanded(false);
      const modal = document.getElementById('devModal') as HTMLDialogElement | null;
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
      }
    });
  }

  // Close on outside click
  document.addEventListener('click', (e: MouseEvent) => {
    if (isExpanded && !island.contains(e.target as Node)) {
      setExpanded(false);
    }
  });

  // Close on Escape
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isExpanded) {
      setExpanded(false);
    }
  });

  // Animated procedural waveform equalizer bars in expanded island
  if (waveform) {
    const bars = waveform.querySelectorAll('i') as NodeListOf<HTMLElement>;
    let t = 0;
    function animateWaveform(): void {
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
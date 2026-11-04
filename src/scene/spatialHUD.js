// Apple VisionOS Spatial Computing HUD Engine
// Displays floating holographic Swift 6 architecture and Apple Neural Engine telemetry.

import { sound } from '../lib/sound.js';

let isOpen = false;

export function initSpatialHUD() {
  const hud = document.getElementById('spatialHUD');
  if (!hud) return;

  const closeBtn = document.getElementById('spatialCloseBtn');
  const copyBtn = document.getElementById('spatialCopySwiftBtn');
  const reticle = document.getElementById('spatialReticle');
  const coordsEl = document.getElementById('spatialCoords');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleSpatialHUD(false));
  }

  // Live cursor reticle tracking inside the spatial viewport
  if (reticle && coordsEl) {
    window.addEventListener('pointermove', (e) => {
      if (!isOpen) return;
      const x = e.clientX;
      const y = e.clientY;
      reticle.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const nx = ((x / window.innerWidth) * 2 - 1).toFixed(3);
      const ny = ((1 - y / window.innerHeight) * 2 - 1).toFixed(3);
      coordsEl.textContent = `X:${nx} Y:${ny} · ANE:SYNC`;
    }, { passive: true });
  }

  // Copy Swift code snippet
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const codeBlock = document.getElementById('spatialSwiftCode');
      if (!codeBlock) return;
      try {
        await navigator.clipboard.writeText(codeBlock.innerText.trim());
        const originalText = copyBtn.querySelector('span')?.textContent;
        if (copyBtn.querySelector('span')) {
          copyBtn.querySelector('span').textContent = 'Copied to Clipboard!';
          sound.playChime();
          setTimeout(() => {
            copyBtn.querySelector('span').textContent = originalText || 'Copy Swift 6 Snippet';
          }, 2400);
        }
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    });
  }

  // Keyboard shortcut: Space or ⌘K toggles, Escape dismisses
  window.addEventListener('keydown', (e) => {
    // Avoid interfering with form inputs
    const inInput = e.target.closest('input, textarea, select');
    if (inInput) return;

    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      toggleSpatialHUD(false);
    } else if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === ' ' && !isOpen && window.scrollY < 200)) {
      e.preventDefault();
      toggleSpatialHUD(!isOpen);
    }
  });

  // Attach to any trigger buttons
  document.querySelectorAll('.js-open-spatial').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSpatialHUD(true);
    });
  });
}

export function toggleSpatialHUD(forceState = null) {
  const hud = document.getElementById('spatialHUD');
  if (!hud) return;

  isOpen = forceState !== null ? forceState : !isOpen;

  hud.classList.toggle('is-active', isOpen);
  document.documentElement.classList.toggle('is-spatial-mode', isOpen);

  if (isOpen) {
    sound.playSpatialBoot();
  } else {
    sound.playWhoosh();
  }
}


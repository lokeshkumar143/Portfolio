// Universal Interactive 3D Cursor Tilt & Specular Glare System
// Brings refined, tactile Apple-style 3D micro-physics to cards on direct hover.

import { sound } from '../lib/sound.js';

export function initUniversalTilt() {
  if (matchMedia('(pointer: coarse)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  initCardMicroTilt();
}

/**
 * Per-Card Interactive 3D Micro-Tilt & Specular Glare Tracking
 * Tracks pointer offset relative to each card's bounding box and applies physical 3D rotation
 */
function initCardMicroTilt() {
  const cardSelectors = [
    '.sk-card',
    '.gh-card',
    '.about-item',
    '.about-narrative__card',
    '.dev-details',
    '.dev-tab',
    '.uni-node',
    '.hero-btn',
    '.fin__devBadge',
    '.proj-card',
  ];

  const boundCards = new WeakSet();

  function bindCard(card) {
    if (boundCards.has(card)) return;
    boundCards.add(card);
    card.classList.add('has-3d-tilt');

    let isHovered = false;
    let targetRx = 0, targetRy = 0, targetTz = 0;
    let currentRx = 0, currentRy = 0, currentTz = 0;
    let glareX = 0, glareY = 0;
    let targetGlareOp = 0, currentGlareOp = 0;
    let rafId = null;

    const updatePhysics = () => {
      // Damped spring interpolation for smooth 60fps / 120Hz ProMotion feel
      const ease = 0.14;
      currentRx += (targetRx - currentRx) * ease;
      currentRy += (targetRy - currentRy) * ease;
      currentTz += (targetTz - currentTz) * ease;
      currentGlareOp += (targetGlareOp - currentGlareOp) * ease;

      card.style.setProperty('--rx', `${currentRx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${currentRy.toFixed(2)}deg`);
      card.style.setProperty('--tz', `${currentTz.toFixed(2)}px`);
      card.style.setProperty('--mx', `${glareX.toFixed(1)}px`);
      card.style.setProperty('--my', `${glareY.toFixed(1)}px`);
      card.style.setProperty('--glare-op', currentGlareOp.toFixed(3));

      const isResting =
        !isHovered &&
        Math.abs(currentRx) < 0.04 &&
        Math.abs(currentRy) < 0.04 &&
        Math.abs(currentTz) < 0.04 &&
        currentGlareOp < 0.01;

      if (!isResting) {
        rafId = requestAnimationFrame(updatePhysics);
      } else {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
        card.style.removeProperty('--tz');
        card.style.removeProperty('--glare-op');
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(updatePhysics);
    };

    card.addEventListener('pointerenter', (e) => {
      isHovered = true;
      targetTz = 12;
      targetGlareOp = 0.85;
      sound.playHover();
      startLoop();
    }, { passive: true });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glareX = x;
      glareY = y;

      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;

      // Restrained micro-tilt angles: 8deg yaw, 6deg pitch for elegance
      targetRy = nx * 8.0;
      targetRx = -ny * 6.0;
      targetTz = 14.0;

      startLoop();
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      isHovered = false;
      targetRx = 0;
      targetRy = 0;
      targetTz = 0;
      targetGlareOp = 0;
      startLoop();
    }, { passive: true });
  }

  function scanAndBind() {
    const cards = document.querySelectorAll(cardSelectors.join(', '));
    cards.forEach(bindCard);
  }

  scanAndBind();

  // Watch for dynamic elements (e.g. GitHub repos loaded asynchronously)
  const observer = new MutationObserver(() => {
    scanAndBind();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

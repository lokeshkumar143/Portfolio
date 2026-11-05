// Cinematic HUD: Fluid Magnetic Cursor & Chapter Progress Rail
import { damp } from '../lib/ease.js';
import { sound } from '../lib/sound.js';

export function initHUD() {
  initCursor();
  initChapterRail();
}

function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const text = document.getElementById('cursorText');
  if (!dot || !ring) return;

  document.body.classList.add('has-custom-cursor');

  let px = window.innerWidth / 2;
  let py = window.innerHeight / 2;
  let rx = px;
  let ry = py;
  let visible = false;
  let hoverLabel = '';

  window.addEventListener('pointermove', (e) => {
    px = e.clientX;
    py = e.clientY;
    if (!visible) {
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
    dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    visible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  // Hover detection
  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.g-card');
    const yr = e.target.closest('.yr');
    const node = e.target.closest('.uni-node');
    const sk = e.target.closest('.sk-card');
    const dev = e.target.closest('.dev-phone, .dev-tab');
    const gh = e.target.closest('.gh-card');
    const btn = e.target.closest('button, a, .fin__devBadge');

    if (card) {
      ring.classList.add('is-hover-card');
      hoverLabel = 'EXPLORE';
    } else if (yr) {
      ring.classList.add('is-hover-card');
      hoverLabel = 'JOURNEY';
    } else if (node) {
      ring.classList.add('is-hover-card');
      hoverLabel = 'SKILL';
    } else if (sk) {
      ring.classList.add('is-hover-card');
      hoverLabel = 'TECH';
    } else if (dev) {
      ring.classList.add('is-hover-card');
      hoverLabel = 'DEVICE';
    } else if (gh) {
      ring.classList.add('is-hover-card');
      hoverLabel = 'CODE';
    } else if (btn) {
      ring.classList.add('is-hover-btn');
      hoverLabel = '';
    } else {
      ring.classList.remove('is-hover-card', 'is-hover-btn');
      hoverLabel = '';
    }
    if (text) text.textContent = hoverLabel;
  });

  // RAF loop for smooth trailing ring
  let last = performance.now();
  function renderCursor(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;

    rx = damp(rx, px, 16.0, dt);
    ry = damp(ry, py, 16.0, dt);

    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

function initChapterRail() {
  const rail = document.getElementById('chapterRail');
  if (!rail) return;

  const items = rail.querySelectorAll('.chapter-item');
  const sections = [
    {
      id: 'stage',
      getRange: () => {
        const spacer = document.querySelector('.hero-spacer');
        const end = spacer ? spacer.offsetHeight : window.innerHeight;
        return [0, end];
      }
    },
    {
      id: 'about',
      getRange: () => {
        const a = document.getElementById('about');
        const u = document.getElementById('universe');
        const start = a ? a.offsetTop : (u ? u.offsetTop : window.innerHeight);
        const end = u ? (u.offsetTop + u.offsetHeight) : (a ? a.offsetTop + a.offsetHeight : window.innerHeight * 2);
        return [start, end];
      }
    },
    {
      id: 'skills',
      getRange: () => {
        const el = document.getElementById('skills');
        return el ? [el.offsetTop, el.offsetTop + el.offsetHeight] : null;
      }
    },
    {
      id: 'gallery',
      getRange: () => {
        const el = document.getElementById('gallery');
        return el ? [el.offsetTop, el.offsetTop + el.offsetHeight] : null;
      }
    },
    {
      id: 'devices',
      getRange: () => {
        const el = document.getElementById('devices');
        return el ? [el.offsetTop, el.offsetTop + el.offsetHeight] : null;
      }
    },
    {
      id: 'chrono',
      getRange: () => {
        const el = document.getElementById('chrono');
        return el ? [el.offsetTop, el.offsetTop + el.offsetHeight] : null;
      }
    },
    {
      id: 'github',
      getRange: () => {
        const el = document.getElementById('github');
        return el ? [el.offsetTop, el.offsetTop + el.offsetHeight] : null;
      }
    },
    {
      id: 'fin',
      getRange: () => {
        const el = document.getElementById('fin');
        return el ? [el.offsetTop, el.offsetTop + el.offsetHeight] : null;
      }
    },
  ];

  function update() {
    const scrollMid = window.scrollY + window.innerHeight * 0.45;
    let activeIdx = 0;

    sections.forEach((sec, idx) => {
      const range = sec.getRange();
      if (!range) return;
      if (scrollMid >= range[0] && scrollMid < range[1]) {
        activeIdx = idx;
      }
    });

    items.forEach((item, idx) => {
      item.classList.toggle('is-active', idx === activeIdx);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.dataset.target;
      sound.playWhoosh();
      if (targetId === 'stage') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId === 'about') {
        const el = document.getElementById('universe') || document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


// Scene two's lifecycle — the supplied film, presented.
//
// The section IS the reference video, played as delivered (video stream
// untouched; only the audio track was dropped and the moov atom moved up
// front for instant start). What this file adds is presentation: the film
// arrives from black when the section is reached, decodes only while it is
// actually on screen, and a veil breathes to black across the loop point so
// the 10-second wrap is never seen as a cut.
//
// The procedural WebGL version of this room (universe.js, ribbon.js,
// particles.js, shaders2.js) is parked, not deleted — swap this module's
// implementation back if the live, pointer-reactive variant is ever wanted.

import { sound } from '../lib/sound.js';

const SEAM = 0.45;   // seconds of veil on each side of the wrap

export async function initUniverse() {
  const section = document.getElementById('universe');
  const film = document.getElementById('uniFilm');
  const veil = document.getElementById('uniVeil');
  const constellation = document.getElementById('uniConstellation');
  if (!section || !film || !veil) return null;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = { visible: false, raf: 0, entered: false };

  const play = () => {
    film.play().catch(() => {
      // autoplay refused: arm a one-shot retry on the first real interaction
      const retry = () => { film.play().catch(() => {}); };
      window.addEventListener('pointerdown', retry, { once: true });
      window.addEventListener('scroll', retry, { once: true });
    });
  };

  // ---- the loop seam ------------------------------------------------------
  // rVFC only fires while frames are actually being decoded, so this costs
  // nothing when the section is off screen or the film is paused
  const watchSeam = () => {
    const tick = () => {
      if (!state.visible) return;
      const d = film.duration || 10;
      const t = film.currentTime;
      const toEnd = d - t;
      const dip = Math.min(1, Math.min(t, Math.max(toEnd, 0)) / SEAM);
      // fully dark only in the last/first breath of the wrap
      veil.style.opacity = state.entered ? String((1 - dip) * 0.92) : '1';
      state.raf = film.requestVideoFrameCallback
        ? film.requestVideoFrameCallback(tick)
        : requestAnimationFrame(tick);
    };
    state.raf = film.requestVideoFrameCallback
      ? film.requestVideoFrameCallback(tick)
      : requestAnimationFrame(tick);
  };

  new IntersectionObserver((entries) => {
    for (const e of entries) {
      state.visible = e.isIntersecting;
      if (e.isIntersecting) {
        if (!state.entered) {
          state.entered = true;
          section.classList.add('is-on');
          veil.style.opacity = '0';
        }
        if (reduced) {
          // honour the preference: hold the film as a still
          film.currentTime = Math.min(6.5, (film.duration || 10) * 0.6);
          film.pause();
          veil.style.opacity = '0';
        } else {
          play();
          watchSeam();
        }
      } else {
        film.pause();
      }
    }
  }, { threshold: 0.30 }).observe(section);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') film.pause();
    else if (state.visible && !reduced) play();
  });

  film.addEventListener('error', () => section.classList.add('is-fallback'),
    { once: true });

  // warm the film once the page is otherwise idle, so scrolling into the
  // section never waits on a 3 MB fetch
  window.addEventListener('load', () => {
    if (!state.entered && film.preload !== 'auto') {
      film.preload = 'auto';
      film.load();
    }
  }, { once: true });

  // 3D Constellation Gyroscopic Parallax & Sound Interaction
  if (constellation && !reduced) {
    const clusterL = constellation.querySelector('.uni-cluster--left');
    const clusterR = constellation.querySelector('.uni-cluster--right');
    const nodes = constellation.querySelectorAll('.uni-node');

    let cx = 0, cy = 0, tcx = 0, tcy = 0;
    section.addEventListener('pointermove', (e) => {
      const r = section.getBoundingClientRect();
      tcx = ((e.clientX - r.left) / r.width) * 2 - 1;
      tcy = ((e.clientY - r.top) / r.height) * 2 - 1;
    }, { passive: true });

    section.addEventListener('pointerleave', () => {
      tcx = 0;
      tcy = 0;
    });

    const tiltLoop = () => {
      if (state.visible) {
        cx += (tcx - cx) * 0.08;
        cy += (tcy - cy) * 0.08;
        const rotY = (cx * 12).toFixed(2);
        const rotX = (-cy * 8).toFixed(2);
        const transZ = (Math.abs(cx) * 15).toFixed(2);
        if (clusterL) {
          clusterL.style.transform = `translateY(-50%) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${transZ}px)`;
        }
        if (clusterR) {
          clusterR.style.transform = `translateY(-50%) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${transZ}px)`;
        }
      }
      requestAnimationFrame(tiltLoop);
    };
    requestAnimationFrame(tiltLoop);

    nodes.forEach((node) => {
      node.addEventListener('mouseenter', () => sound.playHover());
      node.addEventListener('click', () => {
        sound.playClick(true);
        node.style.transform = 'scale(1.12)';
        setTimeout(() => { node.style.transform = ''; }, 300);
      });
    });
  }

  return { film, section };
}

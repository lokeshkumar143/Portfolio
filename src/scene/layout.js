// Composition geometry for the 2-tier architectural wordmark.
//
// Proportions calibrated to maintain monumental, cinematic presence across
// any viewport size:
//   Block ink box: width ~88% of screen, cap height ~54% of viewport
//   Figure: commands the central stage, walking through both lines
//   Side chips & HUD: re-anchored to the dual-line proportions

import { TARGET_RATIO } from './type.js';

export const REF = {
  wordWidth: 0.88,     // fraction of viewport width
  capHeight: 0.54,     // fraction of viewport height for the 2-line block
  vCentre: 0.51,       // vertical centre of the block
  legend: { x: 0.8812, y: 0.2450, h: 0.0422 },
  artist: { x: 0.0150, y: 0.7250, h: 0.0367 },
  dotsBR: { x: 0.9844, y: 0.9500 },
  arrows: { left: 0.0181, right: 0.9750, top: 0.345, bottom: 0.625, count: 5 },
};

export function computeLayout(w, h) {
  const portrait = h / w > 1.05;
  const narrow = w < 760;

  // fit the word block by whichever axis binds first
  const byWidth = (REF.wordWidth * w) / TARGET_RATIO;
  const byHeight = h * REF.capHeight;
  let blockH = Math.min(byWidth, byHeight);

  if (portrait) blockH = Math.min(byWidth * 1.0, h * 0.44);

  const wordW = blockH * TARGET_RATIO;
  const cx = w * 0.5;
  const vCentre = portrait ? h * 0.48 : h * REF.vCentre;
  const capTop = vCentre - blockH * 0.5;
  const baseline = vCentre + blockH * 0.5;

  const word = {
    x: cx - wordW * 0.5,
    y: capTop,
    w: wordW,
    h: blockH,
    capH: blockH,
    baseline,
  };

  // Sized so he commands the stage in front of the 2-tier block:
  // Head rises above top line (LOKESH),
  // Chest is in front of LOKESH,
  // Torso & hips are in front of KUMAR S.,
  // Legs and shoes land on the runway above the action pills
  let heroH = Math.max(blockH * 1.16, h * 0.65);
  let feet = Math.min(baseline + blockH * 0.16, h * 0.87);

  if (portrait) {
    heroH = h * 0.58;
    feet = h * 0.885;
  }

  return {
    w,
    h,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    portrait,
    narrow,
    word,
    hero: { h: heroH, cx, feet },
    welcomeY: portrait ? (feet - heroH) - h * 0.075 : Math.max(76, capTop - h * 0.065),
    legend: {
      x: portrait ? w * 0.955 : w * 0.982,
      y: portrait ? capTop - h * 0.052 : h * REF.legend.y,
      h: portrait ? 20 : Math.max(18, h * REF.legend.h),
      alignRight: true,
    },
    artist: portrait
      ? { x: w * 0.045, y: baseline + h * 0.055, h: 19 }
      : {
        x: w * REF.artist.x, y: h * REF.artist.y,
        h: Math.max(16, h * REF.artist.h)
      },
    ember: { x: 0.5, y: vCentre / h },
  };
}

/**
 * Place a clip so the SUBJECT (not the video rectangle) lands where we want.
 * The tracks baked into the manifest give the subject's box per frame.
 */
export function fitSubject(track, frameAspect, opts) {
  const [x0, y0, x1, y1] = track;
  const subW = x1 - x0;
  const subH = y1 - y0;
  const subAspect = (subW * frameAspect) / subH;
  const subCX = (x0 + x1) * 0.5;

  const h = opts.height;
  const w = h * subAspect;
  const x = opts.cx - w * 0.5;
  const y = opts.feet - h;

  const frameH = h / subH;
  const frameW = frameH * frameAspect;
  const frameX = opts.cx - frameW * subCX;
  const frameY = opts.feet - frameH * y1;

  return {
    subject: { x, y, w, h },
    frame: { x: frameX, y: frameY, w: frameW, h: frameH },
  };
}

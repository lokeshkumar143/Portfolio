// Composition geometry for the 2-tier monolithic architectural wordmark.
//
// Proportions calibrated to maintain monumental, cinematic presence across
// any viewport size:
//   Block ink box: width ~82% of screen, cap height ~46% of viewport
//   Figure: commands the central stage, walking through both lines
//   Side chips & HUD: collision-free framing anchors
//   Welcome strip: generous breathing room above figure's head

import { TARGET_RATIO } from './type.js';

export const REF = {
  wordWidth: 0.82,     // fraction of viewport width (so letters don't touch chips)
  capHeight: 0.46,     // fraction of viewport height for the 2-line block
  vCentre: 0.525,      // vertical centre of the block
  legend: { x: 0.9820, y: 0.2450, h: 0.0380 },
  artist: { x: 0.0180, y: 0.7400, h: 0.0360 },
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

  if (portrait) blockH = Math.min(byWidth * 0.96, h * 0.32);

  const wordW = blockH * TARGET_RATIO;
  const cx = w * 0.5;
  const vCentre = portrait ? h * 0.46 : h * REF.vCentre;
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
  // Head rises gently above Line 1 with clear 80px+ clearance below the welcome strip
  // Chest and torso walk right through Line 1
  // Legs and trousers step in front of Line 2
  // Feet land cleanly on the dark runway above the action buttons
  let heroH = Math.min(blockH * 1.18, h * 0.54);
  let feet = Math.min(baseline + blockH * 0.12, h * 0.84);

  if (portrait) {
    heroH = h * 0.50;
    feet = h * 0.87;
  }

  // Welcome strip: comfortably placed in the upper band, maintaining 60px+ above his head
  const welcomeY = portrait
    ? Math.max(85, capTop - h * 0.08)
    : Math.min(125, Math.max(96, capTop - 80));

  return {
    w,
    h,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    portrait,
    narrow,
    word,
    hero: { h: heroH, cx, feet },
    welcomeY,
    legend: {
      x: portrait ? w * 0.955 : w * REF.legend.x,
      y: portrait ? capTop - 24 : Math.max(82, capTop - 20),
      h: portrait ? 18 : Math.max(16, h * REF.legend.h),
      alignRight: true,
    },
    artist: {
      x: portrait ? w * 0.045 : w * REF.artist.x,
      y: portrait ? baseline + 24 : Math.min(h * 0.82, baseline + 20),
      h: portrait ? 18 : Math.max(16, h * REF.artist.h),
      alignRight: false,
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

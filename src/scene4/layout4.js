// Scene four's measured geometry — every number read off the supplied
// reference (section 4 image.jpg, 1600x900), which is the source of truth.
// The card sprites and the environment plate are cut from that image by
// tools/extract_s4.py; this module records where each piece goes back.
//
// Coordinates are reference-frame pixels. fitCover() maps the frame onto the
// viewport the way the plate shader does (cover: fill, centre-anchored), so
// the DOM cards and the canvas can never drift apart.

export const FRAME = [1600, 900];

export const CARDS = [
  { id: 'p01_timeless', title: 'Smart Ulcer AI Predictor',
    box: [213, 72, 384, 273], depth: 0.45,
    tint: [0.28, 0.35, 0.42] },
  { id: 'p02_game', title: 'Patient Fitness Trainer iOS',
    box: [63, 251, 428, 269], depth: 0.25,
    tint: [0.25, 0.29, 0.32] },
  { id: 'p03_build', title: 'SwiftUI & UIKit Interfaces',
    box: [566, 41, 471, 288], depth: 0.6,
    tint: [0.42, 0.29, 0.25] },
  { id: 'p04_driven', title: 'Appium & Selenium QA Suite',
    box: [998, 95, 460, 377], depth: 0.45,
    tint: [0.32, 0.35, 0.28] },
  { id: 'p05_ideas', title: 'Doctor Consultation Booking',
    box: [394, 358, 232, 198], depth: 0.8,
    tint: [0.39, 0.30, 0.25] },
  { id: 'p06_sound', title: 'Vulnerability & Load Testing',
    box: [568, 364, 173, 203], depth: 0.9,
    tint: [0.34, 0.32, 0.35] },
  { id: 'p07_food', title: 'Medical Image Classification',
    box: [698, 366, 211, 204], depth: 1.0,
    tint: [0.34, 0.25, 0.22] },
  { id: 'p08_travel', title: 'CoreLocation & MapKit Engine',
    box: [844, 370, 195, 206], depth: 0.9,
    tint: [0.26, 0.32, 0.38] },
  { id: 'p09_space', title: 'Firebase Realtime & Auth',
    box: [988, 364, 231, 208], depth: 0.8,
    tint: [0.38, 0.30, 0.24] },
  { id: 'p10_play', title: 'Oracle AI Database & SQL',
    box: [1181, 251, 355, 242], depth: 0.3,
    tint: [0.42, 0.28, 0.26] },
  { id: 'p11_cleaner', title: 'SIMATS iOS Engineer Mentorship',
    box: [118, 467, 345, 243], depth: 0.1,
    tint: [0.29, 0.35, 0.30] },
  { id: 'p12_steps', title: 'App Store Production Release',
    box: [1139, 478, 325, 234], depth: 0.1,
    tint: [0.31, 0.32, 0.35] },
];

// the central figure: crop box in frame px (his lighting is baked in)
export const PERSON = { x: 718, y: 483, w: 160, h: 335 };

// the floor's lit ellipses (centre x, centre y, rx, ry) and the overhead ring,
// used by the live glints the canvas draws over the baked plate
export const FLOOR_OUT = [798, 735, 372, 80];
export const FLOOR_IN = [798, 741, 240, 57];
export const RING = [802, 34, 392, 148];

/** Cover-fit the reference frame onto a viewport. */
export function fitCover(w, h) {
  const s = Math.max(w / FRAME[0], h / FRAME[1]);
  return { s, ox: (w - FRAME[0] * s) / 2, oy: (h - FRAME[1] * s) / 2 };
}

// --------------------------------------------------------------------------
// Portrait is a recomposition, not a crop: cover-fitting a 16:9 amphitheatre
// to a phone leaves only the centre quarter on screen. The plate still cover-
// fits (floor, circle and haze survive centred), and a curated set of cards
// restacks into a column that keeps the reference hierarchy: hero screen up
// top, the small row over the figure, the two green closers at his feet.
// Entries: card index -> centre x/y (viewport fractions), width (vw fraction).
// --------------------------------------------------------------------------
export const PORTRAIT = new Map([
  [2, { cx: 0.50, cy: 0.235, w: 0.80 }],   // build
  [0, { cx: 0.235, cy: 0.385, w: 0.50 }],  // timeless
  [3, { cx: 0.77, cy: 0.39, w: 0.48 }],    // driven
  [6, { cx: 0.325, cy: 0.53, w: 0.29 }],   // food
  [7, { cx: 0.675, cy: 0.53, w: 0.29 }],   // travel
  [10, { cx: 0.20, cy: 0.815, w: 0.48 }],  // cleaner
  [11, { cx: 0.80, cy: 0.815, w: 0.48 }],  // steps
]);

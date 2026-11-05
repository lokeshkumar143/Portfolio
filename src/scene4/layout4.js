// Scene four's measured geometry — every number read off the supplied
// reference (section 4 image.jpg, 1600x900), which is the source of truth.
// The card sprites and the environment plate are cut from that image by
// tools/extract_s4.py; this module records where each piece goes back.
//
// Coordinates are reference-frame pixels. fitCover() maps the frame onto the
// viewport the way the plate shader does (cover: fill, centre-anchored), so
// the DOM cards and the canvas can never drift apart.

export const FRAME = [1600, 900];

// Active completed projects showcased in the 3D amphitheatre.
// Symmetrically flanking the central creator in the light.
export const CARDS = [
  {
    id: 'p01_timeless',
    name: 'RecovFit',
    badge: ' Live on App Store',
    isLive: true,
    title: 'RecovFit — Patient Recovery & Fitness ( Live on App Store)',
    box: [220, 90, 480, 320],
    depth: 0.5,
    tint: [0.38, 0.22, 0.25]
  },
  {
    id: 'p03_build',
    name: 'Smart Ulcer Predictor',
    badge: ' Live on App Store',
    isLive: true,
    title: 'Smart Ulcer Predictor — Deep Learning Wound AI ( Live on App Store)',
    box: [900, 90, 480, 320],
    depth: 0.5,
    tint: [0.42, 0.20, 0.26]
  }
];

// Full 12-card architecture configuration preserved for future completed releases.
export const ALL_PIPELINE_CARDS = [
  { id: 'p01_timeless', name: 'RecovFit', badge: ' Live on App Store', isLive: true,
    title: 'RecovFit — Patient Recovery & Fitness ( Live on App Store)',
    box: [220, 90, 480, 320], depth: 0.5, tint: [0.38, 0.22, 0.25] },
  { id: 'p03_build', name: 'Smart Ulcer Predictor', badge: ' Live on App Store', isLive: true,
    title: 'Smart Ulcer Predictor — Deep Learning Wound AI ( Live on App Store)',
    box: [900, 90, 480, 320], depth: 0.5, tint: [0.42, 0.20, 0.26] },
  { id: 'p02_game', name: 'Urosonic AI', badge: 'Acoustic Medical AI', isLive: false,
    title: 'Urosonic AI — Acoustic Uroflowmetry Diagnostics',
    box: [63, 251, 428, 269], depth: 0.25, tint: [0.249, 0.267, 0.295] },
  { id: 'p04_driven', name: 'Dental AI', badge: 'Biomedical Vision', isLive: false,
    title: 'Dental AI — Radiographic Structure Segmentation',
    box: [998, 95, 460, 377], depth: 0.45, tint: [0.322, 0.278, 0.261] },
  { id: 'p05_ideas', name: 'Gamified DSA', badge: 'Interactive Algorithms', isLive: false,
    title: 'Gamified DSA Learning Platform (Phoenix Mascot)',
    box: [394, 358, 232, 198], depth: 0.8, tint: [0.39, 0.303, 0.234] },
  { id: 'p06_sound', name: 'Firebase Sync', badge: 'Realtime & APNs', isLive: false,
    title: 'Firebase Realtime DB & APNs Cloud Sync',
    box: [568, 364, 173, 203], depth: 0.9, tint: [0.336, 0.324, 0.333] },
  { id: 'p07_food', name: 'Oracle SQL', badge: 'Certified Architecture', isLive: false,
    title: 'Oracle AI Database & SQL Architecture',
    box: [698, 366, 211, 204], depth: 1.0, tint: [0.336, 0.243, 0.217] },
  { id: 'p08_travel', name: 'Selenium QA', badge: 'Web Test Automation', isLive: false,
    title: 'Selenium Automated Web QA Matrix',
    box: [844, 370, 195, 206], depth: 0.9, tint: [0.26, 0.32, 0.366] },
  { id: 'p09_space', name: 'Appium QA', badge: 'Mobile Automation', isLive: false,
    title: 'Appium iOS & Android Mobile QA Automation',
    box: [988, 364, 231, 208], depth: 0.8, tint: [0.336, 0.283, 0.269] },
  { id: 'p10_play', name: 'Security Shield', badge: 'OWASP Pentesting', isLive: false,
    title: 'Backend Security Shield & Vulnerability Pentest',
    box: [1181, 251, 355, 242], depth: 0.3, tint: [0.448, 0.305, 0.235] },
  { id: 'p11_cleaner', name: 'Load Testing', badge: 'Performance & SRE', isLive: false,
    title: 'High-Concurrency Server Load Testing (1,000+ VU)',
    box: [118, 467, 345, 243], depth: 0.1, tint: [0.311, 0.339, 0.263] },
  { id: 'p12_steps', name: 'App Store Deploy', badge: 'Release Engineering', isLive: false,
    title: 'Production App Store Deployment & Signing',
    box: [1139, 478, 325, 234], depth: 0.1, tint: [0.31, 0.317, 0.302] },
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
  [0, { cx: 0.50, cy: 0.28, w: 0.88 }],   // RecovFit
  [1, { cx: 0.50, cy: 0.58, w: 0.88 }],   // Smart Ulcer Predictor
]);

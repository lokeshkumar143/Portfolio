/**
 * Easing functions and math utilities for cinematic animations.
 * All functions are pure, frame-rate independent where applicable.
 */

/** Clamp value between min and max. */
export const clamp = (v: number, a = 0, b = 1): number => (v < a ? a : v > b ? b : v);

/** Linear interpolation between a and b by factor t. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Normalised progress of `t` across [a,b]. */
export const span = (t: number, a: number, b: number): number => clamp((t - a) / (b - a));

/** Easing: ease-out cubic */
export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/** Easing: ease-in cubic */
export const easeInCubic = (t: number): number => t * t * t;

/** Easing: ease-in-out cubic */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** Strong deceleration - workhorse for elements settling into place. */
export const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/** Easing: ease-out quint */
export const easeOutQuint = (t: number): number => 1 - (1 - t) ** 5;

/** Overshoots then settles; used for the drop-in of WELCOME TO MY WORLD. */
export function easeOutBack(t: number, k = 1.42): number {
  const c = k + 1;
  return 1 + c * (t - 1) ** 3 + k * (t - 1) ** 2;
}

/** Damped spring, for elements that arrive with weight and bounce once. */
export function easeOutSpring(t: number, damp = 5.2, freq = 7.2): number {
  if (t >= 1) return 1;
  return 1 - Math.exp(-damp * t) * Math.cos(freq * t);
}

/** Smoothstep interpolation - cubic Hermite. */
export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Frame-rate independent approach toward a target. */
export const damp = (cur: number, target: number, lambda: number, dt: number): number =>
  lerp(cur, target, 1 - Math.exp(-lambda * dt));
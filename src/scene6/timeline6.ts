// The closing shot's beats, in seconds from the footer's first sight.
//
//   black -> the red furnace breathes in -> smoke -> the title card rises,
//   dissolves sharp -> the man appears in front, smoking -> the editorial
//   captions settle -> the functional footer row -> stillness, with a pulse.

const T = {
  glow: [0.25, 1.8] as [number, number],
  fog: [0.8, 2.35] as [number, number],
  word: [1.35, 2.75] as [number, number],
  man: [2.1, 3.15] as [number, number],
  caps: [2.8, 3.95] as [number, number],
  bar: [3.6, 4.55] as [number, number],
  live: 4.2,
};

export const T6 = T;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = ([a, b]: [number, number], t: number) => clamp01((t - a) / (b - a));
const ease = (v: number) => v * v * (3 - 2 * v);

export function sample6(t: number) {
  return {
    glow: ease(span(T.glow, t)),
    fog: ease(span(T.fog, t)),
    word: span(T.word, t),
    man: ease(span(T.man, t)),
    caps: span(T.caps, t),
    bar: span(T.bar, t),
    live: t >= T.live,
  };
}

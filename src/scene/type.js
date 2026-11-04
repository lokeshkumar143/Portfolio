// Renders LOKESH KUMAR S. into a two-line cinematic coverage texture and
// reports the ink rectangle of every individual letter.
//
// Why a texture and not DOM text: the figure walks directly in front of the
// letters with real-time shadow projection and rim bounce. Sharing one atlas
// means the clip mask and the visible letters are the exact same pixels, so
// they can never drift apart by even a subpixel.
//
// Anton font with heavy, condensed grotesque proportions gives the monolithic
// title card presence of Christopher Nolan / Apple cinematic launch visuals.

const LINES = ['LOKESH', 'KUMAR S.'];

// Combined aspect ratio for the two-tier monolithic block
export const TARGET_RATIO = 2.12;

function ctx2d(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c.getContext('2d', { willReadFrequently: false });
}

function metricsFor(ctx, ch) {
  const m = ctx.measureText(ch);
  return {
    advance: m.width,
    left: m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
    ascent: m.actualBoundingBoxAscent,
    descent: m.actualBoundingBoxDescent,
  };
}

/**
 * Builds the two-tier architectural wordmark (Line 1: LOKESH, Line 2: KUMAR S.)
 * @param {number} blockHeightPx desired total height of the 2-line block in device pixels
 * @param {number} maxTexture  gl.MAX_TEXTURE_SIZE
 */
  export function buildWord(blockHeightPx, maxTexture = 4096) {
    const probe = 400;
    let c = ctx2d(8, 8);
    c.font = `${probe}px Anton, "Arial Narrow", Impact, sans-serif`;
    c.textBaseline = 'alphabetic';

    // Solve font size for a single line's cap height inside the two-tier block
    const capAt = metricsFor(c, 'H').ascent || probe * 0.72;
    const lineGapRatio = 0.12;
    const capHPx = blockHeightPx / (2 + lineGapRatio);
    const lineGapPx = capHPx * lineGapRatio;
    let size = (capHPx / capAt) * probe;

    c.font = `${size}px Anton, "Arial Narrow", Impact, sans-serif`;
    const tracking = -0.012 * capHPx;

      // Measure both lines
      const linesMetrics = LINES.map((line) => {
        const per = [...line].map((ch) => metricsFor(c, ch));
        let pen = 0;
        let natL = Infinity;
        let natR = -Infinity;
        const walk = per.map((m, i) => {
          const at = pen;
          if (line[i] !== ' ') {
            natL = Math.min(natL, at - m.left);
            natR = Math.max(natR, at + m.right);
          }
          pen += m.advance + tracking;
          return { char: line[i], pen: at, m };
        });
        return {
          line,
          walk,
          inkL: natL,
          inkR: natR,
          inkW: Math.max(1, natR - natL),
          descent: Math.max(0, ...per.map((m) => m.descent)),
        };
      });

      // Scale lines with uniform Anton compression
      const naturalMaxW = Math.max(...linesMetrics.map((l) => l.inkW));
      const targetBlockW = TARGET_RATIO * blockHeightPx;
      const scaleX = targetBlockW / naturalMaxW;

      const pad = Math.ceil(capHPx * 0.08);
      const totalInkW = naturalMaxW * scaleX;
      const totalInkH = blockHeightPx;

      let W = Math.ceil(totalInkW) + pad * 2;
      let H = Math.ceil(totalInkH) + pad * 2;

      let fit = 1;
      if (W > maxTexture) fit = maxTexture / W;
      if (H * fit > maxTexture) fit = maxTexture / H;
      if (fit < 1) {
        size *= fit;
        W = Math.floor(W * fit);
        H = Math.floor(H * fit);
      }

      const g = ctx2d(W, H);
      g.font = `${size}px Anton, "Arial Narrow", Impact, sans-serif`;
      g.textBaseline = 'alphabetic';
      g.fillStyle = '#fff';

        const allLetters = [];

        linesMetrics.forEach((lm, lineIdx) => {
          const lineW = lm.inkW * scaleX;
          // Horizontally centre this line inside totalInkW
          const lineOffsetX = (totalInkW - lineW) * 0.5 - lm.inkL * scaleX;
          const lineBaselineY = lineIdx === 0 ? capHPx : capHPx + lineGapPx + capHPx;

          g.setTransform(
            scaleX * fit,
            0,
            0,
            fit,
            lineOffsetX * fit + pad,
            lineBaselineY * fit + pad
          );

          lm.walk.forEach((r) => {
            if (r.char !== ' ') {
              g.fillText(r.char, r.pen, 0);
            }
            const x0 = (lineOffsetX + (r.pen - r.m.left) * scaleX) * fit + pad;
            const x1 = (lineOffsetX + (r.pen + r.m.right) * scaleX) * fit + pad;
            const w = Math.max(0, x1 - x0);
            const ascent = (r.m.ascent || capHPx) * fit;
            const y = lineBaselineY * fit + pad - ascent;
            allLetters.push({
              char: r.char,
              x: r.char === ' ' ? 0 : x0,
              y: r.char === ' ' ? 0 : y,
              w: r.char === ' ' ? 0 : w,
              h: r.char === ' ' ? 0 : ascent,
              line: lineIdx,
            });
          });
        });

        g.setTransform(1, 0, 0, 1, 0, 0);

        return {
          canvas: g.canvas,
          width: W,
          height: H,
          pad,
          fit,
            ink: { x: pad, y: pad, w: totalInkW * fit, h: totalInkH * fit },
            letters: allLetters.map((l) => ({
              ...l,
              u0: l.x / W,
              v0: l.y / H,
              u1: (l.x + l.w) / W,
              v1: (l.y + l.h) / H,
            })),
          };
        }

        export async function fontsReady() {
          if (!document.fonts) return;
          try {
            await Promise.all([
              document.fonts.load('400 200px Anton'),
              document.fonts.load('700 40px Oswald'),
              document.fonts.load('400 40px Oswald'),
            ]);
            await document.fonts.ready;
          } catch { /* fall back to the stack in the font shorthand */ }
        }

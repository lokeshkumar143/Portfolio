/**
 * The compositor.
 *
 * Draw order, back to front:
 *   1  plate        mottled black, vignette, red ember behind the wordmark
 *   2  letters      seven quads sharing one glyph atlas
 *   3  shadow       his darkness falling ON the letters he stands in front of
 *   4  hero figure  the walking man - the only clip in the piece, nearest camera
 *   5  post         grain, vignette, pulse
 *
 * He is the main character, so he is the front-most element: where his body
 * crosses a letter, his body wins. The wordmark is the environment behind him.
 * The shadow between the two layers is what stops him reading as a cut-out
 * pasted on top - it is the only cue that says he is standing in that space.
 *
 * Everything is premultiplied, so a single blend mode covers the whole frame.
 */

import {
  createGL, createProgram, createUnitQuad, createTexture, uploadTexture, bindTexture, loadImage,
} from './renderer.js';
import {
  VERT, FRAG_BG, FRAG_LETTER, FRAG_FIGURE, FRAG_SHADOW, FRAG_POST,
} from './shaders.js';

const INK: [number, number, number] = [0.871, 0.106, 0.110]; // #DE1B1C

export interface LayoutData {
  w: number;
  h: number;
  dpr: number;
  hero: HeroLayout;
  word: WordLayout;
  ember: { x: number; y: number };
}

export interface HeroLayout {
  cx: number;
  feet: number;
  h: number;
}

export interface WordLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  ink: { x: number; y: number; w: number; h: number };
  letters: LetterInfo[];
}

export interface LetterInfo {
  char: string;
  x: number;
  y: number;
  w: number;
  h: number;
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

export interface WordData {
  letters: LetterInfo[];
  canvas: HTMLCanvasElement;
  ink: { x: number; y: number; w: number; h: number };
  capPx: number;
}

export interface StateFrame {
  ember: number;
  letters: LetterState[];
  grain: number;
  flash: number;
  hero: HeroState;
}

export interface LetterState {
  opacity: number;
  reveal: number;
  dy: number;
  soften: number;
  edge: number;
}

export interface HeroState {
  opacity: number;
  reveal: number;
  scale: number;
  dy: number;
  shadow: number;
}

/** Clip reference for the hero video. */
export interface HeroClip {
  ready: boolean;
  poll: () => boolean;
  box: () => number[];
  seamFade: () => number;
  w: number;
  h: number;
  el: HTMLVideoElement;
}

export interface Clips {
  hero: HeroClip;
}

export class Stage {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext | null;
  public readonly ok: boolean;
  public readonly maxTexture: number;

  private readonly quad!: WebGLVertexArrayObject;
  private readonly progs!: Record<string, ReturnType<typeof createProgram>>;
  private readonly tex!: Record<string, WebGLTexture>;

  public word: WordData | null = null;
  public layout: LayoutData | null = null;

  public parallax = { x: 0, y: 0 };
  public pointerScreen: [number, number] = [0.5, 0.5];
  public pointerActive = 0;
  public shockwave = 0;
  public shockwavePos: [number, number] = [0.5, 0.5];

  // Exposed for tuning distressing against reference art
  public wear = 0.44;
  public wearGain = 2.1;
  public wearScale = 5.6;

  private readonly res: [number, number] = [1, 1];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = createGL(canvas);
    this.ok = !!this.gl;
    if (!this.ok) {
      this.maxTexture = 4096;
      this.quad = {} as WebGLVertexArrayObject;
      this.progs = {} as Record<string, ReturnType<typeof createProgram>>;
      this.tex = {} as Record<string, WebGLTexture>;
      return;
    }

    const gl = this.gl!;
    this.quad = createUnitQuad(gl);
    this.progs = {
      bg: createProgram(gl, VERT, FRAG_BG, 'bg'),
      letter: createProgram(gl, VERT, FRAG_LETTER, 'letter'),
      figure: createProgram(gl, VERT, FRAG_FIGURE, 'figure'),
      shadow: createProgram(gl, VERT, FRAG_SHADOW, 'shadow'),
      post: createProgram(gl, VERT, FRAG_POST, 'post'),
    };
    this.tex = {
      glyph: createTexture(gl),
      grunge: createTexture(gl, { wrap: 'repeat' }),
      grain: createTexture(gl, { wrap: 'repeat' }),
      hero: createTexture(gl),
    };
    this.maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }

  async loadTextures({ grunge, grain }: { grunge: string; grain: string }): Promise<void> {
    const [a, b] = await Promise.all([loadImage(grunge), loadImage(grain)]);
    uploadTexture(this.gl!, this.tex.grunge, a);
    uploadTexture(this.gl!, this.tex.grain, b);
  }

  setWord(word: WordData): void {
    this.word = word;
    uploadTexture(this.gl!, this.tex.glyph, word.canvas);
  }

  resize(layout: LayoutData): void {
    this.layout = layout;
    const { w, h, dpr } = layout;
    const W = Math.round(w * dpr);
    const H = Math.round(h * dpr);
    if (this.canvas.width !== W || this.canvas.height !== H) {
      this.canvas.width = W;
      this.canvas.height = H;
    }
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.res[0] = W;
    this.res[1] = H;
    this.gl!.viewport(0, 0, W, H);
  }

  // ---------------------------------------------------------------- drawing

  private _quad(
    prog: ReturnType<typeof createProgram>,
    rect: [number, number, number, number],
    uv: [number, number, number, number] = [0, 0, 1, 1],
    skew: [number, number] = [0, 0]
  ): void {
    const gl = this.gl!;
    gl.uniform4f(prog.u.uRect, rect[0], rect[1], rect[2], rect[3]);
    gl.uniform2f(prog.u.uRes, this.res[0], this.res[1]);
    if (prog.u.uUV) gl.uniform4f(prog.u.uUV, uv[0], uv[1], uv[2], uv[3]);
    if (prog.u.uSkew) gl.uniform2f(prog.u.uSkew, skew[0], skew[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /** Letter destination rect in device pixels. */
  private letterRect(i: number): [number, number, number, number] {
    const layout = this.layout!;
    const W = this.word!;
    const s = (layout.word.w * layout.dpr) / W.ink.w;
    const L = W.letters[i];
    return [
      layout.word.x * layout.dpr + (L.x - W.ink.x) * s,
      layout.word.y * layout.dpr + (L.y - W.ink.y) * s,
      L.w * s,
      L.h * s,
    ];
  }

  render(state: StateFrame, time: number, clips: Clips): void {
    if (!this.ok || !this.word || !this.layout) return;
    const gl = this.gl!;
    const [W, H] = this.res;
    const dpr = this.layout.dpr;
    const aspect = W / H;
    gl.bindVertexArray(this.quad);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const px = this.parallax.x;
    const py = this.parallax.y;

    // ---- 1 plate --------------------------------------------------------
    {
      const p = this.progs.bg;
      gl.useProgram(p.p);
      gl.uniform1i(p.u.uGrain, bindTexture(gl, this.tex.grain, 0));
      gl.uniform1f(p.u.uTime, time);
      gl.uniform1f(p.u.uEmber, state.ember);
      gl.uniform1f(p.u.uAspect, aspect);
      gl.uniform2f(p.u.uEmberAt, this.layout.ember.x, this.layout.ember.y);
      if (p.u.uPointer) gl.uniform2f(p.u.uPointer, this.pointerScreen[0], this.pointerScreen[1]);
      if (p.u.uPointerActive) gl.uniform1f(p.u.uPointerActive, this.pointerActive);
      this._quad(p, [0, 0, W, H]);
    }

    // He is the nearest thing to camera, so under the pointer he travels
    // further than the wordmark behind him
    const heroSkew: [number, number] = [px * 30 * dpr, py * 18 * dpr];
    const geo = this._heroGeometry(clips.hero, state.hero);

    // ---- 2 letters ------------------------------------------------------
    {
      const p = this.progs.letter;
      gl.useProgram(p.p);
      gl.uniform1i(p.u.uGlyph, bindTexture(gl, this.tex.glyph, 0));
      gl.uniform1i(p.u.uGrunge, bindTexture(gl, this.tex.grunge, 1));
      gl.uniform3f(p.u.uInk, INK[0], INK[1], INK[2]);
      // Distressed surface sampled in SCREEN space so it reads as one
      // continuous worn sheet across all letters, not seven tiles
      gl.uniform2f(p.u.uGrungeScale, aspect * this.wearScale, this.wearScale);
      gl.uniform2f(p.u.uGrungeOffset, 0.12, 0.31);
      gl.uniform1f(p.u.uWear, this.wear);
      gl.uniform1f(p.u.uWearGain, this.wearGain);
      if (p.u.uPointer) gl.uniform2f(p.u.uPointer, this.pointerScreen[0], this.pointerScreen[1]);
      if (p.u.uPointerActive) gl.uniform1f(p.u.uPointerActive, this.pointerActive);
      if (p.u.uAspect) gl.uniform1f(p.u.uAspect, aspect);
      if (p.u.uShockwave) gl.uniform1f(p.u.uShockwave, this.shockwave);
      if (p.u.uShockwavePos) gl.uniform2f(p.u.uShockwavePos, this.shockwavePos[0], this.shockwavePos[1]);

      for (let i = 0; i < this.word.letters.length; i++) {
        const L = this.word.letters[i];
        const s = state.letters[i];
        if (!s || s.opacity <= 0.001 || L.char === ' ' || L.w <= 0.001 || L.h <= 0.001) continue;
        const r = this.letterRect(i);
        const lift = s.dy * r[3];
        gl.uniform1f(p.u.uOpacity, s.opacity);
        gl.uniform1f(p.u.uReveal, s.reveal);
        gl.uniform1f(p.u.uSoften, s.soften * 0.026 * (L.v1 - L.v0));
        gl.uniform1f(p.u.uEdgeLight, s.edge);
        this._quad(p, r, [L.u0, L.v0, L.u1 - L.u0, L.v1 - L.v0],
          [px * 14 * dpr, lift + py * 9 * dpr]);
      }
    }

    // ---- 3 + 4 the walking man, in front of the wordmark ----------------
    this._heroShadow(geo, state.hero, heroSkew);
    this._heroFigure(clips.hero, geo, state.hero, heroSkew);

    // ---- 5 post ---------------------------------------------------------
    {
      const p = this.progs.post;
      gl.useProgram(p.p);
      gl.uniform1i(p.u.uGrain, bindTexture(gl, this.tex.grain, 0));
      gl.uniform1f(p.u.uTime, time);
      gl.uniform1f(p.u.uAmount, state.grain);
      gl.uniform1f(p.u.uAspect, aspect);
      gl.uniform1f(p.u.uFlash, state.flash);
      this._quad(p, [0, 0, W, H]);
    }
    gl.bindVertexArray(null);
  }

  /**
   * Where the figure lands, in device pixels.
   * Anchored by the SUBJECT box from the baked track rather than by the video
   * rectangle, so his feet stay planted and his height stays constant even
   * though he grows through the shot as he walks toward the camera.
   */
  private _heroGeometry(clip: HeroClip, st: HeroState): { wantH: number; rect: [number, number, number, number] } | null {
    if (!clip || !clip.ready || st.opacity <= 0.001) return null;
    const dpr = this.layout!.dpr;
    const { hero } = this.layout!;
    const box = clip.box();
    const subH = Math.max(box[3] - box[1], 1e-3);
    const subCX = (box[0] + box[2]) * 0.5;

    const wantH = hero.h * dpr * st.scale;
    const quadH = wantH / subH;
    const quadW = quadH * (clip.w / clip.h);
    return {
      wantH,
      rect: [
        hero.cx * dpr - quadW * subCX,
        (hero.feet * dpr + st.dy * wantH) - quadH * box[3],
        quadW,
        quadH,
      ],
    };
  }

  /** His darkness, cast onto the wordmark he is standing in front of. */
  private _heroShadow(
    geo: { wantH: number; rect: [number, number, number, number] } | null,
    st: HeroState,
    skew: [number, number]
  ): void {
    if (!geo) return;
    const gl = this.gl!;
    const dpr = this.layout!.dpr;
    const { hero } = this.layout!;
    const p = this.progs.shadow;
    gl.useProgram(p.p);
    gl.uniform1f(p.u.uOpacity, 0.46 * st.shadow);
    gl.uniform2f(p.u.uFalloff, 0.30, 0.46);
    const sw = geo.wantH * 0.50;
    const sh = geo.wantH * 0.60;
    this._quad(p, [hero.cx * dpr - sw / 2 + skew[0] * 0.55,
      hero.feet * dpr - sh, sw, sh]);
  }

  private _heroFigure(
    clip: HeroClip,
    geo: { wantH: number; rect: [number, number, number, number] } | null,
    st: HeroState,
    skew: [number, number]
  ): void {
    if (!geo) return;
    const gl = this.gl!;
    if (clip.poll()) uploadTexture(gl, this.tex.hero, clip.el);

    const p = this.progs.figure;
    gl.useProgram(p.p);
    gl.uniform1i(p.u.uClip, bindTexture(gl, this.tex.hero, 0));
    gl.uniform1i(p.u.uGrunge, bindTexture(gl, this.tex.grunge, 1));
    gl.uniform1i(p.u.uMask, bindTexture(gl, this.tex.glyph, 2));
    gl.uniform1f(p.u.uUseMask, 0);
    gl.uniform4f(p.u.uMaskUV, 0, 0, 1, 1);
    gl.uniform2f(p.u.uTexel, 0.5 / (clip.w * 2), 0.5 / clip.h);
    gl.uniform1f(p.u.uOpacity, st.opacity * clip.seamFade());
    gl.uniform1f(p.u.uReveal, st.reveal);
    // His shoes dissolve into the dark instead of ending on a hard edge,
    // which also disposes of the floor highlight the key could not fully remove
    gl.uniform1f(p.u.uFeetFade, 0.085);
    gl.uniform1f(p.u.uTopFade, 0.012);
    gl.uniform1f(p.u.uExposure, 1.24);
    gl.uniform1f(p.u.uLift, 1.35);
    // Standing in front of a wall of red, the bounce onto his silhouette is
    // physically motivated - it is what ties him into the frame
    gl.uniform1f(p.u.uRimRed, 0.30);
    gl.uniform1f(p.u.uContrast, 1.13);
    gl.uniform1f(p.u.uDesat, 0.2);
    gl.uniform1f(p.u.uFloorY, 0.845);
    const { word, h } = this.layout!;
    gl.uniform2f(p.u.uBand, word.y / h, (word.y + word.h) / h);
    if (p.u.uPointer) gl.uniform2f(p.u.uPointer, this.pointerScreen[0], this.pointerScreen[1]);
    if (p.u.uPointerActive) gl.uniform1f(p.u.uPointerActive, this.pointerActive);
    if (p.u.uAspect) gl.uniform1f(p.u.uAspect, this.res[0] / this.res[1]);
    this._quad(p, geo.rect, [0, 0, 1, 1], skew);
  }
}
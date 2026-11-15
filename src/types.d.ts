// Global type declarations for modules without TypeScript definitions yet

// Scene 2-6 module declarations with proper types
declare module './scene2/boot2.js' {
  export interface UniverseInstance {
    film: HTMLVideoElement;
    section: HTMLElement;
  }
  export async function initUniverse(): Promise<UniverseInstance | null>;
}

declare module './scene3/boot3.js' {
  export interface ChronoInstance {
    chrono: any;
    section: HTMLElement;
    setTarget: (u: number) => void;
  }
  export async function initChrono(): Promise<ChronoInstance | null>;
}

declare module './scene4/boot4.js' {
  export interface GalleryInstance {
    gallery: any;
    section: HTMLElement;
  }
  export async function initGallery(): Promise<GalleryInstance | null>;
}

declare module './scene6/boot6.js' {
  export interface FinaleInstance {
    fin: any;
    section: HTMLElement;
  }
  export async function initFinale(): Promise<FinaleInstance | null>;
}

// Additional module declarations for type safety
declare module './scene/devcard.js' {
  export function initDevCard(): void;
}

declare module './scene/projectModal.js' {
  export interface ProjectDetail {
    tag: string;
    title: string;
    subtitle: string;
    appStoreUrl?: string;
    appId?: string;
    icon?: string;
    screenshots?: string[];
    desc: string;
    tech: string[];
    metrics: { label: string; val: string }[];
    problem?: string;
    features: string[];
    contrib?: string;
    github?: string;
  }
  export const PROJECT_DETAILS: Record<string, ProjectDetail>;
  export function openProjectModal(id: string): void;
  export function initProjectModal(): void;
}

declare module './scene/deviceShowcase.js' {
  export interface DeviceApp {
    id: string;
    name: string;
    category: string;
    tagline: string;
    tech: string;
    appStoreUrl?: string;
    appId?: string;
    description: string;
    features: string[];
    statusPill: string;
    accentColor: string;
    screenshots?: string[];
    screenHtml: string;
  }
  export const DEVICE_APPS: Record<string, DeviceApp>;
  export function initDeviceShowcase(): void;
}

declare module './scene/github.js' {
  export interface RepoData {
    name: string;
    html_url: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
  }
  export const CURATED_REPOS: RepoData[];
  export function initGitHub(): Promise<void>;
}

declare module './scene/particles.js' {
  export class ParticleSystem {
    constructor(canvas: HTMLCanvasElement);
    init(): void;
    resize(): void;
    addShockwave(x: number, y: number): void;
    start(): void;
    stop(): void;
  }
  export function initParticles(): ParticleSystem | null;
  export function getParticleSystem(): ParticleSystem | null;
}

declare module './scene/dynamicIsland.js' {
  export function initDynamicIsland(): void;
}

declare module './scene/spatialHUD.js' {
  export function initSpatialHUD(): void;
  export function toggleSpatialHUD(forceState?: boolean | null): void;
}

declare module './scene/tilt.js' {
  export function initUniversalTilt(): void;
}

declare module './scene/magicalReveal.js' {
  export function initMagicalReveal(): void;
}

declare module './scene/gameLoader.js' {
  export interface GameLoaderController {
    updateProgress: (fraction: number, message?: string) => void;
    setReady: () => void;
    bypass: () => void;
  }
  export function initGameLoader(opts?: { onComplete?: (data: { visitorName: string; skipped: boolean }) => void }): GameLoaderController;
}

declare module './scene/hud.js' {
  export function initHUD(): void;
}

declare module './scene/layout.js' {
  export interface LayoutResult {
    w: number;
    h: number;
    dpr: number;
    portrait: boolean;
    narrow: boolean;
    word: {
      x: number;
      y: number;
      w: number;
      h: number;
      capH: number;
      baseline: number;
      ink: { x: number; y: number; w: number; h: number };
      letters: any[];
    };
    hero: { h: number; cx: number; feet: number };
    welcomeY: number;
    legend: { x: number; y: number; h: number; alignRight: boolean };
    artist: { x: number; y: number; h: number; alignRight: boolean };
    ember: { x: number; y: number };
  }
  export function computeLayout(w: number, h: number): LayoutResult;
  export function fitSubject(track: number[], frameAspect: number, opts: { height: number; cx: number; feet: number }): { subject: any; frame: any };
  export const REF: any;
}

declare module './scene/type.js' {
  export const TARGET_RATIO: number;
  export interface WordData {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    pad: number;
    fit: number;
    ink: { x: number; y: number; w: number; h: number };
    letters: { char: string; x: number; y: number; w: number; h: number; line: number; u0: number; v0: number; u1: number; v1: number }[];
    capPx: number;
  }
  export function buildWord(blockHeightPx: number, maxTexture: number): WordData;
  export async function fontsReady(): Promise<void>;
}

declare module './scene/furniture.js' {
  export class Furniture {
    constructor(root?: Document);
    apply(L: any): void;
    portrait: boolean;
  }
}

declare module './scene/timeline.js' {
  export const T: {
    heroIn: number;
    heroInDur: number;
    letters: number;
    letterStagger: number;
    letterDur: number;
    ember: number;
    welcome: number;
    artist: number;
    legend: number;
    arrows: number;
    dots: number;
    header: number;
    settled: number;
  };
  export interface LetterInfo {
    char: string;
    x: number;
    y: number;
    w: number;
    h: number;
    line: number;
    u0: number;
    v0: number;
    u1: number;
    v1: number;
  }
  export interface LetterState {
    reveal: number;
    opacity: number;
    dy: number;
    soften: number;
    edge: number;
  }
  export interface HeroState {
    reveal: number;
    opacity: number;
    scale: number;
    dy: number;
    shadow: number;
  }
  export interface SampleResult {
    hero: HeroState;
    letters: LetterState[];
    ember: number;
    flash: number;
    grain: number;
    settled: boolean;
    progress: number;
  }
  export function letterOrder(letters: { u0: number; u1: number }[]): number[];
  export function sample(t: number, nLetters: number, order: number[]): SampleResult;
  export const CUES: [number, string][];
}

declare module './scene/devcard.js' {
  export function initDevCard(): void;
}

declare module './scene/projectModal.js' {
  export interface ProjectDetail {
    tag: string;
    title: string;
    subtitle: string;
    appStoreUrl?: string;
    appId?: string;
    icon?: string;
    screenshots?: string[];
    desc: string;
    tech: string[];
    metrics: { label: string; val: string }[];
    problem?: string;
    features: string[];
    contrib?: string;
    github?: string;
  }
  export const PROJECT_DETAILS: Record<string, ProjectDetail>;
  export function openProjectModal(id: string): void;
  export function initProjectModal(): void;
}

declare module './scene/deviceShowcase.js' {
  export interface DeviceApp {
    id: string;
    name: string;
    category: string;
    tagline: string;
    tech: string;
    appStoreUrl?: string;
    appId?: string;
    description: string;
    features: string[];
    statusPill: string;
    accentColor: string;
    screenshots?: string[];
    screenHtml: string;
  }
  export const DEVICE_APPS: Record<string, DeviceApp>;
  export function initDeviceShowcase(): void;
}

declare module './scene/github.js' {
  export interface RepoData {
    name: string;
    html_url: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
  }
  export const CURATED_REPOS: RepoData[];
  export function initGitHub(): Promise<void>;
}

declare module './scene/particles.js' {
  export class ParticleSystem {
    constructor(canvas: HTMLCanvasElement);
    init(): void;
    resize(): void;
    addShockwave(x: number, y: number): void;
    start(): void;
    stop(): void;
  }
  export function initParticles(): ParticleSystem | null;
  export function getParticleSystem(): ParticleSystem | null;
}

declare module './scene/dynamicIsland.js' {
  export function initDynamicIsland(): void;
}

declare module './scene/spatialHUD.js' {
  export function initSpatialHUD(): void;
  export function toggleSpatialHUD(forceState?: boolean | null): void;
}

declare module './scene/tilt.js' {
  export function initUniversalTilt(): void;
}

declare module './scene/magicalReveal.js' {
  export function initMagicalReveal(): void;
}

declare module './scene/gameLoader.js' {
  export interface GameLoaderController {
    updateProgress: (fraction: number, message?: string) => void;
    setReady: () => void;
    bypass: () => void;
  }
  export function initGameLoader(opts?: { onComplete?: (data: { visitorName: string; skipped: boolean }) => void }): GameLoaderController;
}

declare module './scene/hud.js' {
  export function initHUD(): void;
}

declare module './gl/renderer.js' {
  export interface GLProgram {
    p: WebGLProgram;
    u: Record<string, WebGLUniformLocation | null>;
  }
  export interface CreateGLOptions {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    premultipliedAlpha?: boolean;
    powerPreference?: WebGLPowerPreference;
    preserveDrawingBuffer?: boolean;
  }
  export function createGL(canvas: HTMLCanvasElement, opts?: CreateGLOptions): WebGL2RenderingContext | null;
  export function createProgram(gl: WebGL2RenderingContext, vert: string, frag: string, label?: string): GLProgram;
  export function createUnitQuad(gl: WebGL2RenderingContext): WebGLVertexArrayObject;
  export interface TextureOptions {
    wrap?: 'clamp' | 'repeat';
    filter?: 'linear' | 'nearest';
  }
  export function createTexture(gl: WebGL2RenderingContext, opts?: TextureOptions): WebGLTexture;
  export function uploadTexture(gl: WebGL2RenderingContext, tex: WebGLTexture, source: TexImageSource, flipY?: boolean): boolean;
  export function bindTexture(gl: WebGL2RenderingContext, tex: WebGLTexture, unit: number): number;
  export function loadImage(src: string): Promise<HTMLImageElement>;
}

declare module './gl/shaders.js' {
  export const VERT: string;
  export const FRAG_BG: string;
  export const FRAG_LETTER: string;
  export const FRAG_FIGURE: string;
  export const FRAG_SHADOW: string;
  export const FRAG_POST: string;
}

declare module './gl/stage.js' {
  export class Stage {
    constructor(canvas: HTMLCanvasElement);
    readonly canvas: HTMLCanvasElement;
    readonly gl: WebGL2RenderingContext | null;
    readonly ok: boolean;
    readonly maxTexture: number;
    parallax: { x: number; y: number };
    pointerScreen: [number, number];
    pointerActive: number;
    shockwave: number;
    shockwavePos: [number, number];
    wear: number;
    wearGain: number;
    wearScale: number;
    loadTextures(opts: { grunge: string; grain: string }): Promise<void>;
    setWord(word: any): void;
    resize(layout: any): void;
    render(state: any, time: number, clips: any): void;
  }
}

declare module './lib/clip.js' {
  export interface ClipSource {
    url: string;
    type: string;
  }
  export interface ClipOptions {
    src: ClipSource[];
    poster?: string;
    w: number;
    h: number;
    track?: number[][];
    loopFade?: number;
    loop?: boolean;
  }
  export class Clip {
    constructor(opts: ClipOptions);
    readonly w: number;
    readonly h: number;
    readonly track: number[][] | null;
    readonly loopFade: number;
    readonly loop: boolean;
    ready: boolean;
    needsUpload: boolean;
    ended: boolean;
    duration: number;
    readonly el: HTMLVideoElement;
    whenReady(timeoutMs?: number): Promise<this>;
    play(): Promise<boolean>;
    pause(): void;
    poll(): boolean;
    box(): number[];
    seamFade(): number;
  }
}

declare module './lib/sound.js' {
  export interface SoundEngine {
    init(): void;
    toggle(): boolean;
    playHover(): void;
    playClick(high?: boolean): void;
    playKeyBeep(): void;
    playWhoosh(): void;
    playTone(freq?: number, type?: OscillatorType, duration?: number, vol?: number): void;
    playChime(index?: number): void;
    playSpatialBoot(): void;
    playHapticClick(): void;
    playChimeAlt(): void;
    isAudioActive(): boolean;
    playMechanicalBoot(): void;
    playDiagnosticTick(freq?: number): void;
    playAccessGranted(): void;
    playBlastDoorsOpen(): void;
    playRockstarBass(): void;
    playRockstarShutter(): void;
    playSirenStrobe(): void;
    playKeyBeepAlt(): void;
  }
  export const sound: SoundEngine;
  export function initSoundUI(): void;
}

declare module './lib/ease.js' {
  export const clamp: (v: number, a?: number, b?: number) => number;
  export const lerp: (a: number, b: number, t: number) => number;
  export const span: (t: number, a: number, b: number) => number;
  export const easeOutCubic: (t: number) => number;
  export const easeInCubic: (t: number) => number;
  export const easeInOutCubic: (t: number) => number;
  export const easeOutExpo: (t: number) => number;
  export const easeOutQuint: (t: number) => number;
  export const easeOutBack: (t: number, k?: number) => number;
  export const easeOutSpring: (t: number, damp?: number, freq?: number) => number;
  export const smoothstep: (a: number, b: number, x: number) => number;
  export const damp: (cur: number, target: number, lambda: number, dt: number) => number;
}

declare module './lib/mat4.js' {
  export type Mat4 = Float32Array;
  export type Vec3 = [number, number, number];
  export type Vec2 = [number, number];
  export function identity(o?: Float32Array): Mat4;
  export function perspective(fovY: number, aspect: number, near: number, far: number, o?: Float32Array): Mat4;
  export function multiply(a: Mat4, b: Mat4, o?: Float32Array): Mat4;
  export function compose(pos: Vec3, rot: Vec3, scale: Vec2, o?: Float32Array): Mat4;
  export function projectPoint(mvp: Mat4, x: number, y: number, z: number): [number, number, number];
}
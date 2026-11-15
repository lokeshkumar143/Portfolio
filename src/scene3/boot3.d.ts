// TypeScript declarations for scene3/boot3.js
export interface ChronoInstance {
  chrono: any;
  section: HTMLElement;
  setTarget: (u: number) => void;
}

export async function initChrono(): Promise<ChronoInstance | null>;
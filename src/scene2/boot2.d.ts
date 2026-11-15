// TypeScript declarations for scene2/boot2.js
export interface UniverseInstance {
  film: HTMLVideoElement;
  section: HTMLElement;
}

export async function initUniverse(): Promise<UniverseInstance | null>;
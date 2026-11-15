// TypeScript declarations for scene4/boot4.js
export interface GalleryInstance {
  gallery: any;
  section: HTMLElement;
}

export async function initGallery(): Promise<GalleryInstance | null>;
// Video playback for the packed-alpha clips.
//
// Autoplay is handled gracefully with muted playsinline settings.
// When loop=false, the video plays its full walk sequence once and permanently
// settles and pauses on the final completed frame with full 100% opacity,
// maintaining the hero's grounded, confident presence on the stage runway.

export class Clip {
  constructor({ src, poster, w, h, track, loopFade = 0.55, loop = false }) {
    this.w = w;
    this.h = h;
    this.track = track || null;
    this.loopFade = loopFade;
    this.loop = !!loop;
    this.ready = false;
    this.needsUpload = false;
    this.ended = false;
    this._lastTime = -1;

    const v = document.createElement('video');
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.loop = this.loop;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.preload = 'auto';
    v.disablePictureInPicture = true;
    if (poster) v.poster = poster;

    for (const s of src) {
      const el = document.createElement('source');
      el.src = s.url;
      el.type = s.type;
      v.appendChild(el);
    }
    this.el = v;
    this.duration = 0;

    v.addEventListener('loadedmetadata', () => { this.duration = v.duration; });
    v.addEventListener('canplay', () => { this.ready = true; });
    v.addEventListener('loadeddata', () => { this.ready = true; });

    // Handle single-play completion: pause on the final frame without looping back
    const onEnd = () => {
      if (!this.loop) {
        this.ended = true;
        v.pause();
        if (this.duration > 0.05) {
          v.currentTime = Math.max(0, this.duration - 0.03);
        }
      }
    };

    v.addEventListener('ended', onEnd);
    v.addEventListener('timeupdate', () => {
      if (!this.loop && this.duration > 0.1 && v.currentTime >= this.duration - 0.04) {
        onEnd();
      }
    });

    v.load();
  }

  /** Resolves when there is enough data to start without stalling. */
  whenReady(timeoutMs = 1400) {
    if (this.el.readyState >= 2) {
      this.ready = true;
      return Promise.resolve(this);
    }
    return new Promise((res) => {
      let timer;
      const done = () => {
        clearTimeout(timer);
        cleanup();
        this.ready = true;
        res(this);
      };
      const cleanup = () => {
        this.el.removeEventListener('canplaythrough', done);
        this.el.removeEventListener('canplay', done);
        this.el.removeEventListener('loadeddata', done);
        this.el.removeEventListener('error', done);
      };
      timer = setTimeout(done, timeoutMs);
      this.el.addEventListener('canplaythrough', done, { once: true });
      this.el.addEventListener('canplay', done, { once: true });
      this.el.addEventListener('loadeddata', done, { once: true });
      this.el.addEventListener('error', done, { once: true });
    });
  }

  async play() {
    try {
      this.el.muted = true;
      this.el.defaultMuted = true;
      if (this.ended) return true;
      await this.el.play();
      return true;
    } catch {
      return false;
    }
  }

  pause() { this.el.pause(); }

  /** True when the decoder has produced a new frame since the last upload. */
  poll() {
    const t = this.el.currentTime;
    if (t !== this._lastTime && this.el.readyState >= 2) {
      this._lastTime = t;
      return true;
    }
    return false;
  }

  /** Subject box for the current frame, from the baked track. */
  box() {
    if (!this.track || !this.track.length) return [0.25, 0.05, 0.75, 0.98];
    const d = this.duration || 1;
    const i = Math.min(this.track.length - 1,
      Math.max(0, Math.floor((this.el.currentTime / d) * this.track.length)));
    return this.track[i];
  }

  /** 0..1 opacity that dips through the loop wrap so the cut is never seen. */
  seamFade() {
    if (!this.loop) {
      // Single-play mode: never fade out at the end, keep 100% full opacity on the completed frame
      return 1;
    }
    const d = this.duration;
    if (!d || !this.loopFade) return 1;
    const t = this.el.currentTime;
    const f = this.loopFade;
    if (t > d - f) return Math.max(0, (d - t) / f);
    if (t < f) return Math.min(1, t / f);
    return 1;
  }
}

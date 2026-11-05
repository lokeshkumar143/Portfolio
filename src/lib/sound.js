// Cinematic Ambient Audio Engine (Web Audio API Synthesizer)
// 100% procedurally synthesized — zero external audio assets required.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = true;
    this.droneGain = null;
    this.fxGain = null;
    this.lfo = null;
    this.oscillators = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master FX Gain
      this.fxGain = this.ctx.createGain();
      this.fxGain.gain.value = 0.18;
      this.fxGain.connect(this.ctx.destination);

      // Drone Gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0.0;
      this.droneGain.connect(this.ctx.destination);

      this.initialized = true;
    } catch (e) {
      console.warn('AudioContext unavailable:', e);
    }
  }

  startDrone() {
    if (!this.initialized || !this.ctx) return;
    if (this.oscillators.length > 0) return;

    const now = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);
    filter.Q.setValueAtTime(2.5, now);
    filter.connect(this.droneGain);

    // Deep sub-bass 55Hz (A1) + subtle overtone 82.4Hz (E2)
    const freqs = [55.0, 82.41, 110.0];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.12, now);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      this.oscillators.push(osc);
    });

    // Slow ambient breathing LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, now); // 8 second cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(35, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
    this.lfo = lfo;

    if (!this.muted) {
      this.droneGain.gain.setTargetAtTime(0.22, now, 1.8);
    }
  }

  toggle() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.muted = !this.muted;

    if (!this.muted) {
      this.startDrone();
      if (this.droneGain) {
        this.droneGain.gain.setTargetAtTime(0.24, this.ctx.currentTime, 1.5);
      }
      this.playClick(true);
    } else {
      if (this.droneGain) {
        this.droneGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.8);
      }
    }
    return !this.muted;
  }

  playHover() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(1180, now + 0.08);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  playClick(high = false) {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const f0 = high ? 740 : 160;
      const f1 = high ? 320 : 42;
      osc.frequency.setValueAtTime(f0, now);
      osc.frequency.exponentialRampToValueAtTime(f1, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // --------------------------------------------------------------
  // Key press beep – short synthetic click used for input fields
  // --------------------------------------------------------------
  playKeyBeep() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.fxGain);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  playWhoosh() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // White noise buffer for cinematic transition whoosh
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.25);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.fxGain);

      whiteNoise.start(now);
    } catch {}
  }

  playTone(freq = 440, type = 'sine', duration = 0.15, vol = 0.05) {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.fxGain);
      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  playChime(index = 0) {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.50, 1174.66, 1318.51, 1567.98, 1760.0];
      const freq = pentatonic[index % pentatonic.length];
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.008, now + 0.24);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      osc.connect(gain);
      gain.connect(this.fxGain);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  playSpatialBoot() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [130.81, 196.00, 261.63, 392.00, 523.25];
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 1.4);
      filter.Q.setValueAtTime(3.5, now);
      filter.connect(this.fxGain);

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        const startAt = now + idx * 0.06;
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.06, startAt + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.2);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(startAt);
        osc.stop(startAt + 1.25);
      });
    } catch {}
  }

  playHapticClick() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.fxGain);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  playChime() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [1760, 2640].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.04, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(this.fxGain);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.38);
      });
    } catch {}
  }

  isAudioActive() {
    return !this.muted && this.initialized && this.ctx && this.ctx.state === 'running';
  }

  playMechanicalBoot() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.6);
      filter.Q.setValueAtTime(4.0, now);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.6);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch {}
  }

  playDiagnosticTick(freq = 920) {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.035);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  playAccessGranted() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 783.99, 1174.66]; // D5, G5, D6 triumphant chord
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startAt = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startAt);

        gain.gain.setValueAtTime(0.001, startAt);
        gain.gain.linearRampToValueAtTime(0.07, startAt + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.55);

        osc.connect(gain);
        gain.connect(this.fxGain);

        osc.start(startAt);
        osc.stop(startAt + 0.6);
      });
    } catch {}
  }

  playBlastDoorsOpen() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.5);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.fxGain);

      whiteNoise.start(now);
    } catch {}
  }

  // --------------------------------------------------------------
  // Rockstar-style iconic deep cinematic bass drop & shutter
  // --------------------------------------------------------------
  playRockstarBass() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      sub.type = 'sine';

      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.9);

      sub.frequency.setValueAtTime(55, now);
      sub.frequency.exponentialRampToValueAtTime(26, now + 1.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 1.2);
      sub.stop(now + 1.2);
    } catch {}
  }

  playRockstarShutter() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.06);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  playKeyBeep() {
    if (this.muted || !this.initialized || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1420 + Math.random() * 120, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.fxGain);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }
}

export const sound = new SoundEngine();

export function initSoundUI() {
  const btn = document.getElementById('soundBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const active = sound.toggle();
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
    const label = btn.querySelector('.sound-btn__label');
    if (label) label.textContent = active ? 'Audio: On' : 'Audio: Off';
  });

  // Attach hover sounds to interactive elements
  const hoverables = document.querySelectorAll(
    'a, button, .g-card, .yr, .fin__devBadge, .sk-card, .uni-node'
  );
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => sound.playHover());
  });

  // Init on first interaction
  const warmUp = () => {
    sound.init();
    window.removeEventListener('pointerdown', warmUp);
    window.removeEventListener('keydown', warmUp);
  };
  window.addEventListener('pointerdown', warmUp, { once: true });
  window.addEventListener('keydown', warmUp, { once: true });
}


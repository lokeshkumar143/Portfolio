// High-performance Kinetic Cybernetic Ember & Spark Particle Stream
// Renders ambient rising embers, velocity-aware cursor sparks, and click shockwaves.

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.embers = [];
    this.sparks = [];
    this.rings = [];
    this.w = 1;
    this.h = 1;
    this.dpr = 1;
    this.running = false;
    this.lastPointer = { x: -999, y: -999, vx: 0, vy: 0 };
    this.maxEmbers = 36;
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Seed initial ambient embers
    for (let i = 0; i < this.maxEmbers; i++) {
      this.embers.push(this._createEmber(true));
    }

    this._bindPointer();
    this.start();
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  _createEmber(randomY = false) {
    return {
      x: Math.random() * this.w,
      y: randomY ? Math.random() * this.h : this.h + 10 + Math.random() * 20,
      size: 0.8 + Math.random() * 2.2,
      vy: -(0.35 + Math.random() * 0.75),
      vx: (Math.random() - 0.5) * 0.4,
      swayAmp: 1.2 + Math.random() * 2.5,
      swaySpeed: 0.8 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.15 + Math.random() * 0.45,
      color: Math.random() > 0.4 ? '255, 68, 48' : '255, 175, 75',
      life: 0,
      maxLife: 280 + Math.random() * 240,
    };
  }

  _bindPointer() {
    if (matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('pointermove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - this.lastPointer.x;
      const dy = y - this.lastPointer.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 6 && this.sparks.length < 80) {
        const count = Math.min(3, Math.floor(dist / 8));
        for (let i = 0; i < count; i++) {
          this.sparks.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            vx: (dx * 0.08 + (Math.random() - 0.5) * 1.8),
            vy: (dy * 0.08 - 0.5 - Math.random() * 1.2),
            size: 1.2 + Math.random() * 2.0,
            alpha: 0.85,
            decay: 0.024 + Math.random() * 0.028,
            color: Math.random() > 0.3 ? '255, 85, 55' : '255, 215, 120',
          });
        }
      }

      this.lastPointer = { x, y, vx: dx, vy: dy };
    }, { passive: true });
  }

  addShockwave(x, y) {
    this.rings.push({
      x,
      y,
      radius: 4,
      maxRadius: Math.min(this.w, this.h) * 0.42,
      speed: 12 + Math.random() * 4,
      alpha: 0.75,
      decay: 0.018,
    });

    // Burst of kinetic sparks on shockwave
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 4.5;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.95,
        decay: 0.018 + Math.random() * 0.025,
        color: i % 2 === 0 ? '255, 60, 40' : '255, 220, 110',
      });
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    let last = performance.now();

    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      this.ctx.clearRect(0, 0, this.w, this.h);

      // 1. Render ambient embers
      for (let i = this.embers.length - 1; i >= 0; i--) {
        const e = this.embers[i];
        e.life++;
        e.y += e.vy;
        e.x += e.vx + Math.sin(e.phase + e.life * 0.03 * e.swaySpeed) * (e.swayAmp * 0.15);

        const fade = Math.sin((e.life / e.maxLife) * Math.PI);
        const a = Math.max(0, e.alpha * fade);

        if (a > 0.01 && e.y > -20 && e.life < e.maxLife) {
          this.ctx.beginPath();
          this.ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${e.color}, ${a.toFixed(3)})`;
          this.ctx.shadowColor = `rgba(${e.color}, ${(a * 0.7).toFixed(3)})`;
          this.ctx.shadowBlur = 8;
          this.ctx.fill();
        } else {
          this.embers[i] = this._createEmber(false);
        }
      }

      // 2. Render cursor sparks
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.alpha -= s.decay;

        if (s.alpha > 0.02) {
          this.ctx.beginPath();
          this.ctx.arc(s.x, s.y, s.size * (s.alpha / 0.85), 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${s.color}, ${s.alpha.toFixed(3)})`;
          this.ctx.shadowColor = `rgba(${s.color}, ${(s.alpha * 0.8).toFixed(3)})`;
          this.ctx.shadowBlur = 6;
          this.ctx.fill();
        } else {
          this.sparks.splice(i, 1);
        }
      }

      // 3. Render shockwave rings
      for (let i = this.rings.length - 1; i >= 0; i--) {
        const r = this.rings[i];
        r.radius += r.speed;
        r.speed *= 0.96;
        r.alpha -= r.decay;

        if (r.alpha > 0.01 && r.radius < r.maxRadius) {
          this.ctx.beginPath();
          this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          this.ctx.strokeStyle = `rgba(255, 60, 40, ${r.alpha.toFixed(3)})`;
          this.ctx.lineWidth = Math.max(1, 2.5 * (1 - r.radius / r.maxRadius));
          this.ctx.shadowColor = `rgba(255, 100, 70, ${r.alpha.toFixed(3)})`;
          this.ctx.shadowBlur = 10;
          this.ctx.stroke();
        } else {
          this.rings.splice(i, 1);
        }
      }

      this.ctx.shadowBlur = 0;
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
  }
}

let instance = null;

export function initParticles() {
  const wrap = document.querySelector('.stage-wrap');
  if (!wrap) return null;

  let canvas = document.getElementById('stageParticles');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'stageParticles';
    canvas.className = 'stage-particles';
    canvas.setAttribute('aria-hidden', 'true');
    const stage = document.getElementById('stage');
    if (stage && stage.nextSibling) {
      wrap.insertBefore(canvas, stage.nextSibling);
    } else {
      wrap.appendChild(canvas);
    }
  }

  instance = new ParticleSystem(canvas);
  instance.init();

  // Trigger shockwave on pointerdown across the stage
  wrap.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    instance.addShockwave(e.clientX, e.clientY);
  });

  return instance;
}

export function getParticleSystem() {
  return instance;
}


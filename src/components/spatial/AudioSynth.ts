/**
 * AudioSynth — Zero-dependency Web Audio API SFX manager.
 * HSR-inspired sci-fi UI sounds (hover, click, confirm, deny).
 */

export class AudioSynth {
  private ctx: AudioContext | null = null;
  private _muted = true;

  get muted() {
    return this._muted;
  }

  toggle(): boolean {
    this._muted = !this._muted;
    return this._muted;
  }

  mute() {
    this._muted = true;
  }

  unmute() {
    this._muted = false;
  }

  private ensureCtx() {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  /** Short sine beep — for hover/rollover */
  hover() {
    if (this._muted) return;
    try {
      this.ensureCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 800 + Math.random() * 400;
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      /* silently ignore audio errors */
    }
  }

  /** Square-wave sweep — for nav click / section switch */
  click() {
    if (this._muted) return;
    try {
      this.ensureCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      /* silently ignore audio errors */
    }
  }

  /** Rising chime — for confirm / success */
  confirm() {
    if (this._muted) return;
    try {
      this.ensureCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;

      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        const t = now + i * 0.07;
        gain.gain.setValueAtTime(0.02, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
      });
    } catch {
      /* silently ignore audio errors */
    }
  }

  /** Descending buzz — for deny / error */
  deny() {
    if (this._muted) return;
    try {
      this.ensureCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      /* silently ignore audio errors */
    }
  }

  /** Cleanup */
  dispose() {
    this.ctx?.close();
    this.ctx = null;
  }
}

/** Singleton instance */
export const audioSynth = new AudioSynth();

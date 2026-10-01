/**
 * Web Audio API synthesized sound generator for safety alerts.
 * Uses browser-native oscillators to produce high-impact alert tones
 * without external audio dependencies.
 */

class AudioAlertSystem {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a distinct warning tone based on severity.
   */
  public playAlert(severity: 'low' | 'medium' | 'high' | 'critical') {
    if (this.isMuted) return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (severity === 'critical') {
        // High urgency pulsating siren tone (900Hz <-> 600Hz)
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          const startTime = now + i * 0.22;
          
          osc.frequency.setValueAtTime(880, startTime);
          osc.frequency.exponentialRampToValueAtTime(587.33, startTime + 0.18);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.35, startTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.2);
        }
      } else if (severity === 'high') {
        // Double alert chime (740Hz + 880Hz)
        [0, 0.16].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          const startTime = now + offset;
          const freq = idx === 0 ? 659.25 : 880;

          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.15);
        });
      } else {
        // Moderate notification ping (523Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn('Audio alert not allowed or audio context unavailable:', e);
    }
  }
}

export const audioAlertSystem = new AudioAlertSystem();

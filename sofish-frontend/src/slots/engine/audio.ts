/**
 * slots/engine/audio.ts
 * ---------------------------------------------------------------------------
 * SoundManager — 100% synthesized WebAudio SFX. Zero audio files.
 *
 * - Lazy AudioContext: created/resumed on the first user gesture (unlock()).
 * - Mute toggle persisted to localStorage 'sofish_sfx_muted'.
 * - Everything is oscillators + shaped noise buffers: spin loop, reel-stop
 *   clicks, tiered win jingles, scatter-tease riser, bonus fanfare and an
 *   ambient pad loop per musicMood.
 */

import type { SlotConfig, WinTier } from './types'

const MUTE_KEY = 'sofish_sfx_muted'

type Mood = SlotConfig['musicMood']

/** Root frequencies (Hz) for the ambient pad per mood. */
const MOOD_CHORDS: Record<Mood, number[]> = {
  chill: [110, 165, 220, 277.18], // A major-ish drift
  epic: [98, 146.83, 196, 246.94], // G heroic stack
  playful: [130.81, 196, 261.63, 329.63], // C bouncy
  dark: [82.41, 123.47, 155.56, 196] // E minor brood
}

class SoundManager {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private ambientStop: (() => void) | null = null
  private spinStop: (() => void) | null = null
  private _muted: boolean

  constructor() {
    this._muted = typeof localStorage !== 'undefined' && localStorage.getItem(MUTE_KEY) === '1'
  }

  get muted(): boolean {
    return this._muted
  }

  /** Call from any pointer/key handler. Safe to call repeatedly. */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    try {
      this.ctx = new AudioContext()
    } catch {
      return // Audio unavailable — stay silent.
    }
    this.master = this.ctx.createGain()
    this.master.gain.value = this._muted ? 0 : 0.5
    this.master.connect(this.ctx.destination)
    // 1s white-noise buffer reused by every noise-based effect.
    const len = this.ctx.sampleRate
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = this.noiseBuffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }

  setMuted(muted: boolean): void {
    this._muted = muted
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      /* private mode — ignore */
    }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.05)
    }
  }

  // ------------------------------------------------------------------ core

  private ready(): boolean {
    return !!this.ctx && !!this.master && this.ctx.state === 'running'
  }

  private out(): GainNode {
    return this.master as GainNode
  }

  private time(): number {
    return this.ctx ? this.ctx.currentTime : 0
  }

  /** One enveloped oscillator note. */
  private tone(
    freq: number,
    start: number,
    dur: number,
    opts?: { type?: OscillatorType; gain?: number; slideTo?: number }
  ): void {
    if (!this.ready()) return
    const ctx = this.ctx as AudioContext
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = opts?.type ?? 'sine'
    osc.frequency.setValueAtTime(freq, start)
    if (opts?.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, start + dur)
    const peak = opts?.gain ?? 0.2
    g.gain.setValueAtTime(0.0001, start)
    g.gain.exponentialRampToValueAtTime(peak, start + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    osc.connect(g)
    g.connect(this.out())
    osc.start(start)
    osc.stop(start + dur + 0.05)
  }

  /** Burst of filtered noise (clicks, whooshes, coin fizz). */
  private noise(
    start: number,
    dur: number,
    opts?: { gain?: number; freq?: number; q?: number; type?: BiquadFilterType }
  ): void {
    if (!this.ready() || !this.noiseBuffer) return
    const ctx = this.ctx as AudioContext
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = opts?.type ?? 'bandpass'
    filter.frequency.value = opts?.freq ?? 2000
    filter.Q.value = opts?.q ?? 1
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, start)
    g.gain.exponentialRampToValueAtTime(opts?.gain ?? 0.15, start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    src.connect(filter)
    filter.connect(g)
    g.connect(this.out())
    src.start(start)
    src.stop(start + dur + 0.05)
  }

  // ------------------------------------------------------------------- sfx

  /** UI click for buttons. */
  click(): void {
    this.tone(880, this.time(), 0.06, { type: 'triangle', gain: 0.12 })
  }

  betStep(): void {
    this.tone(660, this.time(), 0.05, { type: 'square', gain: 0.06 })
  }

  /** Looping spin whoosh. Returns a stop function (idempotent). */
  spinLoop(): () => void {
    this.stopSpinLoop()
    if (!this.ready() || !this.noiseBuffer) return () => undefined
    const ctx = this.ctx as AudioContext
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 500
    filter.Q.value = 0.8
    const g = ctx.createGain()
    g.gain.value = 0.0001
    g.gain.setTargetAtTime(0.12, ctx.currentTime, 0.15)
    // Slow LFO on the filter = "reels rushing" wobble.
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 9
    lfoGain.gain.value = 220
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    src.connect(filter)
    filter.connect(g)
    g.connect(this.out())
    src.start()
    lfo.start()
    let stopped = false
    const stop = () => {
      if (stopped) return
      stopped = true
      g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05)
      window.setTimeout(() => {
        try {
          src.stop()
          lfo.stop()
        } catch {
          /* already stopped */
        }
      }, 200)
      if (this.spinStop === stop) this.spinStop = null
    }
    this.spinStop = stop
    return stop
  }

  stopSpinLoop(): void {
    this.spinStop?.()
  }

  /** Mechanical reel-stop clack; pitch drops per reel index. */
  reelStop(reelIndex = 0): void {
    const t = this.time()
    this.noise(t, 0.08, { gain: 0.2, freq: Math.max(400, 1400 - reelIndex * 120), q: 2 })
    this.tone(Math.max(80, 180 - reelIndex * 12), t, 0.09, { type: 'triangle', gain: 0.16 })
  }

  /** Rising anticipation riser while scatters tease. Returns stop fn. */
  scatterRiser(): () => void {
    if (!this.ready()) return () => undefined
    const ctx = this.ctx as AudioContext
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 2.2)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.4)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5)
    osc.connect(g)
    g.connect(this.out())
    osc.start()
    osc.stop(ctx.currentTime + 2.6)
    let stopped = false
    return () => {
      if (stopped) return
      stopped = true
      try {
        g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03)
        osc.stop(ctx.currentTime + 0.15)
      } catch {
        /* already stopped */
      }
    }
  }

  scatterLand(): void {
    const t = this.time()
    this.tone(1174.66, t, 0.12, { type: 'triangle', gain: 0.18 })
    this.tone(1567.98, t + 0.06, 0.16, { type: 'triangle', gain: 0.14 })
  }

  /** Tiered win jingles — more notes & sparkle for higher tiers. */
  winJingle(tier: WinTier): void {
    const t = this.time()
    const base = [523.25, 659.25, 783.99] // C E G
    const extra: Record<WinTier, number[]> = {
      none: [],
      normal: [],
      big: [1046.5, 1318.5],
      mega: [1046.5, 1318.5, 1568, 2093],
      epic: [1046.5, 1318.5, 1568, 2093, 2637, 3136]
    }
    if (tier === 'none') return
    const notes = [...base, ...extra[tier]]
    notes.forEach((f, i) => {
      this.tone(f, t + i * 0.09, 0.28, { type: 'triangle', gain: 0.16 })
      this.tone(f * 2, t + i * 0.09, 0.18, { type: 'sine', gain: 0.05 })
    })
    if (tier === 'mega' || tier === 'epic') {
      this.noise(t, 1.2, { gain: 0.06, freq: 6000, q: 0.6, type: 'highpass' }) // coin fizz
    }
  }

  /** Coin-counting tick while the win counter rolls up. */
  coinTick(): void {
    this.tone(2093, this.time(), 0.04, { type: 'square', gain: 0.045 })
  }

  bonusFanfare(): void {
    const t = this.time()
    const seq = [392, 523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
    seq.forEach((f, i) => {
      this.tone(f, t + i * 0.12, 0.34, { type: 'sawtooth', gain: 0.1 })
      this.tone(f / 2, t + i * 0.12, 0.34, { type: 'triangle', gain: 0.12 })
    })
    this.noise(t + 0.7, 1.0, { gain: 0.08, freq: 5000, q: 0.5, type: 'highpass' })
  }

  gambleWin(): void {
    const t = this.time()
    this.tone(659.25, t, 0.15, { type: 'triangle', gain: 0.15 })
    this.tone(987.77, t + 0.12, 0.25, { type: 'triangle', gain: 0.15 })
  }

  gambleLose(): void {
    const t = this.time()
    this.tone(311.13, t, 0.25, { type: 'sawtooth', gain: 0.1, slideTo: 155.56 })
  }

  // --------------------------------------------------------------- ambient

  /** Start the ambient pad loop for a mood. Idempotent. */
  startAmbient(mood: Mood): void {
    if (!this.ready() || this.ambientStop) return
    const ctx = this.ctx as AudioContext
    const chord = MOOD_CHORDS[mood]
    const pad = ctx.createGain()
    pad.gain.value = 0.0001
    pad.gain.setTargetAtTime(0.05, ctx.currentTime, 1.2)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    pad.connect(filter)
    filter.connect(this.out())
    const oscs: OscillatorNode[] = []
    for (const f of chord) {
      for (const detune of [-4, 3]) {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = f
        osc.detune.value = detune
        osc.connect(pad)
        osc.start()
        oscs.push(osc)
      }
    }
    // Gentle breathing LFO on the pad.
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.12
    lfoGain.gain.value = 0.02
    lfo.connect(lfoGain)
    lfoGain.connect(pad.gain)
    lfo.start()
    oscs.push(lfo)
    this.ambientStop = () => {
      pad.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4)
      window.setTimeout(
        () =>
          oscs.forEach((o) => {
            try {
              o.stop()
            } catch {
              /* already stopped */
            }
          }),
        1200
      )
      this.ambientStop = null
    }
  }

  stopAmbient(): void {
    this.ambientStop?.()
  }
}

/** Singleton used by SlotMachine and games. */
export const soundManager = new SoundManager()

/**
 * slots/engine/SlotMachine.tsx
 * ---------------------------------------------------------------------------
 * The shared modern slot machine. Renders ANY SlotConfig (SPEC §3):
 *
 *  1. DOM+CSS-transform reels, 3-phase easing (accelerate → blur cruise →
 *     elastic decel), per-reel staggered stops, motion blur while fast.
 *  2. Scatter anticipation: reels after 2 landed scatters slow-spin ~2.5s
 *     with pulse glow + rising audio.
 *  3. Tiered celebrations (winTier): Big/Mega/Epic overlays, coin shower,
 *     counting-up win display, screen shake on Mega+.
 *  4. Free-spin mode: tinted backdrop, spins-remaining counter, retrigger,
 *     feature-win accumulator banner.
 *  5. ALL 10 bonus mechanics implemented for real (see playRound/settle):
 *     freespins, cascade, expanding-wilds, pick-me, multiplier-trail,
 *     sticky-wilds, respin, both-ways, gamble, jackpot.
 *  6. Controls: bet +/-, MAX BET, SPIN, AUTOPLAY (10/25/50/100 + stop on
 *     feature + loss limit), TURBO, spacebar = spin, disabled while busy.
 *  7. Paytable modal, mute toggle, session stats, last-5 ticker.
 *  8. Full-bleed themed layout, responsive to 360px, reduced-motion aware.
 *  9. SoundManager: fully synthesized SFX + ambient pad per musicMood.
 * 10. Balance: useUserBalance when authenticated, demo chip otherwise.
 *
 * Also exports SlotMachinePage: /slots/play/:gameId wrapper (SPEC §5).
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  Coins,
  Heart,
  Info,
  Minus,
  Plus,
  Spade,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react'
import type { SlotConfig, SpinOutcome, WinTier } from './types'
import { symbolMap } from './types'
import {
  MULTIPLIER_TRAIL,
  collectWinCells,
  collapseGrid,
  countScatters,
  evaluateGrid,
  scattersPerReel,
  trailMultiplier,
  winTier
} from './math'
import { createRng, shuffle, weightedPick } from './rng'
import type { Rng } from './rng'
import { createSpinAdapter, generateGrid } from './adapters'
import type { SpinAdapter } from './adapters'
import { soundManager } from './audio'
import { getGame } from './registry'
import { useUserBalance } from '../../hooks/useGames'
import '../slots.css'

// ------------------------------------------------------------------ helpers

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

const fmt = (n: number): string =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2 })

const BET_LADDER = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]

function stepBet(cur: number, dir: 1 | -1, min: number, max: number): number {
  const steps = BET_LADDER.filter((b) => b >= min && b <= max)
  const list = steps.length > 0 ? steps : [min]
  const i = list.findIndex((b) => b >= cur)
  if (i === -1) return dir === 1 ? list[list.length - 1] : list[Math.max(0, list.length - 2)]
  if (list[i] === cur) return list[Math.min(list.length - 1, Math.max(0, i + dir))]
  return dir === 1 ? list[i] : list[Math.max(0, i - 1)]
}

/** Types whose near-miss (trigger-1 scatters) awards a respin. */
const RESPIN_TYPES = new Set(['respin', 'both-ways', 'cascade'])

// ----------------------------------------------------------- sub-components

/** Counting-up number display (win amounts). */
function CountUp({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || value <= 0) {
      setDisplay(value)
      return
    }
    let raf = 0
    let lastTick = 0
    const start = performance.now()
    const stepFn = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (t - lastTick > 110) {
        lastTick = t
        soundManager.coinTick()
      }
      if (p < 1) raf = requestAnimationFrame(stepFn)
    }
    raf = requestAnimationFrame(stepFn)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, reduced])
  return <span>{fmt(display)}</span>
}

/** CSS coin-particle shower for Big/Mega/Epic celebrations. */
function CoinShower({ count, color }: { count: number; color: string }) {
  const coins = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        key: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        dur: 1.6 + Math.random() * 1.6,
        size: 9 + Math.random() * 15,
        drift: -60 + Math.random() * 120
      })),
    [count]
  )
  return (
    <div className="sf-coins" aria-hidden>
      {coins.map((c) => (
        <span
          key={c.key}
          className="sf-coin"
          style={
            {
              left: `${c.left}%`,
              width: c.size,
              height: c.size,
              background: color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.dur}s`,
              '--sf-drift': `${c.drift}px`
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

const TIER_LABEL: Record<string, string> = {
  big: 'BIG WIN',
  mega: 'MEGA WIN',
  epic: 'EPIC WIN'
}

/** Full-screen tiered win celebration overlay. */
function WinOverlay({
  tier,
  amount,
  accent,
  onClose
}: {
  tier: WinTier
  amount: number
  accent: string
  onClose: () => void
}) {
  const reduced = useReducedMotion()
  const coins = tier === 'epic' ? 44 : tier === 'mega' ? 30 : 18
  return (
    <motion.div
      className={`sf-overlay sf-overlay--${tier}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {!reduced && <CoinShower count={coins} color={accent} />}
      <motion.div
        className="sf-overlay-text"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        <div className="sf-overlay-title">{TIER_LABEL[tier] ?? 'WIN'}</div>
        <div className="sf-overlay-amount" style={{ color: accent }}>
          <CountUp value={amount} duration={tier === 'epic' ? 2000 : 1400} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Paytable / game-rules modal. */
function PaytableModal({ config, onClose }: { config: SlotConfig; onClose: () => void }) {
  const { meta } = config
  const counts = [3, 4, 5]
  return (
    <motion.div
      className="sf-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sf-modal"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sf-modal-head">
          <h2>{meta.title} — Paytable</h2>
          <button className="sf-icon-btn" onClick={onClose} aria-label="Close paytable">
            <X size={18} />
          </button>
        </div>
        <div className="sf-badges">
          <span className="sf-badge">RTP {meta.rtp}%</span>
          <span className="sf-badge">{meta.volatility.toUpperCase()} VOLATILITY</span>
          <span className="sf-badge">{meta.paylines === 0 ? '243 WAYS' : `${meta.paylines} LINES`}</span>
        </div>
        <div className="sf-paytable-grid">
          {config.symbols.map((s) => (
            <div key={s.id} className="sf-paytable-row">
              <div className="sf-paytable-icon">{s.render(40)}</div>
              <div className="sf-paytable-name">
                {s.name}
                {s.kind === 'wild' && <em> — substitutes all but scatter</em>}
                {s.kind === 'scatter' && <em> — pays anywhere</em>}
              </div>
              <div className="sf-paytable-pays">
                {counts.map((c) => (
                  <span key={c}>
                    ×{c}: <b>{s.pays?.[c] ?? '—'}</b>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="sf-bonus-rules">
          <h3>
            <Trophy size={16} /> {meta.bonus.label}
          </h3>
          <p>{meta.bonus.description}</p>
          <p className="sf-dim">
            {meta.bonus.triggerScatters ?? 3}+ scatters trigger
            {meta.bonus.awardSpins ? ` · awards ${meta.bonus.awardSpins} free spins` : ''}. Pays are
            multipliers of total bet.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Pick-me bonus: 6 chests, 3 picks, each reveals a bet multiplier. */
function PickMeOverlay({
  config,
  bet,
  onComplete
}: {
  config: SlotConfig
  bet: number
  onComplete: (amount: number) => void
}) {
  interface PickItem {
    mult: number
    revealed: boolean
  }
  const [items, setItems] = useState<PickItem[]>(() =>
    shuffle(
      [0.5, 1, 2, 3, 5, 10].map((mult) => ({ mult, revealed: false })),
      createRng()
    )
  )
  const [picksLeft, setPicksLeft] = useState(3)
  const [total, setTotal] = useState(0)
  const doneRef = useRef(false)

  const pick = (i: number) => {
    if (picksLeft <= 0 || items[i].revealed || doneRef.current) return
    soundManager.winJingle('normal')
    const next = items.map((it, idx) => (idx === i ? { ...it, revealed: true } : it))
    const newTotal = total + items[i].mult * bet
    setItems(next)
    setTotal(newTotal)
    const left = picksLeft - 1
    setPicksLeft(left)
    if (left === 0) {
      doneRef.current = true
      window.setTimeout(() => onComplete(newTotal), 1300)
    }
  }

  return (
    <motion.div
      className="sf-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sf-modal sf-pickme">
        <h2>{config.meta.bonus.label}</h2>
        <p className="sf-dim">{config.meta.bonus.description}</p>
        <p>
          Picks left: <b>{picksLeft}</b> · Won: <b>{fmt(total)}</b>
        </p>
        <div className="sf-pick-grid">
          {items.map((it, i) => (
            <button
              key={i}
              className={`sf-pick-item${it.revealed ? ' sf-pick-item--open' : ''}`}
              onClick={() => pick(i)}
              disabled={it.revealed || picksLeft <= 0}
            >
              {it.revealed ? <b>×{it.mult}</b> : <span>?</span>}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/** Gamble double-or-nothing (red/black) overlay. */
function GambleOverlay({
  stake,
  onDone
}: {
  stake: number
  onDone: (delta: number) => void
}) {
  const [current, setCurrent] = useState(stake)
  const [round, setRound] = useState(0)
  const [busy, setBusy] = useState(false)
  const [revealed, setRevealed] = useState<'red' | 'black' | null>(null)
  const rngRef = useRef<Rng | null>(null)
  if (!rngRef.current) rngRef.current = createRng()
  const rng = rngRef.current

  const guess = (color: 'red' | 'black') => {
    if (busy) return
    setBusy(true)
    setRevealed(null)
    const result: 'red' | 'black' = rng() < 0.5 ? 'red' : 'black'
    window.setTimeout(() => {
      setRevealed(result)
      if (result === color) {
        soundManager.gambleWin()
        const nv = current * 2
        setCurrent(nv)
        const nr = round + 1
        setRound(nr)
        setBusy(false)
        if (nr >= 5) window.setTimeout(() => onDone(nv - stake), 900) // cap 5 rounds
      } else {
        soundManager.gambleLose()
        window.setTimeout(() => onDone(-stake), 1000)
      }
    }, 650)
  }

  return (
    <motion.div
      className="sf-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sf-modal sf-gamble">
        <h2>Gamble — Double or Nothing</h2>
        <div className={`sf-gamble-card${revealed ? ` sf-gamble-card--${revealed}` : ''}`}>
          {revealed === 'red' && <Heart size={44} fill="currentColor" />}
          {revealed === 'black' && <Spade size={44} fill="currentColor" />}
          {!revealed && <span>?</span>}
        </div>
        <p>
          Stake: <b>{fmt(current)}</b> · Round {round + 1}/5
        </p>
        <div className="sf-gamble-actions">
          <button className="sf-btn sf-btn--red" onClick={() => guess('red')} disabled={busy}>
            <Heart size={16} /> RED
          </button>
          <button className="sf-btn sf-btn--black" onClick={() => guess('black')} disabled={busy}>
            <Spade size={16} /> BLACK
          </button>
          <button className="sf-btn" onClick={() => onDone(current - stake)} disabled={busy}>
            COLLECT {fmt(current)}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const JACKPOT_TIERS = [
  { key: 'MINI', mult: 20, w: 70 },
  { key: 'MAJOR', mult: 100, w: 25 },
  { key: 'GRAND', mult: 500, w: 5 }
] as const

/** Jackpot tease → fixed-tier award overlay. */
function JackpotOverlay({
  config,
  bet,
  onComplete
}: {
  config: SlotConfig
  bet: number
  onComplete: (amount: number, tier: string) => void
}) {
  const result = useMemo(() => weightedPick(JACKPOT_TIERS, (t) => t.w, createRng()), [])
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => {
      setRevealed(true)
      soundManager.bonusFanfare()
    }, 2400)
    return () => window.clearTimeout(t)
  }, [])
  useEffect(() => {
    if (!revealed) return
    const t = window.setTimeout(() => onComplete(result.mult * bet, result.key), 2000)
    return () => window.clearTimeout(t)
  }, [revealed, bet, onComplete, result])
  return (
    <motion.div
      className="sf-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="sf-modal sf-jackpot">
        <h2>
          <Trophy size={20} /> {config.meta.bonus.label}
        </h2>
        <div className="sf-jackpot-tiers">
          {JACKPOT_TIERS.map((t) => (
            <div
              key={t.key}
              className={`sf-jackpot-tier${revealed && t.key === result.key ? ' sf-jackpot-tier--hit' : ''}${!revealed ? ' sf-jackpot-tier--tease' : ''}`}
            >
              <b>{t.key}</b>
              <span>×{t.mult}</span>
            </div>
          ))}
        </div>
        {revealed ? (
          <p className="sf-jackpot-result">
            {result.key} JACKPOT — {fmt(result.mult * bet)}!
          </p>
        ) : (
          <p className="sf-dim">The temple wheels are turning…</p>
        )}
      </div>
    </motion.div>
  )
}

/** Multiplier-trail indicator. */
function TrailBar({ step }: { step: number }) {
  return (
    <div className="sf-trail">
      {MULTIPLIER_TRAIL.map((m, i) => (
        <span key={m} className={`sf-trail-step${i <= step && step > 0 ? ' sf-trail-step--on' : ''}`}>
          ×{m}
        </span>
      ))}
    </div>
  )
}

// --------------------------------------------------------------- interfaces

interface SpinJob {
  strips: string[][]
  targets: string[][]
  durations: number[]
  anticipateFrom: number
}

interface FsState {
  remaining: number
  totalWin: number
  spinIndex: number
}

interface AutoplayState {
  remaining: number
  stopOnFeature: boolean
  lossLimit: number | null
  startBalance: number
}

interface RoundOpts {
  freeSpin?: boolean
  overrides?: Record<string, string>
  isRespin?: boolean
}

// ------------------------------------------------------------ main machine

export function SlotMachine({ config }: { config: SlotConfig }) {
  const { meta } = config
  const symbols = useMemo(() => symbolMap(config), [config])
  const reels = meta.reels
  const rows = meta.rows
  const bonusType = meta.bonus.type
  const reducedMotion = useReducedMotion() ?? false

  // ------------------------------------------------------------ rng & refs
  const rngRef = useRef<Rng | null>(null)
  if (!rngRef.current) rngRef.current = createRng()
  const rng = rngRef.current

  const mountedRef = useRef(false)
  const busyRef = useRef(false)
  const adapterRef = useRef<SpinAdapter | null>(null)
  const betRef = useRef(meta.minBet)
  const turboRef = useRef(false)
  const reducedRef = useRef(reducedMotion)
  const balanceRef = useRef(0)
  const cellHRef = useRef(88)
  const stripRefs = useRef<(HTMLDivElement | null)[]>([])
  const windowRef = useRef<HTMLDivElement | null>(null)
  const timersRef = useRef<number[]>([])
  const riserStopRef = useRef<(() => void) | null>(null)
  const autoplayRef = useRef<AutoplayState | null>(null)
  const fsRef = useRef<FsState | null>(null)
  const stickyRef = useRef<string[]>([])
  const trailRef = useRef(0)
  const featureRef = useRef(false)
  const pendingRespinRef = useRef<Record<string, string> | null>(null)
  const pendingFsRef = useRef<number | null>(null)
  const overlayBlocksRef = useRef(false)
  const playRoundRef = useRef<(opts?: RoundOpts) => Promise<void>>(async () => undefined)

  // ----------------------------------------------------------------- state
  const [strips, setStrips] = useState<string[][]>(() => generateGrid(config, rng))
  const [spinJob, setSpinJob] = useState<SpinJob | null>(null)
  const [stoppedCount, setStoppedCount] = useState(0)
  const [anticipateFrom, setAnticipateFrom] = useState(reels)
  const [cellH, setCellH] = useState(88)
  const [phase, setPhase] = useState<'idle' | 'spinning'>('idle')
  const [bet, setBet] = useState(meta.minBet)
  const [balance, setBalance] = useState<number | null>(null)
  const [mode, setMode] = useState<'server' | 'local'>('local')
  const [lastWin, setLastWin] = useState(0)
  const [winCells, setWinCells] = useState<Set<string>>(new Set())
  const [popCells, setPopCells] = useState<Set<string>>(new Set())
  const [overlay, setOverlay] = useState<{ tier: WinTier; amount: number } | null>(null)
  const [fs, setFs] = useState<FsState | null>(null)
  const [featureBanner, setFeatureBanner] = useState<number | null>(null)
  const [trailStep, setTrailStep] = useState(0)
  const [stickyWilds, setStickyWilds] = useState<string[]>([])
  const [turbo, setTurbo] = useState(false)
  const [muted, setMuted] = useState(soundManager.muted)
  const [showPaytable, setShowPaytable] = useState(false)
  const [showAutoplayMenu, setShowAutoplayMenu] = useState(false)
  const [autoplay, setAutoplay] = useState<AutoplayState | null>(null)
  const [pickMeOpen, setPickMeOpen] = useState(false)
  const [jackpotOpen, setJackpotOpen] = useState(false)
  const [gambleState, setGambleState] = useState<{ stake: number } | null>(null)
  const [gambleAvailable, setGambleAvailable] = useState(0)
  const [stats, setStats] = useState({ wagered: 0, won: 0, biggest: 0 })
  const [ticker, setTicker] = useState<number[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // authenticated balance (SPEC §3 item 10)
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()
  const refetchBalanceRef = useRef(refetchBalance)
  useEffect(() => {
    refetchBalanceRef.current = refetchBalance
  }, [refetchBalance])

  // keep hot refs in sync
  useEffect(() => {
    betRef.current = bet
  }, [bet])
  useEffect(() => {
    turboRef.current = turbo
  }, [turbo])
  useEffect(() => {
    reducedRef.current = reducedMotion
  }, [reducedMotion])

  // ------------------------------------------------------------ lifecycle
  useEffect(() => {
    mountedRef.current = true
    const adapter = createSpinAdapter(config)
    adapterRef.current = adapter
    setMode(adapter.mode)
    adapter
      .getBalance()
      .then((b) => {
        if (!mountedRef.current) return
        setBalance(b)
        balanceRef.current = b
      })
      .catch(() => undefined)
    const unlock = () => {
      soundManager.unlock()
      soundManager.startAmbient(config.musicMood)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    const timers = timersRef.current
    return () => {
      mountedRef.current = false
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      timers.forEach((t) => window.clearTimeout(t))
      soundManager.stopSpinLoop()
      soundManager.stopAmbient()
      riserStopRef.current?.()
    }
  }, [config])

  // responsive cell height = window height / rows
  useEffect(() => {
    const el = windowRef.current
    if (!el) return
    const update = () => {
      const h = Math.max(40, el.clientHeight / rows)
      cellHRef.current = h
      setCellH(h)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [rows])

  // ----------------------------------------------------- reel animation
  useLayoutEffect(() => {
    if (!spinJob) {
      // idle: strips are exactly the landed grid at offset 0
      stripRefs.current.forEach((el) => {
        if (!el) return
        el.style.transition = 'none'
        el.style.transform = 'translateY(0px)'
      })
      return
    }
    // 3-phase easing via a single GPU-composited transform transition:
    // cubic-bezier(0.23,0.64,0.16,1) = accelerate → constant cruise (blur
    // class applied while spinning) → elastic-style soft decelerate.
    const timers: number[] = []
    spinJob.strips.forEach((strip, r) => {
      const el = stripRefs.current[r]
      if (!el) return
      el.style.transition = 'none'
      el.style.transform = 'translateY(0px)'
      void el.offsetHeight // force reflow so the reset applies first
      el.style.transition = `transform ${spinJob.durations[r]}ms cubic-bezier(0.23, 0.64, 0.16, 1)`
      el.style.transform = `translateY(${-(strip.length - rows) * cellHRef.current}px)`
    })
    spinJob.durations.forEach((dur, r) => {
      timers.push(
        window.setTimeout(() => {
          soundManager.reelStop(r)
          if (spinJob.targets[r].some((id) => symbols.get(id)?.kind === 'scatter')) {
            soundManager.scatterLand()
          }
          // riser starts when the last pre-anticipation reel lands…
          if (r === spinJob.anticipateFrom - 1 && spinJob.anticipateFrom < reels) {
            riserStopRef.current = soundManager.scatterRiser()
          }
          // …and stops when the first teased reel lands.
          if (r === spinJob.anticipateFrom && riserStopRef.current) {
            riserStopRef.current()
            riserStopRef.current = null
          }
          setStoppedCount(r + 1)
        }, dur)
      )
    })
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      if (riserStopRef.current) {
        riserStopRef.current()
        riserStopRef.current = null
      }
    }
  }, [spinJob, reels, rows, symbols])

  // ------------------------------------------------------------- helpers
  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((x) => x !== t)
      if (mountedRef.current) fn()
    }, ms)
    timersRef.current.push(t)
  }, [])

  const flashNotice = useCallback(
    (text: string, ms = 1800) => {
      setNotice(text)
      schedule(() => setNotice(null), ms)
    },
    [schedule]
  )

  const stopAutoplay = useCallback(() => {
    autoplayRef.current = null
    setAutoplay(null)
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }, [])

  const creditFeature = useCallback(async (amount: number): Promise<void> => {
    const adapter = adapterRef.current
    if (!adapter || amount === 0) return
    const b = await adapter.credit(amount)
    if (!mountedRef.current) return
    setBalance(b)
    balanceRef.current = b
    setStats((s) => ({ ...s, won: s.won + Math.max(0, amount), biggest: Math.max(s.biggest, amount) }))
  }, [])

  // -------------------------------------------------- continuation logic
  const continueAfterFeature = useCallback(() => {
    const ap = autoplayRef.current
    if (!ap || busyRef.current) return
    if (ap.remaining <= 0) {
      stopAutoplay()
      return
    }
    if (ap.stopOnFeature && featureRef.current) {
      stopAutoplay()
      return
    }
    if (ap.lossLimit != null && ap.startBalance - balanceRef.current >= ap.lossLimit) {
      stopAutoplay()
      return
    }
    schedule(() => void playRoundRef.current({}), turboRef.current ? 250 : 650)
  }, [schedule, stopAutoplay])

  const continueFlow = useCallback(() => {
    // free spins running?
    if (fsRef.current) {
      if (fsRef.current.remaining > 0) {
        schedule(() => void playRoundRef.current({ freeSpin: true }), turboRef.current ? 400 : 900)
        return
      }
      // feature just ended → accumulator banner
      const total = fsRef.current.totalWin
      fsRef.current = null
      setFs(null)
      stickyRef.current = []
      setStickyWilds([])
      trailRef.current = 0
      setTrailStep(0)
      setFeatureBanner(total)
      schedule(() => {
        setFeatureBanner(null)
        continueAfterFeature()
      }, reducedRef.current ? 900 : 2400)
      return
    }
    continueAfterFeature()
  }, [schedule, continueAfterFeature])

  const afterRound = useCallback(() => {
    // a near-miss respin queued by settle()
    if (pendingRespinRef.current) {
      const hold = pendingRespinRef.current
      pendingRespinRef.current = null
      schedule(() => void playRoundRef.current({ freeSpin: true, overrides: hold, isRespin: true }), 550)
      return
    }
    // free spins queued by settle()
    if (pendingFsRef.current != null) {
      const n = pendingFsRef.current
      pendingFsRef.current = null
      fsRef.current = { remaining: n, totalWin: 0, spinIndex: 0 }
      setFs(fsRef.current)
      stickyRef.current = []
      setStickyWilds([])
      flashNotice(`${n} FREE SPINS!`, 2200)
      schedule(() => void playRoundRef.current({ freeSpin: true }), 1300)
      return
    }
    // a blocking overlay (pick-me / jackpot / gamble) resumes us later
    if (overlayBlocksRef.current) return
    continueFlow()
  }, [schedule, flashNotice, continueFlow])

  // --------------------------------------------------------- settle spin
  const settle = useCallback(
    async (
      outcome: SpinOutcome,
      betNow: number,
      isFreeSpin: boolean,
      isRespin: boolean,
      adapter: SpinAdapter
    ) => {
      let spinWin = outcome.totalWin
      let displayGrid = outcome.grid

      // --- sticky wilds: wilds landing during FS persist for the feature
      if (isFreeSpin && bonusType === 'sticky-wilds') {
        const wildId = config.symbols.find((s) => s.kind === 'wild')?.id
        if (wildId) {
          const next = new Set(stickyRef.current)
          outcome.grid.forEach((reel, r) =>
            reel.forEach((id, row) => {
              if (id === wildId) next.add(`${r},${row}`)
            })
          )
          stickyRef.current = [...next]
          setStickyWilds(stickyRef.current)
        }
      }

      // --- multiplier trail: consecutive wins (or FS spin index) climb it
      if (bonusType === 'multiplier-trail') {
        const step = fsRef.current ? fsRef.current.spinIndex : trailRef.current
        const mult = trailMultiplier(step)
        if (spinWin > 0 && mult > 1) {
          const boosted = spinWin * mult
          await creditFeature(boosted - spinWin)
          spinWin = boosted
        }
        trailRef.current = fsRef.current ? step : spinWin > 0 ? step + 1 : 0
        setTrailStep(trailRef.current)
      }

      // --- cascade: pop winning cells, drop new symbols, chain while wins
      if (bonusType === 'cascade') {
        let chainTotal = outcome.totalWin
        let current = outcome.grid
        for (let guard = 0; guard < 12; guard++) {
          const ev = evaluateGrid(current, config, betNow)
          if (ev.totalWin <= 0) break
          const cells = collectWinCells(current, config, ev.winLines)
          if (cells.size === 0) break
          setWinCells(cells)
          setPopCells(cells)
          soundManager.click()
          await sleep(turboRef.current ? 260 : 480)
          if (!mountedRef.current) return
          current = collapseGrid(current, cells, (_r, needed) =>
            Array.from({ length: needed }, () => weightedPick(config.symbols, (s) => s.weight, rng).id)
          )
          setPopCells(new Set())
          setWinCells(new Set())
          setStrips(current)
          if (guard > 0) chainTotal += ev.totalWin
          await sleep(turboRef.current ? 160 : 320)
          if (!mountedRef.current) return
        }
        if (adapter.mode === 'local' && chainTotal > outcome.totalWin) {
          await creditFeature(chainTotal - outcome.totalWin)
          spinWin = chainTotal
        }
        displayGrid = current
      }

      // --- bookkeeping
      setLastWin(spinWin)
      setStats((s) => ({
        wagered: s.wagered + (isFreeSpin ? 0 : betNow),
        won: s.won + spinWin,
        biggest: Math.max(s.biggest, spinWin)
      }))
      setTicker((t) => [spinWin, ...t].slice(0, 5))
      if (fsRef.current) {
        fsRef.current = { ...fsRef.current, totalWin: fsRef.current.totalWin + spinWin }
        setFs(fsRef.current)
      }

      // --- win presentation (tiered celebrations)
      const tier = winTier(spinWin, betNow)
      if (tier !== 'none') {
        soundManager.winJingle(tier)
        if (bonusType !== 'cascade') {
          setWinCells(collectWinCells(displayGrid, config, outcome.winLines))
        }
        if (tier === 'big' || tier === 'mega' || tier === 'epic') {
          setOverlay({ tier, amount: spinWin })
          await sleep(reducedRef.current ? 900 : turboRef.current ? 1400 : 2600)
          if (!mountedRef.current) return
          setOverlay(null)
        } else {
          await sleep(turboRef.current ? 300 : 800)
          if (!mountedRef.current) return
        }
      }

      // --- gamble offer (type 'gamble')
      if (bonusType === 'gamble' && spinWin > 0 && !isFreeSpin) {
        setGambleAvailable(spinWin)
      }

      // --- bonus triggers
      const triggerN = config.meta.bonus.triggerScatters ?? 3
      const scatCount = countScatters(outcome.grid, symbols)

      if (outcome.bonusTriggered) {
        featureRef.current = true
        if (outcome.freeSpinsAwarded) {
          soundManager.bonusFanfare()
          if (isFreeSpin && fsRef.current) {
            // retrigger
            fsRef.current = {
              ...fsRef.current,
              remaining: fsRef.current.remaining + outcome.freeSpinsAwarded
            }
            setFs(fsRef.current)
            flashNotice(`+${outcome.freeSpinsAwarded} SPINS — RETRIGGER!`, 2200)
          } else if (!isFreeSpin) {
            pendingFsRef.current = outcome.freeSpinsAwarded
          }
        } else if (!isFreeSpin && bonusType === 'pick-me') {
          soundManager.bonusFanfare()
          overlayBlocksRef.current = true
          await sleep(600)
          if (!mountedRef.current) return
          setPickMeOpen(true)
        } else if (!isFreeSpin && bonusType === 'jackpot') {
          soundManager.bonusFanfare()
          overlayBlocksRef.current = true
          await sleep(600)
          if (!mountedRef.current) return
          setJackpotOpen(true)
        }
      }

      // --- respin on near-miss (respin / both-ways / cascade games)
      if (
        !isFreeSpin &&
        !isRespin &&
        RESPIN_TYPES.has(bonusType) &&
        scatCount === triggerN - 1 &&
        scatCount > 0
      ) {
        featureRef.current = true
        const hold: Record<string, string> = {}
        outcome.grid.forEach((reel, r) =>
          reel.forEach((id, row) => {
            if (symbols.get(id)?.kind === 'scatter') hold[`${r},${row}`] = id
          })
        )
        pendingRespinRef.current = hold
        flashNotice('RESPIN!', 1500)
      }
    },
    [bonusType, config, symbols, rng, creditFeature, flashNotice]
  )

  // ----------------------------------------------------------- playRound
  const playRound = useCallback(
    async (opts: RoundOpts = {}) => {
      if (busyRef.current) return
      const isFreeSpin = opts.freeSpin ?? false
      busyRef.current = true
      featureRef.current = false
      setPhase('spinning')
      setError(null)
      setWinCells(new Set())
      setPopCells(new Set())
      setGambleAvailable(0)
      if (!isFreeSpin) setLastWin(0)

      if (isFreeSpin && fsRef.current) {
        fsRef.current = {
          ...fsRef.current,
          remaining: fsRef.current.remaining - 1,
          spinIndex: fsRef.current.spinIndex + 1
        }
        setFs(fsRef.current)
      }
      if (!isFreeSpin && autoplayRef.current) {
        autoplayRef.current = { ...autoplayRef.current, remaining: autoplayRef.current.remaining - 1 }
        setAutoplay(autoplayRef.current)
      }

      const adapter = createSpinAdapter(config)
      adapterRef.current = adapter
      setMode(adapter.mode)
      soundManager.unlock()

      // sticky wilds force wild into their cells for the rest of the feature
      const overrides: Record<string, string> = { ...(opts.overrides ?? {}) }
      if (isFreeSpin && bonusType === 'sticky-wilds') {
        const wildId = config.symbols.find((s) => s.kind === 'wild')?.id
        if (wildId) for (const c of stickyRef.current) overrides[c] = wildId
      }

      const stopSpinSound = soundManager.spinLoop()
      let outcome: SpinOutcome
      try {
        const res = await adapter.spin({ bet: betRef.current, freeSpin: isFreeSpin, overrides })
        outcome = res.outcome
        setBalance(res.balance)
        balanceRef.current = res.balance
        if (adapter.mode === 'server') void refetchBalanceRef.current()
      } catch (e) {
        stopSpinSound()
        setError(e instanceof Error ? e.message : 'Spin failed')
        stopAutoplay()
        busyRef.current = false
        setPhase('idle')
        return
      }
      if (!mountedRef.current) {
        stopSpinSound()
        return
      }

      // ------------------------- animate reels onto the outcome grid
      const target = outcome.grid
      const sPerReel = scattersPerReel(target, symbols)
      let run = 0
      while (run < reels && sPerReel[run]) run++
      const antFrom = run >= 2 && run < reels ? run : reels
      const baseDur = reducedRef.current ? 260 : turboRef.current ? 400 : 950
      const stagger = reducedRef.current ? 70 : turboRef.current ? 130 : 300
      const antExtra = reducedRef.current ? 400 : 2500
      const jobStrips: string[][] = []
      const durations: number[] = []
      for (let r = 0; r < reels; r++) {
        let dur = baseDur + r * stagger
        if (r >= antFrom) dur += antExtra
        durations.push(dur)
        const filler = (reducedRef.current ? 3 : turboRef.current ? 6 : 10) + r * 2 + (r >= antFrom ? 6 : 0)
        const cells = [...(strips[r] ?? target[r])]
        for (let i = 0; i < filler; i++) {
          cells.push(weightedPick(config.symbols, (s) => s.weight, rng).id)
        }
        cells.push(...target[r])
        jobStrips.push(cells)
      }
      setStoppedCount(0)
      setAnticipateFrom(antFrom)
      setSpinJob({ strips: jobStrips, targets: target, durations, anticipateFrom: antFrom })
      await sleep(Math.max(...durations) + 80)
      stopSpinSound()
      if (!mountedRef.current) return
      // land: strips become exactly the outcome grid (transform reset by effect)
      setSpinJob(null)
      setStrips(target)
      setAnticipateFrom(reels)
      setStoppedCount(0)

      await settle(outcome, betRef.current, isFreeSpin, opts.isRespin ?? false, adapter)
      if (!mountedRef.current) return
      busyRef.current = false
      setPhase('idle')
      afterRound()
    },
    [config, bonusType, reels, symbols, rng, strips, settle, afterRound, stopAutoplay]
  )
  useEffect(() => {
    playRoundRef.current = playRound
  }, [playRound])

  // --------------------------------------------------------- user actions
  const changeBet = useCallback(
    (dir: 1 | -1) => {
      soundManager.unlock()
      soundManager.betStep()
      setBet((b) => stepBet(b, dir, meta.minBet, meta.maxBet))
    },
    [meta.minBet, meta.maxBet]
  )

  const maxBet = useCallback(() => {
    soundManager.unlock()
    soundManager.betStep()
    setBet(meta.maxBet)
  }, [meta.maxBet])

  const toggleMute = useCallback(() => {
    soundManager.unlock()
    const next = !soundManager.muted
    soundManager.setMuted(next)
    setMuted(next)
  }, [])

  const startAutoplay = useCallback((count: number, stopOnFeature: boolean, lossLimit: number | null) => {
    soundManager.click()
    const ap: AutoplayState = {
      remaining: count,
      stopOnFeature,
      lossLimit,
      startBalance: balanceRef.current
    }
    autoplayRef.current = ap
    setAutoplay(ap)
    setShowAutoplayMenu(false)
    void playRoundRef.current({})
  }, [])

  const handleStopAutoplay = useCallback(() => {
    soundManager.click()
    stopAutoplay()
  }, [stopAutoplay])

  // spacebar = spin (or stop autoplay)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      const t = e.target as HTMLElement | null
      if (t && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(t.tagName)) return
      e.preventDefault()
      soundManager.unlock()
      if (overlayBlocksRef.current || pickMeOpen || jackpotOpen || gambleState || showPaytable) return
      if (autoplayRef.current) {
        stopAutoplay()
        return
      }
      void playRoundRef.current({})
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pickMeOpen, jackpotOpen, gambleState, showPaytable, stopAutoplay])

  // ------------------------------------------------ overlay completions
  const handlePickComplete = useCallback(
    async (amount: number) => {
      setPickMeOpen(false)
      overlayBlocksRef.current = false
      await creditFeature(amount)
      setTicker((t) => [amount, ...t].slice(0, 5))
      setLastWin(amount)
      const tier = winTier(amount, betRef.current)
      if (tier === 'big' || tier === 'mega' || tier === 'epic') {
        setOverlay({ tier, amount })
        schedule(() => setOverlay(null), 2400)
      }
      continueFlow()
    },
    [creditFeature, continueFlow, schedule]
  )

  const handleJackpotComplete = useCallback(
    async (amount: number, tierKey: string) => {
      setJackpotOpen(false)
      overlayBlocksRef.current = false
      await creditFeature(amount)
      setTicker((t) => [amount, ...t].slice(0, 5))
      setLastWin(amount)
      flashNotice(`${tierKey} JACKPOT!`, 2600)
      setOverlay({ tier: winTier(amount, betRef.current) === 'epic' ? 'epic' : 'mega', amount })
      schedule(() => setOverlay(null), 2600)
      continueFlow()
    },
    [creditFeature, continueFlow, schedule, flashNotice]
  )

  const handleGambleDone = useCallback(
    async (delta: number) => {
      setGambleState(null)
      overlayBlocksRef.current = false
      await creditFeature(delta)
      if (delta < 0) {
        setLastWin(0)
        setTicker((t) => {
          const nt = [...t]
          if (nt.length > 0) nt[0] = 0
          return nt
        })
      } else if (delta > 0) {
        setLastWin((w) => w + delta)
      }
      continueFlow()
    },
    [creditFeature, continueFlow]
  )

  // -------------------------------------------------------------- render
  const spinning = phase === 'spinning'
  const inFreeSpins = fs !== null
  const controlsLocked = spinning || inFreeSpins
  const displayBalance = mode === 'server' ? balanceData?.balance ?? balance : balance

  const paletteStyle = {
    '--sf-primary': meta.palette.primary,
    '--sf-secondary': meta.palette.secondary,
    '--sf-bg': meta.palette.bg,
    '--sf-accent': meta.palette.accent,
    '--sf-ambient': config.ambientColor
  } as CSSProperties

  const machineClass = [
    'sf-machine',
    inFreeSpins ? 'sf-machine--fs' : '',
    overlay && overlay.tier !== 'big' && !reducedMotion ? 'sf-machine--shake' : ''
  ]
    .filter(Boolean)
    .join(' ')

  const reelClass = (r: number): string => {
    if (!spinJob) return 'sf-reel'
    if (r < stoppedCount) return 'sf-reel sf-reel--stopped'
    if (r >= anticipateFrom) return 'sf-reel sf-reel--anticipate'
    return 'sf-reel sf-reel--spinning'
  }

  const symbolSize = Math.round(cellH * 0.72)

  return (
    <div className={machineClass} style={paletteStyle}>
      <div className="sf-backdrop" aria-hidden />

      {/* ------------------------------------------------------ top bar */}
      <header className="sf-topbar">
        <Link to="/slots" className="sf-back">
          <ArrowLeft size={18} /> <span>Lobby</span>
        </Link>
        <div className="sf-title">
          <span className="sf-title-icon">{meta.iconEmoji}</span> {meta.title}
        </div>
        <div className="sf-top-actions">
          <div className="sf-balance" title={mode === 'local' ? 'Demo balance' : 'Balance'}>
            <Coins size={16} />
            <b>{displayBalance != null ? fmt(displayBalance) : '—'}</b>
            {mode === 'local' && <span className="sf-demo-chip">DEMO</span>}
          </div>
          <button className="sf-icon-btn" onClick={toggleMute} aria-label="Toggle sound">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="sf-icon-btn" onClick={() => setShowPaytable(true)} aria-label="Paytable">
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------- feature HUDs */}
      {inFreeSpins && (
        <div className="sf-fs-hud">
          <b>{meta.bonus.label}</b>
          <span>SPINS LEFT {fs.remaining}</span>
          <span>FEATURE WIN {fmt(fs.totalWin)}</span>
          {bonusType === 'sticky-wilds' && stickyWilds.length > 0 && (
            <span>STICKY ×{stickyWilds.length}</span>
          )}
        </div>
      )}
      {bonusType === 'multiplier-trail' && <TrailBar step={trailStep} />}

      {/* --------------------------------------------------- reel window */}
      <main className="sf-stage">
        <div
          className="sf-window"
          ref={windowRef}
          style={{ aspectRatio: `${reels} / ${rows}`, maxHeight: inFreeSpins ? '52vh' : '56vh' }}
        >
          <div className="sf-reels" style={{ gridTemplateColumns: `repeat(${reels}, 1fr)` }}>
            {Array.from({ length: reels }, (_, r) => {
              const strip = spinJob ? spinJob.strips[r] : strips[r]
              return (
                <div key={r} className={reelClass(r)}>
                  <div
                    className="sf-reel-strip"
                    ref={(el) => {
                      stripRefs.current[r] = el
                    }}
                    style={{ height: strip.length * cellH }}
                  >
                    {strip.map((id, i) => {
                      const key = `${r},${i}`
                      const cls = spinJob
                        ? 'sf-cell'
                        : `sf-cell${winCells.has(key) ? ' sf-cell--win' : ''}${popCells.has(key) ? ' sf-cell--pop' : ''}${inFreeSpins && stickyWilds.includes(key) ? ' sf-cell--sticky' : ''}`
                      return (
                        <div key={i} className={cls} style={{ height: cellH }}>
                          {symbols.get(id)?.render(symbolSize) ?? id}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="sf-window-vignette" aria-hidden />
          {notice && <div className="sf-notice">{notice}</div>}
        </div>

        {/* win bar */}
        <div className={`sf-winbar${lastWin > 0 ? ' sf-winbar--win' : ''}`}>
          {error ? (
            <span className="sf-error">{error}</span>
          ) : lastWin > 0 ? (
            <>
              WIN <CountUp value={lastWin} />
            </>
          ) : (
            <span className="sf-dim">{inFreeSpins ? meta.bonus.label : 'GOOD LUCK'}</span>
          )}
        </div>
      </main>

      {/* ------------------------------------------------------ controls */}
      <div className="sf-controls">
        <div className="sf-bet-ctl">
          <button
            className="sf-ctl-btn"
            onClick={() => changeBet(-1)}
            disabled={controlsLocked || !!autoplay}
            aria-label="Decrease bet"
          >
            <Minus size={16} />
          </button>
          <div className="sf-bet-value">
            <span>BET</span>
            <b>{fmt(bet)}</b>
          </div>
          <button
            className="sf-ctl-btn"
            onClick={() => changeBet(1)}
            disabled={controlsLocked || !!autoplay}
            aria-label="Increase bet"
          >
            <Plus size={16} />
          </button>
          <button className="sf-ctl-btn sf-maxbet" onClick={maxBet} disabled={controlsLocked || !!autoplay}>
            MAX
          </button>
        </div>

        <button
          className={`sf-spin-btn${spinning ? ' sf-spin-btn--busy' : ''}`}
          onClick={() => (autoplay ? handleStopAutoplay() : void playRound({}))}
          disabled={!autoplay && spinning}
        >
          {autoplay ? `STOP ${autoplay.remaining}` : spinning ? '…' : 'SPIN'}
        </button>

        <div className="sf-side-ctl">
          {gambleAvailable > 0 && !controlsLocked && (
            <button
              className="sf-ctl-btn sf-gamble-btn"
              onClick={() => {
                stopAutoplay()
                overlayBlocksRef.current = true
                setGambleState({ stake: gambleAvailable })
                setGambleAvailable(0)
              }}
            >
              GAMBLE
            </button>
          )}
          <div className="sf-autoplay-wrap">
            <button
              className={`sf-ctl-btn${autoplay ? ' sf-ctl-btn--on' : ''}`}
              onClick={() => (autoplay ? handleStopAutoplay() : setShowAutoplayMenu((v) => !v))}
              disabled={controlsLocked && !autoplay}
              aria-label="Autoplay"
            >
              AUTO
            </button>
            {showAutoplayMenu && !autoplay && (
              <AutoplayMenu onStart={startAutoplay} onClose={() => setShowAutoplayMenu(false)} />
            )}
          </div>
          <button
            className={`sf-ctl-btn${turbo ? ' sf-ctl-btn--on' : ''}`}
            onClick={() => {
              soundManager.click()
              setTurbo((v) => !v)
            }}
            aria-label="Turbo mode"
            title="Turbo"
          >
            <Zap size={16} />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------- stats & ticker */}
      <footer className="sf-stats">
        <div className="sf-stat">
          <span>WAGERED</span>
          <b>{fmt(stats.wagered)}</b>
        </div>
        <div className="sf-stat">
          <span>WON</span>
          <b>{fmt(stats.won)}</b>
        </div>
        <div className="sf-stat">
          <span>BIGGEST</span>
          <b>{fmt(stats.biggest)}</b>
        </div>
        <div className="sf-ticker">
          {ticker.map((w, i) => (
            <span key={i} className={`sf-tick${w > 0 ? ' sf-tick--win' : ''}`}>
              {w > 0 ? `+${fmt(w)}` : '·'}
            </span>
          ))}
        </div>
      </footer>

      {/* ------------------------------------------------------ overlays */}
      <AnimatePresence>
        {overlay && (
          <WinOverlay
            key="win"
            tier={overlay.tier}
            amount={overlay.amount}
            accent={meta.palette.accent}
            onClose={() => setOverlay(null)}
          />
        )}
        {featureBanner !== null && (
          <motion.div
            key="feature"
            className="sf-feature-banner"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            TOTAL FEATURE WIN
            <b style={{ color: meta.palette.accent }}>
              <CountUp value={featureBanner} />
            </b>
          </motion.div>
        )}
        {showPaytable && (
          <PaytableModal key="paytable" config={config} onClose={() => setShowPaytable(false)} />
        )}
        {pickMeOpen && (
          <PickMeOverlay key="pick" config={config} bet={betRef.current} onComplete={handlePickComplete} />
        )}
        {jackpotOpen && (
          <JackpotOverlay
            key="jackpot"
            config={config}
            bet={betRef.current}
            onComplete={handleJackpotComplete}
          />
        )}
        {gambleState && <GambleOverlay key="gamble" stake={gambleState.stake} onDone={handleGambleDone} />}
      </AnimatePresence>
    </div>
  )
}

/** Autoplay options popover: 10/25/50/100, stop-on-feature, loss limit. */
function AutoplayMenu({
  onStart,
  onClose
}: {
  onStart: (count: number, stopOnFeature: boolean, lossLimit: number | null) => void
  onClose: () => void
}) {
  const [stopOnFeature, setStopOnFeature] = useState(true)
  const [lossLimit, setLossLimit] = useState<number | null>(null)
  return (
    <div className="sf-auto-menu">
      <div className="sf-auto-counts">
        {[10, 25, 50, 100].map((n) => (
          <button key={n} className="sf-ctl-btn" onClick={() => onStart(n, stopOnFeature, lossLimit)}>
            {n}
          </button>
        ))}
      </div>
      <label className="sf-auto-opt">
        <input type="checkbox" checked={stopOnFeature} onChange={(e) => setStopOnFeature(e.target.checked)} />
        Stop on feature
      </label>
      <label className="sf-auto-opt">
        Loss limit
        <select
          value={lossLimit == null ? '' : String(lossLimit)}
          onChange={(e) => setLossLimit(e.target.value === '' ? null : Number(e.target.value))}
        >
          <option value="">None</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
        </select>
      </label>
      <button className="sf-auto-close" onClick={onClose}>
        ×
      </button>
    </div>
  )
}

/**
 * SlotMachinePage — thin route wrapper (SPEC §5).
 * /slots/play/:gameId → getGame(gameId) → SlotMachine, or a styled 404.
 */
export function SlotMachinePage() {
  const { gameId } = useParams<{ gameId: string }>()
  const mod = gameId ? getGame(gameId) : undefined
  if (!mod) {
    return (
      <div className="sf-page">
        <div className="sf-404">
          <h1>404 — Game not found</h1>
          <p>No slot called “{gameId}” lives here. It may have sunk beneath the waves.</p>
          <Link to="/slots" className="sf-btn">
            <ArrowLeft size={16} /> Back to the lobby
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="sf-page">
      <SlotMachine key={mod.meta.id} config={mod.config} />
    </div>
  )
}

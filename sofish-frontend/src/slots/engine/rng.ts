/**
 * slots/engine/rng.ts
 * ---------------------------------------------------------------------------
 * Deterministic seeded RNG (mulberry32) + weighted pick helper.
 * Used by LocalSpinAdapter for full client-side simulation and by the
 * SlotMachine for cosmetic randomness (reel strips while spinning, pick-me
 * shuffles, jackpot tease).
 */

export type Rng = () => number

/**
 * mulberry32 — tiny, fast, seedable PRNG. Returns a function producing
 * floats in [0, 1).
 */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return function next(): number {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fresh RNG seeded from crypto (falls back to Date.now). */
export function createRng(seed?: number): Rng {
  if (seed !== undefined) return mulberry32(seed)
  const buf = new Uint32Array(1)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf)
    return mulberry32(buf[0])
  }
  return mulberry32((Date.now() * 2654435761) >>> 0)
}

/**
 * Weighted pick over an array of items. `weightOf` must return a
 * non-negative number; items with weight 0 are never picked.
 * Throws if the total weight is <= 0.
 */
export function weightedPick<T>(items: readonly T[], weightOf: (item: T) => number, rng: Rng): T {
  let total = 0
  for (const item of items) total += Math.max(0, weightOf(item))
  if (total <= 0) throw new Error('weightedPick: total weight must be positive')
  let roll = rng() * total
  for (const item of items) {
    roll -= Math.max(0, weightOf(item))
    if (roll < 0) return item
  }
  return items[items.length - 1]
}

/** Integer in [min, max] inclusive. */
export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

/** In-place Fisher–Yates shuffle. Returns the same array. */
export function shuffle<T>(arr: T[], rng: Rng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Returns a number in [0, 1). Injected everywhere randomness is needed so tests can seed it. */
export type Rng = () => number

export const defaultRng: Rng = Math.random

/** Seedable mulberry32 generator: same seed, same sequence. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** One die: 1…sides. */
export function roll(rng: Rng, sides: number): number {
  return Math.floor(rng() * sides) + 1
}

/** Sum of `count` dice, e.g. 4d4. */
export function rollMany(rng: Rng, count: number, sides: number): number {
  let total = 0
  for (let i = 0; i < count; i++) total += roll(rng, sides)
  return total
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  if (list.length === 0) throw new Error('Cannot pick from an empty list')
  return list[roll(rng, list.length) - 1]
}

/** Fisher–Yates shuffle into a new array; the input is left untouched. */
export function shuffle<T>(rng: Rng, list: readonly T[]): T[] {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

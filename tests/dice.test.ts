import { describe, expect, it } from 'vitest'
import { createRng, defaultRng, pick, roll, rollMany, shuffle } from '../src/rules/dice'

describe('createRng', () => {
  it('returns the same sequence for the same seed', () => {
    const a = createRng(42)
    const b = createRng(42)
    const seqA = Array.from({ length: 20 }, () => a())
    const seqB = Array.from({ length: 20 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('returns different sequences for different seeds', () => {
    const a = createRng(1)
    const b = createRng(2)
    expect(a()).not.toBe(b())
  })

  it('only returns values in [0, 1)', () => {
    const rng = createRng(7)
    for (let i = 0; i < 10_000; i++) {
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('defaultRng', () => {
  it('returns values in [0, 1)', () => {
    const value = defaultRng()
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThan(1)
  })
})

describe('roll', () => {
  it.each([4, 6, 8, 17])('a d%i covers every face and nothing else over 10,000 rolls', (sides) => {
    const rng = createRng(sides)
    const seen = new Set<number>()
    for (let i = 0; i < 10_000; i++) seen.add(roll(rng, sides))
    expect([...seen].sort((x, y) => x - y)).toEqual(
      Array.from({ length: sides }, (_, i) => i + 1),
    )
  })
})

describe('rollMany', () => {
  it('4d4 always totals between 4 and 16 and reaches both ends', () => {
    const rng = createRng(99)
    const totals = new Set<number>()
    for (let i = 0; i < 10_000; i++) totals.add(rollMany(rng, 4, 4))
    expect(Math.min(...totals)).toBe(4)
    expect(Math.max(...totals)).toBe(16)
  })
})

describe('pick', () => {
  it('returns every element of the list over many picks', () => {
    const rng = createRng(3)
    const list = ['a', 'b', 'c', 'd']
    const seen = new Set<string>()
    for (let i = 0; i < 1_000; i++) seen.add(pick(rng, list))
    expect([...seen].sort()).toEqual(list)
  })

  it('throws on an empty list', () => {
    expect(() => pick(createRng(1), [])).toThrow('empty')
  })
})

describe('shuffle', () => {
  it('returns a permutation of the input', () => {
    const input = [14, 13, 10, 8, 7]
    const result = shuffle(createRng(5), input)
    expect([...result].sort((a, b) => a - b)).toEqual([7, 8, 10, 13, 14])
  })

  it('does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5]
    shuffle(createRng(5), input)
    expect(input).toEqual([1, 2, 3, 4, 5])
  })

  it('produces different orders for different seeds', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]
    const orders = new Set<string>()
    for (let seed = 0; seed < 20; seed++) orders.add(shuffle(createRng(seed), input).join(','))
    expect(orders.size).toBeGreaterThan(1)
  })
})

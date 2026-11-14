import { describe, expect, it } from 'vitest'
import { ATTRIBUTE_IDS, CLASS_IDS, CLASSES, type AttributeId, type Attributes } from '../src/data/classes'
import { createRng } from '../src/rules/dice'
import { rollAttributes } from '../src/rules/generate'

function attributeWithValue(attrs: Attributes, value: number): AttributeId {
  const found = ATTRIBUTE_IDS.find((id) => attrs[id] === value)
  if (!found) throw new Error(`No attribute has value ${value}`)
  return found
}

describe('rollAttributes', () => {
  it.each(CLASS_IDS)('%s: 1,000 rolls are all permutations of 14/13/10/8/7', (classId) => {
    const rng = createRng(1)
    for (let i = 0; i < 1_000; i++) {
      const attrs = rollAttributes(rng, classId)
      const values = ATTRIBUTE_IDS.map((id) => attrs[id]).sort((a, b) => a - b)
      expect(values).toEqual([7, 8, 10, 13, 14])
    }
  })

  it.each(CLASS_IDS)('%s: 14 always lands on an allowed main attribute', (classId) => {
    const rng = createRng(2)
    const allowed = CLASSES[classId].mainAttributes
    for (let i = 0; i < 1_000; i++) {
      expect(allowed).toContain(attributeWithValue(rollAttributes(rng, classId), 14))
    }
  })

  it.each(CLASS_IDS)('%s: 13 always lands on an allowed secondary attribute', (classId) => {
    const rng = createRng(3)
    const allowed = CLASSES[classId].secondaryAttributes
    for (let i = 0; i < 1_000; i++) {
      expect(allowed).toContain(attributeWithValue(rollAttributes(rng, classId), 13))
    }
  })

  it.each(CLASS_IDS)('%s: every allowed main and secondary attribute gets used', (classId) => {
    const rng = createRng(4)
    const mains = new Set<AttributeId>()
    const secondaries = new Set<AttributeId>()
    for (let i = 0; i < 1_000; i++) {
      const attrs = rollAttributes(rng, classId)
      mains.add(attributeWithValue(attrs, 14))
      secondaries.add(attributeWithValue(attrs, 13))
    }
    expect([...mains].sort()).toEqual([...CLASSES[classId].mainAttributes].sort())
    expect([...secondaries].sort()).toEqual([...CLASSES[classId].secondaryAttributes].sort())
  })

  it('a Ranger with DEX as main never also gets DEX as secondary (and the same for STR)', () => {
    const rng = createRng(5)
    for (let i = 0; i < 1_000; i++) {
      const attrs = rollAttributes(rng, 'ranger')
      expect(attributeWithValue(attrs, 14)).not.toBe(attributeWithValue(attrs, 13))
    }
  })

  it('the same seed gives the same attributes', () => {
    expect(rollAttributes(createRng(6), 'thief')).toEqual(rollAttributes(createRng(6), 'thief'))
  })
})

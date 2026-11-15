import { describe, expect, it } from 'vitest'
import { ATTRIBUTE_IDS, CLASS_IDS, CLASSES, type AttributeId, type Attributes } from '../src/data/classes'
import { createRng } from '../src/rules/dice'
import { generateCharacter, rollAttributes } from '../src/rules/generate'

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

describe('class tables (pp. 34–59)', () => {
  it.each(CLASS_IDS)('%s has 6 backgrounds, 8 characteristics, 8 traits and 10 names', (classId) => {
    const c = CLASSES[classId]
    expect(c.backgrounds).toHaveLength(6)
    expect(c.characteristics).toHaveLength(8)
    expect(c.traits).toHaveLength(8)
    expect(c.names).toHaveLength(10)
  })

  it.each(CLASS_IDS)('%s tables have no blank or duplicate entries', (classId) => {
    const c = CLASSES[classId]
    for (const table of [c.backgrounds, c.characteristics, c.traits, c.names]) {
      expect(table.every((entry) => entry.trim().length > 0)).toBe(true)
      expect(new Set(table).size).toBe(table.length)
    }
  })
})

describe('generateCharacter', () => {
  it('respects a chosen class', () => {
    expect(generateCharacter(createRng(1), 'witch').classId).toBe('witch')
  })

  it('picks every class over many random rolls', () => {
    const rng = createRng(2)
    const seen = new Set<string>()
    for (let i = 0; i < 500; i++) seen.add(generateCharacter(rng).classId)
    expect([...seen].sort()).toEqual([...CLASS_IDS].sort())
  })

  it.each(CLASS_IDS)('%s: name, background, characteristic and trait come from the class tables', (classId) => {
    const rng = createRng(3)
    const c = CLASSES[classId]
    for (let i = 0; i < 100; i++) {
      const character = generateCharacter(rng, classId)
      expect(c.names).toContain(character.name)
      expect(c.backgrounds).toContain(character.background)
      expect(c.characteristics).toContain(character.characteristic)
      expect(c.traits).toContain(character.trait)
    }
  })

  it('starts at level 1 with 0 deeds (pp. 30, 66)', () => {
    const character = generateCharacter(createRng(4), 'warrior')
    expect(character.level).toBe(1)
    expect(character.deeds).toBe(0)
  })

  it('rolls attributes that follow the class matrix', () => {
    const character = generateCharacter(createRng(5), 'thief')
    expect(attributeWithValue(character.attributes, 14)).toBe('dex')
  })

  it('the same seed gives the same character', () => {
    expect(generateCharacter(createRng(6))).toEqual(generateCharacter(createRng(6)))
  })
})

describe('rollAttributes key order', () => {
  it('always lists attributes in STR, DEX, CON, AWA, PRE order', () => {
    const rng = createRng(7)
    for (const classId of CLASS_IDS) {
      expect(Object.keys(rollAttributes(rng, classId))).toEqual([...ATTRIBUTE_IDS])
    }
  })
})

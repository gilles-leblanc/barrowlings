import { describe, expect, it } from 'vitest'
import { CLASSES } from '../src/data/classes'
import { createRng } from '../src/rules/dice'
import { changeClass, generateCharacter, rerollSection, SECTIONS, type Character, type Section } from '../src/rules/generate'

/** Which Character keys each section is allowed to change. */
const CHANGES: Record<Section, (keyof Character)[]> = {
  name: ['name'],
  background: ['background'],
  characteristic: ['characteristic'],
  trait: ['trait'],
  attributes: ['attributes'],
  kit: ['gear'],
  bond: ['bond'],
  spells: ['spells'],
  class: ['classId', 'background', 'gear', 'name', 'spells', 'attributes'],
}

function changedKeys(before: Character, after: Character): (keyof Character)[] {
  return (Object.keys(before) as (keyof Character)[]).filter(
    (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]),
  )
}

describe('rerollSection', () => {
  it.each(SECTIONS.filter((s) => s !== 'spells'))('%s: changes only its own fields, and always changes something', (section) => {
    const rng = createRng(1)
    for (let i = 0; i < 50; i++) {
      const before = generateCharacter(rng, 'wizard')
      const after = rerollSection(rng, before, section)
      const changed = changedKeys(before, after)
      expect(changed.length).toBeGreaterThan(0)
      for (const key of changed) expect(CHANGES[section]).toContain(key)
    }
  })

  it('spells: a caster gets a different pair, and nothing else changes', () => {
    const rng = createRng(2)
    for (let i = 0; i < 50; i++) {
      const before = generateCharacter(rng, 'cleric')
      const after = rerollSection(rng, before, 'spells')
      expect(changedKeys(before, after)).toEqual(['spells'])
      expect(after.spells).toHaveLength(2)
    }
  })

  it('spells: a non-caster is left unchanged', () => {
    const before = generateCharacter(createRng(3), 'warrior')
    expect(rerollSection(createRng(4), before, 'spells')).toEqual(before)
  })

  it('kit: picks a different kit', () => {
    const rng = createRng(5)
    for (let i = 0; i < 50; i++) {
      const before = generateCharacter(rng, 'thief')
      expect(rerollSection(rng, before, 'kit').gear.kit).not.toBe(before.gear.kit)
    }
  })

  it('bond: keeps the other character’s name', () => {
    const before = { ...generateCharacter(createRng(6)), bond: { text: 'x Party Member', partyMember: 'Rowan' } }
    expect(rerollSection(createRng(7), before, 'bond').bond.partyMember).toBe('Rowan')
  })

  it('does not mutate the original character', () => {
    const before = generateCharacter(createRng(8), 'ranger')
    const copy = structuredClone(before)
    rerollSection(createRng(9), before, 'attributes')
    expect(before).toEqual(copy)
  })
})

describe('changeClass', () => {
  it('re-rolls background, kit, name, spells and attributes for the new class', () => {
    const before = generateCharacter(createRng(10), 'warrior')
    const after = changeClass(createRng(11), before, 'wizard')
    expect(after.classId).toBe('wizard')
    expect(CLASSES.wizard.backgrounds).toContain(after.background)
    expect(CLASSES.wizard.names).toContain(after.name)
    expect(after.spells).toHaveLength(2)
    expect(after.attributes.pre).toBe(14)
  })

  it('keeps characteristic, trait, bond, languages, level and deeds', () => {
    const before = { ...generateCharacter(createRng(12), 'thief'), languages: 'Common, Elven', bond: { text: 'x', partyMember: 'Sigrid' } }
    const after = changeClass(createRng(13), before, 'paladin')
    for (const key of ['characteristic', 'trait', 'bond', 'languages', 'level', 'deeds'] as const) {
      expect(after[key]).toEqual(before[key])
    }
  })

  it('re-rolling the class section always picks a different class', () => {
    const rng = createRng(14)
    for (let i = 0; i < 50; i++) {
      const before = generateCharacter(rng)
      expect(rerollSection(rng, before, 'class').classId).not.toBe(before.classId)
    }
  })
})

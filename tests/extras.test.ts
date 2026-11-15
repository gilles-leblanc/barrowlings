import { describe, expect, it } from 'vitest'
import { CLASS_IDS, CLASSES } from '../src/data/classes'
import { BONDS } from '../src/data/bonds'
import { CASTER_CLASSES, SPELLS } from '../src/data/spells'
import { createRng } from '../src/rules/dice'
import { generateCharacter, rollBond, rollSpells } from '../src/rules/generate'

describe('spell lists (pp. 82, 87, 93)', () => {
  it('Cleric, Witch and Wizard are the casters', () => {
    expect([...CASTER_CLASSES].sort()).toEqual(['cleric', 'witch', 'wizard'])
  })

  it.each(['cleric', 'witch', 'wizard'] as const)('%s has 4 level-1 spells with summaries', (classId) => {
    expect(SPELLS[classId]).toHaveLength(4)
    for (const spell of SPELLS[classId]) expect(spell.summary.length).toBeGreaterThan(0)
  })

  it('matches the rulebook level-1 spell names', () => {
    expect(SPELLS.cleric.map((s) => s.name)).toEqual(['Cure Light Wounds', 'Detect Undead', 'Holy Weapon', 'Light'])
    expect(SPELLS.witch.map((s) => s.name)).toEqual(['Animal Messenger', 'Detect Affliction', 'Water Breathing', 'Soporific Pollen'])
    expect(SPELLS.wizard.map((s) => s.name)).toEqual(['Light', 'Magic Missile', 'Magical Armour', 'Ventriloquism'])
  })
})

describe('rollSpells (p.81: casters start with 2 first-level spells)', () => {
  it.each(['cleric', 'witch', 'wizard'] as const)('%s gets 2 distinct spells from its own list', (classId) => {
    const rng = createRng(1)
    const names = SPELLS[classId].map((s) => s.name)
    for (let i = 0; i < 200; i++) {
      const spells = rollSpells(rng, classId)
      expect(spells).toHaveLength(2)
      expect(new Set(spells).size).toBe(2)
      for (const spell of spells) expect(names).toContain(spell)
    }
  })

  it.each(['paladin', 'ranger', 'thief', 'warrior'] as const)('%s gets no spells', (classId) => {
    expect(rollSpells(createRng(1), classId)).toEqual([])
  })
})

describe('bonds (pp. 63–64)', () => {
  it('has 17 bonds, each mentioning Party Member', () => {
    expect(BONDS).toHaveLength(17)
    for (const bond of BONDS) expect(bond).toContain('Party Member')
  })

  it('rollBond picks from the list and leaves the other character blank', () => {
    const rng = createRng(2)
    for (let i = 0; i < 100; i++) {
      const bond = rollBond(rng)
      expect(BONDS).toContain(bond.text)
      expect(bond.partyMember).toBe('')
    }
  })
})

describe('class abilities', () => {
  it.each(CLASS_IDS)('%s has abilities with names and summaries', (classId) => {
    expect(CLASSES[classId].abilities.length).toBeGreaterThan(0)
    for (const ability of CLASSES[classId].abilities) {
      expect(ability.name.length).toBeGreaterThan(0)
      expect(ability.summary.length).toBeGreaterThan(0)
    }
  })
})

describe('generated characters include spells, bond and an empty languages field', () => {
  it('a Witch has 2 spells and a bond', () => {
    const character = generateCharacter(createRng(3), 'witch')
    expect(character.spells).toHaveLength(2)
    expect(BONDS).toContain(character.bond.text)
  })

  it('a Warrior has no spells', () => {
    expect(generateCharacter(createRng(3), 'warrior').spells).toEqual([])
  })

  it('languages start empty (SPEC.md: optional, no suggestions)', () => {
    expect(generateCharacter(createRng(3)).languages).toBe('')
  })
})

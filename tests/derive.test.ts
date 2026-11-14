import { describe, expect, it } from 'vitest'
import { CLASSES, type Attributes } from '../src/data/classes'
import { slotCapacity, startingHp } from '../src/rules/derive'

function attrs(overrides: Partial<Attributes>): Attributes {
  return { str: 10, dex: 10, con: 10, awa: 10, pre: 10, ...overrides }
}

describe('class reference data (SPEC.md, rulebook pp. 32–56)', () => {
  it('has the HP per level from each class entry', () => {
    expect(CLASSES.cleric.hpPerLevel).toBe(2)
    expect(CLASSES.paladin.hpPerLevel).toBe(3)
    expect(CLASSES.ranger.hpPerLevel).toBe(3)
    expect(CLASSES.thief.hpPerLevel).toBe(2)
    expect(CLASSES.warrior.hpPerLevel).toBe(3)
    expect(CLASSES.witch.hpPerLevel).toBe(1)
    expect(CLASSES.wizard.hpPerLevel).toBe(1)
  })

  it('has the weapon proficiencies from each class entry', () => {
    expect(CLASSES.warrior.weapons).toEqual(['simple', 'standard', 'martial', 'twoHandedMartial'])
    expect(CLASSES.paladin.weapons).toEqual(['simple', 'standard', 'martial'])
    expect(CLASSES.thief.weapons).toEqual(['simple', 'standard'])
    expect(CLASSES.witch.weapons).toEqual(['simple'])
  })

  it('has the armour proficiencies from each class entry', () => {
    expect(CLASSES.warrior.armour).toEqual(['light', 'medium', 'heavy', 'shield'])
    expect(CLASSES.cleric.armour).toEqual(['light', 'medium', 'shield'])
    expect(CLASSES.thief.armour).toEqual(['light'])
    expect(CLASSES.wizard.armour).toEqual([])
  })
})

describe('startingHp (p.62)', () => {
  it('matches the rulebook example: Warrior with CON 15 starts with 10 HP', () => {
    expect(startingHp(attrs({ con: 15 }), 'warrior')).toBe(10)
  })

  it('rounds half of CON down: Wizard with CON 13 starts with 7 HP', () => {
    expect(startingHp(attrs({ con: 13 }), 'wizard')).toBe(7)
  })

  it('works at the lowest starting CON: Cleric with CON 7 starts with 5 HP', () => {
    expect(startingHp(attrs({ con: 7 }), 'cleric')).toBe(5)
  })
})

describe('slotCapacity (p.69)', () => {
  it('is 10 when STR is below 10', () => {
    expect(slotCapacity(attrs({ str: 7 }))).toBe(10)
  })

  it('is 10 when STR is exactly 10', () => {
    expect(slotCapacity(attrs({ str: 10 }))).toBe(10)
  })

  it('equals STR when STR is above 10', () => {
    expect(slotCapacity(attrs({ str: 14 }))).toBe(14)
  })
})

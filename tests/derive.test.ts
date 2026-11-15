import { describe, expect, it } from 'vitest'
import { CLASS_IDS, CLASSES, type Attributes } from '../src/data/classes'
import { gearItems, ITEMS } from '../src/data/gear'
import { armourValue, DAMAGE_DIE, hasShield, slotCapacity, slotsUsed, startingHp, weaponsWithDamage } from '../src/rules/derive'

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

describe('gear-derived values', () => {
  it('armourValue is 1 with a gambeson (Light, p.70) and 0 without', () => {
    expect(armourValue(gearItems('warrior', 1))).toBe(1)
    expect(armourValue(gearItems('warrior', 3))).toBe(0)
  })

  it('hasShield is true when the gear includes a shield', () => {
    expect(hasShield(gearItems('paladin', 1))).toBe(true) // fixed gear
    expect(hasShield(gearItems('warrior', 2))).toBe(true) // kit
    expect(hasShield(gearItems('warrior', 1))).toBe(false)
  })

  it('weaponsWithDamage lists every weapon with its damage die (p.72)', () => {
    expect(weaponsWithDamage(gearItems('paladin', 2), 'paladin')).toEqual([
      { name: 'Mace', die: 'd6' },
      { name: '2 javelins', die: 'd8' },
    ])
    expect(weaponsWithDamage(gearItems('warrior', 4), 'warrior')).toEqual([
      { name: 'Polearm (halberd)', die: 'd10' },
      { name: 'Club', die: 'd4' },
    ])
  })

  it('drops a weapon to the next weaker category the class is proficient with (p.18)', () => {
    expect(weaponsWithDamage(['Long sword'], 'wizard')).toEqual([{ name: 'Long sword', die: 'd4' }])
    expect(weaponsWithDamage(['Polearm (halberd)'], 'paladin')).toEqual([{ name: 'Polearm (halberd)', die: 'd8' }])
    expect(weaponsWithDamage(['Long sword'], 'thief')).toEqual([{ name: 'Long sword', die: 'd6' }])
  })

  it('slotsUsed counts normal 1, encumbering 2, stack 1, tiny and worn 0 (p.69)', () => {
    expect(slotsUsed(['Rope', 'Tent', 'Torches', 'Tinder box', 'Clothes'])).toBe(4)
  })

  it('every rolled kit in the rulebook is used at full damage by its own class', () => {
    for (const classId of CLASS_IDS) {
      for (let kit = 1; kit <= 4; kit++) {
        const items = gearItems(classId, kit)
        const full = items.filter((name) => ITEMS[name].weapon).map((name) => DAMAGE_DIE[ITEMS[name].weapon!])
        expect(weaponsWithDamage(items, classId).map((w) => w.die), `${classId} kit ${kit}`).toEqual(full)
      }
    }
  })
})

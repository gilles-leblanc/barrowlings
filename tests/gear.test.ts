import { describe, expect, it } from 'vitest'
import { CLASS_IDS, CLASSES } from '../src/data/classes'
import { COMMON_GEAR, gearItems, ITEMS, KITS, SLOT_COST, type ItemName } from '../src/data/gear'
import { createRng } from '../src/rules/dice'
import { generateCharacter, rollGear } from '../src/rules/generate'

function slotsFor(names: readonly ItemName[]): number {
  return names.reduce((total, name) => total + SLOT_COST[ITEMS[name].tag], 0)
}

describe('gear catalogue and kits (pp. 34–58, 69–77)', () => {
  it.each(CLASS_IDS)('%s has exactly 4 kits', (classId) => {
    expect(KITS[classId]).toHaveLength(4)
  })

  it.each(CLASS_IDS)('%s: every kit, fixed and optional item is in the catalogue', (classId) => {
    const names: string[] = [...KITS[classId].flat(), ...CLASSES[classId].fixedGear, ...CLASSES[classId].optionalGear]
    for (const name of names) expect(ITEMS, name).toHaveProperty([name])
  })

  it.each(CLASS_IDS)('%s: every kit fits in 10 slots with fixed and common gear', (classId) => {
    for (let kit = 1; kit <= 4; kit++) {
      expect(slotsFor(gearItems(classId, kit)), `${classId} kit ${kit}`).toBeLessThanOrEqual(10)
    }
  })

  it('common gear is clothes, rations and a waterskin (p.31)', () => {
    expect(COMMON_GEAR).toEqual(['Clothes', 'Rations', 'Waterskin'])
  })

  it('uses the equipment-list tags where they exist (pp. 76–77)', () => {
    expect(ITEMS['Torches'].tag).toBe('stack')
    expect(ITEMS['Rations'].tag).toBe('stack')
    expect(ITEMS['Tinder box'].tag).toBe('tiny')
    expect(ITEMS['Backpack'].tag).toBe('worn')
    expect(ITEMS['Tent'].tag).toBe('encumbering')
    expect(ITEMS['Crowbar'].tag).toBe('encumbering')
  })

  it('two-handed weapons and the staff take 2 slots (pp. 69, 73–74)', () => {
    expect(ITEMS['Polearm (halberd)'].tag).toBe('encumbering')
    expect(ITEMS['Staff'].tag).toBe('encumbering')
  })

  it('only the gambeson is armour, and it is Light (SPEC.md decision 2)', () => {
    const armour = Object.entries(ITEMS).filter(([, item]) => item.armour)
    expect(armour.map(([name]) => name)).toEqual(['Gambeson'])
    expect(ITEMS['Gambeson'].armour).toBe('light')
  })

  it('has the right weapon categories for a sample of weapons (pp. 73–74)', () => {
    expect(ITEMS['Dagger'].weapon).toBe('simple')
    expect(ITEMS['Hunting bow'].weapon).toBe('standard')
    expect(ITEMS['Long sword'].weapon).toBe('martial')
    expect(ITEMS['Polearm (halberd)'].weapon).toBe('twoHandedMartial')
  })

  it('marks shields', () => {
    expect(ITEMS['Shield'].shield).toBe(true)
  })
})

describe('gearItems', () => {
  it('combines fixed gear, the chosen kit and common gear', () => {
    const items = gearItems('ranger', 1)
    expect(items.slice(0, 3)).toEqual(['Hunting bow', 'Quiver', 'Arrows'])
    expect(items).toContain('Bear trap')
    expect(items.slice(-3)).toEqual(['Clothes', 'Rations', 'Waterskin'])
  })

  it('includes the Wizard spellbook', () => {
    expect(gearItems('wizard', 1)).toContain('Spellbook')
  })
})

describe('rollGear', () => {
  it('picks every kit (1–4) over many rolls', () => {
    const rng = createRng(1)
    const kits = new Set<number>()
    for (let i = 0; i < 200; i++) kits.add(rollGear(rng).kit)
    expect([...kits].sort()).toEqual([1, 2, 3, 4])
  })

  it('rolls 4d4 coins: always 4–16, reaching both ends', () => {
    const rng = createRng(2)
    const coins = new Set<number>()
    for (let i = 0; i < 5_000; i++) coins.add(rollGear(rng).coins)
    expect(Math.min(...coins)).toBe(4)
    expect(Math.max(...coins)).toBe(16)
  })

  it('is part of every generated character', () => {
    const { gear } = generateCharacter(createRng(3), 'thief')
    expect(gear.kit).toBeGreaterThanOrEqual(1)
    expect(gear.kit).toBeLessThanOrEqual(4)
  })
})

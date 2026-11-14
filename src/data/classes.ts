// Class reference data. Rulebook: Barrows and Banshees v0.17.

export const ATTRIBUTE_IDS = ['str', 'dex', 'con', 'awa', 'pre'] as const
export type AttributeId = (typeof ATTRIBUTE_IDS)[number]
export type Attributes = Record<AttributeId, number>

/** p.60: values assigned to the five attributes at creation. */
export const ATTRIBUTE_ARRAY = [14, 13, 10, 8, 7] as const

export type ArmourType = 'light' | 'medium' | 'heavy' | 'shield'
export type WeaponCategory = 'simple' | 'standard' | 'martial' | 'twoHandedMartial'

export const CLASS_IDS = ['cleric', 'paladin', 'ranger', 'thief', 'warrior', 'witch', 'wizard'] as const
export type ClassId = (typeof CLASS_IDS)[number]

export interface ClassData {
  name: string
  page: number
  hpPerLevel: number
  armour: readonly ArmourType[]
  weapons: readonly WeaponCategory[]
  fixedGear: readonly string[]
  optionalGear: readonly string[]
  /** Roll guidance only (SPEC.md › class attribute matrix): the attribute that gets 14. */
  mainAttributes: readonly AttributeId[]
  /** Roll guidance only: the attribute that gets 13 (never the one chosen as main). */
  secondaryAttributes: readonly AttributeId[]
}

export const CLASSES: Record<ClassId, ClassData> = {
  cleric: {
    name: 'Cleric',
    page: 32,
    hpPerLevel: 2,
    armour: ['light', 'medium', 'shield'],
    weapons: ['simple', 'standard'],
    fixedGear: ['Holy symbol'], // p.34
    optionalGear: [],
    mainAttributes: ['pre'],
    secondaryAttributes: ['str', 'con'],
  },
  paladin: {
    name: 'Paladin',
    page: 36,
    hpPerLevel: 3,
    armour: ['light', 'medium', 'heavy', 'shield'],
    weapons: ['simple', 'standard', 'martial'],
    fixedGear: ['Shield'], // p.38
    optionalGear: [],
    mainAttributes: ['str'],
    secondaryAttributes: ['pre', 'con'],
  },
  ranger: {
    name: 'Ranger',
    page: 40,
    hpPerLevel: 3,
    armour: ['light', 'medium', 'shield'],
    weapons: ['simple', 'standard', 'martial'],
    fixedGear: ['Hunting bow', 'Quiver', 'Arrows'], // p.42
    optionalGear: [],
    mainAttributes: ['dex', 'str'],
    secondaryAttributes: ['dex', 'str', 'awa'],
  },
  thief: {
    name: 'Thief',
    page: 44,
    hpPerLevel: 2,
    armour: ['light'],
    weapons: ['simple', 'standard'],
    fixedGear: ['Lock picks'], // p.46
    optionalGear: [],
    mainAttributes: ['dex'],
    secondaryAttributes: ['awa', 'pre'],
  },
  warrior: {
    name: 'Warrior',
    page: 48,
    hpPerLevel: 3,
    armour: ['light', 'medium', 'heavy', 'shield'],
    weapons: ['simple', 'standard', 'martial', 'twoHandedMartial'],
    fixedGear: [], // p.50
    optionalGear: [],
    mainAttributes: ['str'],
    secondaryAttributes: ['con'],
  },
  witch: {
    name: 'Witch',
    page: 52,
    hpPerLevel: 1,
    armour: [],
    weapons: ['simple'],
    fixedGear: [], // p.54
    optionalGear: [],
    mainAttributes: ['pre'],
    secondaryAttributes: ['dex', 'con', 'awa'],
  },
  wizard: {
    name: 'Wizard',
    page: 56,
    hpPerLevel: 1,
    armour: [],
    weapons: ['simple'],
    fixedGear: [], // p.58
    optionalGear: ['Spellbook'], // p.58: "Optional: Spellbook"
    mainAttributes: ['pre'],
    secondaryAttributes: ['dex', 'con', 'awa'],
  },
}

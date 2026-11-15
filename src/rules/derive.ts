import { CLASSES, type Attributes, type ClassId, type WeaponCategory } from '../data/classes'
import { ITEMS, SLOT_COST, type ItemName } from '../data/gear'

/** p.62: half CON rounded down, plus class HP per level. */
export function startingHp(attrs: Attributes, classId: ClassId): number {
  return Math.floor(attrs.con / 2) + CLASSES[classId].hpPerLevel
}

/** p.69: gear slots equal 10 or STR, whichever is greater. */
export function slotCapacity(attrs: Attributes): number {
  return Math.max(10, attrs.str)
}

/** p.69: normal 1, encumbering 2, stack 1, tiny and worn 0. */
export function slotsUsed(items: readonly ItemName[]): number {
  return items.reduce((total, name) => total + SLOT_COST[ITEMS[name].tag], 0)
}

const ARMOUR_VALUE = { light: 1, medium: 2, heavy: 3 } as const

/** pp. 13, 70–71: armour can't be layered, so take the best piece carried. */
export function armourValue(items: readonly ItemName[]): number {
  return Math.max(0, ...items.map((name) => {
    const armour = ITEMS[name].armour
    return armour ? ARMOUR_VALUE[armour] : 0
  }))
}

export function hasShield(items: readonly ItemName[]): boolean {
  return items.some((name) => ITEMS[name].shield)
}

/** p.72 weapon damage, weakest to strongest. */
export const DAMAGE_DIE: Record<WeaponCategory, string> = {
  simple: 'd4',
  standard: 'd6',
  martial: 'd8',
  twoHandedMartial: 'd10',
}
const CATEGORY_ORDER = Object.keys(DAMAGE_DIE) as WeaponCategory[]

/** p.18: a weapon outside the class list uses the next weakest category the class is proficient with. */
function effectiveCategory(category: WeaponCategory, classId: ClassId): WeaponCategory {
  const proficient = CLASSES[classId].weapons
  for (let i = CATEGORY_ORDER.indexOf(category); i > 0; i--) {
    if (proficient.includes(CATEGORY_ORDER[i])) return CATEGORY_ORDER[i]
  }
  return 'simple'
}

export interface WeaponDamage {
  name: ItemName
  die: string
}

export function weaponsWithDamage(items: readonly ItemName[], classId: ClassId): WeaponDamage[] {
  return items.flatMap((name) => {
    const category = ITEMS[name].weapon
    return category ? [{ name, die: DAMAGE_DIE[effectiveCategory(category, classId)] }] : []
  })
}

export interface SlotLine {
  name: ItemName
  /** True on the second line of a 2-slot (encumbering) item. */
  continued: boolean
}

/** Gear laid out on inventory lines, in carrying order: one line per slot used. */
export function slotLines(items: readonly ItemName[]): SlotLine[] {
  return items.flatMap((name) =>
    Array.from({ length: SLOT_COST[ITEMS[name].tag] }, (_, i) => ({ name, continued: i > 0 })),
  )
}

/**
 * SPEC.md › over-limit items: count slots in carrying order and return the indices of items whose
 * slots go past `capacity`. A 2-slot item that straddles the limit is over; 0-slot items never are.
 */
export function overLimitIndices(items: readonly ItemName[], capacity: number): number[] {
  const over: number[] = []
  let used = 0
  items.forEach((name, i) => {
    const cost = SLOT_COST[ITEMS[name].tag]
    used += cost
    if (cost > 0 && used > capacity) over.push(i)
  })
  return over
}

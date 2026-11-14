import { CLASSES, type Attributes, type ClassId } from '../data/classes'

/** p.62: half CON rounded down, plus class HP per level. */
export function startingHp(attrs: Attributes, classId: ClassId): number {
  return Math.floor(attrs.con / 2) + CLASSES[classId].hpPerLevel
}

/** p.69: gear slots equal 10 or STR, whichever is greater. */
export function slotCapacity(attrs: Attributes): number {
  return Math.max(10, attrs.str)
}

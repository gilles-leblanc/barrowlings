import { ATTRIBUTE_IDS, CLASS_IDS, CLASSES, type Attributes, type ClassId } from '../data/classes'
import { BONDS } from '../data/bonds'
import { isCaster, SPELLS } from '../data/spells'
import { roll, rollMany, pick, shuffle, type Rng } from './dice'

/**
 * p.60 + SPEC.md › class attribute matrix: 14 on an allowed main attribute,
 * 13 on an allowed secondary (never the main), 10/8/7 shuffled across the rest.
 */
export function rollAttributes(rng: Rng, classId: ClassId): Attributes {
  const { mainAttributes, secondaryAttributes } = CLASSES[classId]
  const main = pick(rng, mainAttributes)
  const secondary = pick(rng, secondaryAttributes.filter((id) => id !== main))
  const rest = ATTRIBUTE_IDS.filter((id) => id !== main && id !== secondary)
  const restValues = shuffle(rng, [10, 8, 7])

  const attrs = { [main]: 14, [secondary]: 13 } as Partial<Attributes>
  rest.forEach((id, i) => (attrs[id] = restValues[i]))
  return attrs as Attributes
}

export interface Gear {
  /** Which d4 class kit (1–4). Items come from `gearItems(classId, kit)`. */
  kit: number
  coins: number
}

/** Class kit (d4, "choose or roll") and 4d4 starting coins (p.31). */
export function rollGear(rng: Rng): Gear {
  return { kit: roll(rng, 4), coins: rollMany(rng, 4, 4) }
}

/** p.81: casters start with 2 first-level spells from their class list; others get none. */
export function rollSpells(rng: Rng, classId: ClassId): string[] {
  if (!isCaster(classId)) return []
  return shuffle(rng, SPELLS[classId]).slice(0, 2).map((spell) => spell.name)
}

export interface Bond {
  text: string
  /** The other character's name, typed by the player. */
  partyMember: string
}

/** pp. 63–64: one bond from the list; the other character is filled in at the table. */
export function rollBond(rng: Rng): Bond {
  return { text: pick(rng, BONDS), partyMember: '' }
}

export interface Character {
  classId: ClassId
  name: string
  background: string
  characteristic: string
  trait: string
  attributes: Attributes
  gear: Gear
  spells: string[]
  bond: Bond
  /** p.62: free text, empty by default, no suggestions (SPEC.md). */
  languages: string
  level: number
  deeds: number
}

/** pp. 30–31: a level-1 character. Picks a random class unless one is given. */
export function generateCharacter(rng: Rng, classId: ClassId = pick(rng, CLASS_IDS)): Character {
  const c = CLASSES[classId]
  return {
    classId,
    name: pick(rng, c.names),
    background: pick(rng, c.backgrounds),
    characteristic: pick(rng, c.characteristics),
    trait: pick(rng, c.traits),
    attributes: rollAttributes(rng, classId),
    gear: rollGear(rng),
    spells: rollSpells(rng, classId),
    bond: rollBond(rng),
    languages: '',
    level: 1,
    deeds: 0,
  }
}

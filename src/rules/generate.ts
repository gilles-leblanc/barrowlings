import { ATTRIBUTE_ARRAY, ATTRIBUTE_IDS, CLASS_IDS, CLASSES, type AttributeId, type Attributes, type ClassId } from '../data/classes'
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
  const [mainValue, secondaryValue, ...rest] = ATTRIBUTE_ARRAY
  const restValues = shuffle(rng, rest)

  const valueFor = (id: AttributeId): number => {
    if (id === main) return mainValue
    if (id === secondary) return secondaryValue
    return restValues.shift()!
  }
  // Keys always come out in ATTRIBUTE_IDS order, so equal attributes compare equal.
  return Object.fromEntries(ATTRIBUTE_IDS.map((id) => [id, valueFor(id)])) as Attributes
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

/** Sections of the sheet that have their own re-roll button (SPEC.md › user flow). */
export const SECTIONS = ['class', 'name', 'background', 'characteristic', 'trait', 'attributes', 'kit', 'bond', 'spells'] as const
export type Section = (typeof SECTIONS)[number]

/** Picks a value other than `current` when the list allows it, so a re-roll visibly changes something. */
function pickOther<T>(rng: Rng, list: readonly T[], current: T): T {
  const others = list.filter((item) => item !== current)
  return pick(rng, others.length > 0 ? others : list)
}

/** Re-rolls until the result differs from `current` (by value), giving up after a few tries. */
function rerollUntilDifferent<T>(roller: () => T, current: T): T {
  let next = roller()
  for (let i = 0; i < 20 && JSON.stringify(next) === JSON.stringify(current); i++) next = roller()
  return next
}

/** Changes class and re-rolls everything that depends on it; keeps everything else (SPEC.md › user flow). */
export function changeClass(rng: Rng, character: Character, classId: ClassId): Character {
  const c = CLASSES[classId]
  return {
    ...character,
    classId,
    name: pick(rng, c.names),
    background: pick(rng, c.backgrounds),
    attributes: rollAttributes(rng, classId),
    gear: { ...character.gear, kit: roll(rng, 4) },
    spells: rollSpells(rng, classId),
  }
}

/** Returns a new character with one section re-rolled and every other section untouched. */
export function rerollSection(rng: Rng, character: Character, section: Section): Character {
  const c = CLASSES[character.classId]
  switch (section) {
    case 'class':
      return changeClass(rng, character, pickOther(rng, CLASS_IDS, character.classId))
    case 'name':
      return { ...character, name: pickOther(rng, c.names, character.name) }
    case 'background':
      return { ...character, background: pickOther(rng, c.backgrounds, character.background) }
    case 'characteristic':
      return { ...character, characteristic: pickOther(rng, c.characteristics, character.characteristic) }
    case 'trait':
      return { ...character, trait: pickOther(rng, c.traits, character.trait) }
    case 'attributes':
      return { ...character, attributes: rerollUntilDifferent(() => rollAttributes(rng, character.classId), character.attributes) }
    case 'kit':
      return { ...character, gear: { ...character.gear, kit: pickOther(rng, [1, 2, 3, 4], character.gear.kit) } }
    case 'bond':
      return { ...character, bond: { ...character.bond, text: pickOther(rng, BONDS, character.bond.text) } }
    case 'spells':
      if (!isCaster(character.classId)) return character
      return {
        ...character,
        spells: rerollUntilDifferent(() => rollSpells(rng, character.classId).sort(), [...character.spells].sort()),
      }
  }
}

/** p.60: any arrangement of the attribute values is allowed, so any two can be swapped. */
export function swapAttributes(character: Character, a: AttributeId, b: AttributeId): Character {
  const attributes = { ...character.attributes, [a]: character.attributes[b], [b]: character.attributes[a] }
  return { ...character, attributes }
}

export type TextField = 'name' | 'background' | 'characteristic' | 'trait' | 'languages' | 'bond' | 'partyMember'

/** Hand edits from the sheet. `bond` is the bond text; `partyMember` the other character's name. */
export function editText(character: Character, field: TextField, value: string): Character {
  if (field === 'bond') return { ...character, bond: { ...character.bond, text: value } }
  if (field === 'partyMember') return { ...character, bond: { ...character.bond, partyMember: value } }
  return { ...character, [field]: value }
}

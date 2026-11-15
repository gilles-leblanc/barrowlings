import { ATTRIBUTE_IDS, CLASS_IDS, CLASSES, type Attributes, type ClassId } from '../data/classes'
import { pick, shuffle, type Rng } from './dice'

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

export interface Character {
  classId: ClassId
  name: string
  background: string
  characteristic: string
  trait: string
  attributes: Attributes
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
    level: 1,
    deeds: 0,
  }
}

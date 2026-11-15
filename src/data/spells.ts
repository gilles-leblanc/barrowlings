// Level-1 spell lists. Rulebook: Barrows and Banshees v0.17, pp. 82, 87, 93.
import type { ClassId } from './classes'

export interface Spell {
  name: string
  summary: string
}

export const CASTER_CLASSES = ['cleric', 'witch', 'wizard'] as const satisfies readonly ClassId[]
export type CasterClassId = (typeof CASTER_CLASSES)[number]

export function isCaster(classId: ClassId): classId is CasterClassId {
  return (CASTER_CLASSES as readonly ClassId[]).includes(classId)
}

export const SPELLS: Record<CasterClassId, readonly Spell[]> = {
  // p.82: Cleric Prayers, Level 1
  cleric: [
    { name: 'Cure Light Wounds', summary: 'Heal a Nearby target for 1d8 HP.' },
    { name: 'Detect Undead', summary: 'For the next Watch you know if there are any undead up to Faraway.' },
    { name: 'Holy Weapon', summary: 'Your weapon’s damage die goes up one step for 1 hour.' },
    { name: 'Light', summary: 'A torch-equivalent light on a Nearby spot or object for 1 hour.' },
  ],
  // p.87: Witch Rites, Level 1
  witch: [
    { name: 'Animal Messenger', summary: 'A small animal carries a short message to a target up to 6 miles away.' },
    { name: 'Detect Affliction', summary: 'Sense if Nearby objects or creatures are poisonous, corrupted or diseased. Lasts 1 hour.' },
    { name: 'Water Breathing', summary: 'A Close creature can breathe underwater. Lasts 1 hour.' },
    { name: 'Soporific Pollen', summary: 'A Nearby humanoid or animal is Distracted for the next Moments.' },
  ],
  // p.93: Wizard Spells, Level 1
  wizard: [
    { name: 'Light', summary: 'A torch-equivalent light on a Nearby spot or object for 1 hour.' },
    { name: 'Magic Missile', summary: 'A target up to Nearby takes 2d4 damage.' },
    { name: 'Magical Armour', summary: 'You gain AV 1, like Light Armour. Does not stack. Lasts a day.' },
    { name: 'Ventriloquism', summary: 'Project your voice up to Distant, to any place you can see. Lasts Minutes.' },
  ],
}

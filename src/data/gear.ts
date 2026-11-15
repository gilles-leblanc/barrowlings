// Gear catalogue and class kits. Rulebook: Barrows and Banshees v0.17.
//
// Tagging rules (SPEC.md › derived values, author-approved):
// 1. Use the equipment-list tag where the item is on pp. 76–77 (or a weapon/armour rule, pp. 69–74).
// 2. Clothing, headwear, cloaks, masks and jewellery are `worn`; bags (backpack, sack, quiver) don't count (p.69).
// 3. Fist-sized items are `tiny` (p.69).
// 4. Everything else is `normal`.
// Items not on the equipment list that could be tiny are normal unless clearly jewellery (author review, 2026-11-14).

import { CLASSES, type ClassId, type WeaponCategory } from './classes'

export type GearTag = 'normal' | 'encumbering' | 'stack' | 'tiny' | 'worn'

/** p.69 slot rules. Armour slots: Light 1 (p.70). */
export const SLOT_COST: Record<GearTag, number> = {
  normal: 1,
  encumbering: 2,
  stack: 1,
  tiny: 0,
  worn: 0,
}

export interface Item {
  tag: GearTag
  weapon?: WeaponCategory
  armour?: 'light' | 'medium' | 'heavy'
  shield?: true
}

const ITEM_DATA = {
  // ── Weapons (pp. 73–74) ─────────────────────────────
  'Club': { tag: 'normal', weapon: 'simple' },
  'Cudgel': { tag: 'normal', weapon: 'simple' },
  'Bone club': { tag: 'normal', weapon: 'simple' },
  'Dagger': { tag: 'normal', weapon: 'simple' },
  'Long knife': { tag: 'normal', weapon: 'simple' },
  'Hunting knife': { tag: 'normal', weapon: 'simple' },
  'Curved knife': { tag: 'normal', weapon: 'simple' },
  'Darts': { tag: 'normal', weapon: 'simple' },
  'Throwing knife': { tag: 'normal', weapon: 'simple' },
  "Shepherd's axe": { tag: 'normal', weapon: 'simple' },
  'Sickle': { tag: 'normal', weapon: 'simple' },
  'Staff': { tag: 'encumbering', weapon: 'simple' }, // p.73: staff (encumbering)
  'Gnarled staff': { tag: 'encumbering', weapon: 'simple' },
  'Hand axe': { tag: 'normal', weapon: 'standard' },
  'Hunting bow': { tag: 'normal', weapon: 'standard' },
  'Mace': { tag: 'normal', weapon: 'standard' },
  'Rapier': { tag: 'normal', weapon: 'standard' },
  'Side sword': { tag: 'normal', weapon: 'standard' },
  'Short sword': { tag: 'normal', weapon: 'standard' },
  'Spear': { tag: 'normal', weapon: 'standard' },
  "Horseman's pick": { tag: 'normal', weapon: 'martial' },
  'War hammer': { tag: 'normal', weapon: 'martial' },
  '2 javelins': { tag: 'normal', weapon: 'martial' },
  'Long sword': { tag: 'normal', weapon: 'martial' },
  'Polearm (halberd)': { tag: 'encumbering', weapon: 'twoHandedMartial' }, // p.74: all two-handed martial are encumbering

  // ── Armour and shields (pp. 70–71) ──────────────────
  'Gambeson': { tag: 'normal', armour: 'light' }, // Light armour: 1 slot, AV 1
  'Shield': { tag: 'normal', shield: true },

  // ── Equipment-list items (pp. 76–77) ────────────────
  'Arrows': { tag: 'stack' },
  'Backpack': { tag: 'worn' },
  'Bear trap': { tag: 'normal' },
  'Small bell': { tag: 'tiny' }, // Bell (tiny)
  'Caltrops': { tag: 'normal' },
  'Candles': { tag: 'stack' },
  'Small cauldron': { tag: 'normal' },
  'Chalk': { tag: 'stack' },
  'Box of chalk powder': { tag: 'stack' },
  'Charcoal': { tag: 'stack' },
  'Hooded cloak': { tag: 'worn' },
  'Brown cloak': { tag: 'worn' },
  'Clothes': { tag: 'worn' },
  'Compass': { tag: 'normal' }, // untagged on p.76; author: normal
  'Crowbar': { tag: 'encumbering' },
  'Firecrackers': { tag: 'tiny' },
  'Skillet': { tag: 'normal' }, // Frying pan
  'Grappling hook': { tag: 'normal' },
  'Small hammer': { tag: 'normal' },
  'Holy symbol': { tag: 'worn' }, // untagged on p.76; author: worn as a pendant
  'Holy water': { tag: 'normal' },
  'Hunting horn': { tag: 'normal' },
  'Lantern': { tag: 'normal' },
  'Metal file': { tag: 'normal' },
  'Small mirror': { tag: 'normal' }, // untagged on p.77; author: normal
  'Signaling mirror': { tag: 'normal' }, // author: normal
  'Flute': { tag: 'normal' }, // Musical instrument
  'Oil': { tag: 'stack' },
  'Oiled leather tarpaulin': { tag: 'normal' },
  'Parchment': { tag: 'stack' },
  'Blank parchment': { tag: 'stack' },
  'Large bear pelt': { tag: 'encumbering' }, // Pelt, large (encumbering)
  'Pipe and pipe leaf': { tag: 'normal' }, // untagged on p.77; author: normal
  'Rations': { tag: 'stack' },
  'Rope': { tag: 'normal' },
  'Large sack': { tag: 'worn' }, // bag: doesn't count (p.69)
  'Crosscut saw': { tag: 'normal' },
  'Shovel': { tag: 'normal' },
  'Iron spikes': { tag: 'stack' },
  'Tent': { tag: 'encumbering' },
  'Tinder box': { tag: 'tiny' },
  'Lock picks': { tag: 'normal' }, // Thieves' tools (lock pick), untagged on p.77; author: normal
  'Torches': { tag: 'stack' },
  'Twine': { tag: 'normal' },
  'Waterskin': { tag: 'normal' },
  'Brass whistle': { tag: 'tiny' }, // Whistle (tiny)
  'Winter blanket': { tag: 'normal' },
  'Quiver': { tag: 'worn' }, // bag: doesn't count (p.69)

  // ── Worn: clothing, headwear, masks, jewellery ──────
  'Brown robes': { tag: 'worn' },
  'Pagan robes': { tag: 'worn' },
  'Long fancy robes': { tag: 'worn' },
  'Mask': { tag: 'worn' },
  'Masquerade mask': { tag: 'worn' },
  'Bark mask': { tag: 'worn' },
  'Leather jerkin and riding breeches': { tag: 'worn' }, // SPEC.md decision 2: not armour
  'Tunic': { tag: 'worn' },
  'Tunic and long pants': { tag: 'worn' },
  'Prayer beads': { tag: 'worn' },
  'Worn out fancy clothes': { tag: 'worn' },
  'Peasant clothing': { tag: 'worn' },
  'Bycocket': { tag: 'worn' },
  'Cape': { tag: 'worn' },
  'Tabard': { tag: 'worn' },
  'Tabard with heraldic symbol': { tag: 'worn' },
  'Wide brimmed hat': { tag: 'worn' },
  'Emblazoned surcoat': { tag: 'worn' },
  'Beat up coat and patched pants': { tag: 'worn' },
  'High oiled leather boots': { tag: 'worn' },
  'Black form fitting suit': { tag: 'worn' },
  'Bandana': { tag: 'worn' },
  'Short leather apron': { tag: 'worn' },
  "Jester's hat": { tag: 'worn' },
  'Colourful scarves': { tag: 'worn' },
  'Dirty worn-out clothes': { tag: 'worn' },
  'Road leathers': { tag: 'worn' },
  'Single metal pauldron': { tag: 'worn' }, // SPEC.md decision 2: not armour
  "Miner's helmet": { tag: 'worn' }, // SPEC.md decision 2: not armour
  'Strong boots': { tag: 'worn' },
  'Bird skull headband': { tag: 'worn' },
  'Crow feather cape': { tag: 'worn' },
  'Antler crown': { tag: 'worn' },
  'Silver pendant': { tag: 'worn' },
  'Fur shoulder wrap': { tag: 'worn' }, // SPEC.md decision 2: not armour
  'Bone jewelry': { tag: 'worn' },
  'Spectacles': { tag: 'worn' },
  'Workers clothes': { tag: 'worn' },
  'Dark linen clothing': { tag: 'worn' },
  'Traveling clothes': { tag: 'worn' },
  'Felt hat': { tag: 'worn' },

  // ── Tiny: fits in a closed fist ─────────────────────
  'Scroll with religious poem': { tag: 'normal' }, // author: normal
  'Sweets': { tag: 'normal' }, // author: normal
  'Cup and dice': { tag: 'normal' }, // author: normal
  'Family heirloom locket': { tag: 'tiny' },
  'Signet ring': { tag: 'tiny' },
  'Dried giant rat tail': { tag: 'tiny' },
  'Two headed coin': { tag: 'tiny' },
  'Fake jeweled ring': { tag: 'tiny' },
  "Rabbit's foot": { tag: 'tiny' },
  'Knuckle bones': { tag: 'tiny' },
  'Tarot deck': { tag: 'tiny' },
  'Sewing needle and thread': { tag: 'tiny' },
  'Pot of white face paint': { tag: 'tiny' },
  'Crystal pendulum': { tag: 'tiny' },
  'Magnifying glass': { tag: 'tiny' },
  'Quill and ink bottle': { tag: 'tiny' },
  'Deck of playing cards': { tag: 'tiny' },
  'Handful of dice': { tag: 'tiny' },

  // ── Normal: everything else (1 slot) ────────────────
  'Wooden chalice': { tag: 'normal' },
  'Banner': { tag: 'normal' },
  'Candlestick': { tag: 'normal' },
  'Metal wire': { tag: 'normal' },
  'Lucky deer skull': { tag: 'normal' },
  'Folding metal pole': { tag: 'normal' },
  'Ball of yarn': { tag: 'normal' },
  'Steel flask with liquor': { tag: 'normal' },
  'Hard bristled brush': { tag: 'normal' },
  'Leather sewing kit': { tag: 'normal' },
  'Leg manacles': { tag: 'normal' },
  'Mortar and pestle': { tag: 'normal' },
  'Cauldron tripod': { tag: 'normal' },
  'Small copper bowl': { tag: 'normal' },
  'Yew dowsing rod': { tag: 'normal' },
  'Star charts': { tag: 'normal' },
  'Small crystal ball': { tag: 'normal' },
  'Wand': { tag: 'normal' },
  'Small scale': { tag: 'normal' },
  'Spellbook': { tag: 'normal' },
} satisfies Record<string, Item>

export type ItemName = keyof typeof ITEM_DATA
export const ITEMS: Record<ItemName, Item> = ITEM_DATA

/** p.31: every character starts with these, in addition to class gear. */
export const COMMON_GEAR: readonly ItemName[] = ['Clothes', 'Rations', 'Waterskin']

/** d4 starting kits per class ("Plus choose or roll"). */
export const KITS: Record<ClassId, readonly (readonly ItemName[])[]> = {
  // p.34
  cleric: [
    ["Shepherd's axe", 'Brown robes', 'Skillet', 'Tinder box', 'Winter blanket', 'Oiled leather tarpaulin', 'Scroll with religious poem', 'Sweets'],
    ['Long knife', 'Darts', 'Hooded cloak', 'Torches', 'Tinder box', 'Mask', 'Cup and dice'],
    ['Short sword', 'Leather jerkin and riding breeches', 'Torches', 'Tinder box', 'Shovel', 'Charcoal', 'Blank parchment'],
    ['Cudgel', 'Tunic', 'Small bell', 'Holy water', 'Wooden chalice', 'Prayer beads'],
  ],
  // p.38
  paladin: [
    ['Long sword', 'Worn out fancy clothes', 'Torches', 'Tinder box', 'Banner', 'Family heirloom locket'],
    ['Mace', '2 javelins', 'Gambeson', 'Peasant clothing', 'Candles', 'Tinder box', 'Signet ring', 'Candlestick'],
    ['Short sword', 'Hunting bow', 'Quiver', 'Bycocket', 'Compass', 'Backpack', 'Pipe and pipe leaf'],
    ["Horseman's pick", 'Cape', 'Tabard', 'Small hammer', 'Iron spikes', 'Holy symbol', 'Prayer beads'],
  ],
  // p.42
  ranger: [
    ['Spear', 'Dagger', 'Wide brimmed hat', 'Torches', 'Tinder box', 'Rope', 'Bear trap', 'Metal wire'],
    ['Short sword', 'Hunting knife', 'Emblazoned surcoat', 'Torches', 'Tinder box', 'Backpack', 'Tent', 'Hunting horn', 'Signaling mirror'],
    ['Hand axe', 'Sickle', 'Beat up coat and patched pants', 'Backpack', 'Crosscut saw', 'Large bear pelt', 'Lucky deer skull'],
    ['Side sword', 'Cudgel', 'High oiled leather boots', 'Torches', 'Tinder box', 'Crowbar', 'Dried giant rat tail', 'Box of chalk powder'],
  ],
  // p.46
  thief: [
    ['Cudgel', 'Black form fitting suit', 'Rope', 'Grappling hook', 'Large sack', 'Two headed coin', 'Metal file'],
    ['Rapier', 'Bandana', 'Short leather apron', 'Torches', 'Tinder box', 'Iron spikes', 'Small hammer', 'Firecrackers', 'Folding metal pole'],
    ['Dagger', 'Darts', "Jester's hat", 'Masquerade mask', 'Small mirror', 'Flute', 'Colourful scarves'],
    ['Club', 'Dirty worn-out clothes', 'Torches', 'Tinder box', 'Winter blanket', 'Fake jeweled ring', 'Ball of yarn'],
  ],
  // p.50
  warrior: [
    ['Spear', 'Throwing knife', 'Gambeson', 'Road leathers', 'Torches', 'Tinder box', 'Backpack', 'Steel flask with liquor', 'Single metal pauldron'],
    ['Short sword', 'Gambeson', 'Shield', 'Tabard with heraldic symbol', 'Large sack', 'Rope', 'Hard bristled brush', 'Leather sewing kit'],
    ['War hammer', "Miner's helmet", 'Bandana', 'Lantern', 'Oil', 'Tinder box', 'Chalk', "Rabbit's foot"],
    ['Polearm (halberd)', 'Club', 'Tunic and long pants', 'Strong boots', 'Caltrops', 'Brass whistle', 'Leg manacles'],
  ],
  // p.54
  witch: [
    ['Gnarled staff', 'Hooded cloak', 'Bird skull headband', 'Oiled leather tarpaulin', 'Mortar and pestle', 'Knuckle bones'],
    ['Dagger', 'Crow feather cape', 'Pagan robes', 'Small cauldron', 'Cauldron tripod', 'Tinder box', 'Tarot deck', 'Small copper bowl'],
    ['Bone club', 'Antler crown', 'Silver pendant', 'Twine', 'Chalk', 'Sewing needle and thread', 'Pot of white face paint'],
    ['Sickle', 'Bark mask', 'Fur shoulder wrap', 'Bone jewelry', 'Torches', 'Tinder box', 'Yew dowsing rod', 'Crystal pendulum'],
  ],
  // p.58
  wizard: [
    ['Dagger', 'Spectacles', 'Workers clothes', 'Torches', 'Tinder box', 'Star charts', 'Magnifying glass'],
    ['Darts', 'Long fancy robes', 'Parchment', 'Quill and ink bottle', 'Small crystal ball', 'Wand'],
    ['Curved knife', 'Dark linen clothing', 'Brown cloak', 'Torches', 'Tinder box', 'Deck of playing cards', 'Small scale'],
    ['Staff', 'Traveling clothes', 'Felt hat', 'Compass', 'Pipe and pipe leaf', 'Handful of dice'],
  ],
}

/** All gear for a class and kit (1–4): fixed gear, optional gear, the kit, then common gear. */
export function gearItems(classId: ClassId, kit: number): ItemName[] {
  const c = CLASSES[classId]
  return [
    ...(c.fixedGear as readonly ItemName[]),
    ...(c.optionalGear as readonly ItemName[]),
    ...KITS[classId][kit - 1],
    ...COMMON_GEAR,
  ]
}

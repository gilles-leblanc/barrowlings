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
  backgrounds: readonly string[] // d6
  characteristics: readonly string[] // d8
  traits: readonly string[] // d8
  names: readonly string[] // sample names
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
    // pp. 34–35
    backgrounds: ['Village healer', 'Travelling friar', 'Relic seeker', 'Touched by a dead god', 'Apostate cultist', 'Defrocked priest'],
    characteristics: ['Well fed', 'Wiry', 'Braids', 'Wears beads', 'Baby face', 'Shaved head', 'Haunted look', 'Stern face'],
    traits: ['Virtuous', 'Zealous', 'Merciful', 'Caring', 'Confident', 'Stubborn', 'Perfectionist', 'Chastises others'],
    names: ['Eamon', 'Jereth', 'Firmin', 'Elric', 'Bate', 'Maera', 'Calista', 'Anwyn', 'Royse', 'Hawise'],
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
    // pp. 38–39
    backgrounds: ['Stalwart of a fallen order', 'Protector of the people', 'Sanctified blade', 'Converted penitent', 'Noble bastard', 'Left the clergy'],
    characteristics: ['Piercing voice', 'Beautiful / Handsome', 'Steely gaze', 'Tall', 'Perfect smile', 'Soothing voice', 'Fiery gaze', 'Streak of prematurely white hair'],
    traits: ['Fair', 'Flowery speech', 'Never lies', 'Protective', 'Haunted past', 'Virtuous', 'Compassionate', 'Prays often'],
    names: ['Aldric', 'Matthias', 'Hadrian', 'Berach', 'Daman', 'Brynne', 'Helene', 'Ysanne', 'Etheldred', 'Catrin'],
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
    // pp. 42–43
    backgrounds: ['Abomination hunter', 'Wilderness courier', 'Warden of the woods', 'Lost child', 'Gutter stalker', 'Displaced drifter'],
    characteristics: ['Rasping voice', 'Missing finger', 'Eye patch', 'Piercings', 'Wild eyes', 'Square jaw and broad shouldered', 'Sun-leathered skin', 'Long tangled hair'],
    traits: ['Searches for omens', 'Talks to animals', 'Mysterious', 'Quiet', 'Brave', 'Friendly', 'Tragic past', 'Wary of strangers'],
    names: ['Edrik', 'Arfred', 'Henrick', 'Jory', 'Harn', 'Sable', 'Isolde', 'Lowri', 'Meiriona', 'Nest'],
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
    // pp. 46–47
    backgrounds: ['Pickpocket', 'Circus acrobat', 'Dungeon delver', 'Grew up in a sewer gang', 'Tavern performer', 'Cat burglar'],
    characteristics: ['Short', 'Eye-patch', 'Pudgy', 'Narrow face', 'Tattoos', 'Handsome / Beautiful', 'Lithe', 'Shifty eyes'],
    traits: ['Tragic past', 'Manic', 'Hedonist', 'Loves urban legends', 'Thrill seeker', 'Hoards shiny objects', 'Mysterious', 'Gambler'],
    names: ['Silas', 'Perrin', 'Glyn', 'Gerallt', 'Stace', 'Nyx', 'Mira', 'Lira', 'Gladys', 'Gwenneth'],
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
    // pp. 50–51
    backgrounds: ['Noble guard deserter', 'Sell sword', 'Frontier militia veteran', 'Knight errant', 'Abandoned squire', 'Deep mine survivor'],
    characteristics: ['Muscular', 'Wiry', 'Tall', 'Bald', 'Battle standard tattoo', 'Old campaign scar', 'Crooked nose', 'Long haired'],
    traits: ['Brave', 'Stoic', 'Superstitious', 'Prone to laughter', 'Eager', 'Keeps trophies', 'Boastful', 'Rash'],
    names: ['Corvin', 'Rusk', 'Bran', 'Wilmot', 'Finn', 'Meris', 'Sigrid', 'Elska', 'Rowan', 'Meggy'],
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
    // pp. 54–55
    backgrounds: ['Druid of the circle', 'Vermin whisperer', 'Pact with the fey', 'Initiated into witch coven', 'Sown back to life', 'Forest oracle'],
    characteristics: ['Always dirty', 'Beautiful / Handsome', 'Wild hair littered with branches', 'Spider web tattoos', 'Covered in insect bites', 'Missing teeth', 'Strange birthmark', 'Animal-like eyes'],
    traits: ['Dislikes metal', 'Cryptic', 'Jovial', 'Forgets social customs', 'Mercurial', 'Obsessed by stars and moon', 'Unsettling calm', 'Laughs at odd times'],
    names: ['Charon', 'Corvus', 'Ivar', 'Zephyr', 'Vernon', 'Rhianon', 'Morwen', 'Nimue', 'Ysella', 'Morgan'],
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
    // pp. 58–59
    backgrounds: ['Failed academic wizard', 'Magical artifact smuggler', 'Hedge wizard', 'Mutated by magical accident', 'Renegade apprentice', 'Lore seeker'],
    characteristics: ['Tattoos of arcane sigils', 'Beautiful / Handsome', 'Odd coloured eyes (heterochromia)', 'Sunken cheeks', 'Long beard / long hair', 'Shaven head', 'Scrawny', 'Long nose'],
    traits: ['Unsettling laugh', 'Feels superior to non-wizards', 'Easily distracted', 'Know-it-all', 'Studious', 'Absent minded', 'Compassionate', 'Oblivious to danger'],
    names: ['Edrien', 'Raven', 'Puck', 'Jan', 'Cefin', 'Eveline', 'Arienne', 'Sage', 'Holly', 'Delphine'],
  },
}

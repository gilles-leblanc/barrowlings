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
  abilities: readonly Ability[]
}

export interface Ability {
  name: string
  summary: string
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
    // pp. 32–33
    abilities: [
      { name: 'Prayers', summary: 'Prepare and cast Divine prayers (see Spellcasting, p.80).' },
      { name: 'Banish Undead', summary: 'Action: test Presence, modified by the highest HD, per group of Nearby undead. Banished undead take damage equal to your level and flee to Distant for 1d4 + your level Moments.' },
    ],
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
    // pp. 36–37
    abilities: [
      { name: 'Lay on Hands', summary: 'Takes Minutes: heal 1 + your level HP and clear Energy Drain. Then test Presence (with disadvantage if already used today); on a failure, no more today.' },
      { name: 'Rallying Presence', summary: 'You and Nearby allies have advantage on tests to resist fear, charm and paralysis.' },
      { name: 'Shield Bash', summary: 'Pool of shield bash dice equal to your level. After a successful defence, spend one to hit the attacker for d4. Resets each day.' },
      { name: 'Interpose', summary: 'Once per day, take the damage a Close creature would receive.' },
    ],
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
    // pp. 40–41
    abilities: [
      { name: 'Tracker', summary: 'Follow tracks over a distance. Test Awareness to learn roughly how many creatures made them and how fast they travel.' },
      { name: 'Vigilant', summary: 'When Taking Watch, gain advantage, or take both Watches (level ÷ 2 times, minimum 1), then take a normal Watch.' },
      { name: 'Two-handed weapon fighting', summary: 'With a Simple or Standard weapon in the off hand, after a successful main-hand attack make a second attack for 1d4.' },
      { name: 'Ambush', summary: 'Once per encounter, add your level to ranged damage against surprised or unaware enemies.' },
      { name: 'Danger Sense', summary: 'Advantage on Awareness tests to ambush or avoid being surprised.' },
    ],
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
    // pp. 44–45
    abilities: [
      { name: 'Roguish Talents', summary: 'Advantage on sneak and stealth, climbing, disarming traps, and sleight of hand.' },
      { name: 'Strike Back', summary: 'On a critical failure when defending, test Dexterity to hit the attacker back for 1d6.' },
      { name: 'Pick Locks', summary: 'With lock picks, open locks with a Dexterity test.' },
      { name: 'Finesse', summary: 'Attack with Dexterity instead of Strength using knives, daggers, short swords and rapiers.' },
      { name: 'Sneak Attack', summary: 'Against an unaware or surprised creature, attack with Dexterity using a Finesse weapon or club for 2d6 (levels 1–2).' },
    ],
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
    // pp. 48–49
    abilities: [
      { name: 'Dealer of Death', summary: 'Pool of d6 damage dice equal to your level. On an attack, assign them among Close targets, at most 3 per target; test to hit each extra target. Resets each day.' },
      { name: 'Bend Bars, Lift Gates', summary: 'Advantage on bending bars, lifting portcullises, breaking down doors and smashing objects.' },
      { name: 'Improvised Weapon', summary: 'Simple weapons and shields deal Standard damage; throw any Simple weapon; any reasonable object works as a Standard weapon but usually breaks.' },
    ],
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
    // pp. 52–53
    abilities: [
      { name: 'Rites', summary: 'Prepare and cast Witch Rites (see Spellcasting, p.80).' },
      { name: 'Third Eye', summary: 'Detect invisible and polymorphed creatures.' },
      { name: 'Beast Tongues', summary: 'Speak with animals and insects. They are not obliged to answer or obey.' },
      { name: 'Omens', summary: 'Once per day, before a test, grant advantage to it (yours or an ally you can communicate with).' },
    ],
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
    // pp. 56–57
    abilities: [
      { name: 'Spells', summary: 'Prepare and cast Arcane spells (see Spellcasting, p.80).' },
      { name: 'Empowered Magic', summary: 'Once per day, test Presence with disadvantage to extend a spell’s duration one step (Moments → Minutes → Hour → Watch → Day).' },
      { name: 'Spontaneous Magic', summary: 'Once per day, test Presence with disadvantage to cast a known spell that is not prepared. On a failure it fizzles and you take 1d3 damage per spell level.' },
    ],
  },
}

/** p.30: characteristics and traits may be picked from any class. Unique, in class order. */
export function allCharacteristics(): string[] {
  return [...new Set(CLASS_IDS.flatMap((id) => CLASSES[id].characteristics))]
}

export function allTraits(): string[] {
  return [...new Set(CLASS_IDS.flatMap((id) => CLASSES[id].traits))]
}

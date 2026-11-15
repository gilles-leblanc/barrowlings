import { allCharacteristics, allTraits, ATTRIBUTE_IDS, CLASSES, type AttributeId } from '../data/classes'
import { gearItems, ITEMS, type ItemName } from '../data/gear'
import { isCaster, SPELLS } from '../data/spells'
import { armourValue, hasShield, slotCapacity, startingHp, weaponsWithDamage } from '../rules/derive'
import type { Character, Section, TextField } from '../rules/generate'
import { rerollButton } from './controls'

export interface SheetActions {
  reroll(section: Section): void
  /** Text edits don't change derived values, so the sheet is not re-rendered (keeps focus). */
  edit(field: TextField, value: string): void
  /** Swapping changes HP and slots, so the sheet is re-rendered. */
  swap(a: AttributeId, b: AttributeId): void
}

export const ATTRIBUTE_NAMES: Record<AttributeId, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  awa: 'Awareness',
  pre: 'Presence',
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  children: Node[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (text !== undefined) node.textContent = text
  node.append(...children)
  return node
}

function field(label: string, value: string | number, button?: HTMLButtonElement): HTMLDivElement {
  const dd = el('dd', String(value))
  if (button) dd.append(' ', button)
  return el('div', undefined, [el('dt', label), dd])
}

function heading(text: string, button?: HTMLButtonElement): HTMLHeadingElement {
  const h2 = el('h2', text)
  if (button) h2.append(' ', button)
  return h2
}

/** A labelled text input (or textarea) that reports edits as the user types. */
function editable(
  label: string,
  field: TextField,
  value: string,
  actions: SheetActions,
  options: { button?: HTMLButtonElement; list?: string; multiline?: boolean } = {},
): HTMLDivElement {
  const id = `field-${field}`
  const input = options.multiline ? el('textarea') : el('input')
  input.id = id
  input.value = value
  if (input instanceof HTMLInputElement) {
    input.type = 'text'
    if (options.list) input.setAttribute('list', options.list)
  } else {
    input.rows = 2
  }
  input.addEventListener('input', () => actions.edit(field, input.value))

  const labelEl = el('label', label)
  labelEl.htmlFor = id
  const dd = el('dd', undefined, [input])
  if (options.button) dd.append(' ', options.button)
  return el('div', undefined, [el('dt', undefined, [labelEl]), dd])
}

function datalist(id: string, entries: string[]): HTMLDataListElement {
  const list = el('datalist')
  list.id = id
  list.append(...entries.map((entry) => new Option(entry)))
  return list
}

function attributeRow(id: AttributeId, value: number, actions: SheetActions): HTMLDivElement {
  const select = el('select')
  select.setAttribute('aria-label', `Swap ${ATTRIBUTE_NAMES[id]} with`)
  select.append(new Option('Swap with…', ''))
  for (const other of ATTRIBUTE_IDS) {
    if (other !== id) select.append(new Option(ATTRIBUTE_NAMES[other], other))
  }
  select.addEventListener('change', () => {
    if (select.value) actions.swap(id, select.value as AttributeId)
  })
  return el('div', undefined, [el('dt', ATTRIBUTE_NAMES[id]), el('dd', String(value), [document.createTextNode(' '), select])])
}

/** Renders the character into `container`, replacing what was there. All data goes in as text or input values. */
export function renderSheet(container: HTMLElement, character: Character, actions: SheetActions): void {
  const { attributes } = character
  const reroll = (section: Section) => rerollButton(section, actions.reroll)

  const identity = el('dl', undefined, [
    editable('Name', 'name', character.name, actions, { button: reroll('name') }),
    field('Class', CLASSES[character.classId].name, reroll('class')),
    field('Level', character.level),
    editable('Background', 'background', character.background, actions, { button: reroll('background') }),
    field('Deeds', character.deeds),
    editable('Characteristic', 'characteristic', character.characteristic, actions, {
      button: reroll('characteristic'),
      list: 'all-characteristics',
    }),
    editable('Trait', 'trait', character.trait, actions, { button: reroll('trait'), list: 'all-traits' }),
  ])

  const attributeList = el(
    'dl',
    undefined,
    ATTRIBUTE_IDS.map((id) => attributeRow(id, attributes[id], actions)),
  )

  const items = gearItems(character.classId, character.gear.kit)
  const weapons = weaponsWithDamage(items, character.classId)

  const combat = el('dl', undefined, [
    field('HP', startingHp(attributes, character.classId)),
    field('Armour Value', armourValue(items)),
    field('Shield', hasShield(items) ? 'Yes' : 'No'),
  ])
  const weaponList = el(
    'ul',
    undefined,
    weapons.map((w) => el('li', `${w.name} (${w.die})`)),
  )

  const bond = el('dl', undefined, [
    editable('Bond', 'bond', character.bond.text, actions, { button: reroll('bond'), multiline: true }),
    editable('Party Member', 'partyMember', character.bond.partyMember, actions),
    editable('Languages', 'languages', character.languages, actions),
  ])

  container.replaceChildren(
    datalist('all-characteristics', allCharacteristics()),
    datalist('all-traits', allTraits()),
    el('section', undefined, [el('h2', 'Character'), identity]),
    el('section', undefined, [el('h2', 'Bond & Languages'), bond]),
    el('section', undefined, [heading('Attributes', reroll('attributes')), attributeList]),
    el('section', undefined, [el('h2', 'Combat'), combat, el('h3', 'Weapons'), weaponList]),
    renderInventory(items, slotCapacity(attributes), character.gear.coins, reroll('kit')),
    ...renderSpells(character, reroll('spells')),
    renderAbilities(character),
  )
}

function described(entries: readonly { name: string; summary: string }[]): HTMLDListElement {
  return el('dl', undefined, entries.map((e) => field(e.name, e.summary)))
}

function renderSpells(character: Character, button: HTMLButtonElement): HTMLElement[] {
  if (!isCaster(character.classId)) return []
  const known = SPELLS[character.classId].filter((s) => character.spells.includes(s.name))
  return [el('section', undefined, [heading('Spells', button), described(known)])]
}

function renderAbilities(character: Character): HTMLElement {
  return el('section', undefined, [el('h2', 'Abilities'), described(CLASSES[character.classId].abilities)])
}

const STACK_CHECKS = 4 // p.25: each stack has 4 checks

function slotItem(name: ItemName): HTMLLIElement {
  const { tag } = ITEMS[name]
  const li = el('li', name)
  if (tag === 'encumbering') li.append(el('span', ' (2 slots)'))
  if (tag === 'stack') {
    const boxes = el('span', ` ${'☐'.repeat(STACK_CHECKS)}`)
    boxes.setAttribute('aria-label', `stack, ${STACK_CHECKS} checks`)
    li.append(boxes)
  }
  return li
}

function renderInventory(items: ItemName[], capacity: number, coins: number, button: HTMLButtonElement): HTMLElement {
  const byTag = (...tags: string[]) => items.filter((name) => tags.includes(ITEMS[name].tag))
  const list = (names: ItemName[]) => el('p', names.join(', ') || '—')

  return el('section', undefined, [
    heading('Inventory', button),
    el('p', `Slots: ${capacity}`),
    el('ol', undefined, byTag('normal', 'encumbering', 'stack').map(slotItem)),
    el('h3', 'Tiny items'),
    list(byTag('tiny')),
    el('h3', 'Worn'),
    list(byTag('worn')),
    el('dl', undefined, [field('Coins', coins)]),
  ])
}

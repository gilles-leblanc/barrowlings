// Print-only sheet laid out like the playtest Character Sheet 1.2. Hidden on screen (print.css).
import { ATTRIBUTE_IDS, CLASSES } from '../data/classes'
import { gearItems, ITEMS, type ItemName } from '../data/gear'
import { isCaster, SPELLS } from '../data/spells'
import { armourValue, hasShield, slotLines, startingHp, weaponsWithDamage } from '../rules/derive'
import type { Character } from '../rules/generate'
import { ATTRIBUTE_NAMES } from './sheet'

const SHEET_SLOTS = 18 // the playtest sheet has 18 numbered slots
const CHECKS_PER_SLOT = 4 // p.25 stacks; the playtest sheet draws 4 boxes on every slot

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

/** A label followed by an underlined value ("Name ________"). Empty values print as blank lines. */
function line(label: string, value: string | number, className = ''): HTMLDivElement {
  const row = el('div', `p-line ${className}`.trim())
  row.append(el('span', 'p-label', label), el('span', 'p-value', String(value)))
  return row
}

function boxes(count: number): HTMLSpanElement {
  const span = el('span', 'p-boxes')
  for (let i = 0; i < count; i++) span.append(el('span', 'p-box'))
  return span
}

function inventory(items: readonly ItemName[]): HTMLDivElement {
  const lines = slotLines(items)
  const grid = el('div', 'p-slots')
  for (let i = 0; i < SHEET_SLOTS; i++) {
    const slot = lines[i]
    const row = el('div', 'p-slot')
    const text = slot ? (slot.continued ? `${slot.name} (cont.)` : slot.name) : ''
    row.append(el('span', 'p-slot-number', String(i + 1)), el('span', 'p-value', text), boxes(CHECKS_PER_SLOT))
    grid.append(row)
  }
  return grid
}

export function renderPrintSheet(container: HTMLElement, character: Character): void {
  const c = CLASSES[character.classId]
  const items = gearItems(character.classId, character.gear.kit)
  const names = (tag: string) => items.filter((name) => ITEMS[name].tag === tag).join(', ')
  const weapons = weaponsWithDamage(items, character.classId).map((w) => `${w.name} (${w.die})`)
  const bond = character.bond.partyMember
    ? character.bond.text.replaceAll('Party Member', character.bond.partyMember)
    : character.bond.text

  const page1 = el('div', 'p-page')
  page1.append(el('h1', 'p-title', 'Barrows and Banshees'))

  const header = el('div', 'p-header')
  header.append(
    line('Name', character.name, 'p-name'),
    line('Class', c.name, 'p-class'),
    line('Level', character.level, 'p-short'),
    line('Background', character.background, 'p-background'),
    line('Deeds', character.deeds, 'p-short'),
    line('Bond', bond, 'p-bond'),
    line('Party Member', character.bond.partyMember, 'p-party'),
  )

  const attributes = el('div', 'p-attributes')
  for (const id of ATTRIBUTE_IDS) {
    const row = el('div', 'p-attribute')
    row.append(el('span', 'p-label', ATTRIBUTE_NAMES[id]), el('span', 'p-attribute-box', String(character.attributes[id])))
    attributes.append(row)
  }

  const shield = el('span', 'p-box p-check', hasShield(items) ? '✕' : '')
  const shieldRow = el('div', 'p-line p-inline')
  shieldRow.append(el('span', 'p-label', 'Shield'), shield)

  const details = el('div', 'p-details')
  details.append(
    line('Languages', character.languages),
    el('div', 'p-label p-block-label', 'Characteristics, Traits, Quirks'),
    el('div', 'p-value p-block', character.characteristic),
    el('div', 'p-value p-block', character.trait),
    line('HP', startingHp(character.attributes, character.classId), 'p-half'),
    line('Current', '', 'p-half'),
    line('Armour Value', armourValue(items), 'p-half'),
    shieldRow,
    el('div', 'p-label p-block-label', 'Weapons'),
    el('div', 'p-value p-block', weapons.slice(0, 2).join(', ')),
    el('div', 'p-value p-block', weapons.slice(2).join(', ')),
  )

  const body = el('div', 'p-body')
  body.append(attributes, details)

  const inventoryTitle = el('div', 'p-inventory-title')
  inventoryTitle.append(el('span', 'p-label', 'Inventory'))

  page1.append(
    header,
    body,
    inventoryTitle,
    inventory(items),
    line('Tiny Items', names('tiny')),
    line('Coins', character.gear.coins, 'p-coins'),
    line('Worn', names('worn'), 'p-worn'),
  )

  const page2 = el('div', 'p-page p-page-2')
  if (isCaster(character.classId)) {
    page2.append(el('h2', 'p-heading', 'Spells'))
    for (const spell of SPELLS[character.classId].filter((s) => character.spells.includes(s.name))) {
      page2.append(el('p', 'p-entry', `${spell.name}: ${spell.summary}`))
    }
  }
  page2.append(el('h2', 'p-heading', 'Abilities'))
  for (const ability of c.abilities) page2.append(el('p', 'p-entry', `${ability.name}: ${ability.summary}`))

  container.replaceChildren(page1, page2)
}

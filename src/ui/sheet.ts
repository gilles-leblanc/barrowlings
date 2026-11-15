import { ATTRIBUTE_IDS, CLASSES, type AttributeId } from '../data/classes'
import { gearItems, ITEMS, type ItemName } from '../data/gear'
import { isCaster, SPELLS } from '../data/spells'
import { armourValue, hasShield, slotCapacity, startingHp, weaponsWithDamage } from '../rules/derive'
import type { Character } from '../rules/generate'

const ATTRIBUTE_NAMES: Record<AttributeId, string> = {
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

function field(label: string, value: string | number): HTMLDivElement {
  return el('div', undefined, [el('dt', label), el('dd', String(value))])
}

/** Renders the character into `container`, replacing what was there. All data goes in as text. */
export function renderSheet(container: HTMLElement, character: Character): void {
  const { attributes } = character

  const identity = el('dl', undefined, [
    field('Name', character.name),
    field('Class', CLASSES[character.classId].name),
    field('Level', character.level),
    field('Background', character.background),
    field('Deeds', character.deeds),
    field('Characteristic', character.characteristic),
    field('Trait', character.trait),
  ])

  const attributeList = el(
    'dl',
    undefined,
    ATTRIBUTE_IDS.map((id) => field(ATTRIBUTE_NAMES[id], attributes[id])),
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
    field('Bond', character.bond.text),
    field('Party Member', character.bond.partyMember),
    field('Languages', character.languages),
  ])

  container.replaceChildren(
    el('section', undefined, [el('h2', 'Character'), identity]),
    el('section', undefined, [el('h2', 'Bond & Languages'), bond]),
    el('section', undefined, [el('h2', 'Attributes'), attributeList]),
    el('section', undefined, [el('h2', 'Combat'), combat, el('h3', 'Weapons'), weaponList]),
    renderInventory(items, slotCapacity(attributes), character.gear.coins),
    ...renderSpells(character),
    renderAbilities(character),
  )
}

function described(entries: readonly { name: string; summary: string }[]): HTMLDListElement {
  return el('dl', undefined, entries.map((e) => field(e.name, e.summary)))
}

function renderSpells(character: Character): HTMLElement[] {
  if (!isCaster(character.classId)) return []
  const known = SPELLS[character.classId].filter((s) => character.spells.includes(s.name))
  return [el('section', undefined, [el('h2', 'Spells'), described(known)])]
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

function renderInventory(items: ItemName[], capacity: number, coins: number): HTMLElement {
  const byTag = (...tags: string[]) => items.filter((name) => tags.includes(ITEMS[name].tag))
  const list = (names: ItemName[]) => el('p', names.join(', ') || '—')

  return el('section', undefined, [
    el('h2', 'Inventory'),
    el('p', `Slots: ${capacity}`),
    el('ol', undefined, byTag('normal', 'encumbering', 'stack').map(slotItem)),
    el('h3', 'Tiny items'),
    list(byTag('tiny')),
    el('h3', 'Worn'),
    list(byTag('worn')),
    el('dl', undefined, [field('Coins', coins)]),
  ])
}

import { ATTRIBUTE_IDS, CLASSES, type AttributeId } from '../data/classes'
import { slotCapacity, startingHp } from '../rules/derive'
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

  const vitals = el('dl', undefined, [
    field('HP', startingHp(attributes, character.classId)),
    field('Inventory slots', slotCapacity(attributes)),
  ])

  container.replaceChildren(
    el('section', undefined, [el('h2', 'Character'), identity]),
    el('section', undefined, [el('h2', 'Attributes'), attributeList]),
    el('section', undefined, [el('h2', 'Vitals'), vitals]),
  )
}

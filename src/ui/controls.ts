import type { Section } from '../rules/generate'

export type RerollHandler = (section: Section) => void

const SECTION_LABELS: Record<Section, string> = {
  class: 'class',
  name: 'name',
  background: 'background',
  characteristic: 'characteristic',
  trait: 'trait',
  attributes: 'attributes',
  kit: 'kit',
  bond: 'bond',
  spells: 'spells',
}

/** A small "Re-roll" button with an accessible label naming the section. */
export function rerollButton(section: Section, onReroll: RerollHandler): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'reroll'
  button.textContent = '↻'
  button.title = `Re-roll ${SECTION_LABELS[section]}`
  button.setAttribute('aria-label', `Re-roll ${SECTION_LABELS[section]}`)
  button.addEventListener('click', () => onReroll(section))
  return button
}

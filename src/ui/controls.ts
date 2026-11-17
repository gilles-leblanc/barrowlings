import type { Section } from '../rules/generate'

export type RerollHandler = (section: Section) => void

/** A small "Re-roll" button with an accessible label naming the section. */
export function rerollButton(section: Section, onReroll: RerollHandler): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'reroll'
  button.textContent = '↻'
  button.title = `Re-roll ${section}`
  button.setAttribute('aria-label', `Re-roll ${section}`)
  button.addEventListener('click', () => onReroll(section))
  return button
}

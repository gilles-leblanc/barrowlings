import { CLASS_IDS, CLASSES, type ClassId } from './data/classes'
import { defaultRng } from './rules/dice'
import { generateCharacter, rerollSection, type Character } from './rules/generate'
import { renderSheet } from './ui/sheet'

const form = document.querySelector<HTMLFormElement>('#roll-form')!
const picker = document.querySelector<HTMLSelectElement>('#class-picker')!
const sheet = document.querySelector<HTMLElement>('#sheet')!

for (const id of CLASS_IDS) picker.add(new Option(CLASSES[id].name, id))

let character: Character | undefined

function show(next: Character): void {
  character = next
  renderSheet(sheet, character, (section) => show(rerollSection(defaultRng, character!, section)))
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const classId = (picker.value || undefined) as ClassId | undefined
  show(generateCharacter(defaultRng, classId))
})

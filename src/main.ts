import './styles/main.css'
import { CLASS_IDS, CLASSES, type ClassId } from './data/classes'
import { defaultRng } from './rules/dice'
import { editText, generateCharacter, rerollSection, swapAttributes, type Character } from './rules/generate'
import { renderSheet, type SheetActions } from './ui/sheet'

const form = document.querySelector<HTMLFormElement>('#roll-form')!
const picker = document.querySelector<HTMLSelectElement>('#class-picker')!
const sheet = document.querySelector<HTMLElement>('#sheet')!

for (const id of CLASS_IDS) picker.add(new Option(CLASSES[id].name, id))

let character: Character | undefined

const actions: SheetActions = {
  reroll: (section) => show(rerollSection(defaultRng, character!, section)),
  edit: (field, value) => (character = editText(character!, field, value)),
  swap: (a, b) => show(swapAttributes(character!, a, b)),
}

function show(next: Character): void {
  character = next
  renderSheet(sheet, character, actions)
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const classId = (picker.value || undefined) as ClassId | undefined
  show(generateCharacter(defaultRng, classId))
})

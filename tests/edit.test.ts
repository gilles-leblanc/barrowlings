import { describe, expect, it } from 'vitest'
import { ATTRIBUTE_IDS, CLASS_IDS, CLASSES, allCharacteristics, allTraits } from '../src/data/classes'
import { createRng } from '../src/rules/dice'
import { editText, generateCharacter, swapAttributes } from '../src/rules/generate'

describe('swapAttributes (p.60: any arrangement is allowed)', () => {
  it('swaps any two attributes, for every pair', () => {
    const character = generateCharacter(createRng(1), 'thief')
    for (const a of ATTRIBUTE_IDS) {
      for (const b of ATTRIBUTE_IDS) {
        const swapped = swapAttributes(character, a, b).attributes
        expect(swapped[a]).toBe(character.attributes[b])
        expect(swapped[b]).toBe(character.attributes[a])
        const values = ATTRIBUTE_IDS.map((id) => swapped[id]).sort((x, y) => x - y)
        expect(values).toEqual([7, 8, 10, 13, 14])
      }
    }
  })

  it('leaves the rest of the character alone and does not mutate it', () => {
    const character = generateCharacter(createRng(2), 'wizard')
    const copy = structuredClone(character)
    const swapped = swapAttributes(character, 'pre', 'str')
    expect(character).toEqual(copy)
    expect({ ...swapped, attributes: character.attributes }).toEqual(character)
  })
})

describe('editText', () => {
  it.each(['name', 'background', 'characteristic', 'trait', 'languages'] as const)('sets %s', (field) => {
    const character = generateCharacter(createRng(3))
    expect(editText(character, field, 'Custom value')[field]).toBe('Custom value')
  })

  it('sets the bond text and the other character separately', () => {
    const character = generateCharacter(createRng(4))
    const withText = editText(character, 'bond', 'We share a secret.')
    expect(withText.bond).toEqual({ text: 'We share a secret.', partyMember: '' })
    expect(editText(withText, 'partyMember', 'Sigrid').bond).toEqual({ text: 'We share a secret.', partyMember: 'Sigrid' })
  })

  it('does not mutate the original character', () => {
    const character = generateCharacter(createRng(5))
    const copy = structuredClone(character)
    editText(character, 'partyMember', 'Rowan')
    expect(character).toEqual(copy)
  })
})

describe('cross-class pickers (p.30: pick from another class)', () => {
  it('allCharacteristics includes every class table entry, without duplicates', () => {
    const all = allCharacteristics()
    for (const id of CLASS_IDS) for (const entry of CLASSES[id].characteristics) expect(all).toContain(entry)
    expect(new Set(all).size).toBe(all.length)
  })

  it('allTraits includes every class table entry, without duplicates', () => {
    const all = allTraits()
    for (const id of CLASS_IDS) for (const entry of CLASSES[id].traits) expect(all).toContain(entry)
    expect(new Set(all).size).toBe(all.length)
  })
})

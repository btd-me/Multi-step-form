import { describe, expect, it } from 'vitest'
import { validateEmpty } from './validation.ts'

describe('validateEmpty', () => {
  it.each([
    ['empty string', ''],
    ['one space', ' '],
    ['two spaces', '  '],
    ['newline', '\n'],
    ['zero-width space', '\u200B'],
    ['two zero width space', '\u200B\u200B'],
  ])('AC-1.2 returns required for %s', (_label, value) => {
    expect(validateEmpty(value)).toBe('required')
  })

  it.each([
    ['a name', 'Ann'],
    ['a name with a space in between', 'An n'],
    ['digits', '1234'],
    ['a single character', '1'],
  ])('AC-1.2 returns null for %s', (_label, value) => {
    expect(validateEmpty(value)).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { validateEmail, validateEmpty } from './validation.ts'

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

describe('validateEmail', () => {
  it.each([
    ['empty string', ''],
    ['spaces only', '   '],
  ])('AC-1.3 returns required, not invalidFormat, for %s', (_label, value) => {
    expect(validateEmail(value)).toBe('required')
  })

  it.each([
    ['no @', 'a'],
    ['no TLD', 'a@a'],
    ['consecutive dots in the domain', 'b@a..com'],
    ['two @ signs', 'b@@a.com'],
    ['empty local part', '@a.com'],
    ['empty domain label', 'a@.com'],
    ['a space in the local part', 'a b@a.com'],
    ['a one-letter TLD', 'a@a.c'],
    ['trailing text after the address', 'a@a.com x'],
  ])('AC-1.3 returns invalidFormat for %s', (_label, value) => {
    expect(validateEmail(value)).toBe('invalidFormat')
  })

  it.each([
    ['a minimal address', 'a@a.com'],
    ['a dot in the local part', 'first.last@example.com'],
    ['plus addressing', 'a+tag@example.com'],
    ['subdomains and a multi-part TLD', 'a@mail.example.co.uk'],
    ['uppercase', 'A@Example.COM'],
  ])('AC-1.3 returns null for %s', (_label, value) => {
    expect(validateEmail(value)).toBeNull()
  })
})

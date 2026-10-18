import { describe, expect, it } from 'vitest'
import {
  validateEmail,
  validateEmpty,
  validatePhoneNumber,
} from './validation.ts'

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

describe('validatePhoneNumber', () => {
  it.each([
    ['empty string', ''],
    ['spaces only', '   '],
  ])('AC-1.4 returns required, not invalidFormat, for %s', (_label, value) => {
    expect(validatePhoneNumber(value)).toBe('required')
  })

  it.each([
    ['a plus sign only', '+'],
    ['4 digits', '+1 (123)'],
    ['6 digits, one under the minimum', '123456'],
    ['16 digits, one over the maximum', '1234567890123456'],
    ['more than one pair of parentheses', '+1 (234) (567) (8910)'],
    ['a plus sign that is not leading', '1+234567890'],
    ['two plus signs', '++1234567890'],
    ['a dot', '234.567.8901'],
    ['letters', '123abc4567'],
    ['an unclosed parenthesis', '(234 5678901'],
    ['an unopened parenthesis', '234) 5678901'],
    ['a plus sign inside parentheses', '(+1) 234 567 890'],
    ['empty parentheses', '() 1234567'],
  ])('AC-1.4 returns invalidFormat for %s', (_label, value) => {
    expect(validatePhoneNumber(value)).toBe('invalidFormat')
  })

  it.each([
    ['the placeholder', '+1 234 567 890'],
    ['an international number with no spaces', '+919912399123'],
    ['parentheses around the area code', '+1 (123) 456 7890'],
    ['digits only', '1234567890'],
    ['hyphens', '123-456-7890'],
    ['exactly 7 digits', '1234567'],
    ['exactly 15 digits', '123456789012345'],
  ])('AC-1.4 returns null for %s', (_label, value) => {
    expect(validatePhoneNumber(value)).toBeNull()
  })
})

export type ValidationError = 'required' | 'invalidFormat'

// Invisible characters that String.prototype.trim() does not remove.
const ZERO_WIDTH_CHARS = /[\u200B-\u200D\u2060]/g

export function validateEmpty(field: string): ValidationError | null {
  const visible = field.replace(ZERO_WIDTH_CHARS, '').trim()
  return visible === '' ? 'required' : null
}

// local@domain.tld (D-10): one @, no spaces in the local part,
// dot-separated ASCII domain labels, and a TLD of 2+ letters.
const EMAIL_FORMAT = /^[^\s@]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/

function isValidEmail(email: string): boolean {
  return EMAIL_FORMAT.test(email)
}

export function validateEmail(value: string): ValidationError | null {
  return validateEmpty(value) ?? (isValidEmail(value) ? null : 'invalidFormat')
}

// Phone rule (D-4): digits, spaces, hyphens and parentheses, with an optional
// leading +, at most one pair of parentheses around digits only, and 7-15 digits.
const PHONE_CHARS = /^\+?[\d ()-]+$/
const PAREN_GROUP = /\(\d+\)/
const MIN_PHONE_DIGITS = 7
const MAX_PHONE_DIGITS = 15

function isValidPhoneNumber(phNumber: string): boolean {
  const digitCount = phNumber.replace(/\D/g, '').length
  if (digitCount < MIN_PHONE_DIGITS || digitCount > MAX_PHONE_DIGITS)
    return false
  if (!PHONE_CHARS.test(phNumber)) return false
  // Remove the one allowed group; any parenthesis left over is invalid.
  return !/[()]/.test(phNumber.replace(PAREN_GROUP, ''))
}

export function validatePhoneNumber(phNumber: string): ValidationError | null {
  return (
    validateEmpty(phNumber) ??
    (isValidPhoneNumber(phNumber) ? null : 'invalidFormat')
  )
}

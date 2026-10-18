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

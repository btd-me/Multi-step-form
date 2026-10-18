export type ValidationError = 'required'

// Invisible characters that String.prototype.trim() does not remove.
const ZERO_WIDTH_CHARS = /[​-‍⁠]/g

export function validateEmpty(field: string): ValidationError | null {
  const visible = field.replace(ZERO_WIDTH_CHARS, '').trim()
  return visible === '' ? 'required' : null
}

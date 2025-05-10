
import { describe, it, expect } from 'vitest'
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

describe('capitalize', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
  })

  it('handles empty strings', () => {
    expect(capitalize('')).toBe('')
  })
})
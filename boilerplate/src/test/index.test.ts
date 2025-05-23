import { capitalize } from '../index.js'
import { describe, it, expect } from 'vitest'
describe('capitalize', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
  })

  it('handles empty strings', () => {
    expect(capitalize('')).toBe('')
  })
})
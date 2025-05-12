import { describe, it, expect } from 'vitest'
import { currentSecond } from '../currentSecond'

describe('currentSecond', () => {
  it('should return the current second', () => {
    expect(Math.abs(currentSecond() - new Date().getSeconds())).toBeLessThan(100)
  })
})
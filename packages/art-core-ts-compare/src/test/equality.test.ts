import { describe, it, expect } from 'vitest'
import { eq, neq, lt, gt, lte, gte } from '../equality'

describe('equality helpers', () => {
  it('eq and neq', () => {
    expect(eq(1, 1)).toBe(true)
    expect(eq(1, 2)).toBe(false)
    expect(neq(1, 2)).toBe(true)
    expect(neq(1, 1)).toBe(false)
    expect(eq('a', 'a')).toBe(true)
    expect(neq('a', 'b')).toBe(true)
  })

  it('lt, gt, lte, gte', () => {
    expect(lt(1, 2)).toBe(true)
    expect(lt(2, 1)).toBe(false)
    expect(gt(2, 1)).toBe(true)
    expect(gt(1, 2)).toBe(false)
    expect(lte(1, 1)).toBe(true)
    expect(lte(1, 2)).toBe(true)
    expect(lte(2, 1)).toBe(false)
    expect(gte(2, 2)).toBe(true)
    expect(gte(2, 1)).toBe(true)
    expect(gte(1, 2)).toBe(false)
  })

  it('works with arrays and objects', () => {
    expect(eq([1, 2], [1, 2])).toBe(true)
    expect(neq([1, 2], [2, 1])).toBe(true)
    expect(lt([1], [1, 2])).toBe(true)
    expect(gt([1, 2], [1])).toBe(true)
    expect(eq({ a: 1 }, { a: 1 })).toBe(true)
    expect(neq({ a: 1 }, { a: 2 })).toBe(true)
  })
})
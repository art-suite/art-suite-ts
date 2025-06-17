import { describe, it, expect } from 'vitest'
import { isComprehensionIterable, isFullySupportedComprehensionIterable } from '../index'

describe('isComprehensionIterable - true resulting inputs', () => {
  it('should return true for an array', () => {
    expect(isComprehensionIterable([1, 2, 3])).toBe(true)
  })
  it('should return true for an object', () => {
    expect(isComprehensionIterable({ a: 1, b: 2, c: 3 })).toBe(true)
  })
  it('should return true for a Map', () => {
    expect(isComprehensionIterable(new Map([['a', 1], ['b', 2], ['c', 3]]))).toBe(true)
  })
  it('should return true for a Set', () => {
    expect(isComprehensionIterable(new Set([1, 2, 3]))).toBe(true)
  })
})

describe('isComprehensionIterable - false resulting inputs', () => {
  it('should return false for a number', () => {
    expect(isComprehensionIterable(1)).toBe(false)
  })
  it('should return false for a string', () => {
    expect(isComprehensionIterable('1')).toBe(false)
  })
  it('should return false for a function', () => {
    expect(isComprehensionIterable(() => { })).toBe(false)
  })
  it('should return false for a promise', () => {
    expect(isComprehensionIterable(Promise.resolve(1))).toBe(false)
  })
})

describe('isFullySupportedComprehensionIterable - true resulting inputs', () => {
  it('should return true for an array', () => {
    expect(isFullySupportedComprehensionIterable([1, 2, 3])).toBe(true)
  })
  it('should return true for an object', () => {
    expect(isFullySupportedComprehensionIterable({ a: 1, b: 2, c: 3 })).toBe(true)
  })
})

describe(' isFullySupportedComprehensionIterable - false resulting inputs', () => {
  it('should return false for a number', () => {
    expect(isFullySupportedComprehensionIterable(1)).toBe(false)
  })
  it('should return false for a string', () => {
    expect(isFullySupportedComprehensionIterable('1')).toBe(false)
  })
  it('should return false for a function', () => {
    expect(isFullySupportedComprehensionIterable(() => { })).toBe(false)
  })
  it('should return false for a promise', () => {
    expect(isFullySupportedComprehensionIterable(Promise.resolve(1))).toBe(false)
  })

  //sets and maps are not supported, and should return false
  it('should return false for a Set', () => {
    expect(isFullySupportedComprehensionIterable(new Set([1, 2, 3]))).toBe(false)
  })
  it('should return false for a Map', () => {
    expect(isFullySupportedComprehensionIterable(new Map([['a', 1], ['b', 2], ['c', 3]]))).toBe(false)
  })
})
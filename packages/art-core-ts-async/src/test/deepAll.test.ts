import { describe, it, expect } from 'vitest'
import { deepAll } from '../index.ts'

describe('deepAll', () => {
  it('should do nothing to non-promise values', async () => {
    const obj = { a: 1, b: '2', c: [3, 4] }
    const result = await deepAll(obj)
    expect(result).toEqual(obj)
  })

  // it('should resolve all promises in a nested object/array structure', async () => {
  //   const obj = { a: 1, b: Promise.resolve(2), c: [Promise.resolve(3), Promise.resolve(4)] }
  //   const result = await deepAll(obj)
  //   expect(result).toEqual({ a: 1, b: 2, c: [3, 4] })
  // })
})
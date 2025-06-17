import { deepEach, deepMap, map } from '../index'
import { expect } from 'chai'
import { describe, it } from 'vitest'

describe('DeepComprehensions', () => {
  describe('basic map', () => {
    it('should be able to map over a an object', () => {
      const obj = {
        a: 1,
        b: 2,
        c: 3
      }
      const result = deepMap(obj, value => value + 1)
      expect(result).to.deep.equal({
        a: 2,
        b: 3,
        c: 4
      })
    })

    it('should be able to map over a deeply nested comprehension iterable', () => {
      const obj = {
        a: 1,
        b: 2,
        c: [1, 2, 3]
      }
      const result = deepMap(obj, value => value + 1)
      expect(result).to.deep.equal({
        a: 2,
        b: 3,
        c: [2, 3, 4]
      })
    })
  })
  describe('deepMap with when', () => {
    it('should be able to map over a deeply nested comprehension iterable with a when function', () => {
      const obj = {
        a: 1,
        b: 2,
        c: [1, 2, 3]
      }
      const result = deepMap(obj, { with: value => value + 1, when: (value, key) => key !== 'c' })
      expect(result).to.deep.equal({
        a: 2,
        b: 3
      })
    })
  })
  describe('deepEach', () => {
    it('should be able to iterate over a deeply nested comprehension iterable', () => {
      let sum = 0
      const obj = {
        a: 1,
        b: 2,
        c: [1, 2, 3]
      }
      deepEach(obj, value => sum += value)
      expect(sum).to.equal(9)
    })
  })
})

describe('map', () => {
  it('should be able to map over a deeply nested comprehension iterable, but only shallowly', () => {
    const obj = {
      a: 1,
      b: 2,
      c: [1, 2, 3]
    }
    const result = map(obj, value => value + 10)
    expect(result).to.deep.equal({
      a: 11,
      b: 12,
      c: "1,2,310" // the result of [1, 2, 3] + 10
    })
  })
})
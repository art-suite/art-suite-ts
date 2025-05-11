import { test, expect } from "vitest"
import { isArray, isFunction, isPlainObject } from "art-core-ts-types"

/*
toS = (el) ->
  switch
  when el == null then :null
  when el == undefined then :undefined
  when el.name then el.name
  when el is Function then "#{el}"
  when el is Array
    "" [#{(array v from el with toS v).join ', '}]

  when el is Object
    "" {#{(array v, k from el with "#{k}: #{toS v}").join ', '}}

  else "#{el}"

testComprehension = (expected, f, source, a, b) ->
    args = [] source, a, b
    while peek(args) == undefined
      args.pop()

    test "#{f.name} #{(array arg in args with toS arg).join ', '} => #{toS expected}" ->
      assert.eq
        expected
        f source, a, b
        {} expected, source, a, b

add = (a, b) -> a + b
mul = (a, b) -> a * b
x2 = (a) -> a + a
even = (a) -> a % 2 == 0
*/

// Helper function to convert any value to a string representation
const toS = (el: any): string => {
  if (el === null) return "null"
  if (el === undefined) return "undefined"
  if (el.name) return el.name
  if (isFunction(el)) return `${el}`
  if (isArray(el)) return `[${el.map(v => toS(v)).join(", ")}]`
  if (isPlainObject(el)) {
    return `{${Object.entries(el).map(([k, v]) => `${k}: ${toS(v)}`).join(", ")}}`
  }
  return `${el}`
}

// Helper function to peek at the last element of an array
const peek = <T>(arr: T[]): T | undefined => arr[arr.length - 1]

// Test function for comprehensions
export const testComprehension = <T>(
  expected: T,
  f: (...args: any[]) => T,
  source?: any,
  a?: any,
  b?: any
): void => {
  const args = [source, a, b].filter(arg => arg !== undefined)

  test(`${f.name} ${args.map(arg => toS(arg)).join(", ")} => ${toS(expected)}`, () => {
    expect(f(...args)).toEqual(expected)
  })
}

// Helper functions for testing
export const add = (a: number, b: number): number => a + b
export const mul = (a: number, b: number): number => a * b
export const x2 = (a: number): number => a + a
export const even = (a: number): boolean => a % 2 === 0


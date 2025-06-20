import { expect, test } from "vitest"
import { array, each, find, object, reduce } from "../Comprehensions"

const a = [1, 2, 3]
const o1 = { a: 1, b: 2, c: 3 }
const a1: number[] = array(a, { when: (v) => v > 1 })
const a2: string[] = array(a, { with: (v) => `${v}` })
const a3: string[] = array(a, (v) => `${v}`)
const a4: string[] = array(a, { when: (v) => v > 1, with: (v) => `${v} * 2` })
const ao1: number[] = array(o1, { when: (v) => v > 1 })
const ao2: string[] = array(o1, { with: (v) => `${v}` })
const ao3: string[] = array(o1, (v) => `${v}`)
const ao4: string[] = array(o1, { when: (v) => v > 1, with: (v) => `${v} * 2` })

const o2: Record<string, number> = object(o1, { when: (v) => v > 1 })
const o3: Record<string, string> = object(o1, { with: (v) => `${v}` })
const o4: Record<string, string> = object(o1, (v) => `${v}`)
const o5: Record<string, string> = object(o1, { when: (v) => v > 1, with: (v) => `${v} * 2` })
const oa1: Record<string, number> = object(a, { when: (v) => v > 1 })
const oa2: Record<string, string> = object(a, { with: (v) => `${v}` })
const oa3: Record<string, string> = object(a, (v) => `${v}`)
const oa4: Record<string, string> = object(a, { when: (v) => v > 1, with: (v) => `${v} * 2` })

const f1: number | undefined = find(a, { when: (v) => v > 1 })
const f2: string | undefined = find(a, { with: (v) => `${v}` })
const f3: string | undefined = find(a, (v) => `${v}`)
const f4: string | undefined = find(a, { when: (v) => v > 1, with: (v) => `${v} * 2` })
const fo1: number | undefined = find(o1, { when: (v) => v > 1 })
const fo2: string | undefined = find(o1, { with: (v) => `${v}` })
const fo3: string | undefined = find(o1, (v) => `${v}`)
const fo4: string | undefined = find(o1, { when: (v) => v > 1, with: (v) => `${v} * 2` })

const r1: number = reduce(a, { when: (acc, v) => v > 1 })
const r2 = reduce(a, { inject: 1, with: (acc, v) => acc + v })
const r3: string = reduce(a, (acc, v) => `${acc} ${v}`)
const r4: string = reduce(a, { when: (v) => v > 1, with: (v) => `${v} * 2` })

// each
const ea1: undefined = each(a, { when: (v) => v > 1 })
const ea2: Record<string, number> = each(a, { into: {}, when: (v) => v > 1 })
const ea3: undefined = each(a, { with: (v) => `${v}` })
const ea4: undefined = each(a, (v) => `${v}`)
const ea5: undefined = each(a, { when: (v) => v > 1, with: (v) => `${v} * 2` })

// regressions
const simple = [1, 2, 3]
const simpleArray1: number[] = array(simple)
const simpleArray3: number[] = array(simple, v => v + 1)
const simpleArray2: number[] = array(simple, { with: (v) => v + 1 })
const simpleArray4: number[] = array(simple, { when: (v) => v > 1 })
const simpleArray5: number[] = array(simple, { when: (v) => v > 1, with: (v) => v + 1 })
const simpleObject1: Record<string, number> = object(simple)
const simpleObject2: Record<string, number> = object(simple, { with: (v) => v })
const simpleObject3: Record<string, number> = object(simple, (v) => v)
const simpleObject4: Record<string, number> = object(simple, { when: (v) => v > 1, with: (v) => v })
const simpleObject5: Record<string, number> = object(simple, { when: (v) => v })
const simpleObject6: Record<string, number> = object(simple, { withKey: (v) => `a${v}` })

const spaces: {
  id: string;
  propertyId: string;
  createdAt: Date;
  name: string;
  updatedAt: Date;
  levelId: string;
}[] = [{ id: '1', propertyId: '1', createdAt: new Date(), name: '1', updatedAt: new Date(), levelId: '1' }]
const spacesArray: string[] = array(spaces, { with: ({ id }) => id })
const spacesFind: string | undefined = find(spaces, { with: ({ id }) => id })
const spacesBySpaceId: Record<string, typeof spaces[number]> = object(spaces, { withKey: ({ id }) => id })

const canConnectTo: Record<string, boolean> = { "foo": true }
const canConnectToArray: string[] = array(canConnectTo, { with: (v, k) => `${k} Ok` })
const canConnectToObjectFind: string | undefined = find(canConnectTo, { with: (v, k) => `${k} Ok` })
const canConnectToObject: Record<string, boolean> = object(canConnectTo, { withKey: (v, k) => `${k} Ok` })

type MessageChannel = 'sms' | 'email' | 'push'
type NormalizedUser = {
  name: string,
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cost: number;
  costDetails: any | null;
  messageCount: number;
  lastMessageAt: Date | null;
  phoneNumber: string | null;
  deletedAt: Date | null;
  messageChannel: MessageChannel | null
}
const users: NormalizedUser[] = [{ name: 'John', messageChannel: null, id: '1', createdAt: new Date(), updatedAt: new Date(), cost: 100, costDetails: null, messageCount: 1, lastMessageAt: new Date(), phoneNumber: null, deletedAt: null }, { name: 'Jane', messageChannel: 'email', id: '2', createdAt: new Date(), updatedAt: new Date(), cost: 100, costDetails: null, messageCount: 1, lastMessageAt: new Date(), phoneNumber: null, deletedAt: null }]
const usersArray1: (string | null)[] = array(users, { with: ({ phoneNumber }) => phoneNumber })
const usersArray2: (string | null)[] = array(users, { with: ({ phoneNumber }) => phoneNumber, when: ({ phoneNumber }) => phoneNumber !== null })
const usersFind1: NormalizedUser | undefined = find(users, { when: ({ phoneNumber }) => phoneNumber })
const usersFind2: string | undefined = find(users, { with: ({ phoneNumber }) => phoneNumber })
const usersObject1: Record<string, NormalizedUser> = object(users)
const usersObject2: Record<string, NormalizedUser> = object(users, a => ({ ...a, phoneNumber: a.phoneNumber ?? null }))
const usersObject3: Record<string, NormalizedUser> = object(users, { with: a => ({ ...a, phoneNumber: a.phoneNumber ?? null }) })
const usersObject4: Record<string, NormalizedUser> = object(users, { when: ({ phoneNumber }) => phoneNumber })
const usersObject5: Record<string, NormalizedUser> = object(users, { withKey: ({ phoneNumber }) => phoneNumber || 'default' })

const anObjectInput = { a: 1, b: 2, c: 3, d: 4 }
const anObjectArray1: number[] = array(anObjectInput)
const anObjectArray2: number[] = array(anObjectInput, v => v * 11)
const anObjectArray3: number[] = array(anObjectInput, { with: v => v * 11 })
const anObjectFind1: number | undefined = find(anObjectInput, { when: (v, k) => k === 'a' })
const anObjectObject1: Record<string, number> = object(anObjectInput)
const anObjectObject2: Record<string, number> = object(anObjectInput, v => v * 11)
const anObjectObject3: Record<string, number> = object(anObjectInput, { with: v => v * 11 })
const anObjectObject4: Record<string, number> = object(anObjectInput, { withKey: v => v * 11 })

const myMap = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
  ["d", 4]
])
const myMapArray1: number[] = array(myMap)
const myMapArray2: number[] = array(myMap, v => v * 11)
const myMapArray3: number[] = array(myMap, { with: v => v * 11 })
const myMapObject1: Record<string, number> = object(myMap)
const myMapObject2: Record<string, number> = object(myMap, v => v * 11)
const myMapObject3: Record<string, number> = object(myMap, { with: v => v * 11 })
const myMapObject4: Record<string, number> = object(myMap, { withKey: v => v * 11 })

// uncomment to see if typescript gives a reasonable error message
// const noMatch = array([], { whom: v => v * 11 })

test('placeholder - the real test is does this file compile?', () => {
  expect(true).toBe(true)
})
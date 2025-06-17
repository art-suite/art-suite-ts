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
const spaces: {
  id: string;
  propertyId: string;
  createdAt: Date;
  name: string;
  updatedAt: Date;
  levelId: string;
}[] = [{ id: '1', propertyId: '1', createdAt: new Date(), name: '1', updatedAt: new Date(), levelId: '1' }]
const spacesBySpaceId = object(spaces, { withKey: ({ id }) => id })

let canConnectTo: Record<string, boolean> = { "foo": true }
let canConnectTo2: Record<string, boolean> = object(canConnectTo, { withKey: (v, k) => `${k} Ok` })

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
const usersByPhoneNumber = object(users, { withKey: ({ phoneNumber }) => phoneNumber })

test('placeholder - the real test is does this file compile?', () => {
  expect(true).toBe(true)
})
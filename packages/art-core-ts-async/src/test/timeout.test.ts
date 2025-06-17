import { describe, it, expect } from 'vitest'
import { timeout, timeoutAt } from '../index.ts'

describe('timeout', () => {
  it('should resolve after the timeout', async () => {
    const result = await timeout(100)
    expect(result).toBeUndefined()
  })

  it('should resolve after the timeout with a function', async () => {
    const result = await timeout(100, () => 'done')
    expect(result).toBe('done')
  })
})

describe('timeoutAt', () => {
  it('should resolve after the timeout', async () => {
    const result = await timeoutAt(Date.now() + 100)
    expect(result).toBeUndefined()
  })

  it('should resolve after the timeout with a function', async () => {
    const result = await timeoutAt(Date.now() + 100, () => 'done')
    expect(result).toBe('done')
  })
})

/*
  @timeout: timeout = (ms, f) =>
    p = new Promise (resolve) -> setTimeout resolve, ms
    if f? then p.then f else p

  # timeout at a specific second - using the Date.now() time
  @timeoutAt: (second, f) => timeout (second - toSeconds()) * 1000, f

*/
import { toSeconds, AllDateTypes } from '@art-suite/art-core-ts-time'

/**
 * Creates a promise that resolves after a specified number of milliseconds.
 * Optionally, a function can be provided to be called after the timeout. If so, the promise will resolve with the result of the function.
 * @param ms - The number of milliseconds to wait
 * @param f - The function to call after the timeout
 * @returns A promise that resolves after the timeout
 */
export const timeout = (ms: number, f?: () => unknown) => {
  const p = new Promise(resolve => setTimeout(resolve, ms))
  return f ? p.then(() => f()) : p
}

/**
 * Creates a promise that resolves after a specified time.
 * Optionally, a function can be provided to be called after the timeout. If so, the promise will resolve with the result of the function.
 * @param triggerAtTime - The time to trigger the timeout - can be a Date, number (seconds or milliseconds), or date-time string
 * @param f - The function to call after the timeout
 * @returns A promise that resolves after the timeout
 */
export const timeoutAt = (triggerAtTime: AllDateTypes, f?: () => void) => timeout((toSeconds(triggerAtTime) - toSeconds()) * 1000, f)
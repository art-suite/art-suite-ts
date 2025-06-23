import { compare } from './compare'

/**
 * deep structural == test
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if the values are deeply equal (compare returns 0), `false` otherwise
 *
 * For more details on comparison behavior, see the art-core-ts-compare README.
 */
export const eq = (a: any, b: any): boolean => compare(a, b) === 0;

/**
 * deep structural != test
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if the values are not deeply equal (compare returns non-zero), `false` otherwise
 *
 * For more details on comparison behavior, see the art-core-ts-compare README.
 */
export const neq = (a: any, b: any): boolean => compare(a, b) !== 0;

/**
 * deep structural < test
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if `a` is less than `b` (compare returns negative), `false` otherwise
 *
 * For more details on comparison behavior, see the art-core-ts-compare README.
 */
export const lt = (a: any, b: any): boolean => compare(a, b) < 0;

/**
 * deep structural > test
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if `a` is greater than `b` (compare returns positive), `false` otherwise
 *
 * For more details on comparison behavior, see the art-core-ts-compare README.
 */
export const gt = (a: any, b: any): boolean => compare(a, b) > 0;

/**
 * deep structural <= test
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if `a` is less than or equal to `b` (compare returns negative or zero), `false` otherwise
 *
 * For more details on comparison behavior, see the art-core-ts-compare README.
 */
export const lte = (a: any, b: any): boolean => compare(a, b) <= 0;

/**
 * deep structural >= test
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns `true` if `a` is greater than or equal to `b` (compare returns positive or zero), `false` otherwise
 *
 * For more details on comparison behavior, see the art-core-ts-compare README.
 */
export const gte = (a: any, b: any): boolean => compare(a, b) >= 0;

type NotPresent = null | undefined;

// Modified type definitions to better support heterogeneous arrays
export type SparseArray<T> = Array<T | NotPresent>;
export type NestedArray<T> = Array<T | NestedArray<T>>;
export type NestedArrayWithNullAndUndefined<T> = Array<T | NestedArrayWithNullAndUndefined<T> | null | undefined>;

export type FlattenedElementType<
  T,
  Seen extends any[] = []
> = Seen['length'] extends 50
  ? (T extends ReadonlyArray<any> ? never : T)
  : T extends ReadonlyArray<infer U>
  ? FlattenedElementType<U, [any, ...Seen]>
  : T;

type CompactedElementType<T extends readonly unknown[]> = Exclude<T[number], null | undefined>;
type CompactFlattenedElementType<T> = CompactedElementType<FlattenedElementType<T>[]>

const isPresent = <T>(value: T): value is NonNullable<T> => value != null

/**
 * Removes null/undefined values from an array.
 * Performance optimized: returns the original array if no filtering is needed.
 * @param array - Array that may contain null/undefined values
 * @param keepTester - Optional function to test which values to keep
 * @returns A new array with null/undefined removed, or the original array if no filtering was needed
 */
export const compact = <T extends readonly any[]>(array: T | NotPresent): CompactedElementType<T>[] => {
  if (array == null) return []
  let needsFilter = false
  for (const item of array) if (item == null) { needsFilter = true; break }
  return needsFilter ? array.filter(isPresent) : array as any
}

/**
 * Recursively flattens nested arrays into a single array.
 * Performance optimized: returns the original array if it's already flat.
 * @param args - Arrays that may contain nested arrays
 * @returns A new flattened array, or the original array if no flattening was needed
 */
export const flatten = <T extends readonly any[]>(array: T | NotPresent, into?: FlattenedElementType<T>[]): FlattenedElementType<T>[] => {
  if (array == null) return []
  let needsFlatten = false
  if (!into) {
    for (const item of array) if (Array.isArray(item)) { needsFlatten = true; break }
    if (!needsFlatten) return array as any
  }

  if (!into) into = []
  for (const item of array) {
    if (Array.isArray(item)) {
      flatten(item, into)
    } else {
      into.push(item as any)
    }
  }
  return into
}


/*
 * Recursively flattens nested arrays and removes null/undefined values.
 * Performance optimized: returns the original array if no flattening or filtering is needed.
 * @param array - Array that may contain nested arrays and null/undefined values
 * @returns A new flattened array with null/undefined removed, or the original array if no changes were needed
 */
export const compactFlatten = <T extends readonly any[]>(array: T | NotPresent, into?: CompactFlattenedElementType<T>[]): CompactFlattenedElementType<T>[] => {
  if (array == null) return []
  if (!Array.isArray(array)) return [array] as any

  if (!into) {
    let needsFlatten = false
    let needsFilter = false
    for (const item of array as any) {
      if (Array.isArray(item)) { needsFlatten = true; break }
      if (item == null) { needsFilter = true; break }
    }
    if (!needsFlatten && !needsFilter) return array as any
  }

  if (!into) into = []
  for (const item of array as any) {
    if (item == null) continue
    if (Array.isArray(item)) {
      compactFlatten(item as any, into)
    } else {
      into.push(item as any)
    }
  }
  return into
}

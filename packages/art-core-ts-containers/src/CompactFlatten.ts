type NotPresent = null | undefined;

// Modified type definitions to better support heterogeneous arrays
export type RecursiveArray<T> = Array<T | RecursiveArray<T>>;
export type SparseItem<T> = T | NotPresent;
export type SparseArray<T> = Array<SparseItem<T>>;
export type NestedArray<T> = T | RecursiveArray<T>;
export type SparseNestedArray<T> = NestedArray<SparseItem<T>>;
export type SparseNestedArrayOrSingleton<T> = SparseNestedArray<T>;

type KeepTester = (value: unknown) => boolean;
const isPresent = <T>(value: T): value is NonNullable<T> => value != null

type CompactedArrayItemType<T> =
  T extends null | undefined ? never
  : T extends readonly (infer U)[] ? CompactedArrayItemType<U>
  : T;

/**
 * Removes null/undefined values from an array.
 * Performance optimized: returns the original array if no filtering is needed.
 * @param array - Array that may contain null/undefined values
 * @param keepTester - Optional function to test which values to keep
 * @returns A new array with null/undefined removed, or the original array if no filtering was needed
 */
export const compact = <T extends readonly any[]>(array: T | NotPresent): CompactedArrayItemType<T>[] => {
  if (array == null) return []
  let needsFilter = false
  for (const item of array) if (item == null) { needsFilter = true; break }
  return needsFilter ? array.filter(isPresent) : array as any as CompactedArrayItemType<T>[]
}

type ExampleTuple = [number, string, { name: string }]
type ExampleNestedTuple = [number, string, ExampleTuple[]]

export type FlattenedArrayItemType<T> = T extends readonly (infer U)[]
  ? FlattenedArrayItemType<U>
  : T;

type FlattenedNestedTuple = FlattenedArrayItemType<ExampleNestedTuple>


/**
 * Recursively flattens nested arrays into a single array.
 * Performance optimized: returns the original array if it's already flat.
 * @param args - Arrays that may contain nested arrays
 * @returns A new flattened array, or the original array if no flattening was needed
 */
export const flatten = <T extends readonly any[]>(array: T | NotPresent, into?: FlattenedArrayItemType<T>[]): FlattenedArrayItemType<T>[] => {
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

type CompactFlattenedArrayItemType<T> = CompactedArrayItemType<FlattenedArrayItemType<T>[]>

/*
 * Recursively flattens nested arrays and removes null/undefined values.
 * Performance optimized: returns the original array if no flattening or filtering is needed.
 * @param array - Array that may contain nested arrays and null/undefined values
 * @returns A new flattened array with null/undefined removed, or the original array if no changes were needed
 */
export const compactFlatten = <T extends readonly any[]>(array: T | NotPresent, into?: CompactFlattenedArrayItemType<T>[]): CompactFlattenedArrayItemType<T>[] => {
  if (array == null) return []
  if (!Array.isArray(array)) return [array as CompactFlattenedArrayItemType<T>]

  if (!into) {
    let needsFlatten = false
    let needsFilter = false
    for (const item of array as Array<SparseNestedArrayOrSingleton<T>>) {
      if (Array.isArray(item)) { needsFlatten = true; break }
      if (item == null) { needsFilter = true; break }
    }
    if (!needsFlatten && !needsFilter) return array as any
  }

  if (!into) into = []
  for (const item of array as Array<SparseNestedArrayOrSingleton<T>>) {
    if (item == null) continue
    if (Array.isArray(item)) {
      compactFlatten(item as any, into)
    } else {
      into.push(item as any)
    }
  }
  return into
}

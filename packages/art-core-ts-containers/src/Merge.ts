type ExcludeUndefined<T> = T extends undefined ? never : T;

export type MergeTwo<A extends object, B extends object> = {
  [K in keyof A | keyof B as
  ExcludeUndefined<K extends keyof B ? B[K] : never> extends never
  ? ExcludeUndefined<K extends keyof A ? A[K] : never> extends never
  ? never
  : K
  : K
  ]: ExcludeUndefined<K extends keyof B ? B[K] : never> extends never
  ? ExcludeUndefined<K extends keyof A ? A[K] : never>
  : ExcludeUndefined<K extends keyof B ? B[K] : never>;
};

export type MergeAll<Arr extends readonly any[]> =
  Arr extends [infer First, ...infer Rest]
  ? MergeTwo<
    First extends object ? First : {},
    MergeAll<Rest>
  >
  : {};

export type Merge<Args extends readonly any[]> = MergeAll<Args>;

export const mergeInto = <Into extends object, T extends readonly (object | null | undefined)[]>(into: Into, ...all: T): MergeTwo<Into, Merge<T>> => {
  // Fast path: no sources to merge
  if (all.length === 0) return into as any;

  // Merge each source directly into target
  for (let i = 0; i < all.length; i++) {
    const source = all[i];
    // Skip null/undefined sources
    if (source == null) continue;

    // Use for...in for faster iteration, but only process own properties
    for (const k in source) {
      if (!Object.prototype.hasOwnProperty.call(source, k)) continue;
      const v = (source as any)[k];
      // Skip undefined values, but allow null
      if (v !== undefined) {
        (into as any)[k] = v;
      }
    }
  }

  return into as any;
};

/**
 * merge: takes N args, all should be objects or null or undefined.
 * objects are merged in order, from first param to last param. Therefor later params have priority over earlier params.
 * undefined fields are SKIPPED and are not added to the output object
 * null fields, however, are preserved and can override existing values in the output object
 * The resulting object should be correctly typed for every field based on the above logic.
 *
 * @param sources - The array of objects to merge.
 * @returns A single merged object.
 */
export const merge = <T extends readonly any[]>(...sources: T): Merge<T> => mergeInto({}, ...sources) as Merge<T>;
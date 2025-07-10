import { isPlainObject, PlainObject } from "@art-suite/art-core-ts-types";

//*********************************************************************
// Deep Merge Helpers
//*********************************************************************

/**
 * General principle: 'b' is the baseline for the new object with 'a' being the default values. 'b' should override 'a' if it is present, but otherwise keep 'a'
 * Rules:
 * - if b is undefined, return a - treated as-if b is not present
 * - if b is null, return null - treated as an 'erase' mechanism
 * - if a and b are both arrays, use deepMergeArray
 * - if a and b are both plain objects, use deepMergeObjects
 * - ELSE: return b - if a and b are not mergeable, return b
 * @param a
 * @param b
 * @returns
 */
const deepMergeItems = (a: any, b: any): any => {
  if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) {
    return deepMergeArray(a, b);
  } else if (isPlainObject(a) && isPlainObject(b)) {
    return deepMergeObjects(a, b);
  } else {
    // Note: this includes nulls; nulls are preserved as an 'erase' mechanism
    return b;
  }
}

/**
 * proceed index by index; if the A and B are both plain objects, use deepMerge, otherwise use B
 * if both are arrays, use deepMergeArray
 */
const deepMergeArray = (a: any[], b: any[]): any[] => {
  const result = [] as any[];
  const len = b.length;
  for (let i = 0; i < len; i++) {
    const aItem = a[i];
    const bItem = b[i];
    result.push(deepMergeItems(aItem, bItem));
  }
  return result;
};

const deepMergeObjects = (a: PlainObject | null | undefined, b: PlainObject | null | undefined, into?: PlainObject): PlainObject => {
  if (!a) a = {};
  if (!b) b = {};
  const result = into ?? {};
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of allKeys) result[k] = deepMergeItems(a[k], b[k]);
  return result;
};

//*********************************************************************
// Deep Merge Exports
//*********************************************************************
/**
 * deepMerge: takes N args, all should be objects or null or undefined.
 * objects are merged in order, from first param to last param. Therefor later params have priority over earlier params.
 * undefined fields are SKIPPED and are not added to the output object.
 * null fields, however, are preserved and can override existing values in the output object.
 * The resulting object should be correctly typed for every field based on the above logic.
 *
 * The difference between merge and deepMerge:
 * - merge: whole objects are replaced by the later ones.
 * - deepMerge: objects are merged recursively
 * @param into - The object to merge into.
 * @param all - The objects to merge.
 * @returns the 'into' object, which was mutated in place.
 */
export const deepMergeInfo = (into: PlainObject, ...all: (PlainObject | null | undefined)[]): PlainObject => {
  for (let i = 0; i < all.length; i++) deepMergeObjects(into, all[i], into);
  return into;
};

/**
 * deepMerge: takes N args, all should be objects or null or undefined.
 * objects are merged in order, from first param to last param. Therefor later params have priority over earlier params.
 * undefined fields are SKIPPED and are not added to the output object.
 * null fields, however, are preserved and can override existing values in the output object.
 * The resulting object should be correctly typed for every field based on the above logic.
 *
 * The difference between merge and deepMerge:
 * - merge: whole objects are replaced by the later ones.
 * - deepMerge: objects are merged recursively
 *
 * @param sources - The array of objects to merge.
 * @returns A new, single merged object.
 */
export const deepMerge = (...all: (PlainObject | null | undefined)[]): PlainObject => deepMergeInfo({}, ...all);

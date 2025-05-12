/**
 * Recursively strips `null` from all properties of an object and elements of an array/tuple.
 * - If a value is `null`, its type becomes `never`.
 * - If an object property's value type becomes `never`, the property is omitted.
 * - For arrays/tuples, if an element's type becomes `never`, it remains `never` in that position.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping null).
 */
export type DeepStripNulls<T> =
  T extends null ? never : // Base case: null becomes never

  // Keep functions, Dates, RegExps, and basic primitives as they are
  T extends Function | Date | RegExp | string | number | boolean | bigint | symbol ? T :

  // Handle arrays and tuples (including readonly ones)
  T extends readonly any[] ?
  // Map over each element in the array/tuple
  // The `-readonly` modifier makes the resulting array/tuple mutable.
  // If you need to preserve readonly, this part would need adjustment.
  { -readonly [K in keyof T]: DeepStripNulls<T[K]> } :

  // Handle objects
  T extends object ?
  // Map over object properties.
  // `as DeepStripNulls<T[P]> extends never ? never : P`
  // This part filters out keys (P) if their transformed value type becomes `never`.
  { [P in keyof T as DeepStripNulls<T[P]> extends never ? never : P]: DeepStripNulls<T[P]> } :

  // Fallback for types not explicitly handled (e.g., `undefined` just passes through)
  T;

/**
 * Recursively strips `null` and `undefined` from all properties of an object and elements of an array/tuple.
 * - If a value is `null` or `undefined`, its type becomes `never`.
 * - If an object property's value type becomes `never`, the property is omitted.
 * - For arrays/tuples, if an element's type becomes `never`, it remains `never` in that position.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping nullish values).
 */
export type DeepStripNullish<T> =
  T extends null | undefined ? never : // Base case: null or undefined becomes never

  // Keep functions, Dates, RegExps, and basic primitives as they are
  T extends Function | Date | RegExp | string | number | boolean | bigint | symbol ? T :

  // Handle arrays and tuples (including readonly ones)
  T extends readonly any[] ?
  { -readonly [K in keyof T]: DeepStripNullish<T[K]> } :

  // Handle objects
  T extends object ?
  { [P in keyof T as DeepStripNullish<T[P]> extends never ? never : P]: DeepStripNullish<T[P]> } :

  // Fallback for types not explicitly handled
  T;

/**
 * Recursively strips `null` from all properties of an object and elements of an array/tuple.
 * - If a value is `null`, it is removed from objects, or skipped in arrays.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping null).
 */
export const deepStripNulls = <T>(data: T): DeepStripNulls<T> => {
  if (data === null) return undefined as DeepStripNulls<T>;
  if (Array.isArray(data)) {
    const result = []
    for (const item of data) {
      if (item === null) continue;
      const stripped = deepStripNulls(item);
      if (stripped != undefined) result.push(stripped);
    }
    return result as DeepStripNulls<T>;
  }
  if (typeof data === 'object') {
    if (data instanceof Date || data instanceof RegExp) return data as DeepStripNulls<T>;
    const result: Record<string, any> = {};
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const value = data[key];
      if (value !== null) {
        const stripped = deepStripNulls(value);
        if (stripped !== undefined) result[key] = stripped;
      }
    }
    return result as DeepStripNulls<T>;
  }
  return data as DeepStripNulls<T>;
};

/**
 * Recursively strips `null` and `undefined` from all properties of an object and elements of an array/tuple.
 * - If a value is `null` or `undefined`, it is removed from objects, or skipped in arrays.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping nullish values).
 */
export const deepStripNullish = <T>(data: T): DeepStripNullish<T> => {
  if (data == null) return undefined as DeepStripNullish<T>;
  if (Array.isArray(data)) {
    const result = []
    for (const item of data) {
      if (item === null) continue;
      const stripped = deepStripNullish(item);
      if (stripped != undefined) result.push(stripped);
    }
    return result as DeepStripNullish<T>;
  }
  if (typeof data === 'object') {
    if (data instanceof Date || data instanceof RegExp) return data as DeepStripNullish<T>;
    const result: Record<string, any> = {};
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const value = data[key];
      if (value != null) {
        const stripped = deepStripNullish(value);
        if (stripped !== undefined) result[key] = stripped;
      }
    }
    return result as DeepStripNullish<T>;
  }
  return data as DeepStripNullish<T>;
};

/**
 * Shallowly strips `null` from all properties of an object and elements of an array/tuple.
 * - If a value is `null`, its type becomes `never`.
 * - If an object property's value type becomes `never`, the property is omitted.
 * - For arrays/tuples, if an element's type becomes `never`, it remains `never` in that position.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping null).
 */
export type StripNulls<T> =
  T extends null | undefined | Function | Date | RegExp | string | number | boolean | bigint | symbol ? T :
  T extends readonly any[] ? { -readonly [K in keyof T]: T[K] extends null ? never : T[K] } :
  T extends object ? { [P in keyof T as T[P] extends null ? never : P]: T[P] } :
  T;

/**
 * Shallowly strips `null` and `undefined` from all properties of an object and elements of an array/tuple.
 * - If a value is `null` or `undefined`, its type becomes `never`.
 * - If an object property's value type becomes `never`, the property is omitted.
 * - For arrays/tuples, if an element's type becomes `never`, it remains `never` in that position.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping nullish values).
 */
export type StripNullish<T> =
  T extends null | undefined | Function | Date | RegExp | string | number | boolean | bigint | symbol ? T :
  T extends readonly any[] ? { -readonly [K in keyof T]: T[K] extends null | undefined ? never : T[K] } :
  T extends object ? { [P in keyof T as T[P] extends null | undefined ? never : P]: T[P] } :
  T;

/**
 * Shallowly strips `null` from all properties of an object and elements of an array/tuple.
 * - If a value is `null`, it is removed from objects, or skipped in arrays.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping null).
 */
export const stripNulls = <T>(data: T): StripNulls<T> => {
  if (data == null) return data as StripNulls<T>;

  if (Array.isArray(data)) return data.filter(item => item !== null) as StripNulls<T>;

  if (typeof data === 'object') {
    if (data instanceof Date || data instanceof RegExp) return data as StripNulls<T>;
    const result: Record<string, any> = {};
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const value = data[key];
      if (value !== null) result[key] = value;
    }
    return result as StripNulls<T>;
  }

  return data as StripNulls<T>;
};

/**
 * Shallowly strips `null` and `undefined` from all properties of an object and elements of an array/tuple.
 * - If a value is `null` or `undefined`, it is removed from objects, or skipped in arrays.
 * - Preserves types of primitives, functions, Dates, RegExps.
 * - Preserves tuple structure and specific element types (after stripping nullish values).
 */
export const stripNullish = <T>(data: T): StripNullish<T> => {
  if (data == null) return data as StripNullish<T>;

  if (Array.isArray(data)) return data.filter(item => item != null) as StripNullish<T>;

  if (typeof data === 'object') {
    if (data instanceof Date || data instanceof RegExp) return data as StripNullish<T>;
    const result: Record<string, any> = {};
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const value = data[key];
      if (value != null) result[key] = value;
    }
    return result as StripNullish<T>;
  }

  return data as StripNullish<T>;
};

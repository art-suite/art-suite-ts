import { isPlainObject, isFunction, exists } from 'art-core-ts-types'
import { EachFunction, ArrayFunction, ObjectFunction, ReduceFunction, FindFunction } from './ComprehensionTypes'

const isMap = (source: any): source is Map<any, any> => source instanceof Map;
const isSet = (source: any): source is Set<any> => source instanceof Set;

const isArrayIterable = (source: any): source is any[] => source != null && source.length >= 0;
const isOfIterable = (o: any): boolean => isFunction(o[Symbol.iterator] || o.next);

const returnFirst = (a: any) => a;
const returnSecond = (a: any, b: any) => b;

const emptyOptions = {};

const iterate = (source: any, body: (value: any, key: any) => boolean) => {
  if (exists(source))
    if (isArrayIterable(source)) for (let key = 0, { length } = source; key < length; key++) { if (body(source[key], key)) break; }
    else if (isPlainObject(source)) for (const key in source) { if (body(source[key], key)) break; }
    else if (isMap(source)) for (const [key, value] of source.entries()) { if (body(value, key)) break; }
    else if (isSet(source)) for (const value of source) { if (body(value, value)) break; }
    else if (isOfIterable(source)) for (const value of source) { if (body(value, value)) break; }
    else throw new Error(`Unsupported source type: ${typeof source}`);
};

/*
  Returns a function that handles "with", "when" and "stopWhen" comprehension clauses:

  1. Returns true if the "stopWhen" is provided and returns true, otherwise returns it will return false
  2. If stopWhen is false, "when" and "with" are processed
  3. If there is no "when" or "when" returns true, "with" is called.
*/
const normalizeBody = (_with: (value: any, key: any) => any, options: any): (value: any, key: any) => boolean => {
  let { when, stopWhen } = options;
  if (when && stopWhen) {
    return (v: any, k: any) => {
      if (stopWhen(v, k)) return true;
      if (when(v, k)) _with(v, k);
      return false;
    }
  }
  if (when) {
    return (v: any, k: any) => {
      if (when(v, k)) _with(v, k);
      return false;
    }
  }
  if (stopWhen) {
    return (v: any, k: any) => {
      if (stopWhen(v, k)) return true;
      _with(v, k);
      return false;
    }
  }
  return (v: any, k: any) => { _with(v, k); return false; };
};

let normalizeKeyFunction = (source: any, options: any) =>
  options.key ||
  options.withKey ||
  (isArrayIterable(source) ? returnFirst : returnSecond);

const _each = (source: any, _with: (value: any, key: any) => any, options: any) => {
  iterate(source, normalizeBody(_with, options));
};

const normalizedEach = (source: any, into: any, _with: (value: any, key: any) => any, options: any) => {
  _each(source, _with, options);
  return into;
};

let normalizedArray = (source: any, into: any, _with: (value: any, key: any) => any, options: any) => {
  if (into == null) into = [];
  _each(source, (v: any, k: any) => into.push(_with(v, k)), options);
  return into;
};

let normalizedObject = (source: any, into: any, _with: (value: any, key: any) => any, options: any) => {
  let key = normalizeKeyFunction(source, options);
  if (into == null) into = {};
  _each(source, (v, k) => (into[key(v, k)] = _with(v, k)), options);
  return into;
};

let normalizedReduce = (source: any, into: any, _with: (into: any, value: any, key: any) => any, options: any) => {
  let first = true;
  _each(source, (v: any, k: any) => {
    if (first) { first = false; into = v; }
    else
      into = _with(into, v, k)
  }, options);
  return into;
};

let normalizedFind = function (source: any, found: any, _with: (value: any, key: any) => any, options: any) {
  let { when } = options;
  iterate(
    source,
    when
      ? (v, k) => {
        if (when(v, k)) {
          found = _with(v, k);
          return true;
        }
      }
      : (v, k) => (found = _with(v, k))
  );
  return found;
};

//####################
// PRIVATE
//####################
/*
Normalizes input params for the 'iteration' function.
Since this normalizes multiple params, and therefor would need to return
an new array or new object otherwise, we pass IN the iteration function
and pass the params directly to it. This keeps the computed params on the
stack and doesn't create new objects.

IN signature 1: (iteration, source, into, _with) ->
IN signature 2: (iteration, source, into, options) ->
IN signature 3: (iteration, source, _with) ->
IN signature 4: (iteration, source, options) ->
IN signature 5: (iteration, source) ->

IN:
iteration: (source, into, _with, options) -> out

  The iteration function is invoked last with the computed args.
  Its results are returned.

  IN:
    source:     passed directly through from inputs
    into:       passed directly through from inputs OR from options.into
    _with:  passed directly through from inputs OR from options.with
    options:    passed directly through from inputs OR {}
                (guaranteed to be set and a plainObject)

source: the source collection to be iterated over. Passed directly through.

into:       passed through to 'iteration'
_with:      passed through to 'iteration'
options:    passed through to 'iteration' AND:

  into:     set 'into' from the options object
  with:     set '_with' from the options object

OUT: out
*/
let invokeNormalizedIteration = function (iteration: (source: any, into: any, _with: (value: any, key: any) => any, options: any) => any, source: any, a: any, b: any) {
  let into, options, _with;
  options = b ? ((into = a), b) : a;
  if (isPlainObject(options)) {
    if (into === undefined) into = options.into
    if (into === undefined) into = options.inject
    if (into === undefined) into = options.returning
    _with = options.with;
  } else {
    if (isFunction(options)) _with = options;
    options = emptyOptions;
  }
  return iteration(source, into, _with || returnFirst, options);
};

/**
 * Iterates over the provided collection, calling the given function for each element.
 *
 * Unlike other comprehensions, `each` is designed for side effects and does not build a new collection.
 *
 * **Return value:**
 * - If an `into`, `inject`, or `returning` option is provided (or as the second argument), that value is returned (not modified by `each` itself).
 * - If no such value is provided, returns `undefined`.
 *
 * This allows you to use `each` for side effects while optionally threading a value through the iteration.
 *
 * @param source The collection to iterate (array, object, Map, Set, etc.)
 * @param a Optional: Either the `into` value or the function to call for each element.
 * @param b Optional: If present, options or the function to call for each element.
 * @returns The `into`/`inject`/`returning` value if provided, otherwise `undefined`.
 */
export const each: EachFunction = ((source: any, a: any, b: any) => invokeNormalizedIteration(normalizedEach, source, a, b)) as EachFunction;

/**
 * Builds a new array from the provided collection, optionally transforming or filtering elements.
 *
 * Options:
 * - `with`: function to transform each element (like map)
 * - `when`: function to filter elements (like filter)
 * - `into`: array to push results into (default: new array)
 *
 * @param source The collection to iterate (array, object, Map, Set, etc.)
 * @param a Optional: `with` function, or options object, or `into` array.
 * @param b Optional: options object if `a` is `into` array.
 * @returns The resulting array.
 */
export const array: ArrayFunction = ((source: any, a: any, b: any) => invokeNormalizedIteration(normalizedArray, source, a, b)) as ArrayFunction;

/**
 * Builds a new object from the provided collection, optionally transforming keys/values or filtering elements.
 *
 * Options:
 * - `with`: function to transform each value
 * - `when`: function to filter elements
 * - `key`/`withKey`: function to determine output keys
 * - `into`: object to assign results into (default: new object)
 *
 * @param source The collection to iterate (array, object, Map, Set, etc.)
 * @param a Optional: `with` function, or options object, or `into` object.
 * @param b Optional: options object if `a` is `into` object.
 * @returns The resulting object.
 */
export const object: ObjectFunction = ((source: any, a: any, b: any) => invokeNormalizedIteration(normalizedObject, source, a, b)) as ObjectFunction;

/**
 * Reduces the provided collection to a single value, similar to Array.prototype.reduce.
 *
 * The first element is used as the initial value unless an `into`/`inject`/`returning` option is provided.
 *
 * Options:
 * - `with`: reducer function (receives accumulator, value, key)
 * - `when`: function to filter elements
 * - `into`/`inject`/`returning`: initial value for the reduction
 *
 * @param source The collection to reduce (array, object, Map, Set, etc.)
 * @param a Optional: initial value or reducer function or options object.
 * @param b Optional: options object if `a` is initial value.
 * @returns The reduced value.
 */
export const reduce: ReduceFunction = ((source: any, a: any, b: any) => invokeNormalizedIteration(normalizedReduce, source, a, b)) as ReduceFunction;

/**
 * Finds and returns the first value in the collection that matches the given criteria.
 *
 * Options:
 * - `with`: function to transform the found value
 * - `when`: function to filter elements (predicate)
 *
 * @param source The collection to search (array, object, Map, Set, etc.)
 * @param a Optional: predicate or options object.
 * @param b Optional: options object if `a` is predicate.
 * @returns The found value, or undefined if not found.
 */
export const find: FindFunction = ((source: any, a: any, b: any) => invokeNormalizedIteration(normalizedFind, source, a, b)) as FindFunction;

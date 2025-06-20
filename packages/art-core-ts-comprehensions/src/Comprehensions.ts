import { isPlainObject, isFunction, exists } from '@art-suite/art-core-ts-types'
import { EachFunction, ArrayFunction, ObjectFunction, ReduceFunction, FindFunction, AnyContainer, ArrayInput, ObjectInput, NotPresent } from './ComprehensionTypes'

const isMap = (source: any): source is Map<any, any> => source instanceof Map;
const isSet = (source: any): source is Set<any> => source instanceof Set;

export const isArrayIterable = (source: any): source is any[] => {
  if (typeof source === 'string') return false
  if (isFunction(source)) return false
  return source != null && source.length >= 0;
}

export const isOfIterable = (o: any): boolean => {
  if (typeof o === 'string') return false
  if (isFunction(o)) return false
  return isFunction(o[Symbol.iterator] || o.next)
}

const returnFirstArg = (a: any) => a;
const returnSecondArg = (a: any, b: any) => b;

const emptyOptions = {};

type CoreIterationFunction = (value: any, key: any) => boolean; // returns true to stop iteration

/**
 * Tight function to abstract away all possible iteration methods based on the source container type.
 *
 * Iterates over the source collection, calling the given function for each element.
 *
 * Stops when the body function returns true.
 * Does NOT return anything. If you need a return value, must set it as a side-effect of the body function.
 *
 * @param source - The collection to iterate (array, object, Map, Set, etc.)
 * @param body - The function to call for each element.
 * @returns void
 */
const iterate = (source: any, body: CoreIterationFunction): void => {
  if (exists(source))
    if (isArrayIterable(source)) for (let key = 0, { length } = source; key < length; key++) { if (body(source[key], key)) break; }
    else if (isPlainObject(source)) for (const key in source) { if (body(source[key], key)) break; }
    else if (isMap(source)) for (const [key, value] of source.entries()) { if (body(value, key)) break; }
    // else if (isSet(source)) for (const value of source) { if (body(value, value)) break; }
    else if (isOfIterable(source)) { let count = 0; for (const value of source) { if (body(value, count++)) break; } }
    else throw new Error(`Unsupported source type: ${typeof source}`);
};

/*
  Returns a function that handles "with", "when" and "stopWhen" comprehension clauses:

  1. Returns true if the "stopWhen" is provided and returns true, otherwise returns it will return false
  2. If stopWhen is false, "when" and "with" are processed
  3. If there is no "when" or "when" returns true, "with" is called.
*/
const normalizeBody = (withFunction: (value: any, key: any) => any, options: AcceptedComprehensionOptions): (value: any, key: any) => boolean => {
  let { when, stopWhen } = options;
  if (when && stopWhen) {
    return (v: any, k: any) => {
      if (stopWhen(v, k)) return true;
      if (when(v, k)) withFunction(v, k);
      return false;
    }
  }
  if (when) {
    return (v: any, k: any) => {
      if (when(v, k)) withFunction(v, k);
      return false;
    }
  }
  if (stopWhen) {
    return (v: any, k: any) => {
      if (stopWhen(v, k)) return true;
      withFunction(v, k);
      return false;
    }
  }
  return (v: any, k: any) => { withFunction(v, k); return false; };
};


let normalizeKeyFunction = (source: any, options: AcceptedComprehensionOptions) =>
  options.withKey || (isArrayIterable(source) ? returnFirstArg : returnSecondArg)

const _each = (source: any, withFunction: (value: any, key: any) => any, options: AcceptedComprehensionOptions) => {
  iterate(source, normalizeBody(withFunction, options));
};

//************************************************************************
// NORMALIZED COMPREHENSION FUNCTIONS
//************************************************************************
type NormalizedIterationFunction = (source: any, options: NormalizedComprehensionOptions) => any;

const normalizedEach: NormalizedIterationFunction = (source: any, options: NormalizedComprehensionOptions) => {
  _each(source, options.with, options);
  return options.into;
};

const normalizedArrayIteration: NormalizedIterationFunction = (source: any, options: NormalizedComprehensionOptions) => {
  let { into, with: withFunction } = options;
  if (into == null) into = [];
  _each(source, (v: any, k: any) => into.push(withFunction(v, k)), options);
  return into;
};

const normalizedObjectIteration: NormalizedIterationFunction = (source: any, options: NormalizedComprehensionOptions) => {
  let { into, with: withFunction } = options;
  if (into == null) into = {};
  let withKey = normalizeKeyFunction(source, options);
  _each(source, (v, k) => (into[withKey(v, k)] = withFunction(v, k)), options);
  return into;
};

const normalizedReduceIteration: NormalizedIterationFunction = (source: any, options: NormalizedComprehensionOptions) => {
  let { into, with: withFunction } = options;
  let first = into === undefined;
  _each(source, (v: any, k: any) => {
    if (first) { first = false; into = v; }
    else {
      into = withFunction(into, v, k)
    }
  }, options);
  return into;
};

const normalizedFindIteration: NormalizedIterationFunction = (source: any, options: NormalizedComprehensionOptions) => {
  let { with: withFunction } = options;
  let { when } = options;
  let found: any | undefined = undefined;
  iterate(
    source,
    when
      ? (v, k) => {
        if (when(v, k)) {
          found = withFunction(v, k);
          return true; // signal to stop iteration
        }
        return false;
      }
      : (v, k) => {
        found = withFunction(v, k) // stops iteration if withFunction returns an value that "exists" (is not undefined, non null)
        return found != null;
      }
  );
  return found;
};

//####################
// PRIVATE
//####################

// WithFunction has two signatures: value + key, or for reduce, accumulator + value + key
type ValueKeyFunction = (value?: any, key?: any) => any;
type AccumulatorValueKeyFunction = (accumulator?: any, value?: any, key?: any) => any;
type WithFunction = ValueKeyFunction | AccumulatorValueKeyFunction;
type WhenFunction = (value: any, key: any) => any;
type WithKeyFunction = (value: any, key: any) => any;

type AcceptedComprehensionOptions = {
  into?: any;
  inject?: any; // alias for into - used to make "reduce" calls make more sense
  returning?: any; // alias for into - used to make "each" calls make more sense
  with?: WithFunction;
  when?: WhenFunction;
  withKey?: WithKeyFunction;
  stopWhen?: (value: any, key: any) => any;
}

type WithOrOptions = WithFunction | AcceptedComprehensionOptions;

const isAcceptedComprehensionOptions = (o: any): o is AcceptedComprehensionOptions => isPlainObject(o)

// the 'with' param will always exist when normalized
type NormalizedComprehensionOptions = Omit<AcceptedComprehensionOptions, 'with' | 'inject' | 'returning'> & {
  with: WithFunction;
}

/**
 * Returns the first non-undefined value from into, inject, or returning
 *
 * @param into - The 'into' parameter.
 * @param inject - The 'inject' parameter.
 * @param returning - The 'returning' parameter.
 * @returns The normalized 'into' parameter.
 */
const firstNotUndefined = (into: any, inject: any, returning: any) => {
  if (into === undefined) into = inject
  if (into === undefined) into = returning
  return into
}

const normalizeIterationParams = (withOrOptions?: WithOrOptions): NormalizedComprehensionOptions => {
  if (isAcceptedComprehensionOptions(withOrOptions)) {
    const { with: withFunction, into, inject, returning, ...rest } = withOrOptions;
    return { ...rest, into: firstNotUndefined(into, inject, returning), with: withFunction ?? returnFirstArg };
  }
  if (isFunction(withOrOptions)) {
    return { with: withOrOptions };
  }
  return { with: returnFirstArg };
};

/*
Normalizes input params for the 'iteration' function.
Since this normalizes multiple params, and therefor would need to return
an new array or new object otherwise, we pass IN the iteration function
and pass the params directly to it. This keeps the computed params on the
stack and doesn't create new objects.

IN signature 1: (iteration, source, withFunction) ->
IN signature 2: (iteration, source, options) ->
IN signature 3: (iteration, source) ->

IN:
iteration: (source, into, withFunction, options) -> out

  The iteration function is invoked last with the computed args.
  Its results are returned.

  IN:
    source:     passed directly through from inputs
    into:       passed directly through from inputs OR from options.into
    withFunction:  passed directly through from inputs OR from options.with
    options:    passed directly through from inputs OR {}
                (guaranteed to be set and a plainObject)

source: the source collection to be iterated over. Passed directly through.

into:       passed through to 'iteration'
withFunction:      passed through to 'iteration'
options:    passed through to 'iteration' AND:

  into:     set 'into' from the options object
  with:     set 'withFunction' from the options object

OUT: out
*/
const invokeNormalizedIteration = (
  normalizedIterationFunction: NormalizedIterationFunction,
  source: any,
  withOrOptions: WithOrOptions
) => normalizedIterationFunction(source, normalizeIterationParams(withOrOptions));

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
 * @param withOrOptions Optional: Either the `into` value or the function to call for each element.
 * @returns The `into`/`inject`/`returning` value if provided, otherwise `undefined`.
 */
export const each: EachFunction = ((source: any, withOrOptions: WithOrOptions) => invokeNormalizedIteration(normalizedEach, source, withOrOptions)) as EachFunction;

/**
 * Builds a new array from the provided collection, optionally transforming or filtering elements.
 *
 * Options:
 * - `with`: function to transform each element (like map)
 * - `when`: function to filter elements (like filter)
 * - `into`: array to push results into (default: new array)
 *
 * @param source The collection to iterate (array, object, Map, Set, etc.)
 * @param withOrOptions Optional: `with` function, or options object, or `into` array.
 * @returns The resulting array.
 */
export const array: ArrayFunction = ((source: any, withOrOptions: WithOrOptions) => invokeNormalizedIteration(normalizedArrayIteration, source, withOrOptions)) as ArrayFunction;

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
 * @param withOrOptions Optional: `with` function, or options object, or `into` object.
 * @returns The resulting object.
 */
export const object: ObjectFunction = ((source: any, withOrOptions: WithOrOptions) => invokeNormalizedIteration(normalizedObjectIteration, source, withOrOptions)) as ObjectFunction;

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
 * @param withOrOptions Optional: initial value or reducer function or options object.
 * @returns The reduced value.
 */
export const reduce: ReduceFunction = ((source: any, withOrOptions: WithOrOptions) => invokeNormalizedIteration(normalizedReduceIteration, source, withOrOptions)) as ReduceFunction;

/**
 * Finds and returns the first value in the collection that matches the given criteria.
 *
 * Options:
 * - `with`: function to transform the found value
 * - `when`: function to filter elements (predicate)
 *
 * @param source The collection to search (array, object, Map, Set, etc.)
 * @param withOrOptions Optional: predicate or options object.
 * @returns The found value, or undefined if not found.
 */
export const find: FindFunction = ((source: any, withOrOptions: WithOrOptions) => invokeNormalizedIteration(normalizedFindIteration, source, withOrOptions)) as FindFunction;


/**
 * Returns true if the source is a comprehension iterable.
 *
 * A comprehension iterable is any object that can be iterated over.
 *
 * This is different from isFullySupportedComprehensionIterable, which only checks if we can both generate and iterate over the source.
 *
 * NOTE strings are not considered comprehension iterables.
 *
 * @param source - The source to check.
 * @returns True if the source is a comprehension iterable, false otherwise.
 */
export const isComprehensionIterable = (source: any): source is AnyContainer<any> =>
  isArrayIterable(source) || isPlainObject(source) || isMap(source) || isSet(source) || isOfIterable(source)

/**
 * Returns true if the source is a fully supported comprehension iterable.
 *
 * Fully supported means we can both generate as well as iterate over the source.
 *
 * This is different from isComprehensionIterable, which only checks if we can iterate over the source.
 *
 * This is useful for cases where we need to know if we can both generate and iterate over the source,
 * such as when we are using the source in a comprehension.
 *
 * Currently, this is only true for arrays and objects. TODO: add Map and Set support.
 * @param source - The source to check.
 * @returns True if the source is a fully supported comprehension iterable, false otherwise.
 */
export const isFullySupportedComprehensionIterable = (source: any): source is AnyContainer<any> =>
  isArrayIterable(source) || isPlainObject(source)

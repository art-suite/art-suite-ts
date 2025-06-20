// Common helper types
export type NotPresent = null | undefined;
export type PlainObject<V = any> = Record<string, V>;

// Input source types
export type ArrayInput<InV> = InV[];
export type ObjectInput<InV> = PlainObject<InV>;
// Basic Iterable input - specific key type (NumK for numeric, StrK for string) depends on usage context
export type IterableInput<InV, InK> = Iterable<[InK, InV]>;


// Callbacks
type WithFn<InV, InK, OutV> = (value: InV, key: InK) => OutV;
type WhenFn<InV, InK> = (value: InV, key: InK) => any; // falsy value to skip to the next iteration
type StopWhenFn<InV, InK> = (value: InV, key: InK) => any; // truthy value to stop iteration
// For generic iterables, key type can vary. For Set<V>, key is V. For Map<K,V>, key is K.

type ReduceWithFn<AccV, InV, InK> = (accumulator: AccV, value: InV, key: InK) => AccV;

// Options
interface BaseComprehensionOptions<InV, InK, OutV> {
  when?: WhenFn<InV, InK>;
  stopWhen?: StopWhenFn<InV, InK>;
  // 'map' option from Comprehensions.js is mainly for reduce/inject internal step,
  // if it needs to be exposed, it would be: map?: (value: InV, key: InK_Actual) => any;
}

/** Options for array comprehension:
 *  - If `with` is omitted, `OutV = InV`.
 *  - If `with` is provided, `OutV` is inferred from the callback.
 */
export type ArrayComprehensionOptions<InV, InK, OutV = InV> =
  BaseComprehensionOptions<InV, InK, OutV> & {
    with?: WithFn<InV, InK, OutV>
    into?: OutV[]
  }

/** Options for object comprehension:
 *  - If `with` is omitted, `OutV = InV`.
 *  - If `with` is provided, `OutV` is inferred from the callback.
 */
export type ObjectComprehensionOptions<
  InV,
  InK,
  OutV = InV,
  OutK = any // in the future, withKey may be able to help refine the returned key type
> =
  BaseComprehensionOptions<InV, InK, OutV> & {
    with?: WithFn<InV, InK, OutV>
    withKey?: WithFn<InV, InK, OutK>
    into?: PlainObject<OutV>
  }
// For find()
interface FindComprehensionOptions<InV, InK, OutV = InV> extends BaseComprehensionOptions<InV, InK, OutV> { }

interface ReduceComprehensionOptions<AccV, InV, InK> extends BaseComprehensionOptions<InV, InK, AccV> {
  inject?: AccV; // alias for into
  with: ReduceWithFn<AccV, InV, InK>; // This 'with' is the reducer
}

// ### array ###
export interface ArrayFunction {
  //******************************************
  // Array-iterable variants
  //******************************************
  // Variant 1: only `array` source
  <InV>(source: ArrayInput<InV>): InV[]

  // Variant 2: has `with` function
  <InV, OutV>(source: ArrayInput<InV>, withFn: WithFn<InV, number, OutV>): OutV[]

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: ArrayComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV>; into?: OutV[] }
  ): OutV[]

  // Variant 4: `options` without `with`
  <InV>(source: ArrayInput<InV>, options: Omit<ArrayComprehensionOptions<InV, InV>, 'with'>): InV[]

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: ArrayInput<InV>, options: Omit<ArrayComprehensionOptions<InV, OutV>, 'into' | 'with'> & { into: OutV[] }): OutV[]

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: ArrayComprehensionOptions<InV, number, OutV> & { into?: OutV[]; with: WithFn<InV, number, OutV> }
  ): OutV[]

  //******************************************
  // Object-iterable variants
  //******************************************
  // Variant 1: only `object` source
  <InV>(source: ObjectInput<InV>): InV[]

  // Variant 2: source and with-function
  <InV, OutV>(source: ObjectInput<InV>, withFn: WithFn<InV, string, OutV>): OutV[]

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: ArrayComprehensionOptions<InV, string, OutV> & { into?: OutV[]; with: WithFn<InV, string, OutV> }
  ): OutV[]

  // Variant 4: `options` without `with`
  <InV>(source: ObjectInput<InV>, options: Omit<ArrayComprehensionOptions<InV, InV>, 'with'>): InV[]

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: ObjectInput<InV>, options: Omit<ArrayComprehensionOptions<InV, OutV>, 'into' | 'with'> & { into: OutV[] }): OutV[]

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: ArrayComprehensionOptions<InV, string, OutV> & { into?: OutV[]; with: WithFn<InV, string, OutV> }
  ): OutV[]

  //******************************************
  // Iterable variants
  //******************************************
  // Variant 1: only `iterable` source
  <InV, InK>(source: IterableInput<InV, InK>): InV[]

  // Variant 2: has `with` function
  <InV, InK, OutV>(source: IterableInput<InV, InK>, withFn: WithFn<InV, InK, OutV>): OutV[]

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV, InK>(
    source: IterableInput<InV, InK>,
    options: ArrayComprehensionOptions<InV, InK, OutV> & { into?: OutV[]; with: WithFn<InV, InK, OutV> }
  ): OutV[]

  // Variant 4: `options` without `with`
  <InV, InK>(source: IterableInput<InV, InK>, options: Omit<ArrayComprehensionOptions<InV, InK, InV>, 'with'>): InV[]

  // Variant 5: `options` with `into` and no `with`
  <InV, InK, OutV>(source: IterableInput<InV, InK>, options: Omit<ArrayComprehensionOptions<InV, InK, OutV>, 'into' | 'with'> & { into: OutV[] }): OutV[]

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV, InK>(
    source: IterableInput<InV, InK>,
    options: ArrayComprehensionOptions<InV, InK, OutV> & { into?: OutV[]; with: WithFn<InV, InK, OutV> }
  ): OutV[]

  //**********************************************
  // NotPresent variants - returns empty array
  //**********************************************
  (source: NotPresent, withFnOrOptions?: any): []

  //**********************************************
  // TypeScript no-match - make it more clear that if the source is valid, it's the second param that is wrong
  //**********************************************
  (
    source: ArrayInput<any> | ObjectInput<any> | IterableInput<any, any>,
    withFnOrOptions: WithFn<any, any, any> | ArrayComprehensionOptions<any, any, any>
  ): never
}

// ### object ###
export interface ObjectFunction {
  //******************************************
  // Array-iterable variants
  //******************************************
  // Variant 1: only `array` source
  <InV>(source: ArrayInput<InV>): PlainObject<InV>

  // Variant 2: has `with` function
  <InV, OutV>(source: ArrayInput<InV>, withFn: WithFn<InV, number, OutV>): PlainObject<OutV>

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: ObjectComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV>; into?: PlainObject<OutV> }
  ): PlainObject<OutV>

  // Variant 4: `options` without `with`
  <InV>(source: ArrayInput<InV>, options: Omit<ObjectComprehensionOptions<InV, number, InV>, 'with'>): PlainObject<InV>

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: ArrayInput<InV>, options: Omit<ObjectComprehensionOptions<InV, number, OutV>, 'into' | 'with'> & { into: PlainObject<OutV> }): PlainObject<OutV>

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: ObjectComprehensionOptions<InV, number, OutV> & { into?: PlainObject<OutV>; with: WithFn<InV, number, OutV> }
  ): PlainObject<OutV>

  //******************************************
  // Object-iterable variants
  //******************************************
  // Variant 1: only `object` source
  <InV>(source: ObjectInput<InV>): PlainObject<InV>

  // Variant 2: source and with-function
  <InV, OutV>(source: ObjectInput<InV>, withFn: WithFn<InV, string, OutV>): PlainObject<OutV>

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: ObjectComprehensionOptions<InV, string, OutV> & { with: WithFn<InV, string, OutV>; into?: PlainObject<OutV> }
  ): PlainObject<OutV>

  // Variant 4: `options` without `with`
  <InV>(source: ObjectInput<InV>, options: Omit<ObjectComprehensionOptions<InV, string, InV>, 'with'>): PlainObject<InV>

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: ObjectInput<InV>, options: Omit<ObjectComprehensionOptions<InV, string, OutV>, 'into' | 'with'> & { into: PlainObject<OutV> }): PlainObject<OutV>

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: ObjectComprehensionOptions<InV, string, OutV> & { with: WithFn<InV, string, OutV>; into?: PlainObject<OutV> }
  ): PlainObject<OutV>

  //******************************************
  // Iterable variants
  //******************************************
  // Variant 1: only `iterable` source
  <InV, InK>(source: IterableInput<InV, InK>): PlainObject<InV>

  // Variant 2: has `with` function
  <InV, InK, OutV>(source: IterableInput<InV, InK>, withFn: WithFn<InV, InK, OutV>): PlainObject<OutV>

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV, InK>(
    source: IterableInput<InV, InK>,
    options: ObjectComprehensionOptions<InV, InK, OutV> & { into?: PlainObject<OutV>; with: WithFn<InV, InK, OutV> }
  ): PlainObject<OutV>

  // Variant 4: `options` without `with`
  <InV, InK>(source: IterableInput<InV, InK>, options: Omit<ObjectComprehensionOptions<InV, InK, InV>, 'with'>): PlainObject<InV>

  // Variant 5: `options` with `into` and no `with`
  <InV, InK, OutV>(source: IterableInput<InV, InK>, options: Omit<ObjectComprehensionOptions<InV, InK, OutV>, 'into' | 'with'> & { into: PlainObject<OutV> }): PlainObject<OutV>

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV, InK>(
    source: IterableInput<InV, InK>,
    options: ObjectComprehensionOptions<InV, InK, OutV> & { into?: PlainObject<OutV>; with: WithFn<InV, InK, OutV> }
  ): PlainObject<OutV>

  //**********************************************
  // NotPresent variants - returns empty object
  //**********************************************
  (source: NotPresent, withFnOrOptions?: any): PlainObject<never>

  //**********************************************
  // TypeScript no-match - make it more clear that if the source is valid, it's the second param that is wrong
  //**********************************************
  (
    source: ArrayInput<any> | ObjectInput<any> | IterableInput<any, any>,
    withFnOrOptions: WithFn<any, any, any> | ObjectComprehensionOptions<any, any, any>
  ): never
}

// could be undefined or OutV, but never null, even if OutV is null
type FindResultIfWithFunction<OutV> = OutV extends null ? never : OutV | undefined;

export interface FindFunction {
  //******************************************
  // Array-iterable variants
  //******************************************
  // Variant 1: only `array` source
  <InV>(source: ArrayInput<InV>): InV | undefined

  // Variant 2: has `with` function
  <InV, OutV>(source: ArrayInput<InV>, withFn: WithFn<InV, number, OutV>): OutV | undefined

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: FindComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV> }
  ): FindResultIfWithFunction<OutV>

  // Variant 4: `options` without `with`
  <InV>(source: ArrayInput<InV>, options: Omit<FindComprehensionOptions<InV, number, InV>, 'with'>): InV | undefined

  // Variant 5: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: FindComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV> }
  ): FindResultIfWithFunction<OutV>

  //******************************************
  // Object-iterable variants
  //******************************************
  // Variant 1: only `object` source
  <InV>(source: ObjectInput<InV>): InV | undefined

  // Variant 2: source and with-function
  <InV, OutV>(source: ObjectInput<InV>, withFn: WithFn<InV, string, OutV>): FindResultIfWithFunction<OutV>

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: FindComprehensionOptions<InV, string, OutV> & { with: WithFn<InV, string, OutV> }
  ): FindResultIfWithFunction<OutV>

  // Variant 4: `options` without `with`
  <InV>(source: ObjectInput<InV>, options: Omit<FindComprehensionOptions<InV, string, InV>, 'with'>): InV | undefined

  // Variant 5: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: FindComprehensionOptions<InV, string, OutV> & { with: WithFn<InV, string, OutV> }
  ): FindResultIfWithFunction<OutV>

  //******************************************
  // Iterable variants
  //******************************************
  // Variant 1: only `iterable` source
  <InV, InK>(source: IterableInput<InV, InK>): InV | undefined

  // Variant 2: has `with` function
  <InV, InK, OutV>(source: IterableInput<InV, InK>, withFn: WithFn<InV, InK, OutV | boolean>): FindResultIfWithFunction<OutV>

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV, InK>(
    source: IterableInput<InV, InK>,
    options: FindComprehensionOptions<InV, InK, OutV> & { with: WithFn<InV, InK, OutV | boolean> }
  ): FindResultIfWithFunction<OutV>

  // Variant 4: `options` without `with`
  <InV, InK>(source: IterableInput<InV, InK>, options: Omit<FindComprehensionOptions<InV, InK, InV>, 'with'>): InV | undefined

  // Variant 5: Full `options` with explicit `with` (for other combinations)
  <InV, OutV, InK>(
    source: IterableInput<InV, InK>,
    options: FindComprehensionOptions<InV, InK, OutV> & { with: WithFn<InV, InK, OutV | boolean> }
  ): FindResultIfWithFunction<OutV>

  //**********************************************
  // NotPresent variants - returns undefined
  //**********************************************
  (source: NotPresent, withFnOrOptions?: any): undefined

  //**********************************************
  // TypeScript no-match - make it more clear that if the source is valid, it's the second param that is wrong
  //**********************************************
  (
    source: ArrayInput<any> | ObjectInput<any> | IterableInput<any, any>,
    withFnOrOptions: WithFn<any, any, any> | FindComprehensionOptions<any, any, any>
  ): never
}

export interface ReduceFunction {
  //******************************************
  // Array-iterable variants
  //******************************************
  // Variant 1: only `array` source
  <InV>(source: ArrayInput<InV>): InV

  // Variant 2: has `with` function
  <InV, AccV>(source: ArrayInput<InV>, withFn: ReduceWithFn<AccV, InV, number>): AccV

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, AccV>(
    source: ArrayInput<InV>,
    options: ReduceComprehensionOptions<AccV, InV, number> & { with: ReduceWithFn<AccV, InV, number>; inject?: AccV }
  ): AccV

  // Variant 4: `options` without `with`
  <InV>(source: ArrayInput<InV>, options: Omit<ReduceComprehensionOptions<InV, InV, number>, 'with'>): InV

  // Variant 5: `options` with `inject` and no `with`
  <InV, AccV>(source: ArrayInput<InV>, options: Omit<ReduceComprehensionOptions<AccV, InV, number>, 'inject' | 'with'> & { inject: AccV }): AccV

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, AccV>(
    source: ArrayInput<InV>,
    options: ReduceComprehensionOptions<AccV, InV, number> & { inject?: AccV; with: ReduceWithFn<AccV, InV, number> }
  ): AccV

  //******************************************
  // Object-iterable variants
  //******************************************
  // Variant 1: only `object` source
  <InV>(source: ObjectInput<InV>): InV

  // Variant 2: source and with-function
  <InV, AccV>(source: ObjectInput<InV>, withFn: ReduceWithFn<AccV, InV, string>): AccV

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, AccV>(
    source: ObjectInput<InV>,
    options: ReduceComprehensionOptions<AccV, InV, string> & { with: ReduceWithFn<AccV, InV, string>; inject?: AccV }
  ): AccV

  // Variant 4: `options` without `with`
  <InV>(source: ObjectInput<InV>, options: Omit<ReduceComprehensionOptions<InV, InV, string>, 'with'>): InV

  // Variant 5: `options` with `inject` and no `with`
  <InV, AccV>(source: ObjectInput<InV>, options: Omit<ReduceComprehensionOptions<AccV, InV, string>, 'inject' | 'with'> & { inject: AccV }): AccV

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, AccV>(
    source: ObjectInput<InV>,
    options: ReduceComprehensionOptions<AccV, InV, string> & { with: ReduceWithFn<AccV, InV, string>; inject?: AccV }
  ): AccV

  //******************************************
  // Iterable variants
  //******************************************
  // Variant 1: only `iterable` source
  <InV, InK>(source: IterableInput<InV, InK>): InV

  // Variant 2: has `with` function
  <InV, InK, AccV>(source: IterableInput<InV, InK>, withFn: ReduceWithFn<AccV, InV, InK>): AccV

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, AccV, InK>(
    source: IterableInput<InV, InK>,
    options: ReduceComprehensionOptions<AccV, InV, InK> & { inject?: AccV; with: ReduceWithFn<AccV, InV, InK> }
  ): AccV

  // Variant 4: `options` without `with`
  <InV, InK>(source: IterableInput<InV, InK>, options: Omit<ReduceComprehensionOptions<InV, InV, InK>, 'with'>): InV

  // Variant 5: `options` with `inject` and no `with`
  <InV, InK, AccV>(source: IterableInput<InV, InK>, options: Omit<ReduceComprehensionOptions<AccV, InV, InK>, 'inject' | 'with'> & { inject: AccV }): AccV

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, AccV, InK>(
    source: IterableInput<InV, InK>,
    options: ReduceComprehensionOptions<AccV, InV, InK> & { inject?: AccV; with: ReduceWithFn<AccV, InV, InK> }
  ): AccV

  //**********************************************
  // NotPresent variants - returns undefined
  //**********************************************
  (source: NotPresent, withFnOrOptions?: any): undefined

  //**********************************************
  // TypeScript no-match - make it more clear that if the source is valid, it's the second param that is wrong
  //**********************************************
  (
    source: ArrayInput<any> | ObjectInput<any> | IterableInput<any, any>,
    withFnOrOptions: ReduceWithFn<any, any, any> | ReduceComprehensionOptions<any, any, any>
  ): never
}

// ### each ###
// `each` returns its `into` argument if provided (via param or options), otherwise returns undefined.
// The `into` is NOT modified by `each` itself, but the callbacks might modify it if it's an object/array.
export interface EachFunction {
  // ArrayInput + into via options
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number, OutV> & { into: OutV }
  ): OutV

  // ArrayInput + options with `with` (no into) → undefined
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV> }
  ): undefined

  // ArrayInput without into → undefined
  <InV, OutV>(
    source: ArrayInput<InV>,
    withFnOrOptions?: WithFn<InV, number, OutV> | BaseComprehensionOptions<InV, number, OutV>
  ): undefined

  // ObjectInput + into via param
  <InV, OutV>(
    source: ObjectInput<InV>,
    into: OutV,
    withFnOrOptions?: WithFn<InV, string, OutV> | BaseComprehensionOptions<InV, string, OutV>
  ): OutV

  // ObjectInput + into via options
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string, OutV> & { into: OutV }
  ): OutV

  // ObjectInput + options with `with` (no into) → undefined
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string, OutV> & { with: WithFn<InV, string, OutV> }
  ): undefined

  // ObjectInput without into → undefined
  <InV, OutV>(
    source: ObjectInput<InV>,
    withFnOrOptions?: WithFn<InV, string, OutV> | BaseComprehensionOptions<InV, string, OutV>
  ): undefined

  // IterableInput (Set-like) + into via options
  <InV, OutV>(
    source: IterableInput<InV, InV>,
    options: BaseComprehensionOptions<InV, InV, OutV> & { into: OutV }
  ): OutV

  // IterableInput (Set-like) + options with `with` (no into) → undefined
  <InV, OutV>(
    source: IterableInput<InV, InV>,
    options: BaseComprehensionOptions<InV, InV, OutV> & { with: WithFn<InV, InV, OutV> }
  ): undefined

  // IterableInput (Set-like) without into → undefined
  <InV, OutV>(
    source: IterableInput<InV, InV>,
    withFnOrOptions?: WithFn<InV, InV, OutV> | BaseComprehensionOptions<InV, InV, OutV>
  ): undefined

  // IterableInput (Map-like) + into via options
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV], KeyV> | Map<KeyV, InV>,
    options: BaseComprehensionOptions<InV, KeyV, OutV> & { into: OutV }
  ): OutV

  // IterableInput (Map-like) + options with `with` (no into) → undefined
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV], KeyV> | Map<KeyV, InV>,
    options: BaseComprehensionOptions<InV, KeyV, OutV> & { with: WithFn<InV, KeyV, OutV> }
  ): undefined

  // IterableInput (Map-like) without into → undefined
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV], KeyV> | Map<KeyV, InV>,
    withFnOrOptions?: WithFn<InV, KeyV, OutV> | BaseComprehensionOptions<InV, KeyV, OutV>
  ): undefined
}

export type AnyContainer<T> = ArrayInput<T> | ObjectInput<T> | IterableInput<T, any>
export type FullySupportedContainer<T> = ArrayInput<T> | ObjectInput<T>
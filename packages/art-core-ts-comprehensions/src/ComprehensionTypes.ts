// Common helper types
export type NotPresent = null | undefined;
export type PlainObject<V = any> = Record<string, V>;

// Input source types
export type ArrayInput<InV> = InV[] | NotPresent;
export type ObjectInput<InV> = PlainObject<InV> | NotPresent;
// Basic Iterable input - specific key type (NumK for numeric, StrK for string) depends on usage context
export type IterableInput<InV> = Iterable<InV> | NotPresent;


// Callbacks
type ArrayWithFn<InV, OutV> = (value: InV, key: number) => OutV;
type ObjectWithFn<InV, OutV> = (value: InV, key: string) => OutV;
// For generic iterables, key type can vary. For Set<V>, key is V. For Map<K,V>, key is K.
type IterableWithFn<InV, InK, OutV> = (value: InV, key: InK) => OutV;

type ArrayWhenFn<InV> = (value: InV, key: number) => boolean;
type ObjectWhenFn<InV> = (value: InV, key: string) => boolean;
type IterableWhenFn<InV, InK> = (value: InV, key: InK) => boolean;

type ObjectKeyFn<InV, InK_Actual, OutK extends string | number | symbol = string> = (value: InV, key: InK_Actual) => OutK;


// Options
interface BaseComprehensionOptions<InV, InK_Actual> {
  when?: InK_Actual extends number ? ArrayWhenFn<InV> : InK_Actual extends string ? ObjectWhenFn<InV> : IterableWhenFn<InV, InK_Actual>;
  stopWhen?: InK_Actual extends number ? ArrayWhenFn<InV> : InK_Actual extends string ? ObjectWhenFn<InV> : IterableWhenFn<InV, InK_Actual>;
  // 'map' option from Comprehensions.js is mainly for reduce/inject internal step,
  // if it needs to be exposed, it would be: map?: (value: InV, key: InK_Actual) => any;
}

/** Options for array comprehension:
 *  - If `with` is omitted, `OutV = InV`.
 *  - If `with` is provided, `OutV` is inferred from the callback.
 */
export type ArrayComprehensionOptions<InV, OutV = InV> =
  BaseComprehensionOptions<InV, number> & {
    into?: OutV[]
  } & (
    { with?: undefined } |
    { with: ArrayWithFn<InV, OutV> }
  )

/** Options for object comprehension:
 *  - If `with` is omitted, `OutV = InV`.
 *  - If `with` is provided, `OutV` is inferred from the callback.
 */
export type ObjectComprehensionOptions<
  InV,
  InK,
  OutV = InV,
  OutK extends string | number | symbol = string
> =
  BaseComprehensionOptions<InV, InK> & {
    into?: PlainObject<OutV>
    withKey?: ObjectKeyFn<InV, InK, OutK>
  } & (
    { with?: undefined } |
    {
      with: InK extends number
      ? ArrayWithFn<InV, OutV>
      : InK extends string
      ? ObjectWithFn<InV, OutV>
      : IterableWithFn<InV, InK, OutV>
    }
  )
// For find()
interface FindComprehensionOptions<InV, InK_Actual, OutV = InV> extends BaseComprehensionOptions<InV, InK_Actual> {
  // `into` is not applicable for find's public API
  with?: InK_Actual extends number ? ArrayWithFn<InV, OutV> : InK_Actual extends string ? ObjectWithFn<InV, OutV> : IterableWithFn<InV, InK_Actual, OutV>;
}

// For reduce() and inject()
type ReduceWithFn<AccV, InV, InK_Actual> = (accumulator: AccV, value: InV, key: InK_Actual) => AccV;

interface ReduceComprehensionOptions<AccV, InV, InK_Actual> extends BaseComprehensionOptions<InV, InK_Actual> {
  into?: AccV; // initial accumulator for inject; also for reduce if explicit
  inject?: AccV; // alias for into
  returning?: AccV; // alias for into
  with: ReduceWithFn<AccV, InV, InK_Actual>; // This 'with' is the reducer
  map?: InK_Actual extends number ? ArrayWithFn<InV, any> : InK_Actual extends string ? ObjectWithFn<InV, any> : IterableWithFn<InV, InK_Actual, any>;
}

// ### array ###
export interface ArrayFunction {
  //******************************************
  // Array-iterable variants
  //******************************************
  // Variant 1: only `array` source
  <InV>(source: ArrayInput<InV>): InV[]

  // Variant 2: has `with` function
  <InV, OutV>(source: ArrayInput<InV>, withFn: ArrayWithFn<InV, OutV>): OutV[]

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & { into?: OutV[]; with: ArrayWithFn<InV, OutV> }
  ): OutV[]

  // Variant 4: `options` without `with`
  <InV>(source: ArrayInput<InV>, options: Omit<ArrayComprehensionOptions<InV, InV>, 'with'>): InV[]

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: ArrayInput<InV>, options: Omit<ArrayComprehensionOptions<InV, OutV>, 'into' | 'with'> & { into: OutV[] }): OutV[]

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: ArrayComprehensionOptions<InV, OutV> & { into?: OutV[]; with: ArrayWithFn<InV, OutV> }
  ): OutV[]

  //******************************************
  // Object-iterable variants
  //******************************************
  // Variant 1: only `object` source
  <InV>(source: ObjectInput<InV>): InV[]

  // Variant 2: source and with-function
  <InV, OutV>(source: ObjectInput<InV>, withFn: ObjectWithFn<InV, OutV>): OutV[]

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & { into?: OutV[]; with: ObjectWithFn<InV, OutV> }
  ): OutV[]

  // Variant 4: `options` without `with`
  <InV>(source: ObjectInput<InV>, options: Omit<ArrayComprehensionOptions<InV, InV>, 'with'>): InV[]

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: ObjectInput<InV>, options: Omit<ArrayComprehensionOptions<InV, OutV>, 'into' | 'with'> & { into: OutV[] }): OutV[]

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: ArrayComprehensionOptions<InV, OutV> & { into?: OutV[]; with: ObjectWithFn<InV, OutV> }
  ): OutV[]

  //******************************************
  // Iterable variants
  //******************************************
  // Variant 1: only `iterable` source
  <InV>(source: IterableInput<InV>): InV[]

  // Variant 2: has `with` function
  <InV, OutV>(source: IterableInput<InV>, withFn: IterableWithFn<InV, any, OutV>): OutV[]

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: IterableInput<InV>,
    options: BaseComprehensionOptions<InV, any> & { into?: OutV[]; with: IterableWithFn<InV, any, OutV> }
  ): OutV[]

  // Variant 4: `options` without `with`
  <InV>(source: IterableInput<InV>, options: Omit<ArrayComprehensionOptions<InV, InV>, 'with'>): InV[]

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: IterableInput<InV>, options: Omit<ArrayComprehensionOptions<InV, OutV>, 'into' | 'with'> & { into: OutV[] }): OutV[]

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: IterableInput<InV>,
    options: ArrayComprehensionOptions<InV, OutV> & { into?: OutV[]; with: IterableWithFn<InV, any, OutV> }
  ): OutV[]

  (source: NotPresent, withFnOrOptions?: any, into?: any): []
}

// ### object ###
export interface ObjectFunction {
  <InV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & {
      withKey: ObjectKeyFn<InV, number, any>
      into?: PlainObject<InV>
    }
  ): PlainObject<InV>

  // ArrayInput + key only (alias), allow any key return
  <InV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & {
      key: ObjectKeyFn<InV, number, any>
      into?: PlainObject<InV>
    }
  ): PlainObject<InV>

  // ArrayInput + when+with
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & {
      into?: PlainObject<OutV>
      key?: ObjectKeyFn<InV, number, OutK>
      withKey?: ObjectKeyFn<InV, number, OutK>
      with: ArrayWithFn<InV, OutV>
    }
  ): PlainObject<OutV>

  // ArrayInput + with
  <InV, OutV = InV>(
    source: ArrayInput<InV>,
    withFn: ArrayWithFn<InV, OutV>
  ): PlainObject<OutV>

  // ArrayInput + into + with
  <InV, OutV = InV>(
    source: ArrayInput<InV>,
    into: PlainObject<OutV>,
    withFn: ArrayWithFn<InV, OutV>
  ): PlainObject<OutV>

  // ArrayInput + options without with/key/withKey
  <InV>(
    source: ArrayInput<InV>,
    options?: Omit<ObjectComprehensionOptions<InV, number, InV>, 'with' | 'key' | 'withKey'>
  ): PlainObject<InV>

  // ArrayInput + full options with with
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ArrayInput<InV>,
    options: ObjectComprehensionOptions<InV, number, OutV, OutK> & { with: ArrayWithFn<InV, OutV> }
  ): PlainObject<OutV>

  // ArrayInput + into + full options
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ArrayInput<InV>,
    into: PlainObject<OutV>,
    options: ObjectComprehensionOptions<InV, number, OutV, OutK> & { with: ArrayWithFn<InV, OutV> }
  ): PlainObject<OutV>


  // --- ObjectInput + withKey only (values = original InV) ---
  <InV, OutK extends string | number | symbol>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & {
      withKey: ObjectKeyFn<InV, string, OutK>
      into?: PlainObject<InV>
    }
  ): PlainObject<InV>

  // --- ObjectInput + key only (alias) ---
  <InV, OutK extends string | number | symbol>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & {
      key: ObjectKeyFn<InV, string, OutK>
      into?: PlainObject<InV>
    }
  ): PlainObject<InV>

  // ObjectInput + when+with
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & {
      into?: PlainObject<OutV>
      key?: ObjectKeyFn<InV, string, OutK>
      withKey?: ObjectKeyFn<InV, string, OutK>
      with: ObjectWithFn<InV, OutV>
    }
  ): PlainObject<OutV>

  // ObjectInput + with
  <InV, OutV = InV>(
    source: ObjectInput<InV>,
    withFn: ObjectWithFn<InV, OutV>
  ): PlainObject<OutV>

  // ObjectInput + into + with
  <InV, OutV = InV>(
    source: ObjectInput<InV>,
    into: PlainObject<OutV>,
    withFn: ObjectWithFn<InV, OutV>
  ): PlainObject<OutV>

  // ObjectInput + options without with/key/withKey
  <InV>(
    source: ObjectInput<InV>,
    options?: Omit<ObjectComprehensionOptions<InV, string, InV>, 'with' | 'key' | 'withKey'>
  ): PlainObject<InV>

  // ObjectInput + full options with with
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ObjectInput<InV>,
    options: ObjectComprehensionOptions<InV, string, OutV, OutK> & { with: ObjectWithFn<InV, OutV> }
  ): PlainObject<OutV>

  // ObjectInput + into + full options
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ObjectInput<InV>,
    into: PlainObject<OutV>,
    options: ObjectComprehensionOptions<InV, string, OutV, OutK> & { with: ObjectWithFn<InV, OutV> }
  ): PlainObject<OutV>

  // IterableInput and NotPresent overloads unchanged…
}
export interface FindFunction {
  // ArrayInput + when+with
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & { with: ArrayWithFn<InV, OutV | boolean> }
  ): OutV | undefined

  // ArrayInput + with
  <InV, OutV>(
    source: ArrayInput<InV>,
    withFn: ArrayWithFn<InV, OutV | boolean>
  ): OutV | undefined

  // ArrayInput + options without with
  <InV>(
    source: ArrayInput<InV>,
    options?: Omit<FindComprehensionOptions<InV, number, InV>, 'with'>
  ): InV | undefined

  // ArrayInput + full options
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: FindComprehensionOptions<InV, number, OutV> & { with: ArrayWithFn<InV, OutV | boolean> }
  ): OutV | undefined

  // ObjectInput + when+with
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & { with: ObjectWithFn<InV, OutV | boolean> }
  ): OutV | undefined

  // ObjectInput + with
  <InV, OutV>(
    source: ObjectInput<InV>,
    withFn: ObjectWithFn<InV, OutV | boolean>
  ): OutV | undefined

  // ObjectInput + options without with
  <InV>(
    source: ObjectInput<InV>,
    options?: Omit<FindComprehensionOptions<InV, string, InV>, 'with'>
  ): InV | undefined

  // ObjectInput + full options
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: FindComprehensionOptions<InV, string, OutV> & { with: ObjectWithFn<InV, OutV | boolean> }
  ): OutV | undefined

  // IterableInput (Set-like) + when+with
  <InV, OutV>(
    source: IterableInput<InV>,
    options: BaseComprehensionOptions<InV, InV> & { with: IterableWithFn<InV, InV, OutV | boolean> }
  ): OutV | undefined

  // IterableInput + with
  <InV, OutV>(
    source: IterableInput<InV>,
    withFn: IterableWithFn<InV, InV, OutV | boolean>
  ): OutV | undefined

  // IterableInput + options without with
  <InV>(
    source: IterableInput<InV>,
    options?: Omit<FindComprehensionOptions<InV, InV, InV>, 'with'>
  ): InV | undefined

  // IterableInput + full options
  <InV, OutV>(
    source: IterableInput<InV>,
    options: FindComprehensionOptions<InV, InV, OutV> & { with: IterableWithFn<InV, InV, OutV | boolean> }
  ): OutV | undefined

  // IterableInput (Map-like) + when+with
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    options: BaseComprehensionOptions<InV, KeyV> & { with: IterableWithFn<InV, KeyV, OutV | boolean> }
  ): OutV | undefined

  // IterableInput + with
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    withFn: IterableWithFn<InV, KeyV, OutV | boolean>
  ): OutV | undefined

  // IterableInput + options without with
  <KeyV, InV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    options?: Omit<FindComprehensionOptions<InV, KeyV, InV>, 'with'>
  ): InV | undefined

  // IterableInput + full options
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    options: FindComprehensionOptions<InV, KeyV, OutV> & { with: IterableWithFn<InV, KeyV, OutV | boolean> }
  ): OutV | undefined

  // NotPresent
  (source: NotPresent, withFnOrOptions?: any): undefined
}

export interface ReduceFunction {
  // 1. reducer + initialValue
  <InV, AccV>(
    source: ArrayInput<InV>,
    reducer: ReduceWithFn<AccV, InV, number>,
    initialValue: AccV
  ): AccV

  // 2. reducer-only with distinct accumulator type → OutV inferred
  <InV, OutV>(
    source: ArrayInput<InV>,
    reducer: (accumulator: OutV, value: InV, key: number) => OutV
  ): OutV

  // 3. reducer-only no initialValue → AccV = InV
  <InV>(
    source: ArrayInput<InV>,
    reducer: ReduceWithFn<InV, InV, number>
  ): InV

  // 4. options without `with` or `inject` → returns last element
  <InV>(
    source: ArrayInput<InV>,
    options?: Omit<ReduceComprehensionOptions<InV, InV, number>, 'with' | 'into' | 'inject' | 'returning'>
  ): InV

  // 5. full options (must include `with`; `into`/`inject` type is return)
  <InV, AccV>(
    source: ArrayInput<InV>,
    options: ReduceComprehensionOptions<AccV, InV, number>
  ): AccV

  // 6. ObjectInput + reducer + initialValue
  <InV, AccV>(
    source: ObjectInput<InV>,
    reducer: ReduceWithFn<AccV, InV, string>,
    initialValue: AccV
  ): AccV

  // 7. ObjectInput + reducer-only distinct accumulator
  <InV, OutV>(
    source: ObjectInput<InV>,
    reducer: (accumulator: OutV, value: InV, key: string) => OutV
  ): OutV

  // 8. ObjectInput + reducer-only no initialValue
  <InV>(
    source: ObjectInput<InV>,
    reducer: ReduceWithFn<InV, InV, string>
  ): InV

  // 9. ObjectInput options without `with` or `inject`
  <InV>(
    source: ObjectInput<InV>,
    options?: Omit<ReduceComprehensionOptions<InV, InV, string>, 'with' | 'into' | 'inject' | 'returning'>
  ): InV

  // 10. ObjectInput full options
  <InV, AccV>(
    source: ObjectInput<InV>,
    options: ReduceComprehensionOptions<AccV, InV, string>
  ): AccV

  // 11. IterableInput + reducer + initialValue
  <InV, KeyV, AccV>(
    source: IterableInput<InV>,
    reducer: ReduceWithFn<AccV, InV, KeyV>,
    initialValue: AccV
  ): AccV

  // 12. IterableInput + reducer-only distinct accumulator
  <InV, KeyV, OutV>(
    source: IterableInput<InV>,
    reducer: (accumulator: OutV, value: InV, key: KeyV) => OutV
  ): OutV

  // 13. IterableInput + reducer-only no initialValue
  <InV, KeyV>(
    source: IterableInput<InV>,
    reducer: ReduceWithFn<InV, InV, KeyV>
  ): InV

  // 14. IterableInput options without `with` or `inject`
  <InV, KeyV>(
    source: IterableInput<InV>,
    options?: Omit<ReduceComprehensionOptions<InV, InV, KeyV>, 'with' | 'into' | 'inject' | 'returning'>
  ): InV

  // 15. IterableInput full options
  <InV, KeyV, AccV>(
    source: IterableInput<InV>,
    options: ReduceComprehensionOptions<AccV, InV, KeyV>
  ): AccV

  // 16. NotPresent → undefined
  (source: NotPresent, reducerOrOptions?: any, initialValue?: any): undefined
}
// ### each ###
// `each` returns its `into` argument if provided (via param or options), otherwise returns undefined.
// The `into` is NOT modified by `each` itself, but the callbacks might modify it if it's an object/array.
export interface EachFunction {
  // ArrayInput + into via options
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & { into: OutV }
  ): OutV

  // ArrayInput + options with `with` (no into) → undefined
  <InV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & { with: ArrayWithFn<InV, any> }
  ): undefined

  // ArrayInput without into → undefined
  <InV>(
    source: ArrayInput<InV>,
    withFnOrOptions?: ArrayWithFn<InV, any> | BaseComprehensionOptions<InV, number>
  ): undefined

  // ObjectInput + into via param
  <InV, OutV>(
    source: ObjectInput<InV>,
    into: OutV,
    withFnOrOptions?: ObjectWithFn<InV, any> | BaseComprehensionOptions<InV, string>
  ): OutV

  // ObjectInput + into via options
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & { into: OutV }
  ): OutV

  // ObjectInput + options with `with` (no into) → undefined
  <InV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & { with: ObjectWithFn<InV, any> }
  ): undefined

  // ObjectInput without into → undefined
  <InV>(
    source: ObjectInput<InV>,
    withFnOrOptions?: ObjectWithFn<InV, any> | BaseComprehensionOptions<InV, string>
  ): undefined

  // IterableInput (Set-like) + into via options
  <InV, OutV>(
    source: IterableInput<InV>,
    options: BaseComprehensionOptions<InV, InV> & { into: OutV }
  ): OutV

  // IterableInput (Set-like) + options with `with` (no into) → undefined
  <InV>(
    source: IterableInput<InV>,
    options: BaseComprehensionOptions<InV, InV> & { with: IterableWithFn<InV, InV, any> }
  ): undefined

  // IterableInput (Set-like) without into → undefined
  <InV>(
    source: IterableInput<InV>,
    withFnOrOptions?: IterableWithFn<InV, InV, any> | BaseComprehensionOptions<InV, InV>
  ): undefined

  // IterableInput (Map-like) + into via options
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    options: BaseComprehensionOptions<InV, KeyV> & { into: OutV }
  ): OutV

  // IterableInput (Map-like) + options with `with` (no into) → undefined
  <KeyV, InV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    options: BaseComprehensionOptions<InV, KeyV> & { with: IterableWithFn<InV, KeyV, any> }
  ): undefined

  // IterableInput (Map-like) without into → undefined
  <KeyV, InV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    withFnOrOptions?: IterableWithFn<InV, KeyV, any> | BaseComprehensionOptions<InV, KeyV>
  ): undefined
}

export type AnyContainer<T> = ArrayInput<T> | ObjectInput<T> | IterableInput<T>
export type FullySupportedContainer<T> = ArrayInput<T> | ObjectInput<T>
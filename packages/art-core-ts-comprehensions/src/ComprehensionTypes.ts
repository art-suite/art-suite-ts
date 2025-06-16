// Common helper types
type NotPresent = null | undefined;
type PlainObject<V = any> = Record<string, V>;

// Input source types
type ArrayInput<InV> = InV[] | NotPresent;
type ObjectInput<InV> = PlainObject<InV> | NotPresent;
// Basic Iterable input - specific key type (NumK for numeric, StrK for string) depends on usage context
type IterableInput<InV> = Iterable<InV> | NotPresent;


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
export type ArrayResultOptions<InV, OutV = InV> =
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
export type ObjectResultOptions<
  InV,
  InK,
  OutV = InV,
  OutK extends string | number | symbol = string
> =
  BaseComprehensionOptions<InV, InK> & {
    into?: PlainObject<OutV>
    key?: ObjectKeyFn<InV, InK, OutK>
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
interface FindOptions<InV, InK_Actual, OutV = InV> extends BaseComprehensionOptions<InV, InK_Actual> {
  // `into` is not applicable for find's public API
  with?: InK_Actual extends number ? ArrayWithFn<InV, OutV> : InK_Actual extends string ? ObjectWithFn<InV, OutV> : IterableWithFn<InV, InK_Actual, OutV>;
}

// For reduce() and inject()
type ReduceWithFn<AccV, InV, InK_Actual> = (accumulator: AccV, value: InV, key: InK_Actual) => AccV;

interface ReduceOptions<AccV, InV, InK_Actual> extends BaseComprehensionOptions<InV, InK_Actual> {
  into?: AccV; // initial accumulator for inject; also for reduce if explicit
  inject?: AccV; // alias for into
  returning?: AccV; // alias for into
  with: ReduceWithFn<AccV, InV, InK_Actual>; // This 'with' is the reducer
  map?: InK_Actual extends number ? ArrayWithFn<InV, any> : InK_Actual extends string ? ObjectWithFn<InV, any> : IterableWithFn<InV, InK_Actual, any>;
}


// ### array ###
export interface ArrayFunction {
  // 1. Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & { into?: OutV[]; with: ArrayWithFn<InV, OutV> }
  ): OutV[]

  // 2. `with` alone
  <InV, OutV>(source: ArrayInput<InV>, withFn: ArrayWithFn<InV, OutV>): OutV[]

  // 3. `into` + `with`
  <InV, OutV>(source: ArrayInput<InV>, into: OutV[], withFn: ArrayWithFn<InV, OutV>): OutV[]

  // 4. `options` without `with`
  <InV>(source: ArrayInput<InV>, options?: Omit<ArrayResultOptions<InV, InV>, 'with'>): InV[]

  // 5. Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: ArrayResultOptions<InV, OutV> & { with: ArrayWithFn<InV, OutV> }
  ): OutV[]

  // ...the rest unchanged:

  <InV, OutV>(
    source: ArrayInput<InV>,
    into: OutV[],
    options: ArrayResultOptions<InV, OutV> & { with: ArrayWithFn<InV, OutV> }
  ): OutV[]

  <InV>(source: ObjectInput<InV>): InV[]
  <InV, OutV>(source: ObjectInput<InV>, withFn: ObjectWithFn<InV, OutV>): OutV[]
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: Omit<ObjectResultOptions<InV, string, OutV>, 'key' | 'withKey' | 'into'> & { into?: OutV[] }
  ): OutV[]
  <InV, OutV>(source: ObjectInput<InV>, into: OutV[], withFn: ObjectWithFn<InV, OutV>): OutV[]
  <InV, OutV>(
    source: ObjectInput<InV>,
    into: OutV[],
    options: Omit<ObjectResultOptions<InV, string, OutV>, 'key' | 'withKey' | 'into'>
  ): OutV[]

  <InV>(source: IterableInput<InV>): InV[]
  <KeyV, InV>(source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>): InV[]
  <InV, OutV = InV>(
    source: IterableInput<InV>,
    withFnOrOptions:
      | IterableWithFn<InV, InV, OutV>
      | (Omit<ObjectResultOptions<InV, InV, OutV>, 'key' | 'withKey' | 'into'> & { into?: OutV[] })
  ): OutV[]
  <KeyV, InV, OutV = InV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    withFnOrOptions:
      | IterableWithFn<InV, KeyV, OutV>
      | (Omit<ObjectResultOptions<InV, KeyV, OutV>, 'key' | 'withKey' | 'into'> & { into?: OutV[] })
  ): OutV[]

  (source: NotPresent, withFnOrOptions?: any, into?: any): []
}
// ### object ###
export interface ObjectFunction {
  // ArrayInput + withKey only (values = original InV), allowing optional keys
  <InV, OutK extends string | number | symbol | undefined>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & {
      withKey: (value: InV, key: number) => OutK
      into?: PlainObject<InV>
    }
  ): PlainObject<InV>

  // ArrayInput + key only (alias), allowing optional keys
  <InV, OutK extends string | number | symbol | undefined>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & {
      key: (value: InV, key: number) => OutK
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
    options?: Omit<ObjectResultOptions<InV, number, InV>, 'with' | 'key' | 'withKey'>
  ): PlainObject<InV>

  // ArrayInput + full options with with
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ArrayInput<InV>,
    options: ObjectResultOptions<InV, number, OutV, OutK> & { with: ArrayWithFn<InV, OutV> }
  ): PlainObject<OutV>

  // ArrayInput + into + full options
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ArrayInput<InV>,
    into: PlainObject<OutV>,
    options: ObjectResultOptions<InV, number, OutV, OutK> & { with: ArrayWithFn<InV, OutV> }
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
    options?: Omit<ObjectResultOptions<InV, string, InV>, 'with' | 'key' | 'withKey'>
  ): PlainObject<InV>

  // ObjectInput + full options with with
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ObjectInput<InV>,
    options: ObjectResultOptions<InV, string, OutV, OutK> & { with: ObjectWithFn<InV, OutV> }
  ): PlainObject<OutV>

  // ObjectInput + into + full options
  <InV, OutV = InV, OutK extends string | number | symbol = string>(
    source: ObjectInput<InV>,
    into: PlainObject<OutV>,
    options: ObjectResultOptions<InV, string, OutV, OutK> & { with: ObjectWithFn<InV, OutV> }
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
    options?: Omit<FindOptions<InV, number, InV>, 'with'>
  ): InV | undefined

  // ArrayInput + full options
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: FindOptions<InV, number, OutV> & { with: ArrayWithFn<InV, OutV | boolean> }
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
    options?: Omit<FindOptions<InV, string, InV>, 'with'>
  ): InV | undefined

  // ObjectInput + full options
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: FindOptions<InV, string, OutV> & { with: ObjectWithFn<InV, OutV | boolean> }
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
    options?: Omit<FindOptions<InV, InV, InV>, 'with'>
  ): InV | undefined

  // IterableInput + full options
  <InV, OutV>(
    source: IterableInput<InV>,
    options: FindOptions<InV, InV, OutV> & { with: IterableWithFn<InV, InV, OutV | boolean> }
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
    options?: Omit<FindOptions<InV, KeyV, InV>, 'with'>
  ): InV | undefined

  // IterableInput + full options
  <KeyV, InV, OutV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    options: FindOptions<InV, KeyV, OutV> & { with: IterableWithFn<InV, KeyV, OutV | boolean> }
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
    options?: Omit<ReduceOptions<InV, InV, number>, 'with' | 'into' | 'inject' | 'returning'>
  ): InV

  // 5. full options (must include `with`; `into`/`inject` type is return)
  <InV, AccV>(
    source: ArrayInput<InV>,
    options: ReduceOptions<AccV, InV, number>
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
    options?: Omit<ReduceOptions<InV, InV, string>, 'with' | 'into' | 'inject' | 'returning'>
  ): InV

  // 10. ObjectInput full options
  <InV, AccV>(
    source: ObjectInput<InV>,
    options: ReduceOptions<AccV, InV, string>
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
    options?: Omit<ReduceOptions<InV, InV, KeyV>, 'with' | 'into' | 'inject' | 'returning'>
  ): InV

  // 15. IterableInput full options
  <InV, KeyV, AccV>(
    source: IterableInput<InV>,
    options: ReduceOptions<AccV, InV, KeyV>
  ): AccV

  // 16. NotPresent → undefined
  (source: NotPresent, reducerOrOptions?: any, initialValue?: any): undefined
}
// ### each ###
// `each` returns its `into` argument if provided (via param or options), otherwise returns undefined.
// The `into` is NOT modified by `each` itself, but the callbacks might modify it if it's an object/array.
export interface EachFunction {
  // ArrayInput + into via param
  <InV, IntoV>(
    source: ArrayInput<InV>,
    into: IntoV,
    withFnOrOptions?: ArrayWithFn<InV, any> | BaseComprehensionOptions<InV, number>
  ): IntoV

  // ArrayInput + into via options
  <InV, IntoV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number> & { into: IntoV }
  ): IntoV

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
  <InV, IntoV>(
    source: ObjectInput<InV>,
    into: IntoV,
    withFnOrOptions?: ObjectWithFn<InV, any> | BaseComprehensionOptions<InV, string>
  ): IntoV

  // ObjectInput + into via options
  <InV, IntoV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string> & { into: IntoV }
  ): IntoV

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

  // IterableInput (Set-like) + into via param
  <InV, IntoV>(
    source: IterableInput<InV>,
    into: IntoV,
    withFnOrOptions?: IterableWithFn<InV, InV, any> | BaseComprehensionOptions<InV, InV>
  ): IntoV

  // IterableInput (Set-like) + into via options
  <InV, IntoV>(
    source: IterableInput<InV>,
    options: BaseComprehensionOptions<InV, InV> & { into: IntoV }
  ): IntoV

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

  // IterableInput (Map-like) + into via param
  <KeyV, InV, IntoV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    into: IntoV,
    withFnOrOptions?: IterableWithFn<InV, KeyV, any> | BaseComprehensionOptions<InV, KeyV>
  ): IntoV

  // IterableInput (Map-like) + into via options
  <KeyV, InV, IntoV>(
    source: IterableInput<[KeyV, InV]> | Map<KeyV, InV>,
    options: BaseComprehensionOptions<InV, KeyV> & { into: IntoV }
  ): IntoV

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

  // NotPresent
  <IntoV = undefined>(
    source: NotPresent,
    withFnOrOptions?: any,
    intoArg?: IntoV
  ): IntoV
}
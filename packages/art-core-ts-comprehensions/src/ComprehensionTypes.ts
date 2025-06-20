// Common helper types
export type NotPresent = null | undefined;
export type PlainObject<V = any> = Record<string, V>;

// Input source types
export type ArrayInput<InV> = InV[] | NotPresent;
export type ObjectInput<InV> = PlainObject<InV> | NotPresent;
// Basic Iterable input - specific key type (NumK for numeric, StrK for string) depends on usage context
export type IterableInput<InV, InK> = Iterable<[InK, InV]> | NotPresent;


// Callbacks
type WithFn<InV, InK, OutV> = (value: InV, key: InK) => OutV;
type WhenFn<InV, InK> = (value: InV, key: InK) => any; // falsy value to skip to the next iteration
type StopWhenFn<InV, InK> = (value: InV, key: InK) => any; // truthy value to stop iteration
// For generic iterables, key type can vary. For Set<V>, key is V. For Map<K,V>, key is K.
type IterableWithFn<InV, InK, OutV> = (value: InV, key: InK) => OutV;

type ArrayWhenFn<InV> = (value: InV, key: number) => boolean;
type ObjectWhenFn<InV> = (value: InV, key: string) => boolean;
type IterableWhenFn<InV, InK> = (value: InV, key: InK) => boolean;

type ObjectKeyFn<InV, InK_Actual, OutK extends string | number | symbol = string> = (value: InV, key: InK_Actual) => OutK;


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

// For reduce() and inject()
type ReduceWithFn<AccV, InV, InK> = (accumulator: AccV, value: InV, key: InK) => AccV;

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
  z<InV>(source: ArrayInput<InV>, options: Omit<ArrayComprehensionOptions<InV, InV>, 'with'>): InV[]

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
  <InV>(source: IterableInput<InV>): InV[]

  // Variant 2: has `with` function
  <InV, OutV>(source: IterableInput<InV>, withFn: WithFn<InV, any, OutV>): OutV[]

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: IterableInput<InV>,
    options: ArrayComprehensionOptions<InV, any, OutV> & { into?: OutV[]; with: WithFn<InV, any, OutV> }
  ): OutV[]

  // Variant 4: `options` without `with`
  <InV>(source: IterableInput<InV>, options: Omit<ArrayComprehensionOptions<InV, InV>, 'with'>): InV[]

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: IterableInput<InV>, options: Omit<ArrayComprehensionOptions<InV, OutV>, 'into' | 'with'> & { into: OutV[] }): OutV[]

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: IterableInput<InV>,
    options: ArrayComprehensionOptions<InV, any, OutV> & { into?: OutV[]; with: WithFn<InV, any, OutV> }
  ): OutV[]

  (source: NotPresent, withFnOrOptions?: any, into?: any): []
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
  <InV>(source: IterableInput<InV>): PlainObject<InV>

  // Variant 2: has `with` function
  <InV, OutV>(source: IterableInput<InV>, withFn: WithFn<InV, any, OutV>): PlainObject<OutV>

  // Variant 3: Combined `when`/`with` overload must come first for correct contextual typing
  <InV, OutV>(
    source: IterableInput<InV>,
    options: ObjectComprehensionOptions<InV, any, OutV> & { into?: PlainObject<OutV>; with: WithFn<InV, any, OutV> }
  ): PlainObject<OutV>

  // Variant 4: `options` without `with`
  <InV>(source: IterableInput<InV>, options: Omit<ObjectComprehensionOptions<InV, any, InV>, 'with'>): PlainObject<InV>

  // Variant 5: `options` with `into` and no `with`
  <InV, OutV>(source: IterableInput<InV>, options: Omit<ObjectComprehensionOptions<InV, any, OutV>, 'into' | 'with'> & { into: PlainObject<OutV> }): PlainObject<OutV>

  // Variant 6: Full `options` with explicit `with` (for other combinations)
  <InV, OutV>(
    source: IterableInput<InV>,
    options: ObjectComprehensionOptions<InV, any, OutV> & { into?: PlainObject<OutV>; with: IterableWithFn<InV, any, OutV> }
  ): PlainObject<OutV>

  (source: NotPresent, withFnOrOptions?: any, into?: any): PlainObject<never>
}
export interface FindFunction {
  // ArrayInput + when+with
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV | boolean> }
  ): OutV | undefined

  // ArrayInput + with
  <InV, OutV>(
    source: ArrayInput<InV>,
    withFn: WithFn<InV, number, OutV | boolean>
  ): OutV | undefined

  // ArrayInput + options without with
  <InV>(
    source: ArrayInput<InV>,
    options?: Omit<FindComprehensionOptions<InV, number, InV>, 'with'>
  ): InV | undefined

  // ArrayInput + full options
  <InV, OutV>(
    source: ArrayInput<InV>,
    options: FindComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV | boolean> }
  ): OutV | undefined

  // ObjectInput + when+with
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: BaseComprehensionOptions<InV, string, OutV> & { with: WithFn<InV, string, OutV | boolean> }
  ): OutV | undefined

  // ObjectInput + with
  <InV, OutV>(
    source: ObjectInput<InV>,
    withFn: WithFn<InV, string, OutV | boolean>
  ): OutV | undefined

  // ObjectInput + options without with
  <InV>(
    source: ObjectInput<InV>,
    options?: Omit<FindComprehensionOptions<InV, string, InV>, 'with'>
  ): InV | undefined

  // ObjectInput + full options
  <InV, OutV>(
    source: ObjectInput<InV>,
    options: FindComprehensionOptions<InV, string, OutV> & { with: WithFn<InV, string, OutV | boolean> }
  ): OutV | undefined

  // IterableInput (Set-like) + when+with
  <InV, OutV>(
    source: IterableInput<InV>,
    options: BaseComprehensionOptions<InV, InV, OutV> & { with: WithFn<InV, InV, OutV | boolean> }
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
    options: BaseComprehensionOptions<InV, KeyV, OutV> & { with: WithFn<InV, KeyV, OutV | boolean> }
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
    options: BaseComprehensionOptions<InV, number, OutV> & { into: OutV }
  ): OutV

  // ArrayInput + options with `with` (no into) → undefined
  <InV>(
    source: ArrayInput<InV>,
    options: BaseComprehensionOptions<InV, number, OutV> & { with: WithFn<InV, number, OutV> }
  ): undefined

  // ArrayInput without into → undefined
  <InV>(
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
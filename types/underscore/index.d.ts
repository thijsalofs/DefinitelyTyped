// Type definitions for Underscore 1.10
// Project: http://underscorejs.org/
// Definitions by: Boris Yankov <https://github.com/borisyankov>,
//                 Josh Baldwin <https://github.com/jbaldwin>,
//                 Christopher Currens <https://github.com/ccurrens>,
//                 Ard Timmerman <https://github.com/confususs>,
//                 Julian Gonggrijp <https://github.com/jgonggrijp>,
//                 Florian Keller <https://github.com/ffflorian>
//                 Regev Brody <https://github.com/regevbr>
//                 Piotr Błażejewicz <https://github.com/peterblazejewicz>
//                 Michael Ness <https://github.com/reubenrybnik>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

declare var _: _.UnderscoreStatic;
export = _;
export as namespace _;

// The DOM is not required to be present, but these definitions reference type Element for the
// isElement check. If the DOM is present, this declaration will merge.
declare global {
    interface Element { }
}

declare module _ {
    /**
    * underscore.js _.throttle options.
    **/
    interface ThrottleSettings {

        /**
        * If you'd like to disable the leading-edge call, pass this as false.
        **/
        leading?: boolean;

        /**
        * If you'd like to disable the execution on the trailing-edge, pass false.
        **/
        trailing?: boolean;
    }

    /**
    * underscore.js template settings, set templateSettings or pass as an argument
    * to 'template()' to override defaults.
    **/
    interface TemplateSettings {
        /**
        * Default value is '/<%([\s\S]+?)%>/g'.
        **/
        evaluate?: RegExp;

        /**
        * Default value is '/<%=([\s\S]+?)%>/g'.
        **/
        interpolate?: RegExp;

        /**
        * Default value is '/<%-([\s\S]+?)%>/g'.
        **/
        escape?: RegExp;

        /**
        * By default, 'template()' places the values from your data in the local scope via the 'with' statement.
        * However, you can specify a single variable name with this setting.
        **/
        variable?: string;
    }

    interface CompiledTemplate {
        (data?: any): string;
        source: string;
    }

    // Common interface between Arrays and jQuery objects
    interface List<T> {
        [index: number]: T;
        length: number;
    }

    interface Dictionary<T> {
        [index: string]: T;
    }

    type Collection<T> = List<T> | Dictionary<T>;

    type EnumerableKey = string | number;

    type CollectionKey<V> = V extends List<any> ? number
        : V extends Dictionary<any> ? string
        : never;

    interface Predicate<T> {
        (value: T): boolean;
    }

    interface CollectionIterator<T extends TypeOfCollection<V>, TResult, V = Collection<T>> {
        (element: T, key: CollectionKey<V>, collection: V): TResult;
    }

    interface ListIterator<T extends TypeOfList<V>, TResult, V = List<T>> extends CollectionIterator<T, TResult, V> { }

    interface ObjectIterator<T extends TypeOfDictionary<V>, TResult, V = Dictionary<T>> extends CollectionIterator<T, TResult, V> { }

    type Iteratee<V, R, T extends TypeOfCollection<V> = TypeOfCollection<V>> =
        CollectionIterator<T, R, V> |
        EnumerableKey |
        EnumerableKey[] |
        Partial<T> |
        null |
        undefined;

    // temporary iteratee type for _Chain until _Chain return types have been fixed
    type _ChainIteratee<V, R, T> = Iteratee<V extends Collection<T> ? V : T[], R>;

    type IterateeResult<I, T> =
        I extends (...args: any[]) => infer R ? R
        : I extends keyof T ? T[I]
        : I extends EnumerableKey |EnumerableKey[] ? any
        : I extends Partial<T> ? boolean
        : I extends null | undefined ? T
        : never;

    type PropertyTypeOrAny<T, K> = K extends keyof T ? T[K] : any;

    interface MemoCollectionIterator<T extends TypeOfCollection<V>, TResult, V = Collection<T>> {
        (prev: TResult, curr: T, key: CollectionKey<V>, collection: V): TResult;
    }

    interface MemoIterator<T extends TypeOfList<V>, TResult, V = List<T>> extends MemoCollectionIterator<T, TResult, V> { }

    interface MemoObjectIterator<T extends TypeOfDictionary<V>, TResult, V = Dictionary<T>> extends MemoCollectionIterator<T, TResult, V> { }

    type TypeOfList<V> =
        V extends never ? any
        : V extends List<infer T> ? T
        : never;

    type TypeOfDictionary<V> =
        V extends never ? any
        : V extends Dictionary<infer T> ? T
        : never;

    type TypeOfCollection<V> = TypeOfList<V> | TypeOfDictionary<V>;

    type ListItemOrSelf<T> = T extends List<infer TItem> ? TItem : T;

    // unfortunately it's not possible to recursively collapse all possible list dimensions to T[] at this time,
    // so give up after one dimension since that's likely the most common case
    // '& object' prevents strings from being matched by list checks so types like string[] don't end up resulting in any
    type DeepestListItemOrSelf<T> =
        T extends List<infer TItem> & object
        ? TItem extends List<any> & object
        ? any
        : TItem
        : T;

    type AnyFalsy = undefined | null | false | '' | 0;

    type Truthy<T> = Exclude<T, AnyFalsy>;

    type _ChainSingle<V> = _Chain<TypeOfCollection<V>, V>;

    interface Cancelable {
        cancel(): void;
    }

    interface UnderscoreStatic {
        /**
         * Underscore OOP Wrapper, all Underscore functions that take an object
         * as the first parameter can be invoked through this function.
         * @param value First argument to Underscore object functions.
         * @returns An Underscore wrapper around the supplied value.
         **/
        <V>(value: V): Underscore<TypeOfCollection<V>, V>;

        /* *************
        * Collections *
        ************* */

        /**
         * Iterates over a collection of elements, yielding each in turn to an
         * iteratee. The iteratee is bound to the context object, if one is
         * passed. Each invocation of `iteratee` is called with three
         * arguments: (element, key, collection).
         * @param collection The collection of elements to iterate over.
         * @param iteratee The iteratee to call for each element in
         * `collection`.
         * @param context 'this' object in `iteratee`, optional.
         * @returns The original collection.
         **/
        each<V extends Collection<any>>(
            collection: V,
            iteratee: CollectionIterator<TypeOfCollection<V>, void, V>,
            context?: any
        ): V;

        /**
         * @see each
         **/
        forEach: UnderscoreStatic['each'];

        /**
         * Produces a new array of values by mapping each value in the collection through a transformation function
         * (iteratee). For function iteratees, each invocation of iteratee is called with three arguments:
         * (value, key, collection).
         * @param collection Maps the elements of this collection.
         * @param iteratee Map iteratee for each element in the collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns The mapped result.
         **/
        map<V extends Collection<any>, I extends Iteratee<V, any>>(
            collection: V,
            iteratee: I,
            context?: any
        ): IterateeResult<I, TypeOfCollection<V>>[];

        /**
         * @see map
         **/
        collect: UnderscoreStatic['map'];

        /**
         * Also known as inject and foldl, reduce boils down a collection of values into a
         * single value. Memo is the initial state of the reduction, and each successive
         * step of it should be returned by iteratee. The iteratee is passed four arguments:
         * the memo, then the value and index (or key) of the iteration, and finally a reference
         * to the entire collection.
         *
         * If no memo is passed to the initial invocation of reduce, the iteratee is not invoked
         * on the first element of the collection. The first element is instead passed as the memo
         * in the invocation of the iteratee on the next element in the collection.
         * @param collection Reduces the elements of this collection.
         * @param iteratee Reduce iteratee function for each element in `collection`.
         * @param memo Initial reduce state or undefined to use the first collection item as initial state.
         * @param context `this` object in `iteratee`, optional.
         * @returns The reduced result.
         **/
        reduce<V extends Collection<any>, TResult>(
            collection: V,
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult, V>,
            memo: TResult,
            context?: any
        ): TResult;
        reduce<V extends Collection<any>, TResult = TypeOfCollection<V>>(
            collection: V,
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult | TypeOfCollection<V>, V>
        ): TResult | TypeOfCollection<V> | undefined;

        /**
         * @see reduce
         **/
        inject: UnderscoreStatic['reduce'];

        /**
         * @see reduce
         **/
        foldl: UnderscoreStatic['reduce'];

        /**
         * The right-associative version of reduce.
         *
         * This is not as useful in JavaScript as it would be in a language with lazy evaluation.
         * @param collection Reduces the elements of this array.
         * @param iteratee Reduce iteratee function for each element in `collection`.
         * @param memo Initial reduce state or undefined to use the first collection item as initial state.
         * @param context `this` object in `iteratee`, optional.
         * @returns The reduced result.
         **/
        reduceRight<V extends Collection<any>, TResult>(
            collection: V,
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult, V>,
            memo: TResult,
            context?: any
        ): TResult;
        reduceRight<V extends Collection<any>, TResult = TypeOfCollection<V>>(
            collection: V,
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult | TypeOfCollection<V>, V>
        ): TResult | TypeOfCollection<V> | undefined;

        /**
         * @see reduceRight
         **/
        foldr: UnderscoreStatic['reduceRight'];

        /**
         * Looks through each value in the collection, returning the first one that passes a
         * truth test (iteratee), or undefined if no value passes the test. The function
         * returns as soon as it finds an acceptable element, and doesn't traverse the entire
         * collection.
         * @param collection Searches for a value in this collection.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @return The first element in `collection` that passes the truth test or undefined
         * if no elements pass.
         **/
        find<V extends Collection<any>>(
            collection: V,
            iteratee?: Iteratee<V, boolean>,
            context?: any
        ): TypeOfCollection<V> | undefined;

        /**
         * @see find
         **/
        detect: UnderscoreStatic['find'];

        /**
         * Looks through each value in the collection, returning an array of all the values that pass a truth
         * test (iteratee).
         * @param collection The collection to filter.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns The set of values that pass the truth test.
         **/
        filter<V extends Collection<any>>(
            collection: V,
            iteratee?: Iteratee<V, boolean>,
            context?: any
        ): TypeOfCollection<V>[];

        /**
         * @see filter
         **/
        select: UnderscoreStatic['filter'];

        /**
         * Looks through each value in the collection, returning an array of all the values that matches the
         * key-value pairs listed in `properties`.
         * @param collection The collection in which to find elements that match `properties`.
         * @param properties The properties to check for on the elements within `collection`.
         * @return The elements in `collection` that match `properties`.
         **/
        where<V extends Collection<any>>(
            collection: V,
            properties: Partial<TypeOfCollection<V>>
        ): TypeOfCollection<V>[];

        /**
         * Looks through the collection and returns the first value that matches all of the key-value
         * pairs listed in `properties`.
         * If no match is found, or if list is empty, undefined will be returned.
         * @param collection The collection in which to find an element that matches `properties`.
         * @param properties The properties to check for on the elements within `collection`.
         * @return The first element in `collection` that matches `properties` or undefined if
         * no match is found.
         **/
        findWhere<V extends Collection<any>>(
            collection: V,
            properties: Partial<TypeOfCollection<V>>
        ): TypeOfCollection<V> | undefined;

        /**
         * Returns the values in `collection` without the elements that pass a truth test (iteratee).
         * The opposite of filter.
         * @param collection The collection to filter.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @return The set of values that fail the truth test.
         **/
        reject<V extends Collection<any>>(
            collection: V,
            iteratee?: Iteratee<V, boolean>,
            context?: any
        ): TypeOfCollection<V>[];

        /**
         * Returns true if all of the values in `collection` pass the `iteratee`
         * truth test. Short-circuits and stops traversing `collection` if a false
         * element is found.
         * @param collection The collection to evaluate.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns True if all elements pass the truth test, otherwise false.
         **/
        every<V extends Collection<any>>(
            collection: V,
            iteratee?: Iteratee<V, boolean>,
            context?: any
        ): boolean;

        /**
         * @see every
         **/
        all: UnderscoreStatic['every'];

        /**
         * Returns true if any of the values in `collection` pass the `iteratee`
         * truth test. Short-circuits and stops traversing `collection` if a
         * true element is found.
         * @param collection The collection to evaluate.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns True if any element passed the truth test, otherwise false.
         **/
        some<V extends Collection<any>>(
            collection: V,
            iteratee?: Iteratee<V, boolean>,
            context?: any
        ): boolean;

        /**
         * @see some
         **/
        any: UnderscoreStatic['some'];

        /**
         * Returns true if the value is present in `collection`. Uses indexOf
         * internally, if `collection` is a List. Use `fromIndex` to start your
         * search at a given index.
         * @param collection The collection to check for `value`.
         * @param value The value to check `collection` for.
         * @param fromIndex The index to start searching from, optional,
         * default = 0, only used when `collection` is a List.
         * @returns True if `value` is present in `collection` after
         * `fromIndex`, otherwise false.
         **/
        contains<V extends Collection<any>>(
            collection: V,
            value: any,
            fromIndex?: number
        ): boolean;

        /**
         * @see contains
         **/
        include: UnderscoreStatic['contains'];

        /**
         * @see contains
         **/
        includes: UnderscoreStatic['contains'];

        /**
        * Calls the method named by methodName on each value in the list. Any extra arguments passed to
        * invoke will be forwarded on to the method invocation.
        * @param list The element's in this list will each have the method `methodName` invoked.
        * @param methodName The method's name to call on each element within `list`.
        * @param arguments Additional arguments to pass to the method `methodName`.
        **/
        invoke<T extends {}>(
            list: _.List<T>,
            methodName: string,
            ...args: any[]): any;

        /**
         * A convenient version of what is perhaps the most common use-case for map: extracting a list of
         * property values.
         * @param collection The collection of items.
         * @param propertyName The name of a specific property to retrieve from all items.
         * @returns The set of values for the specified property for each item in the collection.
         **/
        pluck<V extends Collection<any>, K extends EnumerableKey>(
            collection: V,
            propertyName: K
        ): PropertyTypeOrAny<TypeOfCollection<V>, K>[];

        /**
         * Returns the maximum value in `collection`. If an `iteratee` is
         * provided, it will be used on each element to generate the criterion
         * by which the element is ranked. -Infinity is returned if list is
         * empty. Non-numerical values returned by `iteratee` will be ignored.
         * @param collection The collection in which to find the maximum value.
         * @param iteratee The iteratee that provides the criterion by which
         * each element is ranked, optional if evaluating a collection of
         * numbers.
         * @param context `this` object in `iteratee`, optional.
         * @returns The maximum element within `collection` or -Infinity if
         * `collection` is empty.
         **/
        max<V extends Collection<any>>(
            collection: V,
            iteratee?: Iteratee<V, any>,
            context?: any
        ): TypeOfCollection<V> | number;

        /**
         * Returns the minimum value in `collection`. If an `iteratee` is
         * provided, it will be used on each element to generate the criterion
         * by which the element is ranked. Infinity is returned if list is
         * empty. Non-numerical values returned by `iteratee` will be ignored.
         * @param collection The collection in which to find the minimum value.
         * @param iteratee The iteratee that provides the criterion by which
         * each element is ranked, optional if evaluating a collection of
         * numbers.
         * @param context `this` object in `iteratee`, optional.
         * @returns The minimum element within `collection` or Infinity if
         * `collection` is empty.
         **/
        min<V extends Collection<any>>(
            list: V,
            iteratee?: Iteratee<V, any>,
            context?: any
        ): TypeOfCollection<V> | number;

        /**
        * Returns a sorted copy of list, ranked in ascending order by the results of running each value
        * through iterator. Iterator may also be the string name of the property to sort by (eg. length).
        * @param list Sorts this list.
        * @param iterator Sort iterator for each element within `list`.
        * @param context `this` object in `iterator`, optional.
        * @return A sorted copy of `list`.
        **/
        sortBy<T, TSort>(
            list: _.List<T>,
            iterator?: _.ListIterator<T, TSort>,
            context?: any): T[];

        /**
        * @see _.sortBy
        * @param iterator Sort iterator for each element within `list`.
        **/
        sortBy<T>(
            list: _.List<T>,
            iterator: string,
            context?: any): T[];

        /**
         * Splits a collection into sets, grouped by the result of running each value through iteratee.
         * @param collection The collection to group.
         * @param iteratee An iteratee that provides the value to group by for each item in the collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns A dictionary with the group names as properties where each property contains the grouped elements from the collection.
         **/
        groupBy<V extends Collection<any>>(
            collection: V,
            iteratee: Iteratee<V, any>,
            context?: any
        ): Dictionary<TypeOfCollection<V>[]>;

        /**
        * Given a `list`, and an `iterator` function that returns a key for each element in the list (or a property name),
        * returns an object with an index of each item.  Just like _.groupBy, but for when you know your keys are unique.
        **/
        indexBy<T>(
            list: _.List<T>,
            iterator: _.ListIterator<T, any>,
            context?: any): _.Dictionary<T>;

        /**
        * @see _.indexBy
        * @param iterator Property on each object to index them by.
        **/
        indexBy<T>(
            list: _.List<T>,
            iterator: string,
            context?: any): _.Dictionary<T>;

        /**
        * Sorts a list into groups and returns a count for the number of objects in each group. Similar
        * to groupBy, but instead of returning a list of values, returns a count for the number of values
        * in that group.
        * @param list Group elements in this list and then count the number of elements in each group.
        * @param iterator Group iterator for each element within `list`, return the key to group the element by.
        * @param context `this` object in `iterator`, optional.
        * @return An object with the group names as properties where each property contains the number of elements in that group.
        **/
        countBy<T>(
            list: _.List<T>,
            iterator?: _.ListIterator<T, any>,
            context?: any): _.Dictionary<number>;

        /**
        * @see _.countBy
        * @param iterator Function name
        **/
        countBy<T>(
            list: _.List<T>,
            iterator: string,
            context?: any): _.Dictionary<number>;

        /**
         * Returns a shuffled copy of the collection, using a version of the Fisher-Yates shuffle.
         * @param collection The collection to shuffle.
         * @return A shuffled copy of `collection`.
         **/
        shuffle<V extends Collection<any>>(collection: V): TypeOfCollection<V>[];

        /**
         * Produce a random sample from the collection. Pass a number to return `n` random elements from the collection.
         * Otherwise a single random item will be returned.
         * @param collection The collection to sample.
         * @param n The number of elements to sample from the collection.
         * @return A random sample of `n` elements from `collection` or a single element if `n` is not specified.
         **/
        sample<V extends Collection<any>>(collection: V, n: number): TypeOfCollection<V>[];
        sample<V extends Collection<any>>(collection: V): TypeOfCollection<V> | undefined;

        /**
         * Creates a real Array from the collection (anything that can be
         * iterated over). Useful for transmuting the arguments object.
         * @param collection The collection to transform into an array.
         * @returns An array containing the elements of `collection`.
         **/
        toArray<V extends Collection<any>>(collection: V): TypeOfCollection<V>[];

        /**
         * Determines the number of values in `collection`.
         * @param collection The collection to determine the number of values for.
         * @returns The number of values in `collection`.
         **/
        size(collection: Collection<any>): number;

        /**
         * Splits `collection` into two arrays: one whose elements all satisfy
         * `iteratee` and one whose elements all do not satisfy `iteratee`.
         * @param collection The collection to partition.
         * @param iteratee The iteratee that defines the partitioning scheme
         * for each element in `collection`.
         * @param context `this` object in `iteratee`, optional.
         * @returns An array composed of two elements, where the first element
         * contains the elements in `collection` that satisfied the predicate
         * and the second element contains the elements that did not.
         **/
        partition<V extends Collection<any>>(
            list: V,
            iteratee?: Iteratee<V, boolean>,
            context?: any
        ): [TypeOfCollection<V>[], TypeOfCollection<V>[]];

        /*********
        * Arrays *
        **********/

        /**
         * Returns the first element of `list`. Passing `n` will return the
         * first `n` elements of `list`.
         * @param list The list to retrieve elements from.
         * @param n The number of elements to retrieve, optional.
         * @returns The first `n` elements of `list` or the first element if
         * `n` is omitted.
         **/
        first<V extends List<any>>(list: V): TypeOfList<V> | undefined;
        first<V extends List<any>>(
            list: V,
            n: number
        ): TypeOfList<V>[];

        /**
         * @see first
         **/
        head: UnderscoreStatic['first'];

        /**
         * @see first
         **/
        take: UnderscoreStatic['first'];

        /**
         * Returns everything but the last entry of `list`. Especially useful
         * on the arguments object. Pass `n` to exclude the last
         * `n` elements from the result.
         * @param list The list to retrieve elements from.
         * @param n The number of elements from the end of `list` to omit,
         * optional, default = 1.
         * @returns The elements of `list` with the last `n` items omitted.
         **/
        initial<V extends List<any>>(
            list: V,
            n?: number
        ): TypeOfList<V>[];

        /**
         * Returns the last element of `list`. Passing `n` will return the last
         * `n` elements of `list`.
         * @param list The list to retrieve elements from.
         * @param n The number of elements to retrieve, optional.
         * @returns The last `n` elements of `list` or the last element if `n`
         * is omitted.
         **/
        last<V extends List<any>>(list: V): TypeOfList<V> | undefined;
        last<V extends List<any>>(
            list: V,
            n: number
        ): TypeOfList<V>[];

        /**
         * Returns the rest of the elements in `list`. Pass an `index` to
         * return the values of the list from that index onward.
         * @param list The list to retrieve elements from.
         * @param index The index to start retrieving elements from, optional,
         * default = 1.
         * @returns The elements of `list` from `index` to the end of the list.
         **/
        rest<V extends List<any>>(
            list: V,
            index?: number
        ): TypeOfList<V>[];

        /**
         * @see rest
         **/
        tail: UnderscoreStatic['rest'];

        /**
         * @see rest
         **/
        drop: UnderscoreStatic['rest'];

        /**
         * Returns a copy of `list` with all falsy values removed. In
         * JavaScript, false, null, 0, "", undefined and NaN are all falsy.
         * @param list The list to compact.
         * @returns An array containing the elements of `list` without falsy
         * values.
         **/
        compact<V extends List<any> | null | undefined>(list: V): Truthy<TypeOfList<V>>[];

        /**
         * Flattens a nested array (the nesting can be to any depth). If you pass shallow, the array will
         * only be flattened a single level.
         * @param list The array to flatten.
         * @param shallow If true then only flatten one level, optional, default = false.
         * @returns The flattened list.
         **/
        flatten<V extends List<any>>(list: V, shallow?: false): DeepestListItemOrSelf<TypeOfList<V>>[];
        flatten<V extends List<any>>(list: V, shallow: true): ListItemOrSelf<TypeOfList<V>>[];

        /**
         * Returns a copy of `list` with all instances of `values` removed.
         * @param list The list to exclude `values` from.
         * @param values The values to exclude from `list`.
         * @return An array that contains all elements of `list` except for
         * `values`.
         **/
        without<V extends List<any>>(
            list: V,
            ...values: TypeOfList<V>[]
        ): TypeOfList<V>[];

        /**
        * Computes the union of the passed-in arrays: the list of unique items, in order, that are
        * present in one or more of the arrays.
        * @param arrays Array of arrays to compute the union of.
        * @return The union of elements within `arrays`.
        **/
        union<T>(...arrays: _.List<T>[]): T[];

        /**
        * Computes the list of values that are the intersection of all the arrays. Each value in the result
        * is present in each of the arrays.
        * @param arrays Array of arrays to compute the intersection of.
        * @return The intersection of elements within `arrays`.
        **/
        intersection<T>(...arrays: _.List<T>[]): T[];

        /**
        * Similar to without, but returns the values from array that are not present in the other arrays.
        * @param array Keeps values that are within `others`.
        * @param others The values to keep within `array`.
        * @return Copy of `array` with only `others` values.
        **/
        difference<T>(
            array: _.List<T>,
            ...others: _.List<T>[]): T[];

        /**
         * Produces a duplicate-free version of `list`, using === to test
         * object equality. If you know in advance that `list` is sorted,
         * passing true for isSorted will run a much faster algorithm. If you
         * want to compute unique items based on a transformation, pass an
         * iteratee function.
         * @param list The list to remove duplicates from.
         * @param isSorted True if `list` is already sorted, optional,
         * default = false.
         * @param iteratee Transform the elements of `list` before comparisons
         * for uniqueness.
         * @param context 'this' object in `iteratee`, optional.
         * @return An array containing only the unique elements in `list`.
         **/
        uniq<V extends List<any>>(
            list: V,
            isSorted?: boolean,
            iteratee?: Iteratee<V, any>,
            context?: any
        ): TypeOfList<V>[];
        uniq<V extends List<any>>(
            list: V,
            iteratee?: Iteratee<V, any>,
            context?: any
        ): TypeOfList<V>[];

        /**
         * @see uniq
         **/
        unique: UnderscoreStatic['uniq'];

        /**
        * Merges together the values of each of the arrays with the values at the corresponding position.
        * Useful when you have separate data sources that are coordinated through matching array indexes.
        * If you're working with a matrix of nested arrays, zip.apply can transpose the matrix in a similar fashion.
        * @param arrays The arrays to merge/zip.
        * @return Zipped version of `arrays`.
        **/
        zip(...arrays: any[][]): any[][];

        /**
        * @see _.zip
        **/
        zip(...arrays: any[]): any[];

        /**
        * The opposite of zip. Given a number of arrays, returns a series of new arrays, the first
        * of which contains all of the first elements in the input arrays, the second of which
        * contains all of the second elements, and so on. Use with apply to pass in an array
        * of arrays
        * @param arrays The arrays to unzip.
        * @return Unzipped version of `arrays`.
        **/
        unzip(...arrays: any[][]): any[][];

        /**
        * Converts arrays into objects. Pass either a single list of [key, value] pairs, or a
        * list of keys, and a list of values.
        * @param keys Key array.
        * @param values Value array.
        * @return An object containing the `keys` as properties and `values` as the property values.
        **/
        object<TResult extends {}>(
            keys: _.List<string>,
            values: _.List<any>): TResult;

        /**
        * Converts arrays into objects. Pass either a single list of [key, value] pairs, or a
        * list of keys, and a list of values.
        * @param keyValuePairs Array of [key, value] pairs.
        * @return An object containing the `keys` as properties and `values` as the property values.
        **/
        object<TResult extends {}>(...keyValuePairs: any[][]): TResult;

        /**
        * @see _.object
        **/
        object<TResult extends {}>(
            list: _.List<any>,
            values?: any): TResult;

        /**
        * Returns the index at which value can be found in the array, or -1 if value is not present in the array.
        * Uses the native indexOf function unless it's missing. If you're working with a large array, and you know
        * that the array is already sorted, pass true for isSorted to use a faster binary search ... or, pass a number
        * as the third argument in order to look for the first matching value in the array after the given index.
        * @param array The array to search for the index of `value`.
        * @param value The value to search for within `array`.
        * @param isSorted True if the array is already sorted, optional, default = false.
        * @return The index of `value` within `array`.
        **/
        indexOf<T>(
            array: _.List<T>,
            value: T,
            isSorted?: boolean): number;

        /**
        * @see _indexof
        **/
        indexOf<T>(
            array: _.List<T>,
            value: T,
            startFrom: number): number;

        /**
        * Returns the index of the last occurrence of value in the array, or -1 if value is not present. Uses the
        * native lastIndexOf function if possible. Pass fromIndex to start your search at a given index.
        * @param array The array to search for the last index of `value`.
        * @param value The value to search for within `array`.
        * @param from The starting index for the search, optional.
        * @return The index of the last occurrence of `value` within `array`.
        **/
        lastIndexOf<T>(
            array: _.List<T>,
            value: T,
            from?: number): number;

        /**
        * Returns the first index of an element in `array` where the predicate truth test passes
        * @param array The array to search for the index of the first element where the predicate truth test passes.
        * @param predicate Predicate function.
        * @param context `this` object in `predicate`, optional.
        * @return Returns the index of an element in `array` where the predicate truth test passes or -1.`
        **/
        findIndex<T>(
            array: _.List<T>,
            predicate: _.ListIterator<T, boolean> | {},
            context?: any): number;

        /**
        * Returns the last index of an element in `array` where the predicate truth test passes
        * @param array The array to search for the index of the last element where the predicate truth test passes.
        * @param predicate Predicate function.
        * @param context `this` object in `predicate`, optional.
        * @return Returns the index of an element in `array` where the predicate truth test passes or -1.`
        **/
        findLastIndex<T>(
            array: _.List<T>,
            predicate: _.ListIterator<T, boolean> | {},
            context?: any): number;

        /**
         * Uses a binary search to determine the lowest index at which the
         * value should be inserted into `list` in order to maintain `list`'s
         * sorted order. If an iteratee is provided, it will be used to compute
         * the sort ranking of each value, including the value you pass.
         * @param list A sorted list.
         * @param value The value to determine an insert index for to mainain
         * the sorting in `list`.
         * @param iteratee Iteratee to compute the sort ranking of each
         * element including `value`, optional.
         * @param context `this` object in `iteratee`, optional.
         * @return The index where `value` should be inserted into `list`.
         **/
        sortedIndex<V extends List<any>>(
            list: V,
            value: TypeOfList<V>,
            iteratee?: Iteratee<V, any>,
            context?: any
        ): number;

        /**
         * A function to create flexibly-numbered lists of integers, handy for
         * `each` and `map` loops. Returns a list of integers from
         * `startOrStop` (inclusive) to `stop` (exclusive), incremented
         * (or decremented) by `step`. Note that ranges that `stop` before they
         * `start` are considered to be zero-length instead of negative - if
         * you'd like a negative range, use a negative `step`.
         *
         * If `stop` is not specified, `startOrStop` will be the number to stop
         * at and the default start of 0 will be used.
         * @param startOrStop If `stop` is specified, the number to start at.
         * Otherwise, this is the number to stop at and the default start of 0
         * will be used.
         * @param stop The number to stop at.
         * @param step The number to count up by each iteration, optional,
         * default = 1.
         * @returns An array of numbers from start to `stop` with increments
         * of `step`.
         **/
        range(
            startOrStop: number,
            stop?: number,
            step?: number
        ): number[];

        /**
         * Chunks a list into multiple arrays, each containing length or fewer items.
         * @param list The list to split.
         * @param length The maximum size of the inner arrays.
         * @returns The chunked list.
         **/
        chunk<V extends List<any>>(list: V, length: number): TypeOfList<V>[][]

        /*************
         * Functions *
         *************/

        /**
        * Bind a function to an object, meaning that whenever the function is called, the value of this will
        * be the object. Optionally, bind arguments to the function to pre-fill them, also known as partial application.
        * @param func The function to bind `this` to `object`.
        * @param context The `this` pointer whenever `fn` is called.
        * @param arguments Additional arguments to pass to `fn` when called.
        * @return `fn` with `this` bound to `object`.
        **/
        bind(
            func: Function,
            context: any,
            ...args: any[]): () => any;

        /**
        * Binds a number of methods on the object, specified by methodNames, to be run in the context of that object
        * whenever they are invoked. Very handy for binding functions that are going to be used as event handlers,
        * which would otherwise be invoked with a fairly useless this. If no methodNames are provided, all of the
        * object's function properties will be bound to it.
        * @param object The object to bind the methods `methodName` to.
        * @param methodNames The methods to bind to `object`, optional and if not provided all of `object`'s
        * methods are bound.
        **/
        bindAll(
            object: any,
            ...methodNames: string[]): any;

        /**
        * Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
        * A close cousin of bind.  You may pass _ in your list of arguments to specify an argument that should not be
        * pre-filled, but left open to supply at call-time.
        * @param fn Function to partially fill in arguments.
        * @param arguments The partial arguments.
        * @return `fn` with partially filled in arguments.
        **/

        partial<T1, T2>(
            fn: { (p1: T1): T2 },
            p1: T1
        ): { (): T2 };

        partial<T1, T2, T3>(
            fn: { (p1: T1, p2: T2): T3 },
            p1: T1
        ): { (p2: T2): T3 };

        partial<T1, T2, T3>(
            fn: { (p1: T1, p2: T2): T3 },
            p1: T1,
            p2: T2
        ): { (): T3 };

        partial<T1, T2, T3>(
            fn: { (p1: T1, p2: T2): T3 },
            stub1: UnderscoreStatic,
            p2: T2
        ): { (p1: T1): T3 };

        partial<T1, T2, T3, T4>(
            fn: { (p1: T1, p2: T2, p3: T3): T4 },
            p1: T1
        ): { (p2: T2, p3: T3): T4 };

        partial<T1, T2, T3, T4>(
            fn: { (p1: T1, p2: T2, p3: T3): T4 },
            p1: T1,
            p2: T2
        ): { (p3: T3): T4 };

        partial<T1, T2, T3, T4>(
            fn: { (p1: T1, p2: T2, p3: T3): T4 },
            stub1: UnderscoreStatic,
            p2: T2
        ): { (p1: T1, p3: T3): T4 };

        partial<T1, T2, T3, T4>(
            fn: { (p1: T1, p2: T2, p3: T3): T4 },
            p1: T1,
            p2: T2,
            p3: T3
        ): { (): T4 };

        partial<T1, T2, T3, T4>(
            fn: { (p1: T1, p2: T2, p3: T3): T4 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3
        ): { (p1: T1): T4 };

        partial<T1, T2, T3, T4>(
            fn: { (p1: T1, p2: T2, p3: T3): T4 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p2: T2): T4 };

        partial<T1, T2, T3, T4>(
            fn: { (p1: T1, p2: T2, p3: T3): T4 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p1: T1, p2: T2): T4 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1
        ): { (p2: T2, p3: T3, p4: T4): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1,
            p2: T2
        ): { (p3: T3, p4: T4): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            stub1: UnderscoreStatic,
            p2: T2
        ): { (p1: T1, p3: T3, p4: T4): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1,
            p2: T2,
            p3: T3
        ): { (p4: T4): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3
        ): { (p1: T1, p4: T4): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p2: T2, p4: T4): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p1: T1, p2: T2, p4: T4): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (p1: T1): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p2: T2): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p1: T1, p2: T2): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p3: T3): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p3: T3): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p2: T2, p3: T3): T5 };

        partial<T1, T2, T3, T4, T5>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4): T5 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p2: T2, p3: T3): T5 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1
        ): { (p2: T2, p3: T3, p4: T4, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2
        ): { (p3: T3, p4: T4, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2
        ): { (p1: T1, p3: T3, p4: T4, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2,
            p3: T3
        ): { (p4: T4, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3
        ): { (p1: T1, p4: T4, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p2: T2, p4: T4, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p1: T1, p2: T2, p4: T4, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (p1: T1, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p2: T2, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p1: T1, p2: T2, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p3: T3, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p3: T3, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p2: T2, p3: T3, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p2: T2, p3: T3, p5: T5): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p1: T1): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p2: T2): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p1: T1, p2: T2): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p3: T3): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p1: T1, p3: T3): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p2: T2, p3: T3): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p1: T1, p2: T2, p3: T3): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p2: T2, p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p2: T2, p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p3: T3, p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p3: T3, p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p2: T2, p3: T3, p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T6 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p2: T2, p3: T3, p4: T4): T6 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1
        ): { (p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2
        ): { (p3: T3, p4: T4, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2
        ): { (p1: T1, p3: T3, p4: T4, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3
        ): { (p4: T4, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3
        ): { (p1: T1, p4: T4, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p2: T2, p4: T4, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p1: T1, p2: T2, p4: T4, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (p1: T1, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p2: T2, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p1: T1, p2: T2, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p3: T3, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p3: T3, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p2: T2, p3: T3, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p2: T2, p3: T3, p5: T5, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p1: T1, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p2: T2, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p1: T1, p2: T2, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p3: T3, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p1: T1, p3: T3, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p2: T2, p3: T3, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p1: T1, p2: T2, p3: T3, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p2: T2, p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p2: T2, p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p3: T3, p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p3: T3, p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p2: T2, p3: T3, p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p6: T6): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p2: T2): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p3: T3): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1, p3: T3): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p2: T2, p3: T3): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p2: T2, p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2, p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p3: T3, p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p3: T3, p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p2: T2, p3: T3, p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3, p4: T4): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p3: T3, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p3: T3, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p3: T3, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p3: T3, p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p3: T3, p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p3: T3, p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T7 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T7 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1
        ): { (p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2
        ): { (p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2
        ): { (p1: T1, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3
        ): { (p4: T4, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3
        ): { (p1: T1, p4: T4, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p2: T2, p4: T4, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3
        ): { (p1: T1, p2: T2, p4: T4, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4
        ): { (p1: T1, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p2: T2, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4
        ): { (p1: T1, p2: T2, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p3: T3, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p3: T3, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p2: T2, p3: T3, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4
        ): { (p1: T1, p2: T2, p3: T3, p5: T5, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p1: T1, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p2: T2, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5
        ): { (p1: T1, p2: T2, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p3: T3, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p1: T1, p3: T3, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p2: T2, p3: T3, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5
        ): { (p1: T1, p2: T2, p3: T3, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p2: T2, p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p2: T2, p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p3: T3, p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p3: T3, p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p2: T2, p3: T3, p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p6: T6, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p2: T2, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p3: T3, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1, p3: T3, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p2: T2, p3: T3, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p2: T2, p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2, p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p3: T3, p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p3: T3, p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p2: T2, p3: T3, p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p3: T3, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p3: T3, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p3: T3, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p3: T3, p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p3: T3, p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p2: T2, p3: T3, p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p7: T7): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p2: T2): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p3: T3): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1, p3: T3): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p2: T2, p3: T3): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1, p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p2: T2, p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2, p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p3: T3, p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1, p3: T3, p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p2: T2, p3: T3, p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3, p4: T4): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p2: T2, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p3: T3, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p3: T3, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p2: T2, p3: T3, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p2: T2, p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2, p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p3: T3, p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p3: T3, p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p2: T2, p3: T3, p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            p6: T6,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p3: T3, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p3: T3, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p3: T3, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p3: T3, p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p3: T3, p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p3: T3, p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            p5: T5,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p3: T3, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p3: T3, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p3: T3, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            p4: T4,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p4: T4, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p4: T4, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p4: T4, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            p3: T3,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p4: T4, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p3: T3, p4: T4, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            p2: T2,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p3: T3, p4: T4, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            p1: T1,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T8 };

        partial<T1, T2, T3, T4, T5, T6, T7, T8>(
            fn: { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6, p7: T7): T8 },
            stub1: UnderscoreStatic,
            stub2: UnderscoreStatic,
            stub3: UnderscoreStatic,
            stub4: UnderscoreStatic,
            stub5: UnderscoreStatic,
            stub6: UnderscoreStatic,
            p7: T7
        ): { (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5, p6: T6): T8 };

        /**
        * Memoizes a given function by caching the computed result. Useful for speeding up slow-running computations.
        * If passed an optional hashFunction, it will be used to compute the hash key for storing the result, based
        * on the arguments to the original function. The default hashFunction just uses the first argument to the
        * memoized function as the key.
        * @param fn Computationally expensive function that will now memoized results.
        * @param hashFn Hash function for storing the result of `fn`.
        * @return Memoized version of `fn`.
        **/
        memoize<T = Function>(
            fn: T,
            hashFn?: (...args: any[]) => string): T;

        /**
        * Much like setTimeout, invokes function after wait milliseconds. If you pass the optional arguments,
        * they will be forwarded on to the function when it is invoked.
        * @param func Function to delay `waitMS` amount of ms.
        * @param wait The amount of milliseconds to delay `fn`.
        * @arguments Additional arguments to pass to `fn`.
        **/
        delay(
            func: Function,
            wait: number,
            ...args: any[]): any;

        /**
        * @see _delay
        **/
        delay(
            func: Function,
            ...args: any[]): any;

        /**
        * Defers invoking the function until the current call stack has cleared, similar to using setTimeout
        * with a delay of 0. Useful for performing expensive computations or HTML rendering in chunks without
        * blocking the UI thread from updating. If you pass the optional arguments, they will be forwarded on
        * to the function when it is invoked.
        * @param fn The function to defer.
        * @param arguments Additional arguments to pass to `fn`.
        **/
        defer(
            fn: Function,
            ...args: any[]): void;

        /**
        * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly,
        * will only actually call the original function at most once per every wait milliseconds. Useful for
        * rate-limiting events that occur faster than you can keep up with.
        * By default, throttle will execute the function as soon as you call it for the first time, and,
        * if you call it again any number of times during the wait period, as soon as that period is over.
        * If you'd like to disable the leading-edge call, pass {leading: false}, and if you'd like to disable
        * the execution on the trailing-edge, pass {trailing: false}.
        * @param func Function to throttle `waitMS` ms.
        * @param wait The number of milliseconds to wait before `fn` can be invoked again.
        * @param options Allows for disabling execution of the throttled function on either the leading or trailing edge.
        * @return `fn` with a throttle of `wait`.
        **/
        throttle<T extends Function>(
            func: T,
            wait: number,
            options?: _.ThrottleSettings): T & _.Cancelable;

        /**
        * Creates and returns a new debounced version of the passed function that will postpone its execution
        * until after wait milliseconds have elapsed since the last time it was invoked. Useful for implementing
        * behavior that should only happen after the input has stopped arriving. For example: rendering a preview
        * of a Markdown comment, recalculating a layout after the window has stopped being resized, and so on.
        *
        * Pass true for the immediate parameter to cause debounce to trigger the function on the leading instead
        * of the trailing edge of the wait interval. Useful in circumstances like preventing accidental double
        *-clicks on a "submit" button from firing a second time.
        * @param fn Function to debounce `waitMS` ms.
        * @param wait The number of milliseconds to wait before `fn` can be invoked again.
        * @param immediate True if `fn` should be invoked on the leading edge of `waitMS` instead of the trailing edge.
        * @return Debounced version of `fn` that waits `wait` ms when invoked.
        **/
        debounce<T extends Function>(
            fn: T,
            wait: number,
            immediate?: boolean): T & _.Cancelable;

        /**
        * Creates a version of the function that can only be called one time. Repeated calls to the modified
        * function will have no effect, returning the value from the original call. Useful for initialization
        * functions, instead of having to set a boolean flag and then check it later.
        * @param fn Function to only execute once.
        * @return Copy of `fn` that can only be invoked once.
        **/
        once<T extends Function>(fn: T): T;

        /**
        * Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
        * This accumulates the arguments passed into an array, after a given index.
        **/
        restArgs(func: Function, starIndex?: number): Function;

        /**
        * Creates a version of the function that will only be run after first being called count times. Useful
        * for grouping asynchronous responses, where you want to be sure that all the async calls have finished,
        * before proceeding.
        * @param number count Number of times to be called before actually executing.
        * @param Function fn The function to defer execution `count` times.
        * @return Copy of `fn` that will not execute until it is invoked `count` times.
        **/
        after(
            count: number,
            fn: Function): Function;

        /**
        * Creates a version of the function that can be called no more than count times.  The result of
        * the last function call is memoized and returned when count has been reached.
        * @param number count  The maxmimum number of times the function can be called.
        * @param Function fn The function to limit the number of times it can be called.
        * @return Copy of `fn` that can only be called `count` times.
        **/
        before(
            count: number,
            fn: Function): Function;

        /**
        * Wraps the first function inside of the wrapper function, passing it as the first argument. This allows
        * the wrapper to execute code before and after the function runs, adjust the arguments, and execute it
        * conditionally.
        * @param fn Function to wrap.
        * @param wrapper The function that will wrap `fn`.
        * @return Wrapped version of `fn.
        **/
        wrap(
            fn: Function,
            wrapper: (fn: Function, ...args: any[]) => any): Function;

        /**
        * Returns a negated version of the pass-in predicate.
        * @param (...args: any[]) => boolean predicate
        * @return (...args: any[]) => boolean
        **/
        negate(predicate: (...args: any[]) => boolean): (...args: any[]) => boolean;

        /**
        * Returns the composition of a list of functions, where each function consumes the return value of the
        * function that follows. In math terms, composing the functions f(), g(), and h() produces f(g(h())).
        * @param functions List of functions to compose.
        * @return Composition of `functions`.
        **/
        compose(...functions: Function[]): Function;

        /**********
        * Objects *
        ***********/

        /**
        * Retrieve all the names of the object's properties.
        * @param object Retrieve the key or property names from this object.
        * @return List of all the property names on `object`.
        **/
        keys(object: any): string[];

        /**
        * Retrieve all the names of object's own and inherited properties.
        * @param object Retrieve the key or property names from this object.
        * @return List of all the property names on `object`.
        **/
        allKeys(object: any): string[];

        /**
        * Return all of the values of the object's properties.
        * @param object Retrieve the values of all the properties on this object.
        * @return List of all the values on `object`.
        **/
        values<T>(object: _.Dictionary<T>): T[];

        /**
        * Return all of the values of the object's properties.
        * @param object Retrieve the values of all the properties on this object.
        * @return List of all the values on `object`.
        **/
        values(object: any): any[];

        /**
         * Like map, but for objects. Transform the value of each property in turn.
         * @param object The object to transform
         * @param iteratee The function that transforms property values
         * @param context The optional context (value of `this`) to bind to
         * @return a new _.Dictionary of property values
         */
        mapObject<T, U>(object: _.Dictionary<T>, iteratee: (val: T, key: string, object: _.Dictionary<T>) => U, context?: any): _.Dictionary<U>;

        /**
         * Like map, but for objects. Transform the value of each property in turn.
         * @param object The object to transform
         * @param iteratee The function that tranforms property values
         * @param context The optional context (value of `this`) to bind to
         */
        mapObject<T>(object: any, iteratee: (val: any, key: string, object: any) => T, context?: any): _.Dictionary<T>;

        /**
         * Like map, but for objects. Retrieves a property from each entry in the object, as if by _.property
         * @param object The object to transform
         * @param iteratee The property name to retrieve
         * @param context The optional context (value of `this`) to bind to
         */
        mapObject(object: any, iteratee: string, context?: any): _.Dictionary<any>;

        /**
        * Convert an object into a list of [key, value] pairs.
        * @param object Convert this object to a list of [key, value] pairs.
        * @return List of [key, value] pairs on `object`.
        **/
        pairs(object: any): [string, any][];

        /**
        * Returns a copy of the object where the keys have become the values and the values the keys.
        * For this to work, all of your object's values should be unique and string serializable.
        * @param object Object to invert key/value pairs.
        * @return An inverted key/value paired version of `object`.
        **/
        invert(object: any): any;

        /**
        * Returns a sorted list of the names of every method in an object - that is to say,
        * the name of every function property of the object.
        * @param object Object to pluck all function property names from.
        * @return List of all the function names on `object`.
        **/
        functions(object: any): string[];

        /**
        * @see _functions
        **/
        methods(object: any): string[];

        /**
        * Copy all of the properties in the source objects over to the destination object, and return
        * the destination object. It's in-order, so the last source will override properties of the
        * same name in previous arguments.
        * @param destination Object to extend all the properties from `sources`.
        * @param sources Extends `destination` with all properties from these source objects.
        * @return `destination` extended with all the properties from the `sources` objects.
        **/
        extend(
            destination: any,
            ...sources: any[]): any;

        /**
        * Like extend, but only copies own properties over to the destination object. (alias: assign)
        */
        extendOwn(
            destination: any,
            ...source: any[]): any;

        /**
        * Like extend, but only copies own properties over to the destination object. (alias: extendOwn)
        */
        assign(
            destination: any,
            ...source: any[]): any;

        /**
        * Returns the first key on an object that passes a predicate test.
        * @param obj the object to search in
        * @param predicate Predicate function.
        * @param context `this` object in `iterator`, optional.
        */
        findKey<T>(obj: _.Dictionary<T>, predicate: _.ObjectIterator<T, boolean>, context?: any): string;

        /**
        * Return a copy of the object, filtered to only have values for the whitelisted keys
        * (or array of valid keys).
        * @param object Object to strip unwanted key/value pairs.
        * @keys The key/value pairs to keep on `object`.
        * @return Copy of `object` with only the `keys` properties.
        **/
        pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;
        pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
        pick<T, K extends keyof T>(obj: T, predicate: ObjectIterator<T[K], boolean>): Pick<T, K>;

        /**
        * Return a copy of the object, filtered to omit the blacklisted keys (or array of keys).
        * @param object Object to strip unwanted key/value pairs.
        * @param keys The key/value pairs to remove on `object`.
        * @return Copy of `object` without the `keys` properties.
        **/
        omit(
            object: any,
            ...keys: string[]): any;

        /**
        * @see _.omit
        **/
        omit(
            object: any,
            keys: string[]): any;

        /**
        * @see _.omit
        **/
        omit(
            object: any,
            iteratee: Function): any;

        /**
        * Fill in null and undefined properties in object with values from the defaults objects,
        * and return the object. As soon as the property is filled, further defaults will have no effect.
        * @param object Fill this object with default values.
        * @param defaults The default values to add to `object`.
        * @return `object` with added `defaults` values.
        **/
        defaults(
            object: any,
            ...defaults: any[]): any;

        /**
        * Creates an object that inherits from the given prototype object.
        * If additional properties are provided then they will be added to the
        * created object.
        * @param prototype The prototype that the returned object will inherit from.
        * @param props Additional props added to the returned object.
        **/
        create(prototype: any, props?: object): any;

        /**
        * Create a shallow-copied clone of the object.
        * Any nested objects or arrays will be copied by reference, not duplicated.
        * @param object Object to clone.
        * @return Copy of `object`.
        **/
        clone<T>(object: T): T;

        /**
        * Invokes interceptor with the object, and then returns object. The primary purpose of this method
        * is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.
        * @param object Argument to `interceptor`.
        * @param intercepter The function to modify `object` before continuing the method chain.
        * @return Modified `object`.
        **/
        tap<T>(object: T, intercepter: Function): T;

        /**
        * Does the object contain the given key? Identical to object.hasOwnProperty(key), but uses a safe
        * reference to the hasOwnProperty function, in case it's been overridden accidentally.
        * @param object Object to check for `key`.
        * @param key The key to check for on `object`.
        * @return True if `key` is a property on `object`, otherwise false.
        **/
        has(object: any, key: string): boolean;

        /**
        * Returns a predicate function that will tell you if a passed in object contains all of the key/value properties present in attrs.
        * @param attrs Object with key values pair
        * @return Predicate function
        **/
        matches<T>(attrs: T): _.Predicate<T>;

        /**
        * Returns a predicate function that will tell you if a passed in object contains all of the key/value properties present in attrs.
        * @see _.matches
        * @param attrs Object with key values pair
        * @return Predicate function
        **/
        matcher<T>(attrs: T): _.Predicate<T>;

        /**
        * Returns a function that will itself return the key property of any passed-in object.
        * @param key Property of the object.
        * @return Function which accept an object an returns the value of key in that object.
        **/
        property(key: string | number | Array<string | number>): (object: object) => any;

        /**
        * Returns a function that will itself return the value of a object key property.
        * @param key The object to get the property value from.
        * @return Function which accept a key property in `object` and returns its value.
        **/
        propertyOf(object: object): (key: string | number | Array<string | number>) => any;

        /**
         * Performs an optimized deep comparison between `object` and `other`
         * to determine if they should be considered equal.
         * @param object Compare to `other`.
         * @param other Compare to `object`.
         * @returns True if `object` should be considered equal to `other`.
         **/
        isEqual(object: any, other: any): boolean;

        /**
         * Returns true if `collection` contains no values.
         * For strings and array-like objects checks if the length property is 0.
         * @param collection The collection to check.
         * @returns True if `collection` has no elements.
         **/
        isEmpty(collection: any): boolean;

        /**
         * Returns true if the keys and values in `properties` are contained in `object`.
         * @param object The object to check.
         * @param properties The properties to check for in `object`.
         * @returns True if all keys and values in `properties` are also in `object`.
         **/
        isMatch(object: any, properties: any): boolean;

        /**
         * Returns true if `object` is a DOM element.
         * @param object The object to check.
         * @returns True if `object` is a DOM element, otherwise false.
         **/
        isElement(object: any): object is Element;

        /**
         * Returns true if `object` is an Array.
         * @param object The object to check.
         * @returns True if `object` is an Array, otherwise false.
         **/
        isArray(object: any): object is any[];

        /**
         * Returns true if `object` is a Symbol.
         * @param object The object to check.
         * @returns True if `object` is a Symbol, otherwise false.
         **/
        isSymbol(object: any): object is symbol;

        /**
         * Returns true if `object` is an Object. Note that JavaScript arrays and functions are objects,
         * while (normal) strings and numbers are not.
         * @param object The object to check.
         * @returns True if `object` is an Object, otherwise false.
         **/
        isObject(object: any): object is Dictionary<any> & object;

        /**
         * Returns true if `object` is an Arguments object.
         * @param object The object to check.
         * @returns True if `object` is an Arguments object, otherwise false.
         **/
        isArguments(object: any): object is IArguments;

        /**
         * Returns true if `object` is a Function.
         * @param object The object to check.
         * @returns True if `object` is a Function, otherwise false.
         **/
        isFunction(object: any): object is Function;

        /**
         * Returns true if `object` is an Error.
         * @param object The object to check.
         * @returns True if `object` is a Error, otherwise false.
         **/
        isError(object: any): object is Error;

        /**
         * Returns true if `object` is a String.
         * @param object The object to check.
         * @returns True if `object` is a String, otherwise false.
         **/
        isString(object: any): object is string;

        /**
         * Returns true if `object` is a Number (including NaN).
         * @param object The object to check.
         * @returns True if `object` is a Number, otherwise false.
         **/
        isNumber(object: any): object is number;

        /**
         * Returns true if `object` is a finite Number.
         * @param object The object to check.
         * @returns True if `object` is a finite Number.
         **/
        isFinite(object: any): boolean;

        /**
         * Returns true if `object` is a Boolean.
         * @param object The object to check.
         * @returns True if `object` is a Boolean, otherwise false.
         **/
        isBoolean(object: any): object is boolean;

        /**
         * Returns true if `object` is a Date.
         * @param object The object to check.
         * @returns True if `object` is a Date, otherwise false.
         **/
        isDate(object: any): object is Date;

        /**
         * Returns true if `object` is a RegExp.
         * @param object The object to check.
         * @returns True if `object` is a RegExp, otherwise false.
         **/
        isRegExp(object: any): object is RegExp;

        /**
         * Returns true if `object` is NaN.
         * Note: this is not the same as the native isNaN function,
         * which will also return true if the variable is undefined.
         * @param object The object to check.
         * @returns True if `object` is NaN, otherwise false.
         **/
        isNaN(object: any): boolean;

        /**
         * Returns true if `object` is null.
         * @param object The object to check.
         * @returns True if `object` is null, otherwise false.
         **/
        isNull(object: any): object is null;

        /**
         * Returns true if `object` is undefined.
         * @param object The object to check.
         * @returns True if `object` is undefined, otherwise false.
         **/
        isUndefined(object: any): object is undefined;

        /* *********
        * Utility *
        ********** */

        /**
        * Give control of the "_" variable back to its previous owner.
        * Returns a reference to the Underscore object.
        * @return Underscore object reference.
        **/
        noConflict(): any;

        /**
        * Returns the same value that is used as the argument. In math: f(x) = x
        * This function looks useless, but is used throughout Underscore as a default iterator.
        * @param value Identity of this object.
        * @return `value`.
        **/
        identity<T>(value: T): T;

        /**
        * Creates a function that returns the same value that is used as the argument of _.constant
        * @param value Identity of this object.
        * @return Function that return value.
        **/
        constant<T>(value: T): () => T;

        /**
        * Returns undefined irrespective of the arguments passed to it.  Useful as the default
        * for optional callback arguments.
        * Note there is no way to indicate a 'undefined' return, so it is currently typed as void.
        * @return undefined
        **/
        noop(): void;

        /**
        * Invokes the given iterator function n times.
        * Each invocation of iterator is called with an index argument
        * @param n Number of times to invoke `iterator`.
        * @param iterator Function iterator to invoke `n` times.
        * @param context `this` object in `iterator`, optional.
        **/
        times<TResult>(n: number, iterator: (n: number) => TResult, context?: any): TResult[];

        /**
        * Returns a random integer between min and max, inclusive. If you only pass one argument,
        * it will return a number between 0 and that number.
        * @param max The maximum random number.
        * @return A random number between 0 and `max`.
        **/
        random(max: number): number;

        /**
        * @see _.random
        * @param min The minimum random number.
        * @return A random number between `min` and `max`.
        **/
        random(min: number, max: number): number;

        /**
        * Allows you to extend Underscore with your own utility functions. Pass a hash of
        * {name: function} definitions to have your functions added to the Underscore object,
        * as well as the OOP wrapper.
        * @param object Mixin object containing key/function pairs to add to the Underscore object.
        **/
        mixin(object: any): void;

        /**
        * A mostly-internal function to generate callbacks that can be applied to each element
        * in a collection, returning the desired result -- either identity, an arbitrary callback,
        * a property matcher, or a propetery accessor.
        * @param string|Function|Object value The value to iterate over, usually the key.
        * @param any context
        * @return Callback that can be applied to each element in a collection.
        **/
        iteratee(value: string): Function;
        iteratee(value: Function, context?: any): Function;
        iteratee(value: object): Function;

        /**
        * Generate a globally-unique id for client-side models or DOM elements that need one.
        * If prefix is passed, the id will be appended to it. Without prefix, returns an integer.
        * @param prefix A prefix string to start the unique ID with.
        * @return Unique string ID beginning with `prefix`.
        **/
        uniqueId(prefix?: string): string;

        /**
        * Escapes a string for insertion into HTML, replacing &, <, >, ", ', and / characters.
        * @param str Raw string to escape.
        * @return `str` HTML escaped.
        **/
        escape(str: string): string;

        /**
        * The opposite of escape, replaces &amp;, &lt;, &gt;, &quot;, and &#x27; with their unescaped counterparts.
        * @param str HTML escaped string.
        * @return `str` Raw string.
        **/
        unescape(str: string): string;

        /**
        * If the value of the named property is a function then invoke it; otherwise, return it.
        * @param object Object to maybe invoke function `property` on.
        * @param property The function by name to invoke on `object`.
        * @param defaultValue The value to be returned in case `property` doesn't exist or is undefined.
        * @return The result of invoking the function `property` on `object.
        **/
        result(object: any, property: string, defaultValue?: any): any;

        /**
        * Compiles JavaScript templates into functions that can be evaluated for rendering. Useful
        * for rendering complicated bits of HTML from JSON data sources. Template functions can both
        * interpolate variables, using <%= ... %>, as well as execute arbitrary JavaScript code, with
        * <% ... %>. If you wish to interpolate a value, and have it be HTML-escaped, use <%- ... %> When
        * you evaluate a template function, pass in a data object that has properties corresponding to
        * the template's free variables. If you're writing a one-off, you can pass the data object as
        * the second parameter to template in order to render immediately instead of returning a template
        * function. The settings argument should be a hash containing any _.templateSettings that should
        * be overridden.
        * @param templateString Underscore HTML template.
        * @param data Data to use when compiling `templateString`.
        * @param settings Settings to use while compiling.
        * @return Returns the compiled Underscore HTML template.
        **/
        template(templateString: string, settings?: _.TemplateSettings): CompiledTemplate;

        /**
        * By default, Underscore uses ERB-style template delimiters, change the
        * following template settings to use alternative delimiters.
        **/
        templateSettings: _.TemplateSettings;

        /**
        * Returns an integer timestamp for the current time, using the fastest method available in the runtime. Useful for implementing timing/animation functions.
        **/
        now(): number;

        /* **********
        * Chaining *
        *********** */

        /**
         * Returns a wrapped object. Calling methods on this object will continue to return wrapped objects
         * until value() is used.
         * @param value The object to chain.
         * @returns An underscore chain wrapper around the supplied value.
         **/
        chain<V>(value: V): _Chain<TypeOfCollection<V>, V>;

        /**
         * Current version
         */
        readonly VERSION: string;
    }

    interface Underscore<T, V = T> {

        /* *************
        * Collections *
        ************* */

        /**
         * Iterates over the wrapped collection of elements, yielding each in
         * turn to an iteratee. The iteratee is bound to the context object, if
         * one is passed. Each invocation of `iteratee` is called with three
         * arguments: (element, key, collection).
         * @param iteratee The iteratee to call for each element in the wrapped
         * collection.
         * @param context 'this' object in `iteratee`, optional.
         * @returns The originally wrapped collection.
         **/
        each(iteratee: CollectionIterator<TypeOfCollection<V>, void, V>, context?: any): V;

        /**
         * @see each
         **/
        forEach: Underscore<T, V>['each'];

        /**
         * Produces a new array of values by mapping each value in the wrapped collection through a transformation function
         * (iteratee). For function iterators, each invocation of iterator is called with three arguments:
         * (value, key, collection).
         * @param iteratee Map iteratee for each element in the collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns The mapped result.
         **/
        map<I extends Iteratee<V, any>>(
            iteratee: I,
            context?: any
        ): IterateeResult<I, T>[];

        /**
         * @see map
         **/
        collect: Underscore<T, V>['map'];

        /**
         * Also known as inject and foldl, reduce boils down a collection of wrapped values into a
         * single value. Memo is the initial state of the reduction, and each successive
         * step of it should be returned by iteratee. The iteratee is passed four arguments:
         * the memo, then the value and index (or key) of the iteration, and finally a reference
         * to the entire collection.
         *
         * If no memo is passed to the initial invocation of reduce, the iteratee is not invoked
         * on the first element of the collection. The first element is instead passed as the memo
         * in the invocation of the iteratee on the next element in the collection.
         * @param iteratee Reduce iteratee function for each element in the wrapped collection.
         * @param memo Initial reduce state or undefined to use the first collection item as initial state.
         * @param context `this` object in `iteratee`, optional.
         * @returns The reduced result.
         **/
        reduce<TResult>(iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult, V>,
            memo: TResult,
            context?: any
        ): TResult;
        reduce<TResult = TypeOfCollection<V>>(
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult | TypeOfCollection<V>, V>
        ): TResult | TypeOfCollection<V> | undefined;

        /**
         * @see reduce
         **/
        inject: Underscore<T, V>['reduce'];

        /**
         * @see reduce
         **/
        foldl: Underscore<T, V>['reduce'];

        /**
         * The right-associative version of reduce.
         *
         * This is not as useful in JavaScript as it would be in a language with lazy evaluation.
         * @param iteratee Reduce iteratee function for each element in the wrapped collection.
         * @param memo Initial reduce state or undefined to use the first collection item as initial state.
         * @param context `this` object in `iteratee`, optional.
         * @returns The reduced result.
         **/
        reduceRight<TResult>(
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult, V>,
            memo: TResult,
            context?: any
        ): TResult;
        reduceRight<TResult = TypeOfCollection<V>>(
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult | TypeOfCollection<V>, V>
        ): TResult | TypeOfCollection<V> | undefined;

        /**
         * @see reduceRight
         **/
        foldr: Underscore<T, V>['reduceRight'];

        /**
         * Looks through each value in the wrapped collection, returning the first one that passes a
         * truth test (iteratee), or undefined if no value passes the test. The function
         * returns as soon as it finds an acceptable element, and doesn't traverse the entire
         * collection.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @return The first element in the wrapped collection that passes the truth test or undefined
         * if no elements pass.
         **/
        find(iteratee?: Iteratee<V, boolean>, context?: any): T | undefined;

        /**
         * @see find
         **/
        detect: Underscore<T, V>['find'];

        /**
         * Looks through each value in the wrapped collection, returning an array of all the values that pass a truth
         * test (iteratee).
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns The set of values that pass the truth test.
         **/
        filter(iteratee?: Iteratee<V, boolean>, context?: any): T[];

        /**
         * @see filter
         **/
        select: Underscore<T, V>['filter'];

        /**
         * Looks through each value in the wrapped collection, returning an array of all the values that matches the
         * key-value pairs listed in `properties`.
         * @param properties The properties to check for on the elements within the wrapped collection.
         * @return The elements in the wrapped collection that match `properties`.
         **/
        where(properties: Partial<T>): T[];

        /**
         * Looks through the wrapped collection and returns the first value that matches all of the key-value
         * pairs listed in `properties`.
         * If no match is found, or if list is empty, undefined will be returned.
         * @param properties The properties to check for on the elements within the wrapped collection.
         * @return The first element in the wrapped collection that matches `properties` or undefined if
         * no match is found.
         **/
        findWhere(properties: Partial<T>): T | undefined;

        /**
         * Returns the values in the wrapped collection without the elements that pass a truth test (iteratee).
         * The opposite of filter.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @return The set of values that fail the truth test.
         **/
        reject(iteratee?: Iteratee<V, boolean>, context?: any): T[];

        /**
         * Returns true if all of the values in the wrapped collection pass the
         * `iteratee` truth test. Short-circuits and stops traversing the
         * wrapped collection if a false element is found.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns True if all elements pass the truth test, otherwise false.
         **/
        every(iteratee?: Iteratee<V, boolean>, context?: any): boolean;

        /**
         * @see every
         **/
        all: Underscore<T, V>['every'];

        /**
         * Returns true if any of the values in the wrapped collection pass the
         * `iteratee` truth test. Short-circuits and stops traversing the
         * wrapped collection if a true element is found.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns True if any element passed the truth test, otherwise false.
         **/
        some(iteratee?: Iteratee<V, boolean>, context?: any): boolean;

        /**
         * @see some
         **/
        any: Underscore<T, V>['some'];

        /**
         * Returns true if the value is present in the wrapped collection. Uses
         * indexOf internally, if the wrapped collection is a List. Use
         * `fromIndex` to start your search at a given index.
         * @param value The value to check the wrapped collection for.
         * @param fromIndex The index to start searching from, optional,
         * default = 0, only used when the wrapped collection is a List.
         * @returns True if `value` is present in the wrapped collection after
         * `fromIndex`, otherwise false.
         **/
        contains(value: any, fromIndex?: number): boolean;

        /**
         * @see contains
         **/
        include: Underscore<T, V>['contains'];

        /**
         * @see contains
         **/
        includes: Underscore<T, V>['contains'];

        /**
        * Wrapped type `any[]`.
        * @see _.invoke
        **/
        invoke(methodName: string, ...args: any[]): any;

        /**
         * A convenient version of what is perhaps the most common use-case for map: extracting a list of
         * property values.
         * @param propertyName The name of a specific property to retrieve from all items.
         * @returns The set of values for the specified property for each item in the collection.
         **/
        pluck<K extends EnumerableKey>(
            propertyName: K
        ): PropertyTypeOrAny<T, K>[];

        /**
         * Returns the maximum value in the wrapped collection. If an
         * `iteratee` is provided, it will be used on each element to generate
         * the criterion by which the element is ranked. -Infinity is returned
         * if list is empty. Non-numerical values returned by `iteratee` will
         * be ignored.
         * @param iteratee The iteratee that provides the criterion by which
         * each element is ranked, optional if evaluating a collection of
         * numbers.
         * @param context `this` object in `iteratee`, optional.
         * @returns The maximum element within the wrapped collection or
         * -Infinity if the wrapped collection is empty.
         **/
        max(iteratee?: Iteratee<V, any>, context?: any): T | number;

        /**
         * Returns the minimum value in the wrapped collection. If an
         * `iteratee` is provided, it will be used on each element to generate
         * the criterion by which the element is ranked. Infinity is returned
         * if list is empty. Non-numerical values returned by `iteratee` will
         * be ignored.
         * @param iteratee The iteratee that provides the criterion by which
         * each element is ranked, optional if evaluating a collection of
         * numbers.
         * @param context `this` object in `iteratee`, optional.
         * @returns The minimum element within the wrapped collection or
         * Infinity if the wrapped collection is empty.
         **/
        min(iteratee?: Iteratee<V, any>, context?: any): T | number;

        /**
        * Wrapped type `any[]`.
        * @see _.sortBy
        **/
        sortBy(iterator?: _.ListIterator<T, any>, context?: any): T[];

        /**
        * Wrapped type `any[]`.
        * @see _.sortBy
        **/
        sortBy(iterator: string, context?: any): T[];

        /**
         * Splits a collection into sets, grouped by the result of running each value through iteratee.
         * @param iteratee An iteratee that provides the value to group by for each item in the collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns A dictionary with the group names as properties where each property contains the grouped elements from the collection.
         **/
        groupBy(iteratee: Iteratee<V, any>, context?: any): Dictionary<T[]>;

        /**
        * Wrapped type `any[]`.
        * @see _.indexBy
        **/
        indexBy(iterator: _.ListIterator<T, any>, context?: any): _.Dictionary<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.indexBy
        **/
        indexBy(iterator: string, context?: any): _.Dictionary<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.countBy
        **/
        countBy(iterator?: _.ListIterator<T, any>, context?: any): _.Dictionary<number>;

        /**
        * Wrapped type `any[]`.
        * @see _.countBy
        **/
        countBy(iterator: string, context?: any): _.Dictionary<number>;

        /**
         * Returns a shuffled copy of the wrapped collection, using a version of the Fisher-Yates shuffle.
         * @return A shuffled copy of the wrapped collection.
         **/
        shuffle(): T[];

        /**
         * Produce a random sample from the wrapped collection. Pass a number to return `n` random elements from the
         * wrapped collection. Otherwise a single random item will be returned.
         * @param n The number of elements to sample from the wrapped collection.
         * @return A random sample of `n` elements from the wrapped collection or a single element if `n` is not specified.
         **/
        sample(n: number): T[];
        sample(): T | undefined;

        /**
         * Creates a real Array from the wrapped collection (anything that can
         * be iterated over). Useful for transmuting the arguments object.
         * @returns An array containing the elements of the wrapped collection.
         **/
        toArray(): T[];

        /**
         * Determines the number of values in the wrapped collection.
         * @returns The number of values in the wrapped collection.
         **/
        size(): number;

        /**
         * Splits the wrapped collection into two arrays: one whose elements
         * all satisfy `iteratee` and one whose elements all do not satisfy
         * `iteratee`.
         * @param iteratee The iteratee that defines the partitioning scheme
         * for each element in the wrapped collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns An array composed of two elements, where the first element
         * contains the elements in the wrapped collection that satisfied the
         * predicate and the second element contains the elements that did not.
         **/
        partition(iteratee?: Iteratee<V, boolean>, context?: any): [T[], T[]];

        /*********
        * Arrays *
        **********/

        /**
         * Returns the first element of the wrapped list. Passing `n` will
         * return the first `n` elements of the wrapped list.
         * @param n The number of elements to retrieve, optional.
         * @returns The first `n` elements of the wrapped list or the first
         * element if `n` is omitted.
         **/
        first(): T | undefined;
        first(n: number): T[];

        /**
         * @see first
         **/
        head: Underscore<T, V>['first'];

        /**
         * @see first
        **/
         take: Underscore<T, V>['first'];

        /**
         * Returns everything but the last entry of the wrapped list.
         * Especially useful on the arguments object. Pass `n` to exclude the
         * last `n` elements from the result.
         * @param n The number of elements from the end of the wrapped list to
         * omit, optional, default = 1.
         * @returns The elements of the wrapped list with the last `n` items
         * omitted.
         **/
        initial(n?: number): T[];

        /**
         * Returns the last element of the wrapped list. Passing `n` will
         * return the last `n` elements of the wrapped list.
         * @param n The number of elements to retrieve, optional.
         * @returns The last `n` elements of the wrapped list or the last
         * element if `n` is omitted.
         **/
        last(): T | undefined;
        last(n: number): T[];

        /**
         * Returns the rest of the elements in the wrapped list. Pass an
         * `index` to return the values of the list from that index onward.
         * @param index The index to start retrieving elements from, optional,
         * default = 1.
         * @returns The elements of the wrapped list from `index` to the end
         * of the list.
         **/
        rest(n?: number): T[];

        /**
         * @see rest
         **/
        tail: Underscore<T, V>['rest'];

        /**
         * @see rest
         **/
        drop: Underscore<T, V>['rest'];

        /**
         * Returns a copy of the wrapped list with all falsy values removed. In
         * JavaScript, false, null, 0, "", undefined and NaN are all falsy.
         * @returns An array containing the elements of the wrapped list without
         * falsy values.
         **/
        compact(): Truthy<T>[];

        /**
         * Flattens the wrapped nested list (the nesting can be to any depth). If you pass shallow, the list will
         * only be flattened a single level.
         * @param shallow If true then only flatten one level, optional, default = false.
         * @returns The flattened list.
         **/
        flatten(shallow?: false): DeepestListItemOrSelf<T>[];
        flatten(shallow: true): ListItemOrSelf<T>[];

        /**
         * Returns a copy of the wrapped list with all instances of `values`
         * removed.
         * @param values The values to exclude from the wrapped list.
         * @return An array that contains all elements of the wrapped list
         * except for `values`.
         **/
        without(...values: T[]): T[];

        /**
        * Wrapped type `any[][]`.
        * @see _.union
        **/
        union(...arrays: _.List<T>[]): T[];

        /**
        * Wrapped type `any[][]`.
        * @see _.intersection
        **/
        intersection(...arrays: _.List<T>[]): T[];

        /**
        * Wrapped type `any[]`.
        * @see _.difference
        **/
        difference(...others: _.List<T>[]): T[];

        /**
         * Produces a duplicate-free version of the wrapped list, using === to
         * test object equality. If you know in advance that the wrapped list
         * is sorted, passing true for isSorted will run a much faster
         * algorithm. If you want to compute unique items based on a
         * transformation, pass an iteratee function.
         * @param isSorted True if the wrapped list is already sorted,
         * optional, default = false.
         * @param iteratee Transform the elements of the wrapped list before
         * comparisons for uniqueness.
         * @param context 'this' object in `iteratee`, optional.
         * @return An array containing only the unique elements in the wrapped
         * list.
         **/
        uniq(isSorted?: boolean, iteratee?: Iteratee<V, any>, cotext?: any): T[];
        uniq(iteratee?: Iteratee<V, any>, context?: any): T[];

        /**
        * @see uniq
        **/
        unique: Underscore<T, V>['uniq'];

        /**
        * Wrapped type `any[][]`.
        * @see _.zip
        **/
        zip(...arrays: any[][]): any[][];

        /**
        * Wrapped type `any[][]`.
        * @see _.unzip
        **/
        unzip(...arrays: any[][]): any[][];

        /**
        * Wrapped type `any[][]`.
        * @see _.object
        **/
        object(...keyValuePairs: any[][]): any;

        /**
        * @see _.object
        **/
        object(values?: any): any;

        /**
        * Wrapped type `any[]`.
        * @see _.indexOf
        **/
        indexOf(value: T, isSorted?: boolean): number;

        /**
        * @see _.indexOf
        **/
        indexOf(value: T, startFrom: number): number;

        /**
        * Wrapped type `any[]`.
        * @see _.lastIndexOf
        **/
        lastIndexOf(value: T, from?: number): number;

        /**
        * @see _.findIndex
        **/
        findIndex(predicate: _.ListIterator<T, boolean> | {}, context?: any): number;

        /**
        * @see _.findLastIndex
        **/
        findLastIndex(predicate: _.ListIterator<T, boolean> | {}, context?: any): number;

        /**
         * Uses a binary search to determine the lowest index at which the
         * value should be inserted into the wrapped list in order to maintain
         * the wrapped list's sorted order. If an iteratee is provided, it will
         * be used to compute the sort ranking of each value, including the
         * value you pass.
         * @param value The value to determine an insert index for to mainain
         * the sorting in the wrapped list.
         * @param iteratee Iteratee to compute the sort ranking of each
         * element including `value`, optional.
         * @param context `this` object in `iteratee`, optional.
         * @return The index where `value` should be inserted into the wrapped
         * list.
         **/
        sortedIndex(value: T, iteratee?: Iteratee<V, any>, context?: any): number;

        /**
         * A function to create flexibly-numbered lists of integers, handy for
         * `each` and `map` loops. Returns a list of integers from
         * the wrapped value (inclusive) to `stop` (exclusive), incremented
         * (or decremented) by `step`. Note that ranges that `stop` before they
         * `start` are considered to be zero-length instead of negative - if
         * you'd like a negative range, use a negative `step`.
         *
         * If `stop` is not specified, the wrapped value will be the number to
         * stop at and the default start of 0 will be used.
         * @param stop The number to stop at.
         * @param step The number to count up by each iteration, optional,
         * default = 1.
         * @returns An array of numbers from start to `stop` with increments
         * of `step`.
         **/
        range(stop?: number, step?: number): number[];

        /**
         * Chunks a wrapped list into multiple arrays, each containing length or fewer items.
         * @param length The maximum size of the inner arrays.
         * @returns The chunked list.
         **/
        chunk(length: number): T[][];

        /* ***********
        * Functions *
        ************ */

        /**
        * Wrapped type `Function`.
        * @see _.bind
        **/
        bind(object: any, ...args: any[]): Function;

        /**
        * Wrapped type `object`.
        * @see _.bindAll
        **/
        bindAll(...methodNames: string[]): any;

        /**
        * Wrapped type `Function`.
        * @see _.partial
        **/
        partial(...args: any[]): Function;

        /**
        * Wrapped type `Function`.
        * @see _.memoize
        **/
        memoize(hashFn?: (n: any) => string): Function;

        /**
        * Wrapped type `Function`.
        * @see _.defer
        **/
        defer(...args: any[]): void;

        /**
        * Wrapped type `Function`.
        * @see _.delay
        **/
        delay(wait: number, ...args: any[]): any;

        /**
        * @see _.delay
        **/
        delay(...args: any[]): any;

        /**
        * Wrapped type `Function`.
        * @see _.throttle
        **/
        throttle(wait: number, options?: _.ThrottleSettings): Function & _.Cancelable;

        /**
        * Wrapped type `Function`.
        * @see _.debounce
        **/
        debounce(wait: number, immediate?: boolean): Function & _.Cancelable;

        /**
        * Wrapped type `Function`.
        * @see _.once
        **/
        once(): Function;

        /**
        * Wrapped type `Function`.
        * @see _.once
        **/
        restArgs(starIndex?: number): Function;

        /**
        * Wrapped type `number`.
        * @see _.after
        **/
        after(fn: Function): Function;

        /**
        * Wrapped type `number`.
        * @see _.before
        **/
        before(fn: Function): Function;

        /**
        * Wrapped type `Function`.
        * @see _.wrap
        **/
        wrap(wrapper: Function): () => Function;

        /**
        * Wrapped type `Function`.
        * @see _.negate
        **/
        negate(): (...args: any[]) => boolean;

        /**
        * Wrapped type `Function[]`.
        * @see _.compose
        **/
        compose(...functions: Function[]): Function;

        /********* *
         * Objects *
        ********** */

        /**
        * Wrapped type `object`.
        * @see _.keys
        **/
        keys(): string[];

        /**
        * Wrapped type `object`.
        * @see _.allKeys
        **/
        allKeys(): string[];

        /**
        * Wrapped type `object`.
        * @see _.values
        **/
        values(): T[];

        /**
        * Wrapped type `object`.
        * @see _.pairs
        **/
        pairs(): [string, any][];

        /**
        * Wrapped type `object`.
        * @see _.invert
        **/
        invert(): any;

        /**
        * Wrapped type `object`.
        * @see _.functions
        **/
        functions(): string[];

        /**
        * @see _.functions
        **/
        methods(): string[];

        /**
        * Wrapped type `object`.
        * @see _.extend
        **/
        extend(...sources: any[]): any;

        /**
        * Wrapped type `object`.
        * @see _.extend
        **/
        findKey(predicate: _.ObjectIterator<any, boolean>, context?: any): any

        /**
        * Wrapped type `object`.
        * @see _.pick
        **/
        pick<K extends keyof V>(...keys: K[]): Pick<V, K>;
        pick<K extends keyof V>(keys: K[]): Pick<V, K>;
        pick<K extends keyof V>(predicate: ObjectIterator<V[K], boolean>): Pick<V, K>;

        /**
        * Wrapped type `object`.
        * @see _.omit
        **/
        omit(...keys: string[]): any;
        omit(keys: string[]): any;
        omit(fn: Function): any;

        /**
        * Wrapped type `object`.
        * @see _.defaults
        **/
        defaults(...defaults: any[]): any;

        /**
        * Wrapped type `any`.
        * @see _.create
        **/
        create(props?: object): any;

        /**
        * Wrapped type `any[]`.
        * @see _.clone
        **/
        clone(): T;

        /**
        * Wrapped type `object`.
        * @see _.tap
        **/
        tap(interceptor: (...as: any[]) => any): any;

        /**
        * Wrapped type `object`.
        * @see _.has
        **/
        has(key: string): boolean;

        /**
        * Wrapped type `any[]`.
        * @see _.matches
        **/
        matches(): _.ListIterator<T, boolean>;

        /**
         * Wrapped type `any[]`.
         * @see _.matcher
         **/
        matcher(): _.ListIterator<T, boolean>;

        /**
        * Wrapped type `string`.
        * @see _.property
        **/
        property(): (object: object) => any;

        /**
        * Wrapped type `object`.
        * @see _.propertyOf
        **/
        propertyOf(): (key: string) => any;

        /**
         * Performs an optimized deep comparison between the wrapped object
         * and `other` to determine if they should be considered equal.
         * @param other Compare to the wrapped object.
         * @returns True if the wrapped object should be considered equal to `other`.
         **/
        isEqual(other: any): boolean;

        /**
         * Returns true if the wrapped collection contains no values.
         * For strings and array-like objects checks if the length property is 0.
         * @returns True if the wrapped collection has no elements.
         **/
        isEmpty(): boolean;

        /**
         * Returns true if the keys and values in `properties` are contained in the wrapped object.
         * @param properties The properties to check for in the wrapped object.
         * @returns True if all keys and values in `properties` are also in the wrapped object.
         **/
        isMatch(properties: any): boolean;

        /**
         * Returns true if the wrapped object is a DOM element.
         * @returns True if the wrapped object is a DOM element, otherwise false.
         **/
        isElement(): boolean;

        /**
         * Returns true if the wrapped object is an Array.
         * @returns True if the wrapped object is an Array, otherwise false.
         **/
        isArray(): boolean;

        /**
         * Returns true if the wrapped object is a Symbol.
         * @returns True if the wrapped object is a Symbol, otherwise false.
         **/
        isSymbol(): boolean;

        /**
         * Returns true if the wrapped object is an Object. Note that JavaScript arrays
         * and functions are objects, while (normal) strings and numbers are not.
         * @returns True if the wrapped object is an Object, otherwise false.
         **/
        isObject(): boolean;

        /**
         * Returns true if the wrapped object is an Arguments object.
         * @returns True if the wrapped object is an Arguments object, otherwise false.
         **/
        isArguments(): boolean;

        /**
         * Returns true if the wrapped object is a Function.
         * @returns True if the wrapped object is a Function, otherwise false.
         **/
        isFunction(): boolean;

        /**
         * Returns true if the wrapped object is a Error.
         * @returns True if the wrapped object is a Error, otherwise false.
         **/
        isError(): boolean;

        /**
         * Returns true if the wrapped object is a String.
         * @returns True if the wrapped object is a String, otherwise false.
         **/
        isString(): boolean;

        /**
         * Returns true if the wrapped object is a Number (including NaN).
         * @returns True if the wrapped object is a Number, otherwise false.
         **/
        isNumber(): boolean;

        /**
         * Returns true if the wrapped object is a finite Number.
         * @returns True if the wrapped object is a finite Number.
         **/
        isFinite(): boolean;

        /**
         * Returns true if the wrapped object is a Boolean.
         * @returns True if the wrapped object is a Boolean, otherwise false.
         **/
        isBoolean(): boolean;

        /**
         * Returns true if the wrapped object is a Date.
         * @returns True if the wrapped object is a Date, otherwise false.
         **/
        isDate(): boolean;

        /**
         * Returns true if the wrapped object is a RegExp.
         * @returns True if the wrapped object is a RegExp, otherwise false.
         **/
        isRegExp(): boolean;

        /**
         * Returns true if the wrapped object is NaN.
         * Note: this is not the same as the native isNaN function,
         * which will also return true if the variable is undefined.
         * @returns True if the wrapped object is NaN, otherwise false.
         **/
        isNaN(): boolean;

        /**
         * Returns true if the wrapped object is null.
         * @returns True if the wrapped object is null, otherwise false.
         **/
        isNull(): boolean;

        /**
         * Returns true if the wrapped object is undefined.
         * @returns True if the wrapped object is undefined, otherwise false.
         **/
        isUndefined(): boolean;

        /********* *
         * Utility *
        ********** */

        /**
        * Wrapped type `any`.
        * @see _.identity
        **/
        identity(): any;

        /**
        * Wrapped type `any`.
        * @see _.constant
        **/
        constant(): () => T;

        /**
        * Wrapped type `any`.
        * @see _.noop
        **/
        noop(): void;

        /**
        * Wrapped type `number`.
        * @see _.times
        **/
        times<TResult>(iterator: (n: number) => TResult, context?: any): TResult[];

        /**
        * Wrapped type `number`.
        * @see _.random
        **/
        random(): number;
        /**
        * Wrapped type `number`.
        * @see _.random
        **/
        random(max: number): number;

        /**
        * Wrapped type `object`.
        * @see _.mixin
        **/
        mixin(): void;

        /**
        * Wrapped type `string|Function|Object`.
        * @see _.iteratee
        **/
        iteratee(context?: any): Function;

        /**
        * Wrapped type `string`.
        * @see _.uniqueId
        **/
        uniqueId(): string;

        /**
        * Wrapped type `string`.
        * @see _.escape
        **/
        escape(): string;

        /**
        * Wrapped type `string`.
        * @see _.unescape
        **/
        unescape(): string;

        /**
        * Wrapped type `object`.
        * @see _.result
        **/
        result(property: string, defaultValue?: any): any;

        /**
        * Wrapped type `string`.
        * @see _.template
        **/
        template(settings?: _.TemplateSettings): CompiledTemplate;

        /********** *
         * Chaining *
        *********** */

        /**
         * Returns a wrapped object. Calling methods on this object will continue to return wrapped objects
         * until value() is used.
         * @returns An underscore chain wrapper around the wrapped value.
         **/
        chain(): _Chain<T, V>;

        /**
         * Extracts the value of the wrapped object.
         * @returns The value of the wrapped object.
         **/
        value(): V;
    }

    interface _Chain<T, V = T> {

        /* *************
        * Collections *
        ************* */

        /**
         * Iterates over the wrapped collection of elements, yielding each in
         * turn to an iteratee. The iteratee is bound to the context object, if
         * one is passed. Each invocation of `iteratee` is called with three
         * arguments: (element, key, collection).
         * @param iteratee The iteratee to call for each element in the wrapped
         * collection.
         * @param context 'this' object in `iteratee`, optional.
         * @returns A chain wrapper around the originally wrapped collection.
         **/
        each(iteratee: CollectionIterator<TypeOfCollection<V>, void, V>, context?: any): _Chain<T, V>;

        /**
        * @see each
        **/
        forEach: _Chain<T, V>['each'];

        /**
         * Produces a new array of values by mapping each value in the wrapped collection through a transformation function
         * (iteratee). For function iteratees, each invocation of iteratee is called with three arguments:
         * (value, key, collection).
         * @param iterator Map iteratee for each element in the collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns The mapped result in a chain wrapper.
         **/
        map<I extends _ChainIteratee<V, any, T>>(
            iteratee: I,
            context?: any
        ): _Chain<IterateeResult<I, T>, IterateeResult<I, T>[]>;

        /**
         * @see map
         **/
        collect: _Chain<T, V>['map'];

        /**
         * Also known as inject and foldl, reduce boils down a collection of wrapped values into a
         * single value. Memo is the initial state of the reduction, and each successive
         * step of it should be returned by iteratee. The iteratee is passed four arguments:
         * the memo, then the value and index (or key) of the iteration, and finally a reference
         * to the entire collection.
         *
         * If no memo is passed to the initial invocation of reduce, the iteratee is not invoked
         * on the first element of the collection. The first element is instead passed as the memo
         * in the invocation of the iteratee on the next element in the collection.
         * @param iteratee Reduce iteratee function for each element in `list`.
         * @param memo Initial reduce state or undefined to use the first collection item as initial state.
         * @param context `this` object in `iteratee`, optional.
         * @returns The reduced result in a chain wraper.
         **/
        reduce<TResult>(
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult, V>,
            memo: TResult,
            context?: any
        ): _ChainSingle<TResult>;
        reduce<TResult = TypeOfCollection<V>>(
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult | TypeOfCollection<V>, V>
        ): _ChainSingle<TResult | TypeOfCollection<V> | undefined>;

        /**
         * @see reduce
         **/
        inject: _Chain<T, V>['reduce'];

        /**
         * @see reduce
         **/
        foldl: _Chain<T, V>['reduce'];

        /**
         * The right-associative version of reduce.
         *
         * This is not as useful in JavaScript as it would be in a language with lazy evaluation.
         * @param iteratee Reduce iteratee function for each element in the wrapped collection.
         * @param memo Initial reduce state or undefined to use the first collection item as initial state.
         * @param context `this` object in `iteratee`, optional.
         * @returns The reduced result in a chain wrapper.
         **/
        reduceRight<TResult>(
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult, V>,
            memo: TResult,
            context?: any
        ): _ChainSingle<TResult>;
        reduceRight<TResult = TypeOfCollection<V>>(
            iteratee: MemoCollectionIterator<TypeOfCollection<V>, TResult | TypeOfCollection<V>, V>
        ): _ChainSingle<TResult | TypeOfCollection<V> | undefined>;

        /**
         * @see reduceRight
         **/
        foldr: _Chain<T, V>['reduceRight'];

        /**
         * Looks through each value in the wrapped collection, returning the first one that passes a
         * truth test (iteratee), or undefined if no value passes the test. The function
         * returns as soon as it finds an acceptable element, and doesn't traverse the entire
         * collection.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @return A chain wrapper containing the first element in the wrapped collection that passes
         * the truth test or undefined if no elements pass.
         **/
        find(iteratee?: _ChainIteratee<V, boolean, T>, context?: any): _ChainSingle<T | undefined>;

        /**
         * @see find
         **/
        detect: _Chain<T, V>['find'];

        /**
         * Looks through each value in the wrapped collection, returning an array of all the values that pass a truth
         * test (iteratee).
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns The set of values that pass a truth test in a chain wrapper.
         **/
        filter(iteratee?: _ChainIteratee<V, any, T>, context?: any): _Chain<T, T[]>;

        /**
         * @see filter
         **/
        select: _Chain<T, V>['filter'];

        /**
         * Looks through each value in the wrapped collection, returning an array of all the values that matches the
         * key-value pairs listed in `properties`.
         * @param properties The properties to check for on the elements within the wrapped collection.
         * @return The elements in the wrapped collection that match `properties` in a chain wrapper.
         **/
        where(properties: Partial<T>): _Chain<T, T[]>;

        /**
         * Looks through the wrapped collection and returns the first value that matches all of the key-value
         * pairs listed in `properties`.
         * If no match is found, or if list is empty, undefined will be returned.
         * @param properties The properties to check for on the elements within the wrapped collection.
         * @return The first element in the wrapped collection that matches `properties` or undefined if
         * no match is found. The result will be wrapped in a chain wrapper.
         **/
        findWhere(properties: Partial<T>): _ChainSingle<T | undefined>;

        /**
         * Returns the values in the wrapped collection without the elements that pass a truth test (iteratee).
         * The opposite of filter.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @return The set of values that fail the truth test in a chain wrapper.
         **/
        reject(iteratee?: _ChainIteratee<V, boolean, T>, context?: any): _Chain<T, T[]>;

        /**
         * Returns true if all of the values in the wrapped collection pass the
         * `iteratee` truth test. Short-circuits and stops traversing the
         * wrapped collection if a false element is found.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns A chain wrapper around true if all elements pass the truth
         * test, otherwise around false.
         **/
        every(iterator?: _ChainIteratee<V, boolean, T>, context?: any): _ChainSingle<boolean>;

        /**
         * @see every
         **/
        all: _Chain<T, V>['every'];

        /**
         * Returns true if any of the values in the wrapped collection pass the
         * `iteratee` truth test. Short-circuits and stops traversing the
         * wrapped collection if a true element is found.
         * @param iteratee The truth test to apply.
         * @param context `this` object in `iteratee`, optional.
         * @returns A chain wrapper around true if any element passed the truth
         * test, otherwise around false.
         **/
        some(iterator?: _ChainIteratee<V, boolean, T>, context?: any): _ChainSingle<boolean>;

        /**
         * @see some
         **/
        any: _Chain<T, V>['some'];

        /**
         * Returns true if the value is present in the wrapped collection. Uses
         * indexOf internally, if the wrapped collection is a List. Use
         * `fromIndex` to start your search at a given index.
         * @param value The value to check the wrapped collection for.
         * @param fromIndex The index to start searching from, optional,
         * default = 0, only used when the wrapped collection is a List.
         * @returns A chain wrapper around true if `value` is present in the
         * wrapped collection after `fromIndex`, otherwise around false.
         **/
        contains(value: any, fromIndex?: number): _ChainSingle<boolean>;

        /**
         * @see contains
         **/
        include: _Chain<T, V>['contains'];

        /**
         * @see contains
         **/
        includes: _Chain<T, V>['contains'];

        /**
        * Wrapped type `any[]`.
        * @see _.invoke
        **/
        invoke(methodName: string, ...args: any[]): _Chain<T>;

        /**
         * A convenient version of what is perhaps the most common use-case for map: extracting a list of
         * property values.
         * @param propertyName The name of a specific property to retrieve from all items.
         * @returns The set of values for the specified property for each item in the collection in a chain wrapper.
         **/
        pluck<K extends EnumerableKey>(
            propertyName: K
        ): _Chain<PropertyTypeOrAny<T, K>, PropertyTypeOrAny<T, K>[]>;

        /**
         * Returns the maximum value in the wrapped collection. If an
         * `iteratee` is provided, it will be used on each element to generate
         * the criterion by which the element is ranked. -Infinity is returned
         * if list is empty. Non-numerical values returned by `iteratee` will
         * be ignored.
         * @param iteratee The iteratee that provides the criterion by which
         * each element is ranked, optional if evaluating a collection of
         * numbers.
         * @param context `this` object in `iteratee`, optional.
         * @returns A chain wrapper around the maximum element within the
         * wrapped collection or around -Infinity if the wrapped collection is
         * empty.
         **/
        max(iteratee?: _ChainIteratee<V, any, T>, context?: any): _ChainSingle<T | number>;

        /**
         * Returns the minimum value in the wrapped collection. If an
         * `iteratee` is provided, it will be used on each element to generate
         * the criterion by which the element is ranked. Infinity is returned
         * if list is empty. Non-numerical values returned by `iteratee` will
         * be ignored.
         * @param iteratee The iteratee that provides the criterion by which
         * each element is ranked, optional if evaluating a collection of
         * numbers.
         * @param context `this` object in `iteratee`, optional.
         * @returns A chain wrapper around the minimum element within the
         * wrapped collection or around Infinity if the wrapped collection is
         * empty.
         **/
        min(iteratee?: _ChainIteratee<V, any, T>, context?: any): _ChainSingle<T | number>;

        /**
        * Wrapped type `any[]`.
        * @see _.sortBy
        **/
        sortBy(iterator?: _.ListIterator<T, any>, context?: any): _Chain<T, T[]>;

        /**
        * Wrapped type `any[]`.
        * @see _.sortBy
        **/
        sortBy(iterator: string, context?: any): _Chain<T, T[]>;

        /**
         * Splits a collection into sets, grouped by the result of running each value through iteratee.
         * @param iteratee An iteratee that provides the value to group by for each item in the collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns A dictionary with the group names as properties where each property contains the grouped elements from the collection
         * in a chain wrapper.
         **/
        groupBy(iterator: _ChainIteratee<V, any, T>, context?: any): _Chain<T[], Dictionary<T[]>>;

        /**
        * Wrapped type `any[]`.
        * @see _.indexBy
        **/
        indexBy(iterator: _.ListIterator<T, any>, context?: any): _Chain<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.indexBy
        **/
        indexBy(iterator: string, context?: any): _Chain<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.countBy
        **/
        countBy(iterator?: _.ListIterator<T, any>, context?: any): _Chain<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.countBy
        **/
        countBy(iterator: string, context?: any): _Chain<T>;

        /**
         * Returns a shuffled copy of the wrapped collection, using a version of the Fisher-Yates shuffle.
         * @return A shuffled copy of the wrapped collection in a chain wrapper.
         **/
        shuffle(): _Chain<T, T[]>;

        /**
         * Produce a random sample from the wrapped collection. Pass a number to return `n` random elements from the
         * wrapped collection. Otherwise a single random item will be returned.
         * @param n The number of elements to sample from the wrapped collection.
         * @return A random sample of `n` elements from the wrapped collection or a single element if `n` is not specified.
         * The result will be wrapped in a chain wrapper.
         **/
        sample(n: number): _Chain<T, T[]>;
        sample(): _ChainSingle<T | undefined>;

        /**
         * Creates a real Array from the wrapped collection (anything that can
         * be iterated over). Useful for transmuting the arguments object.
         * @returns A chain wrapper around an array containing the elements
         * of the wrapped collection.
         **/
        toArray(): _Chain<T, T[]>;

        /**
         * Determines the number of values in the wrapped collection.
         * @returns A chain wrapper around the number of values in the wrapped
         * collection.
         **/
        size(): _ChainSingle<number>;

        /**
         * Splits the wrapped collection into two arrays: one whose elements
         * all satisfy `iteratee` and one whose elements all do not satisfy
         * `iteratee`.
         * @param iteratee The iteratee that defines the partitioning scheme
         * for each element in the wrapped collection.
         * @param context `this` object in `iteratee`, optional.
         * @returns A chain wrapper around an array composed of two elements,
         * where the first element contains the elements in the wrapped
         * collection that satisfied the predicate and the second element
         * contains the elements that did not.
         **/
        partition(iteratee?: _ChainIteratee<V, boolean, T>, context?: any): _Chain<T[], [T[], T[]]>;

        /*********
        * Arrays *
        **********/

        /**
         * Returns the first element of the wrapped list. Passing `n` will
         * return the first `n` elements of the wrapped list.
         * @param n The number of elements to retrieve, optional.
         * @returns A chain wrapper around the first `n` elements of the
         * wrapped list or around the first element if `n` is omitted.
         **/
        first(): _ChainSingle<T | undefined>;
        first(n: number): _Chain<T, T[]>;

        /**
         * @see first
         **/
        head: _Chain<T, V>['first'];

        /**
         * @see first
         **/
        take: _Chain<T, V>['first'];

        /**
         * Returns everything but the last entry of the wrapped list.
         * Especially useful on the arguments object. Pass `n` to exclude the
         * last `n` elements from the result.
         * @param n The number of elements from the end of the wrapped list to
         * omit, optional, default = 1.
         * @returns A chain wrapper around the elements of the wrapped list
         * with the last `n` items omitted.
         **/
        initial(n?: number): _Chain<T, T[]>;

        /**
         * Returns the last element of the wrapped list. Passing `n` will
         * return the last `n` elements of the wrapped list.
         * @param n The number of elements to retrieve, optional.
         * @returns A chain wrapper around the last `n` elements of the wrapped
         * list or around the last element if `n` is omitted.
         **/
        last(): _ChainSingle<T | undefined>;
        last(n: number): _Chain<T, T[]>;

        /**
         * Returns the rest of the elements in the wrapped list. Pass an
         * `index` to return the values of the list from that index onward.
         * @param index The index to start retrieving elements from, optional,
         * default = 1.
         * @returns A chain wrapper around the elements of the wrapped list
         * from `index` to the end of the list.
         **/
        rest(n?: number): _Chain<T, T[]>;

        /**
         * @see rest
         **/
        tail: _Chain<T, V>['rest'];

        /**
         * @see rest
         **/
        drop: _Chain<T, V>['rest'];

        /**
         * Returns a copy of the wrapped list with all falsy values removed. In
         * JavaScript, false, null, 0, "", undefined and NaN are all falsy.
         * @returns A chain wrapper around an array containing the elements of
         * the wrapped list without falsy values.
         **/
        compact(): _Chain<Truthy<T>, Truthy<T>[]>;

        /**
         * Flattens the wrapped nested list (the nesting can be to any depth). If you pass shallow, the list will
         * only be flattened a single level.
         * @param shallow If true then only flatten one level, optional, default = false.
         * @returns The flattened list in a chain wrapper.
         **/
        flatten(shallow?: false): _Chain<DeepestListItemOrSelf<T>, DeepestListItemOrSelf<T>[]>;
        flatten(shallow: true): _Chain<ListItemOrSelf<T>, ListItemOrSelf<T>[]>;

        /**
         * Returns a copy of the wrapped list with all instances of `values`
         * removed.
         * @param values The values to exclude from the wrapped list.
         * @return A chain wrapper around an array that contains all elements
         * of the wrapped list except for `values`.
         **/
        without(...values: T[]): _Chain<T, T[]>;

        /**
        * Wrapped type `any[][]`.
        * @see _.union
        **/
        union(...arrays: _.List<T>[]): _Chain<T, T[]>;

        /**
        * Wrapped type `any[][]`.
        * @see _.intersection
        **/
        intersection(...arrays: _.List<T>[]): _Chain<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.difference
        **/
        difference(...others: _.List<T>[]): _Chain<T>;

        /**
         * Produces a duplicate-free version of the wrapped list, using === to
         * test object equality. If you know in advance that the wrapped list
         * is sorted, passing true for isSorted will run a much faster
         * algorithm. If you want to compute unique items based on a
         * transformation, pass an iteratee function.
         * @param isSorted True if the wrapped list is already sorted,
         * optional, default = false.
         * @param iteratee Transform the elements of the wrapped list before
         * comparisons for uniqueness.
         * @param context 'this' object in `iteratee`, optional.
         * @return A chain wrapper around an array containing only the unique
         * elements in the wrapped list.
         **/
        uniq(isSorted?: boolean, iteratee?: _ChainIteratee<V, any, T>, context?: any): _Chain<T, T[]>;
        uniq(iteratee?: _ChainIteratee<V, any, T>, context?: any): _Chain<T, T[]>;

        /**
        * Wrapped type List<T>.
        * @see uniq
        **/
        unique: _Chain<T, V>['uniq'];

        /**
        * Wrapped type `any[][]`.
        * @see _.zip
        **/
        zip(...arrays: any[][]): _Chain<T>;

        /**
        * Wrapped type `any[][]`.
        * @see _.unzip
        **/
        unzip(...arrays: any[][]): _Chain<T>;

        /**
        * Wrapped type `any[][]`.
        * @see _.object
        **/
        object(...keyValuePairs: any[][]): _Chain<T>;

        /**
        * @see _.object
        **/
        object(values?: any): _Chain<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.indexOf
        **/
        indexOf(value: T, isSorted?: boolean): _ChainSingle<number>;

        /**
        * @see _.indexOf
        **/
        indexOf(value: T, startFrom: number): _ChainSingle<number>;

        /**
        * Wrapped type `any[]`.
        * @see _.lastIndexOf
        **/
        lastIndexOf(value: T, from?: number): _ChainSingle<number>;

        /**
        * @see _.findIndex
        **/
        findIndex(predicate: _.ListIterator<T, boolean> | {}, context?: any): _ChainSingle<number>;

        /**
        * @see _.findLastIndex
        **/
        findLastIndex(predicate: _.ListIterator<T, boolean> | {}, context?: any): _ChainSingle<number>;

        /**
         * Uses a binary search to determine the lowest index at which the
         * value should be inserted into the wrapped list in order to maintain
         * the wrapped list's sorted order. If an iteratee is provided, it
         * will be used to compute the sort ranking of each value, including
         * the value you pass.
         * @param value The value to determine an insert index for to mainain
         * the sorting in the wrapped list.
         * @param iteratee Iteratee to compute the sort ranking of each element
         * including `value`, optional.
         * @param context `this` object in `iteratee`, optional.
         * @return A chain wrapper around the index where `value` should be
         * inserted into the wrapped list.
         **/
        sortedIndex(value: T, iteratee?: _ChainIteratee<V, any, T>, context?: any): _ChainSingle<number>;

        /**
         * A function to create flexibly-numbered lists of integers, handy for
         * `each` and `map` loops. Returns a list of integers from
         * the wrapped value (inclusive) to `stop` (exclusive), incremented
         * (or decremented) by `step`. Note that ranges that `stop` before they
         * `start` are considered to be zero-length instead of negative - if
         * you'd like a negative range, use a negative `step`.
         *
         * If `stop` is not specified, the wrapped value will be the number to
         * stop at and the default start of 0 will be used.
         * @param stop The number to stop at.
         * @param step The number to count up by each iteration, optional,
         * default = 1.
         * @returns A chain wrapper around an array of numbers from start to
         * `stop` with increments of `step`.
         **/
        range(stop?: number, step?: number): _Chain<number, number[]>;

        /**
         * Chunks a wrapped list into multiple arrays, each containing length or fewer items.
         * @param length The maximum size of the inner arrays.
         * @returns The wrapped chunked list.
         **/
        chunk(length: number): _Chain<T[], T[][]>;

        /* ***********
        * Functions *
        ************ */

        /**
        * Wrapped type `Function`.
        * @see _.bind
        **/
        bind(object: any, ...args: any[]): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.bindAll
        **/
        bindAll(...methodNames: string[]): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.partial
        **/
        partial(...args: any[]): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.memoize
        **/
        memoize(hashFn?: (n: any) => string): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.defer
        **/
        defer(...args: any[]): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.delay
        **/
        delay(wait: number, ...args: any[]): _Chain<T>;

        /**
        * @see _.delay
        **/
        delay(...args: any[]): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.throttle
        **/
        throttle(wait: number, options?: _.ThrottleSettings): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.debounce
        **/
        debounce(wait: number, immediate?: boolean): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.once
        **/
        once(): _Chain<T>;

        /**
         * Wrapped type `Function`.
         * @see _.once
         **/
        restArgs(startIndex?: number): _Chain<T>;

        /**
        * Wrapped type `number`.
        * @see _.after
        **/
        after(func: Function): _Chain<T>;

        /**
        * Wrapped type `number`.
        * @see _.before
        **/
        before(fn: Function): _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.wrap
        **/
        wrap(wrapper: Function): () => _Chain<T>;

        /**
        * Wrapped type `Function`.
        * @see _.negate
        **/
        negate(): _Chain<T>;

        /**
        * Wrapped type `Function[]`.
        * @see _.compose
        **/
        compose(...functions: Function[]): _Chain<T>;

        /********* *
         * Objects *
        ********** */

        /**
        * Wrapped type `object`.
        * @see _.keys
        **/
        keys(): _Chain<string>;

        /**
        * Wrapped type `object`.
        * @see _.allKeys
        **/
        allKeys(): _Chain<string>;

        /**
        * Wrapped type `object`.
        * @see _.values
        **/
        values(): _Chain<any>;

        /**
        * Wrapped type `object`.
        * @see _.mapObject
        **/
        mapObject(fn: _.ListIterator<T, any>): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.pairs
        **/
        pairs(): _Chain<[string, any]>;

        /**
        * Wrapped type `object`.
        * @see _.invert
        **/
        invert(): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.functions
        **/
        functions(): _Chain<T>;

        /**
        * @see _.functions
        **/
        methods(): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.extend
        **/
        extend(...sources: any[]): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.extend
        **/
        findKey(predicate: _.ObjectIterator<any, boolean>, context?: any): _Chain<T>

        /**
        * Wrapped type `object`.
        * @see _.pick
        **/
        pick<K extends keyof V>(...keys: K[]): _Chain<TypeOfDictionary<Pick<V, K>>, Pick<V, K>>;
        pick<K extends keyof V>(keys: K[]): _Chain<TypeOfDictionary<Pick<V, K>>, Pick<V, K>>;
        pick<K extends keyof V>(predicate: ObjectIterator<V[K], boolean>): _Chain<TypeOfDictionary<Pick<V, K>>, Pick<V, K>>;

        /**
        * Wrapped type `object`.
        * @see _.omit
        **/
        omit(...keys: string[]): _Chain<T>;
        omit(keys: string[]): _Chain<T>;
        omit(iteratee: Function): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.defaults
        **/
        defaults(...defaults: any[]): _Chain<T>;

        /**
         * Wrapped type `any`.
         * @see _.create
         **/
        create(props?: object): _Chain<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.clone
        **/
        clone(): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.tap
        **/
        tap(interceptor: (...as: any[]) => any): _Chain<T, V>;

        /**
        * Wrapped type `object`.
        * @see _.has
        **/
        has(key: string): _Chain<T>;

        /**
        * Wrapped type `any[]`.
        * @see _.matches
        **/
        matches(): _Chain<T>;

        /**
         * Wrapped type `any[]`.
         * @see _.matcher
         **/
        matcher(): _Chain<T>;

        /**
        * Wrapped type `string`.
        * @see _.property
        **/
        property(): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.propertyOf
        **/
        propertyOf(): _Chain<T>;

        /**
         * Performs an optimized deep comparison between the wrapped object
         * and `other` to determine if they should be considered equal.
         * @param other Compare to the wrapped object.
         * @returns True if the wrapped object should be considered equal to `other`.
         * The result will be wrapped in a chain wrapper.
         **/
        isEqual(other: any): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped collection contains no values.
         * For strings and array-like objects checks if the length property is 0.
         * @returns True if the wrapped collection has no elements.
         * The result will be wrapped in a chain wrapper.
         **/
        isEmpty(): _ChainSingle<boolean>;

        /**
         * Returns true if the keys and values in `properties` are contained in the wrapped object.
         * @param properties The properties to check for in the wrapped object.
         * @returns True if all keys and values in `properties` are also in the wrapped object.
         * The result will be wrapped in a chain wrapper.
         **/
        isMatch(properties: any): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a DOM element.
         * @returns True if the wrapped object is a DOM element, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isElement(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is an Array.
         * @returns True if the wrapped object is an Array, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isArray(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a Symbol.
         * @returns True if the wrapped object is a Symbol, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isSymbol(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is an Object. Note that JavaScript arrays
         * and functions are objects, while (normal) strings and numbers are not.
         * @returns True if the wrapped object is an Object, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isObject(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is an Arguments object.
         * @returns True if the wrapped object is an Arguments object, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isArguments(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a Function.
         * @returns True if the wrapped object is a Function, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isFunction(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a Error.
         * @returns True if the wrapped object is a Error, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isError(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a String.
         * @returns True if the wrapped object is a String, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isString(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a Number (including NaN).
         * @returns True if the wrapped object is a Number, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isNumber(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a finite Number.
         * @returns True if the wrapped object is a finite Number.
         * The result will be wrapped in a chain wrapper.
         **/
        isFinite(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a Boolean.
         * @returns True if the wrapped object is a Boolean, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isBoolean(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a Date.
         * @returns True if the wrapped object is a Date, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isDate(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is a RegExp.
         * @returns True if the wrapped object is a RegExp, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isRegExp(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is NaN.
         * Note: this is not the same as the native isNaN function,
         * which will also return true if the variable is undefined.
         * @returns True if the wrapped object is NaN, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isNaN(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is null.
         * @returns True if the wrapped object is null, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isNull(): _ChainSingle<boolean>;

        /**
         * Returns true if the wrapped object is undefined.
         * @returns True if the wrapped object is undefined, otherwise false.
         * The result will be wrapped in a chain wrapper.
         **/
        isUndefined(): _ChainSingle<boolean>;

        /********* *
         * Utility *
        ********** */

        /**
        * Wrapped type `any`.
        * @see _.identity
        **/
        identity(): _Chain<T>;

        /**
        * Wrapped type `any`.
        * @see _.constant
        **/
        constant(): _Chain<T>;

        /**
        * Wrapped type `any`.
        * @see _.noop
        **/
        noop(): _Chain<T>;

        /**
        * Wrapped type `number`.
        * @see _.times
        **/
        times<TResult>(iterator: (n: number) => TResult, context?: any): _Chain<T>;

        /**
        * Wrapped type `number`.
        * @see _.random
        **/
        random(): _Chain<T>;
        /**
        * Wrapped type `number`.
        * @see _.random
        **/
        random(max: number): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.mixin
        **/
        mixin(): _Chain<T>;

        /**
        * Wrapped type `string|Function|Object`.
        * @see _.iteratee
        **/
        iteratee(context?: any): _Chain<T>;

        /**
        * Wrapped type `string`.
        * @see _.uniqueId
        **/
        uniqueId(): _Chain<T>;

        /**
        * Wrapped type `string`.
        * @see _.escape
        **/
        escape(): _Chain<T>;

        /**
        * Wrapped type `string`.
        * @see _.unescape
        **/
        unescape(): _Chain<T>;

        /**
        * Wrapped type `object`.
        * @see _.result
        **/
        result(property: string, defaultValue?: any): _Chain<T>;

        /**
        * Wrapped type `string`.
        * @see _.template
        **/
        template(settings?: _.TemplateSettings): _Chain<CompiledTemplate>;

        /************* *
        * Array proxy *
        ************** */

        /**
        * Returns a new array comprised of the array on which it is called
        * joined with the array(s) and/or value(s) provided as arguments.
        * @param arr Arrays and/or values to concatenate into a new array. See the discussion below for details.
        * @return A new array comprised of the array on which it is called
        **/
        concat(...arr: Array<T[]>): _Chain<T>;

        /**
        * Join all elements of an array into a string.
        * @param separator Optional. Specifies a string to separate each element of the array. The separator is converted to a string if necessary. If omitted, the array elements are separated with a comma.
        * @return The string conversions of all array elements joined into one string.
        **/
        join(separator?: any): _ChainSingle<T>;

        /**
        * Removes the last element from an array and returns that element.
        * @return Returns the popped element.
        **/
        pop(): _ChainSingle<T>;

        /**
        * Adds one or more elements to the end of an array and returns the new length of the array.
        * @param item The elements to add to the end of the array.
        * @return The array with the element added to the end.
        **/
        push(...item: Array<T>): _Chain<T>;

        /**
        * Reverses an array in place. The first array element becomes the last and the last becomes the first.
        * @return The reversed array.
        **/
        reverse(): _Chain<T>;

        /**
        * Removes the first element from an array and returns that element. This method changes the length of the array.
        * @return The shifted element.
        **/
        shift(): _ChainSingle<T>;

        /**
        * Returns a shallow copy of a portion of an array into a new array object.
        * @param start Zero-based index at which to begin extraction.
        * @param end Optional. Zero-based index at which to end extraction. slice extracts up to but not including end.
        * @return A shallow copy of a portion of an array into a new array object.
        **/
        slice(start: number, end?: number): _Chain<T>;

        /**
        * Sorts the elements of an array in place and returns the array. The sort is not necessarily stable. The default sort order is according to string Unicode code points.
        * @param compareFn Optional. Specifies a function that defines the sort order. If omitted, the array is sorted according to each character's Unicode code point value, according to the string conversion of each element.
        * @return The sorted array.
        **/
        sort(compareFn?: (a: T, b: T) => boolean): _Chain<T>;

        /**
        * Changes the content of an array by removing existing elements and/or adding new elements.
        * @param index Index at which to start changing the array. If greater than the length of the array, actual starting index will be set to the length of the array. If negative, will begin that many elements from the end.
        * @param quantity An integer indicating the number of old array elements to remove. If deleteCount is 0, no elements are removed. In this case, you should specify at least one new element. If deleteCount is greater than the number of elements left in the array starting at index, then all of the elements through the end of the array will be deleted.
        * @param items The element to add to the array. If you don't specify any elements, splice will only remove elements from the array.
        * @return An array containing the deleted elements. If only one element is removed, an array of one element is returned. If no elements are removed, an empty array is returned.
        **/
        splice(index: number, quantity: number, ...items: Array<T>): _Chain<T>;

        /**
        * A string representing the specified array and its elements.
        * @return A string representing the specified array and its elements.
        **/
        toString(): _ChainSingle<T>;

        /**
        * Adds one or more elements to the beginning of an array and returns the new length of the array.
        * @param items The elements to add to the front of the array.
        * @return The array with the element added to the beginning.
        **/
        unshift(...items: Array<T>): _Chain<T>;

        /********** *
         * Chaining *
        *********** */

        /**
          * Returns a wrapped object. Calling methods on this object will continue to return wrapped objects
          * until value() is used.
          * @returns An underscore chain wrapper around the wrapped value.
          **/
        chain(): _Chain<T, V>;

        /**
         * Extracts the value of the wrapped object.
         * @returns The value of the wrapped object.
         **/
        value(): V;
    }
}

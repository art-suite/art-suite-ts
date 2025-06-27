/*
  insertIntoArray: (inputArray, index, item) ->
    index = inputArray.length + index + 1 if index < 0
    inputArray.splice index, 0, item
    inputArray

  arrayWithInsertedAt: (inputArray, index, item) =>
    insertIntoArray inputArray.slice(), index, item

*/

/**
 * Inserts an item into an array at the specified index, mutating the original array.
 * @param inputArray - The array to insert into (will be mutated)
 * @param index - The position to insert at. Negative indices count from the end
 * @param item - The item to insert
 * @returns The mutated input array
 */
export const insertIntoArray = <T>(inputArray: T[] | undefined | null, index: number, item: T): T[] => {
  if (!inputArray) return [item]
  index = index < 0 ? inputArray.length + index + 1 : index
  inputArray.splice(index, 0, item)
  return inputArray
}

/**
 * Creates a new array with an item inserted at the specified index, leaving the original array unchanged.
 * @param inputArray - The array to copy and insert into
 * @param index - The position to insert at. Negative indices count from the end
 * @param item - The item to insert
 * @returns A new array with the item inserted
 */
export const arrayWithInsertedAt = <T>(inputArray: T[] | undefined | null, index: number, item: T): T[] =>
  inputArray ? insertIntoArray(inputArray.slice(), index, item) : [item]


/**
 * Creates a new array by concatenating the original array with additional items.
 * @param inputArray - The array to concatenate with
 * @param items - The items to append to the array
 * @returns A new array with the additional items appended
 */
export const arrayWith = <T>(inputArray: T[] | undefined | null, ...items: T[]): T[] =>
  inputArray ? [...inputArray, ...items] : items

/**
 * Returns the last element of an array, or undefined if the array is empty or undefined.
 * @param array - The array to peek into
 * @returns The last element of the array, or undefined if the array is empty or undefined
 */
export const peek = <T>(array: T[] | undefined | null): T | undefined => array?.[array.length - 1]

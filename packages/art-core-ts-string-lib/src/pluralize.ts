import npmPluralize from 'pluralize'
import { isString, isNumber } from '@art-suite/art-core-ts-types'

const patchedNpmPluralize = (noun: string, count?: number | undefined, inclusive?: boolean | undefined) => {
  const match = /^(.*?)([_\W]+)$/.exec(noun)
  if (match) {
    const [__, mainNoun, append] = match
    const out = npmPluralize(mainNoun, count, inclusive)
    return out + append
  }
  return npmPluralize(noun, count, inclusive)
}

export const {
  plural,
  singular,
  isSingular,
  isPlural,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
} = npmPluralize

/**
 * Pluralize a word based on the passed in count. Call signatures:
 *
 * 1 input:
 * pluralize(singleForm: string)
 *
 * 2 inputS:
 * pluralize(singleForm: string, count: number)
 * pluralize(count: number, singleForm: string)
 *
 * 3 inputs:
 * pluralize(singleForm: string, count: number, pluralForm: string)
 * pluralize(count: number, singleForm: string, pluralForm: string)
 *
 * @param a: string | number - The word to pluralize if a string, or the count if a number
 * @param b: string | number - The count to pluralize the word by if a number, or the singleForm if a string
 * @param pluralForm: string - Explicitly provide the plural form of the word (optional)
 * @returns The pluralized word
 */
export const pluralize = (a: number | string, b?: number | string, pluralForm?: string) => {
  let singleForm: string
  let number: number | null = null
  if (isNumber(b)) {
    if (!isString(a)) {
      throw new Error(`singleForm and pluralForm(optional) should be non-empty strings (inputs: ${JSON.stringify({ a, b, pluralForm })}`)
    }
    singleForm = a
    number = b
  } else if (isNumber(a)) {
    if (!isString(b)) {
      throw new Error(`singleForm and pluralForm(optional) should be non-empty strings (inputs: ${JSON.stringify({ a, b, pluralForm })}`)
    }
    singleForm = b
    number = a
  } else {
    if (!isString(a)) throw new Error(`singleForm and pluralForm(optional) should be non-empty strings (inputs: ${JSON.stringify({ a, b, pluralForm })}`)
    singleForm = a
    number = null
  }
  if (pluralForm) return `${number} ${number == 1 ? singleForm : pluralForm}`
  if (number != null) return patchedNpmPluralize(singleForm, number, true)
  return patchedNpmPluralize(singleForm)
}

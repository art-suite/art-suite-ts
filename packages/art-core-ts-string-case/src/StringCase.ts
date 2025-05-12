// import &@ArtSuite/ArtCoreTypes, &@ArtSuite/ArtCoreArrays

import { isArray, isString } from 'art-core-ts-types'
import { compactFlatten } from 'art-core-ts-containers'

const findWordsRegExp = /[a-zA-Z][a-zA-Z0-9]*|[0-9]+/g
const findCapStartWordsRegExp = /(?:[A-Z]{2,}(?![a-z]))|[A-Z][a-z0-9]*|[a-z0-9]+/g

export const getCodeWords = (str: string | string[]): string[] => compactFlatten(
  isArray(str) ? str.map(s => getCodeWords(s)) :
    isString(str) && findWordsRegExp.test(str) ?
      str.match(findWordsRegExp)?.map((word: string) => word.match(findCapStartWordsRegExp) || []) :
      []
)

export const lowerCase = <T extends string | null | undefined>(str: T): T => str?.toLocaleLowerCase() as T
export const upperCase = <T extends string | null | undefined>(str: T): T => str?.toLocaleUpperCase() as T

export const capitalize = <T extends string | null | undefined>(str: T): T => str ? upperCase(str.charAt(0)) + str.slice(1) as T : str
export const decapitalize = <T extends string | null | undefined>(str: T): T => str ? lowerCase(str.charAt(0)) + str.slice(1) as T : str

export const getLowerCaseCodeWords = (str: string): string[] => getCodeWords(str).map(lowerCase)
export const getUpperCaseCodeWords = (str: string) => getCodeWords(str).map(upperCase)
export const getCapitalizedCodeWords = (str: string) => getCodeWords(str).map(word => capitalize(lowerCase(word) || ''))

export const upperCamelCase = (str: string, joiner = '') => getLowerCaseCodeWords(str).map(capitalize).join(joiner)
export const lowerCamelCase = (str: string, joiner = '') => decapitalize(upperCamelCase(str, joiner))

export const snakeCase = (str: string, joiner = '_') => getLowerCaseCodeWords(str).join(joiner)
export const upperSnakeCase = (str: string, joiner = '_') => getUpperCaseCodeWords(str).join(joiner)
export const dashCase = (str: string, joiner = '-') => getLowerCaseCodeWords(str).join(joiner)
export const capitalizedDashCase = (str: string, joiner = '-') => getCapitalizedCodeWords(str).join(joiner)

export const pascalCase = upperCamelCase
export const kebabCase = dashCase
export const constantCase = upperSnakeCase
export const camelCase = lowerCamelCase
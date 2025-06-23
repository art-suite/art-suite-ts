import { compare } from './compare'

export const eq = (a: any, b: any): boolean => compare(a, b) === 0;
export const neq = (a: any, b: any): boolean => compare(a, b) !== 0;
export const lt = (a: any, b: any): boolean => compare(a, b) < 0;
export const gt = (a: any, b: any): boolean => compare(a, b) > 0;
export const lte = (a: any, b: any): boolean => compare(a, b) <= 0;
export const gte = (a: any, b: any): boolean => compare(a, b) >= 0;

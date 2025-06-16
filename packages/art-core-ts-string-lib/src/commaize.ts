/**
 * Adds commas to a number or string
 * @param x - The number or string to commaize
 * @returns The commaized number or string
 */
export const commaize = (x: number | string) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

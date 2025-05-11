export const objectHasKey = (obj: Record<string, any>): boolean => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return true
    }
  }
  return false
}

export const objectKeyCount = (obj: Record<string, any>): number => {
  let count = 0
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      count++
    }
  }
  return count
}
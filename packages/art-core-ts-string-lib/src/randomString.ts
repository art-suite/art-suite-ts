export const base62Characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

const intRand = (max: number): number => {
  return Math.floor(Math.random() * max)
}
/**
 * Generates a Uint8Array of cryptographically secure random bytes.
 * @param size Number of bytes to generate.
 * @returns A Uint8Array filled with random bytes.
 */
const generateRandomBytes = (size: number): Uint8Array =>
  typeof crypto?.getRandomValues === 'function'
    ? crypto.getRandomValues(new Uint8Array(size))
    : require('crypto').randomFillSync(new Uint8Array(size));

/*
  @randomString: randomString = (length = 32, chars = base62Characters, randomNumbers) ->
    result = ''
    charsLength = chars.length
    if randomNumbers
      (chars[randomNumbers[i] % charsLength] for i in [0...length] by 1).join ''
    else
      (chars[intRand charsLength] for i in [0...length] by 1).join ''
*/
export const randomString = (length = 32, chars = base62Characters, randomNumbers?: Uint8Array | number[]): string => {
  const charsLength = chars.length
  let result = ''
  if (randomNumbers) {
    for (let i = 0; i < length; i++) result += chars[randomNumbers[i] % charsLength]
  } else {
    for (let i = 0; i < length; i++) result += chars[intRand(charsLength)]
  }
  return result
}

export const cryptoRandomString = (length = 32, chars = base62Characters): string =>
  randomString(length, chars, generateRandomBytes(length).map(b => b % chars.length))
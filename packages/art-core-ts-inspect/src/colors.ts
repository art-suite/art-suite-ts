export type InspectColors = {
  value: (s: string) => string,
  propName: (s: string) => string,
  symbol: (s: string) => string,
  nullOrUndefined: (s: string) => string,
}

export const defaultColors: InspectColors = {
  // gray: (s: string) => `\x1b[90m${s}\x1b[0m`,
  value: (s: string) => `\x1b[32m${s}\x1b[0m`, // green
  propName: (s: string) => `\x1b[90m${s}\x1b[0m`,
  symbol: (s: string) => `\x1b[90m${s}\x1b[0m`,
  nullOrUndefined: (s: string) => `\x1b[90m${s}\x1b[0m`,
}

export const noColors: InspectColors = {
  value: (s: string) => s,
  propName: (s: string) => s,
  symbol: (s: string) => s,
  nullOrUndefined: (s: string) => s,
}
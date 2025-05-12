# @art-core-ts-string-case

Effortless, lossless conversion between all common string case formats in programming.

## Why This Module?

**The Why:**
There are several common ways to represent words without spaces in programming—camelCase, snake_case, dash-case, and more. Converting between them is a frequent need, but handling edge cases (especially acronyms) is tricky and error-prone. There is no clear standard for how to represent acronyms as "code words," and most libraries lose information when converting between formats.

**The How:**
This library makes one key assumption: acronyms are treated as words. For example, "HTML" is treated as the word "Html" for the purpose of code words. This enables lossless, round-trip conversion between all supported formats—so you can always convert back and forth without losing word boundaries or acronym information.

**The What:**
A comprehensive set of functions for converting between camelCase, PascalCase, snake_case, UPPER_SNAKE_CASE, dash-case, Capitalized-Dash-Case, and more, all with robust handling of acronyms.

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-core-ts-string-case
```

Basic usage:

```ts
import {
  getCodeWords,
  lowerCamelCase,
  upperCamelCase,
  snakeCase,
  upperSnakeCase,
  dashCase,
  capitalizedDashCase,
  pascalCase,
  kebabCase,
  constantCase,
  camelCase,
} from "@art-core-ts-string-case";

getCodeWords("toHTML"); // ["to", "Html"]
lowerCamelCase("to HTML"); // "toHtml"
upperCamelCase("to HTML"); // "ToHtml"
snakeCase("to HTML"); // "to_html"
upperSnakeCase("to HTML"); // "TO_HTML"
dashCase("to HTML"); // "to-html"
capitalizedDashCase("to HTML"); // "To-Html"

// Aliases
pascalCase("to HTML"); // "ToHtml"
kebabCase("to HTML"); // "to-html"
constantCase("to HTML"); // "TO_HTML"
camelCase("to HTML"); // "toHtml"

// All converters accept an optional second parameter: the joiner string
upperCamelCase("to HTML", " "); // "To Html"
snakeCase("to HTML", "--"); // "to--html"
```

## Functional Overview

### Code Word Extraction

- `getCodeWords(str)` — Extracts an array of code words from any string, treating acronyms as words (e.g., "toHTML" → `["to", "Html"]`).

### Case Conversion Functions

All converters accept an optional second parameter, `joiner`, which is the string inserted between each word (default varies by converter).

- `lowerCamelCase(str, joiner?)` — Converts to lowerCamelCase.
- `upperCamelCase(str, joiner?)` — Converts to UpperCamelCase (PascalCase).
- `snakeCase(str, joiner?)` — Converts to snake_case.
- `upperSnakeCase(str, joiner?)` — Converts to UPPER_SNAKE_CASE.
- `dashCase(str, joiner?)` — Converts to dash-case.
- `capitalizedDashCase(str, joiner?)` — Converts to Capitalized-Dash-Case.
- `pascalCase(str, joiner?)` — Alias for `upperCamelCase`.
- `kebabCase(str, joiner?)` — Alias for `dashCase`.
- `constantCase(str, joiner?)` — Alias for `upperSnakeCase`.
- `camelCase(str, joiner?)` — Alias for `lowerCamelCase`.

### Word Case Utilities

- `lowerCase(str)`

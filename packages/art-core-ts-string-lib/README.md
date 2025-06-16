# @art-suite/art-core-ts-string-lib

Essential string utilities for TypeScript, including number formatting and robust pluralization.

## Why This Module?

String manipulation is a core part of any application, but common tasks like formatting numbers with commas or pluralizing words are often re-implemented or handled inconsistently. This module provides focused, type-safe helpers for these needs, with a simple, ergonomic API.

- **Commaize:** Format numbers or numeric strings with thousands separators.
- **Pluralize:** Intelligently pluralize words based on count, with support for custom plural forms and edge cases. Built on top of the popular [`pluralize`](https://www.npmjs.com/package/pluralize) npm package, but presented in a more convenient, TypeScript-friendly API.

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-string-lib
```

Basic usage:

```ts
import { commaize, pluralize } from "@art-suite/art-core-ts-string-lib";

// Format numbers with commas
commaize(1234567); // "1,234,567"
commaize("987654321"); // "987,654,321"

// Pluralize words based on count
pluralize("cat"); // "cats"
pluralize("cat", 1); // "1 cat"
pluralize("cat", 2); // "2 cats"
pluralize(3, "child", "children"); // "3 children"
pluralize("person", 2); // "2 people"
```

## Functional Overview

### `commaize(x: number | string): string`

Adds commas as thousands separators to a number or numeric string.

- `commaize(1234567)` → `"1,234,567"`
- `commaize("1000000")` → `"1,000,000"`

### `pluralize(...)`

Pluralizes a word based on count, with flexible call signatures:

- `pluralize(singleForm: string)` — Returns the plural form: `pluralize("cat")` → `"cats"`
- `pluralize(singleForm: string, count: number)` — Returns `"count word(s)"`: `pluralize("cat", 2)` → `"2 cats"`
- `pluralize(count: number, singleForm: string)` — Same as above: `pluralize(1, "dog")` → `"1 dog"`
- `pluralize(singleForm: string, count: number, pluralForm: string)` — Custom plural: `pluralize("child", 2, "children")` → `"2 children"`
- `pluralize(count: number, singleForm: string, pluralForm: string)` — Same as above.

Handles edge cases and preserves punctuation (e.g., `"bus!"` → `"buses!"`).

> **Note:** This utility leverages the [`pluralize`](https://www.npmjs.com/package/pluralize) npm package under the hood, but wraps it in a more convenient, TypeScript-friendly API and handles additional edge cases. In particular, the `pluralize(number, noun)` signature is closer to normal English and more ergonomic than the default npm pluralize API.

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.

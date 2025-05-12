# @art-suite/art-core-ts-time

Seamless, simple utilities for working with dates, times, and durations in JavaScript and TypeScript.

## Why This Module?

**The Why:**
Working with dates, times, and durations in JavaScript is notoriously error-prone and inconsistent. Developers often need to convert between numbers, strings, and `Date` objects, or present time in human-friendly ways, but the standard APIs are clunky and fragmented.

**The How:**
This library provides a unified set of utilities for effortless conversion between standard date/time representations (`number`, `string`, `Date`), as well as easy formatting and presentation (e.g., `formatDate`, `timeAgo`, `humanDurationString`). It also makes it trivial to convert between different units of time (seconds, hours, days, etc.) and to perform common calculations like "start of day" or "first of month".

**The What:**
A comprehensive set of functions for converting, formatting, and presenting dates and times, plus helpers for working with time units and durations.

## Milliseconds and Seconds

JavaScript date-time-as-numbers uses milliseconds as the unit. However, often seconds is the more natural (and efficient) unit of choice. This library solves this problem by making a powerful assumption that allows you to use both milliseconds and seconds interchangeably:

- **Date/Time in Seconds:** any `number < 100000000000` is considered seconds
- **Date/Time in Milliseconds:** any `number >= 100000000000` is considered milliseconds

This means that the supported date-time ranges for seconds and milliseconds are:

- **Date/Time in Seconds Range:** 1970 to 5138 A.D.
- **Date/Time in Milliseconds Range:** 1973-03-03T09:46:40.000Z to basically eternity (ChatGPT says 275,760 A.D.)

In other words, by making a small sacrifice - not being able to represent date/time seconds greater than the year 5138 nor milliseconds in the years 1970 to 1973, we gain the ability to seamlessly work with either common numerical representation of date/time without having to think about which one is being used.

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-time
```

Basic usage:

```ts
import {
  formatDate,
  toMilliseconds,
  toSeconds,
  toDate,
  timeAgo,
  humanDurationString,
  firstOfDay,
  firstOfMonth,
  secondsPer,
} from "@art-suite/art-core-ts-time";

// Convert between types
toMilliseconds("2024-01-01"); // e.g., 1704067200000
toSeconds(new Date()); // e.g., 1704067200
toDate(1704067200000); // Date object

// Format and present
formatDate(new Date(), "yyyy-MM-dd"); // "2024-06-01"
timeAgo(new Date(Date.now() - 60000)); // "1m ago"
humanDurationString(3661); // "1h 1m 1s"

// Time calculations
firstOfDay(new Date()); // Seconds since epoch at start of today (UTC)
firstOfMonth(new Date()); // Seconds since epoch at start of this month (UTC)

// Time unit constants
secondsPer.hour; // 3600
secondsPer.day; // 86400
```

## Functional Overview

### Conversion Utilities

- `toMilliseconds(value)` — Convert a `Date`, string, or number to milliseconds since epoch.
- `toSeconds(value)` — Convert a `Date`, string, or number to seconds since epoch.
- `toDate(value)` — Convert a string, number, or `Date` to a `Date` object.

### Formatting and Presentation

- `formatDate(value, format?, utc?)` — Format a date as a string, with optional format and UTC support.
- `timeAgo(date, options?)` — Human-friendly "time ago" string (e.g., "2h ago", "just now").
- `humanDurationString(seconds, options?)` — Format a duration in seconds as a human-readable string (e.g., "1h 2m 3s").
- `niceDateString(date, now?)` — Friendly date string (e.g., "today", "yesterday", "June 1").
- `niceFullDateString(date)` — Full, readable date string (e.g., "3:45pm June 1, 2024").

### Time Calculations

- `firstOfHour(time)` — Seconds since epoch at the start of the hour.
- `firstOfDay(time)` — Seconds since epoch at the start of the day (UTC).
- `firstOfWeek(time)` — Seconds since epoch at the start of the week (UTC, Monday).
- `firstOfMonth(time)` — Seconds since epoch at the start of the month (UTC).
- `firstOfYear(time)` — Seconds since epoch at the start of the year (UTC).
- Locale variants: `firstOfDayLocale`, `firstOfWeekLocale`, `firstOfMonthLocale`, `firstOfYearLocale`.

### Time Unit Constants

- `secondsPer` — Object mapping time units (e.g., `hour`, `day`, `month`) to their value in seconds.

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.

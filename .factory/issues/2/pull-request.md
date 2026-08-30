# fix: correct add function arithmetic

## Summary
Fix the `add` function in `test.js` so it performs numeric addition instead of returning a constant, while preserving the named export.

## Changes
- Coerce both arguments with `Number` before adding.
- Add focused Node tests covering the named export, numbers, negative/decimal values, and numeric strings.

## How to test
- Run: `node --test test.test.js`

## Risks
Low. The public `add(a, b)` API is unchanged; behavior is corrected for numeric and numeric-string inputs.

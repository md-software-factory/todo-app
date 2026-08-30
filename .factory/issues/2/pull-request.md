# fix: coerce add operands before summing

## Summary
Fixes `add` so it returns numeric sums for both numbers and supported numeric-string inputs.

## Changes
- Coerce both operands with `Number()` before addition.
- Preserve the named `add(a, b)` export and public API.
- Add focused regression coverage for numeric, negative, fractional, and numeric-string inputs, including `'12' + '30'`.

## How to test
- Run `node --test test.test.js`.
- Confirm all focused tests pass.

## Risks
- Minimal behavioral change limited to correcting addition semantics; no API changes or unrelated code changes.

# fix: coerce add operands before arithmetic

## Summary
Fixes `add(a, b)` so numeric strings are added arithmetically instead of concatenated.

## Changes
- Coerce both operands with `Number()` before addition.
- Preserve the named ES module export and existing interface.
- No unrelated implementation changes.

## How to test
- Run `node --test`.
- Verify numeric and numeric-string cases, including `add('12', '30') === 42`.

## Risks
Low. The change is limited to the reported `test.js` implementation bug; review confirms the working-tree implementation diff is empty after the approved change.

# fix: coerce add operands before numeric addition

## Summary
The intended fix is to make `add(a, b)` perform numeric addition for numbers and numeric strings while preserving its named export.

## Changes
- Reviewed implementation: `test.js` uses `Number()` for both operands before addition.
- Reviewed tests cover numeric inputs, numeric strings, and `add('12', '30') === 42`.
- Current working-tree diff contains only `.factory/issues/2` artifact changes; it does not include the focused `test.js` or `test.test.js` changes.

## How to test
- Run `node --test`.
- Verify `add(2, 3) === 5`, `add('2', '3') === 5`, and `add('12', '30') === 42`.

## Risks
Low for the intended implementation. As currently diffed, the change is not approvable because unrelated factory artifacts are modified and the requested implementation/test diff is absent.

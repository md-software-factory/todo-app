# fix: coerce add operands before numeric addition

## Summary
Fix `add(a, b)` so numeric strings are coerced before arithmetic addition.

## Changes
- Intended implementation: coerce both operands with `Number()` while preserving the named `add` export.
- Intended coverage includes numeric and numeric-string inputs, including `add('12', '30') === 42`.
- Current working-tree diff does not include `test.js` or `test.test.js`; it only contains changes to `.factory/issues/2` review artifacts, including deletion of `pull-request.md`.

## How to test
- Run `node --test`.
- Verify `add(2, 3) === 5`, `add('2', '3') === 5`, and `add('12', '30') === 42`.
- Restore/exclude unrelated `.factory` artifact changes and ensure the focused implementation/test diff is present before approval.

## Risks
Low for the intended code change. As presented, the PR is not reviewable for the requested fix because the implementation and test changes are absent from the current diff, while unrelated issue artifacts are modified.

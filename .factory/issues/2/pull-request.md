# fix: return a + b in add() instead of hard-coded 3

## Summary

Fixes the bug where the exported `add(a, b)` function in `test.js` ignored its arguments and always returned the hard-coded constant `3`.

## Changes

- `test.js`: replace `return 3;` with `return a + b;` in `add` — a single-line fix.
- `.factory/issues/2/*`: lane planning metadata (spec/tasks/review artifacts), not source changes.
- No new dependencies, config, or other behavior changes.

## How to test

```sh
node --input-type=module -e "import('./test.js').then(m => { console.assert(m.add(2, 3) === 5); console.assert(m.add(0, 0) === 0); console.assert(m.add(-1, 4) === 3); })"
```

No assertion failures = pass. Also confirmed via review: diff is limited to the one-line change in `test.js`.

## Risks

- Low. Isolated one-line change in the repo's only source file; no API, data, or dependency changes.

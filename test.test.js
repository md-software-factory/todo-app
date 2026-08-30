import test from 'node:test';
import assert from 'node:assert/strict';
import { add } from './test.js';

test('add remains available as a named export', () => {
  assert.equal(typeof add, 'function');
});

test('adds numbers', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-4, 1.5), -2.5);
});

test('coerces numeric strings before adding', () => {
  assert.equal(add('2', '3'), 5);
  assert.equal(add('10', 0), 10);
  assert.equal(add('0.5', '1.25'), 1.75);
});

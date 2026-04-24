const test = require('node:test');
const assert = require('node:assert/strict');

const { countLeaveDays, normalizeLeaveWindow } = require('./leavePolicy');

test('counts a single leave day as one day', () => {
  assert.equal(countLeaveDays('2026-04-29', '2026-04-29'), 1);
});

test('counts an inclusive date range', () => {
  assert.equal(countLeaveDays('2026-04-29', '2026-05-01'), 3);
});

test('rejects a leave window that ends before it starts', () => {
  assert.throws(() => countLeaveDays('2026-05-02', '2026-04-29'), /end date must be on or after start date/i);
});

test('normalizes the window into ISO dates', () => {
  assert.deepEqual(normalizeLeaveWindow('2026-04-29', '2026-05-01'), {
    startDate: '2026-04-29',
    endDate: '2026-05-01',
    days: 3,
  });
});

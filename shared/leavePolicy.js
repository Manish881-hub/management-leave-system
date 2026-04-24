function parseIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('date must be an ISO date string in YYYY-MM-DD format');
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('date must be a valid calendar date');
  }

  return parsed;
}

function toIsoDate(value) {
  return value.toISOString().slice(0, 10);
}

function countLeaveDays(startDate, endDate) {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  if (end.getTime() < start.getTime()) {
    throw new Error('end date must be on or after start date');
  }

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / dayMs) + 1;
}

function normalizeLeaveWindow(startDate, endDate) {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
    days: countLeaveDays(startDate, endDate),
  };
}

module.exports = {
  countLeaveDays,
  normalizeLeaveWindow,
};

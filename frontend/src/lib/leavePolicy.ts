export function countLeaveDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  if (end.getTime() < start.getTime()) {
    return 0;
  }

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / dayMs) + 1;
}

export function formatDateRange(startDate: string, endDate: string): string {
  return `${startDate} to ${endDate}`;
}

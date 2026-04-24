import type { LeaveStatus } from '../api/types';

const LABELS: Record<LeaveStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export function StatusPill({ status }: { status: LeaveStatus }) {
  return <span className={`status-pill status-pill--${status}`}>{LABELS[status]}</span>;
}

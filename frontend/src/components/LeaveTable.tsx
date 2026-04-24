import type { LeaveRequest, LeaveStatus } from '../api/types';
import { StatusPill } from './StatusPill';

type LeaveTableProps = {
  leaves: LeaveRequest[];
  emptyMessage: string;
  reviewDrafts: Record<number, string>;
  onReviewDraftChange: (id: number, value: string) => void;
  onReview: (id: number, status: Extract<LeaveStatus, 'approved' | 'rejected'>) => void;
  reviewingId: number | null;
};

export function LeaveTable({
  leaves,
  emptyMessage,
  reviewDrafts,
  onReviewDraftChange,
  onReview,
  reviewingId,
}: LeaveTableProps) {
  if (leaves.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="table-card">
      <table className="leave-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Dates</th>
            <th>Type</th>
            <th>Days</th>
            <th>Status</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>
                <div className="employee-cell">
                  <strong>{leave.employee_name ?? `User #${leave.user_id}`}</strong>
                  <span>{leave.employee_email ?? `ID ${leave.user_id}`}</span>
                </div>
              </td>
              <td>
                <div className="date-stack">
                  <span>{leave.start_date}</span>
                  <span className="date-stack__arrow">-></span>
                  <span>{leave.end_date}</span>
                </div>
              </td>
              <td>{leave.type}</td>
              <td>{leave.days}</td>
              <td>
                <StatusPill status={leave.status} />
              </td>
              <td>{leave.manager_comment ?? '--'}</td>
              <td>
                {leave.status === 'pending' ? (
                  <div className="review-actions">
                    <textarea
                      rows={2}
                      value={reviewDrafts[leave.id] ?? ''}
                      onChange={(event) => onReviewDraftChange(leave.id, event.target.value)}
                      placeholder="Manager note"
                    />
                    <div className="review-actions__buttons">
                      <button
                        className="button button--soft"
                        type="button"
                        onClick={() => onReview(leave.id, 'rejected')}
                        disabled={reviewingId === leave.id}
                      >
                        Reject
                      </button>
                      <button
                        className="button button--primary"
                        type="button"
                        onClick={() => onReview(leave.id, 'approved')}
                        disabled={reviewingId === leave.id}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="muted">Closed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { fetchLeaves, reviewLeave } from '../api/client';
import type { LeaveRequest, LeaveStatus, User } from '../api/types';
import { LeaveTable } from '../components/LeaveTable';
import { StatCard } from '../components/StatCard';

type ManagerDashboardProps = {
  token: string;
  user: User;
  onLogout: () => void;
};

type ViewFilter = 'all' | LeaveStatus;

export function ManagerDashboard({ token, user, onLogout }: ManagerDashboardProps) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ViewFilter>('all');
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  async function loadLeaves() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchLeaves(token);
      setLeaves(response.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load leave requests');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeaves();
    // token is stable for the dashboard session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const visibleLeaves = useMemo(
    () => (filter === 'all' ? leaves : leaves.filter((leave) => leave.status === filter)),
    [filter, leaves],
  );

  async function handleReview(id: number, status: Extract<LeaveStatus, 'approved' | 'rejected'>) {
    setReviewingId(id);
    setError(null);

    try {
      await reviewLeave(token, id, {
        status,
        manager_comment: drafts[id]?.trim() || undefined,
      });
      setDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      await loadLeaves();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update leave request');
    } finally {
      setReviewingId(null);
    }
  }

  const pendingCount = leaves.filter((leave) => leave.status === 'pending').length;
  const approvedCount = leaves.filter((leave) => leave.status === 'approved').length;
  const rejectedCount = leaves.filter((leave) => leave.status === 'rejected').length;

  return (
    <main className="dashboard">
      <header className="topbar card">
        <div>
          <p className="eyebrow">Manager dashboard</p>
          <h1>Review leave requests</h1>
          <p className="topbar__subline">
            Approve or reject requests and keep the workflow moving.
          </p>
        </div>

        <div className="topbar__actions">
          <button className="button button--soft" type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard label="Pending" value={String(pendingCount)} tone="amber" detail="Needs action" />
        <StatCard label="Approved" value={String(approvedCount)} tone="emerald" detail="Processed" />
        <StatCard label="Rejected" value={String(rejectedCount)} tone="rose" detail="Closed requests" />
      </section>

      <section className="card">
        <div className="card__header card__header--wrap">
          <div>
            <p className="eyebrow">Requests</p>
            <h2>Queue overview</h2>
          </div>

          <div className="segmented-control" role="tablist" aria-label="Leave request filters">
            {(['all', 'pending', 'approved', 'rejected'] as ViewFilter[]).map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? 'segmented-control__item is-active' : 'segmented-control__item'}
                onClick={() => setFilter(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        {loading ? (
          <div className="empty-state">Loading requests...</div>
        ) : (
          <LeaveTable
            leaves={visibleLeaves}
            emptyMessage="No leave requests match the selected filter."
            reviewDrafts={drafts}
            onReviewDraftChange={(id, value) =>
              setDrafts((current) => ({
                ...current,
                [id]: value,
              }))
            }
            onReview={handleReview}
            reviewingId={reviewingId}
          />
        )}
      </section>

      <section className="card manager-note">
        <p className="eyebrow">Role-based workflow</p>
        <p>
          {user.name} can approve or reject requests here, while employees only see their own
          submissions and balances. That separation keeps the workflow clear and auditable.
        </p>
      </section>
    </main>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { createLeave, fetchLeaves } from '../api/client';
import type { CreateLeaveInput, LeaveRequest, User } from '../api/types';
import { countLeaveDays, formatDateRange } from '../lib/leavePolicy';
import { LeaveForm } from '../components/LeaveForm';
import { StatCard } from '../components/StatCard';
import { StatusPill } from '../components/StatusPill';

type EmployeeDashboardProps = {
  token: string;
  user: User;
  onLogout: () => void;
};

function defaultLeaveForm(): CreateLeaveInput {
  const today = new Date();
  const date = today.toISOString().slice(0, 10);

  return {
    type: 'casual',
    start_date: date,
    end_date: date,
    reason: '',
  };
}

export function EmployeeDashboard({ token, user, onLogout }: EmployeeDashboardProps) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [form, setForm] = useState<CreateLeaveInput>(defaultLeaveForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const previewDays = useMemo(
    () => countLeaveDays(form.start_date, form.end_date),
    [form.end_date, form.start_date],
  );

  const balance = user.leave_balance;
  const recentLeaves = [...leaves].sort((a, b) => b.id - a.id);

  async function handleSubmit() {
    if (!form.reason.trim()) {
      setError('Please add a short reason for the request.');
      return;
    }

    if (previewDays < 1) {
      setError('Please choose a valid date range.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createLeave(token, form);
      setForm(defaultLeaveForm());
      await loadLeaves();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to submit leave request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="dashboard">
      <header className="topbar card">
        <div>
          <p className="eyebrow">Employee dashboard</p>
          <h1>Welcome back, {user.name}</h1>
          <p className="topbar__subline">
            Submit leave requests and track approvals in one place.
          </p>
        </div>

        <div className="topbar__actions">
          <button className="button button--soft" type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard
          label="Remaining leaves"
          value={String(balance?.remaining_leaves ?? 'N/A')}
          tone="emerald"
          detail={`of ${balance?.total_leaves ?? 0} total`}
        />
        <StatCard
          label="Used leaves"
          value={String(balance?.used_leaves ?? 'N/A')}
          tone="amber"
          detail="Approved requests only"
        />
        <StatCard
          label="Open requests"
          value={String(recentLeaves.filter((leave) => leave.status === 'pending').length)}
          tone="cyan"
          detail="Waiting on manager review"
        />
      </section>

      <LeaveForm
        value={form}
        daysPreview={previewDays}
        error={error}
        saving={submitting}
        onChange={setForm}
        onSubmit={handleSubmit}
      />

      <section className="card">
        <div className="card__header">
          <div>
            <p className="eyebrow">My requests</p>
            <h2>Recent leave activity</h2>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading your leave requests...</div>
        ) : recentLeaves.length === 0 ? (
          <div className="empty-state">No requests yet. Submit your first leave above.</div>
        ) : (
          <div className="leave-feed">
            {recentLeaves.map((leave) => (
              <article className="leave-feed__item" key={leave.id}>
                <div>
                  <strong>{formatDateRange(leave.start_date, leave.end_date)}</strong>
                  <p>
                    {leave.type} - {leave.days} day{leave.days === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="leave-feed__meta">
                  <StatusPill status={leave.status} />
                  <span>{leave.reason}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

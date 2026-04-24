import type { CreateLeaveInput, LeaveType } from '../api/types';

type LeaveFormProps = {
  value: CreateLeaveInput;
  daysPreview: number;
  error: string | null;
  saving: boolean;
  onChange: (next: CreateLeaveInput) => void;
  onSubmit: () => void;
};

const LEAVE_TYPES: LeaveType[] = ['casual', 'sick', 'vacation'];

export function LeaveForm({
  value,
  daysPreview,
  error,
  saving,
  onChange,
  onSubmit,
}: LeaveFormProps) {
  return (
    <section className="card form-card">
      <div className="card__header">
        <div>
          <p className="eyebrow">Apply leave</p>
          <h2>Submit a new request</h2>
        </div>
        <p className="card__hint">
          Preview: <strong>{daysPreview}</strong> day{daysPreview === 1 ? '' : 's'}
        </p>
      </div>

      <div className="form-grid">
        <label>
          <span>Leave type</span>
          <select
            value={value.type}
            onChange={(event) =>
              onChange({
                ...value,
                type: event.target.value as LeaveType,
              })
            }
          >
            {LEAVE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type[0].toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Start date</span>
          <input
            type="date"
            value={value.start_date}
            onChange={(event) => onChange({ ...value, start_date: event.target.value })}
          />
        </label>

        <label>
          <span>End date</span>
          <input
            type="date"
            value={value.end_date}
            onChange={(event) => onChange({ ...value, end_date: event.target.value })}
          />
        </label>

        <label className="form-grid__full">
          <span>Reason</span>
          <textarea
            rows={4}
            value={value.reason}
            onChange={(event) => onChange({ ...value, reason: event.target.value })}
            placeholder="Short explanation for the request"
          />
        </label>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="form-actions">
        <button className="button button--primary" type="button" onClick={onSubmit} disabled={saving}>
          {saving ? 'Submitting...' : 'Submit request'}
        </button>
      </div>
    </section>
  );
}

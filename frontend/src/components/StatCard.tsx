type StatCardProps = {
  label: string;
  value: string;
  tone?: 'cyan' | 'amber' | 'rose' | 'emerald';
  detail?: string;
};

export function StatCard({ label, value, tone = 'cyan', detail }: StatCardProps) {
  return (
    <section className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      {detail ? <span className="stat-card__detail">{detail}</span> : null}
    </section>
  );
}

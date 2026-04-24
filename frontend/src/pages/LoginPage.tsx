import type { FormEvent } from 'react';
import { useState } from 'react';
import { login } from '../api/client';

type LoginPageProps = {
  onLogin: (token: string, user: Awaited<ReturnType<typeof login>>['user']) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('employee@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const session = await login(email, password);
      onLogin(session.token, session.user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to log in');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-copy card">
        <p className="eyebrow">HyScaler assignment</p>
        <h1>Leave management, built as a workflow system.</h1>
        <p>
          Employees can submit leave requests, managers can review them, and the backend
          only updates leave balances when a request is approved.
        </p>

        <div className="credential-note">
          <strong>Sample credentials</strong>
          <span>employee@example.com / password</span>
          <span>manager@example.com / password</span>
        </div>
      </div>

      <form className="card auth-form" onSubmit={handleSubmit}>
        <div className="card__header">
          <div>
            <p className="eyebrow">Sign in</p>
            <h2>Access your dashboard</h2>
          </div>
        </div>

        <label>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button--primary" type="submit" disabled={busy}>
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}

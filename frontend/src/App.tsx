import { useEffect, useState } from 'react';
import { fetchMe, logout } from './api/client';
import type { AuthResponse } from './api/types';
import { clearSession, loadSession, saveSession } from './lib/storage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { LoginPage } from './pages/LoginPage';
import { ManagerDashboard } from './pages/ManagerDashboard';

type Session = AuthResponse | null;

export default function App() {
  const [session, setSession] = useState<Session>(() => loadSession());
  const [bootstrapping, setBootstrapping] = useState(Boolean(session?.token));

  useEffect(() => {
    let active = true;

    async function hydrate() {
      if (!session?.token) {
        setBootstrapping(false);
        return;
      }

      try {
        const next = await fetchMe(session.token);
        if (!active) {
          return;
        }
        const refreshedSession: AuthResponse = {
          token: session.token,
          user: next.user,
        };
        setSession(refreshedSession);
        saveSession(refreshedSession);
      } catch {
        if (!active) {
          return;
        }
        clearSession();
        setSession(null);
      } finally {
        if (active) {
          setBootstrapping(false);
        }
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    if (session?.token) {
      try {
        await logout(session.token);
      } catch {
        // Ignore logout errors and clear the local session anyway.
      }
    }

    clearSession();
    setSession(null);
  }

  function handleLogin(token: string, user: AuthResponse['user']) {
    const nextSession = { token, user };
    saveSession(nextSession);
    setSession(nextSession);
  }

  if (bootstrapping) {
    return (
      <div className="screen-center">
        <div className="loading-card card">Checking session...</div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return session.user.role === 'manager' ? (
    <ManagerDashboard token={session.token} user={session.user} onLogout={handleLogout} />
  ) : (
    <EmployeeDashboard token={session.token} user={session.user} onLogout={handleLogout} />
  );
}

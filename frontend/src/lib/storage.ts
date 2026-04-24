import type { AuthResponse } from '../api/types';

const SESSION_KEY = 'hyscaler.leave.session';

export function loadSession(): AuthResponse | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session: AuthResponse): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

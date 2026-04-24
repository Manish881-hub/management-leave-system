import type {
  AuthResponse,
  CreateLeaveInput,
  LeaveListResponse,
  MeResponse,
  ReviewLeaveInput,
} from './types';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await readJson(response);

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message?: string }).message ?? 'Request failed')
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe(token: string): Promise<MeResponse> {
  return request<MeResponse>('/me', { method: 'GET' }, token);
}

export async function fetchLeaves(token: string): Promise<LeaveListResponse> {
  return request<LeaveListResponse>('/leaves', { method: 'GET' }, token);
}

export async function createLeave(token: string, payload: CreateLeaveInput): Promise<unknown> {
  return request('/leave', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token);
}

export async function reviewLeave(
  token: string,
  id: number,
  payload: ReviewLeaveInput,
): Promise<unknown> {
  return request(`/leaves/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token);
}

export async function logout(token: string): Promise<void> {
  await request('/logout', { method: 'POST' }, token);
}

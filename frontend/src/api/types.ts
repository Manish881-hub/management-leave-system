export type UserRole = 'employee' | 'manager';
export type LeaveType = 'sick' | 'casual' | 'vacation';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveBalance {
  id: number;
  user_id: number;
  total_leaves: number;
  used_leaves: number;
  remaining_leaves: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  leave_balance?: LeaveBalance | null;
}

export interface LeaveRequest {
  id: number;
  user_id: number;
  employee_name?: string;
  employee_email?: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  manager_comment: string | null;
  days: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface LeaveListResponse {
  data: LeaveRequest[];
}

export interface CreateLeaveInput {
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface ReviewLeaveInput {
  status: Extract<LeaveStatus, 'approved' | 'rejected'>;
  manager_comment?: string;
}

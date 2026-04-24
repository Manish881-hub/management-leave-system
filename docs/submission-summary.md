# HyScaler Leave Management System Submission Summary

## Overview

This assignment implements an employee leave management workflow with role-based access:

- Employees log in, view their balance, and submit leave requests.
- Managers log in, review the queue, and approve or reject requests.
- Leave balances are updated only when a request is approved.

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Laravel 11-style API
- Database: PostgreSQL

## Key Design Choices

- Bearer token auth keeps the login flow simple for a take-home assignment.
- Controllers stay thin; approval logic lives in a service class.
- PostgreSQL migrations define the data model explicitly.
- A shared leave-day utility keeps day counting consistent across UI and backend logic.

## Important Files

- `frontend/src/App.tsx`
- `frontend/src/pages/EmployeeDashboard.tsx`
- `frontend/src/pages/ManagerDashboard.tsx`
- `frontend/src/api/client.ts`
- `server/app/Http/Controllers/AuthController.php`
- `server/app/Http/Controllers/LeaveController.php`
- `server/app/Services/LeaveApprovalService.php`
- `server/database/migrations/2026_04_24_000001_create_users_table.php`
- `server/database/migrations/2026_04_24_000002_create_leave_balances_table.php`
- `server/database/migrations/2026_04_24_000003_create_leave_requests_table.php`

## Demo Credentials

- Employee: `employee@example.com` / `password`
- Manager: `manager@example.com` / `password`

# Leave Management System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a role-based employee leave management system with a React frontend, Laravel API, and PostgreSQL persistence.

**Architecture:** The frontend will store a bearer token after login, call a Laravel JSON API, and render separate employee and manager dashboards. The backend will keep business logic in a service layer, use form requests for validation, and update leave balances only when a manager approves a request.

**Tech Stack:** React, TypeScript, Vite, Laravel, PHP, PostgreSQL, Sanctum-style bearer auth, PHPUnit

---

### Task 1: Scaffold the project structure

**Files:**
- Create: `README.md`
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `server/composer.json`
- Create: `server/.env.example`
- Create: `server/routes/api.php`
- Create: `server/routes/web.php`

**Step 1: Write the failing test**

Create lightweight backend feature tests that describe login and leave approval behavior.

**Step 2: Run test to verify it fails**

Run: `php artisan test`
Expected: fail because the backend code is not yet implemented.

**Step 3: Write minimal implementation**

Add the backend routes, controllers, and models needed for the tests to pass.

**Step 4: Run test to verify it passes**

Run: `php artisan test`
Expected: pass.

---

### Task 2: Build the backend domain

**Files:**
- Create: `server/app/Models/User.php`
- Create: `server/app/Models/LeaveRequest.php`
- Create: `server/app/Models/LeaveBalance.php`
- Create: `server/app/Http/Controllers/AuthController.php`
- Create: `server/app/Http/Controllers/LeaveController.php`
- Create: `server/app/Http/Requests/LoginRequest.php`
- Create: `server/app/Http/Requests/StoreLeaveRequest.php`
- Create: `server/app/Http/Requests/UpdateLeaveStatusRequest.php`
- Create: `server/app/Services/LeaveApprovalService.php`
- Create: `server/app/Http/Middleware/EnsureRole.php`
- Create: `server/database/migrations/*`
- Create: `server/database/seeders/*`

**Step 1: Write the failing test**

Cover authentication, employee leave submission, manager approval, and leave balance updates.

**Step 2: Run test to verify it fails**

Run: `php artisan test`
Expected: fail on missing models, tables, or service behavior.

**Step 3: Write minimal implementation**

Implement token auth, role checks, leave validation, and approval workflow.

**Step 4: Run test to verify it passes**

Run: `php artisan test`
Expected: pass.

---

### Task 3: Build the React frontend

**Files:**
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/types.ts`
- Create: `frontend/src/auth/AuthProvider.tsx`
- Create: `frontend/src/pages/LoginPage.tsx`
- Create: `frontend/src/pages/EmployeeDashboard.tsx`
- Create: `frontend/src/pages/ManagerDashboard.tsx`
- Create: `frontend/src/components/*.tsx`
- Create: `frontend/src/styles.css`

**Step 1: Write the failing test**

Cover login form rendering, authenticated dashboard switching, and leave request submission.

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: fail because the components and client are not yet implemented.

**Step 3: Write minimal implementation**

Implement the login flow, dashboard rendering, and API client.

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: pass.

---

### Task 4: Polish documentation and submission notes

**Files:**
- Create: `docs/submission-summary.md`
- Update: `README.md`

**Step 1: Write the failing test**

No automated test needed; verify the README and submission summary explain setup and architecture clearly.

**Step 2: Run verification**

Check the instructions manually for completeness.

**Step 3: Write minimal implementation**

Document how to run the frontend and backend and summarize the design decisions.


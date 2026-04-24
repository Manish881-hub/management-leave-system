# HyScaler Leave Management System

Role-based employee leave management system built with:

- React frontend
- Laravel API backend
- PostgreSQL database

## What is included

- Employee login and dashboard
- Manager login and approval dashboard
- Leave request creation
- Leave approval and rejection workflow
- Leave balance tracking
- PostgreSQL migrations and seed data
- A small shared leave-day calculation utility with tests

## Repository Layout

- `frontend/` - React + Vite client
- `server/` - Laravel API application code
- `shared/` - Small pure-JS utility and test
- `docs/plans/` - Implementation plan

## Sample Credentials

Seeded accounts:

- Employee: `employee@example.com` / `password`
- Manager: `manager@example.com` / `password`

## Running Locally

### Frontend

1. `cd frontend`
2. `npm install`
3. Set `VITE_API_URL` in a `.env` file if your backend is not at `http://localhost:8000/api`
4. `npm run dev`

### Backend

The backend code is written for a standard Laravel 11 install.

1. `cd server`
2. `composer install`
3. Copy `.env.example` to `.env`
4. Configure PostgreSQL credentials
5. `php artisan key:generate`
6. `php artisan migrate --seed`
7. `php artisan serve`

## Notes

- The assignment stack is honored end-to-end: React -> Laravel API -> PostgreSQL.
- Leave balances are updated only when a manager approves a request.
- The shared `shared/leavePolicy.js` test keeps the day-counting logic honest.

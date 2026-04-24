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

On a fresh Windows machine, the recommended path is Laravel Sail:

1. Install Docker Desktop.
2. Enable WSL2.
3. Open a WSL terminal.
4. Create a new Laravel app with PostgreSQL support:

   ```bash
   curl -s "https://laravel.build/leave-system?with=pgsql" | bash
   cd leave-system
   ./vendor/bin/sail up -d
   ```

5. Copy the custom backend code from this repo into the generated app:
   - `server/app/`
   - `server/bootstrap/app.php`
   - `server/bootstrap/providers.php`
   - `server/config/`
   - `server/database/`
   - `server/routes/`
   - `server/tests/`

6. Run migrations and seed data:

   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```

7. Start the API if it is not already running:

   ```bash
   ./vendor/bin/sail up -d
   ```

8. If needed, point the frontend to the Sail URL:

   ```bash
   VITE_API_URL=http://localhost/api
   ```

If you already have PHP and Composer installed locally, you can also run the backend without Docker:

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

# Evermore — Personalized Wedding Planner

A full-stack wedding planning app built with **React**, **Express**, **Node.js**, and **MongoDB**. Each couple gets their own account, wedding date, and private data — guest list, budget, checklist, and vendors.

## Features

- **Accounts** — register as a couple, sign in with JWT-based auth
- **Dashboard** — days-until-the-wedding countdown, guest/budget/checklist summary, editable wedding details
- **Guest list** — add guests, assign to a side, track RSVP status, meal preference, plus-ones, with auto-calculated head count
- **Budget tracker** — log expenses by category with estimated vs. actual cost and amount paid, auto-totalled against your overall budget
- **Checklist** — tasks with category, due date, and priority; overdue items are flagged
- **Vendors** — track venue/catering/photography/etc. contacts, quoted cost, and booking status

## Project structure

```
wedding-planner/
  backend/     Express API + Mongoose models (JWT auth, guests, tasks, budget, vendors)
  frontend/    React app (React Router, Axios, context-based auth)
```

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB instance — either running locally (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/wedding_planner   # or your Atlas connection string
JWT_SECRET=some_long_random_string
PORT=5000
CLIENT_URL=http://localhost:3000
```

Run it:

```bash
npm run dev      # requires nodemon (installed as a dev dependency)
# or
npm start
```

The API will be live at `http://localhost:5000/api` (check `GET /api/health`).

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` should point at your backend:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm start
```

The app opens at `http://localhost:3000`. Register a couple's account, and you're in.

## 4. How auth works

- Passwords are hashed with `bcryptjs` before being saved.
- On login/register, the API returns a JWT which the frontend stores in `localStorage` and attaches to every request via an Axios interceptor.
- All guest/task/budget/vendor data is scoped to the logged-in couple's `owner` field, so each account only ever sees its own data.

## 5. Extending it

Some natural next steps if you want to keep building:

- **Seating chart** builder (drag-and-drop tables, using the existing guest records)
- **Email invites/RSVP links** so guests can update their own status without an account
- **File uploads** for contracts or inspiration photos (e.g. via `multer` + S3)
- **Shared access** so both partners (and a planner) can log into the same wedding
- **Timeline view** of the day-of schedule

## Notes on this build

This was generated as a complete starter codebase rather than a live hosted app, since a real Express server + MongoDB database needs to run in your own environment (or a host like Render/Railway + MongoDB Atlas) — it can't be spun up permanently inside this chat. Everything above is ready to run locally or deploy as-is.

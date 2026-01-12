# Task Management Dashboard ✅

**Personal project — built and maintained by me.**

A simple, full-stack task management dashboard that I built to organize tasks, manage users, and view admin stats. It includes authentication, role-based access (user / admin), CRUD for tasks, and a responsive React frontend powered by Vite and Tailwind CSS.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Endpoints (Overview)](#api-endpoints-overview)
- [Notes & Tips](#notes--tips)
- [Contributing](#contributing)
- [License & Author](#license--author)

---

## Features ✨

- User registration and login (JWT + cookies)
- Role-based access control (User & Admin)
- Create, read, update, delete tasks
- Admin: manage users and view all tasks
- Clean, responsive UI built with React + Tailwind

---

## Tech Stack 🔧

- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JSON Web Tokens (JWT)
- Frontend: React, Vite, Redux Toolkit, Tailwind CSS
- Dev tools: Nodemon (backend), Vite (frontend)

---

## Project Structure 📁

Top-level layout:

```
backend/    # Express API, models, controllers, routes
frontend/   # React app (Vite) + components, pages, redux slices
```

Key frontend components you can find in `frontend/src/components/`:
- `ActivityFeed.jsx`, `TaskCard.jsx`, `AdminStats.jsx`, etc.

Key backend folders: `models/`, `controllers/`, `routes/`, `middlewares/`, `config/`.

---

## Quick Start 🚀

Prerequisites:
- Node.js (>=16)
- npm
- MongoDB (local or Atlas cluster)

1) Clone the repo

```bash
git clone <repo-url>
cd Task Management Dashboard
```

2) Backend setup

```bash
cd backend
npm install
# create a .env file (see template below)
npm run dev    # starts server with nodemon
# or `npm start` for production (node server.js)
```

3) Frontend setup

```bash
cd frontend
npm install
npm run dev    # starts Vite dev server (default: http://localhost:5173)
```

Open the frontend in your browser and use the app. The backend runs separately and serves the API at `/api/v1/*`.

---

## Environment Variables (backend/.env) ⚠️

Create a `.env` file in the `backend/` folder with the following keys (example):

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Note: The backend CORS is configured to allow `http://localhost:5173`. Change it in `backend/app.js` if your frontend runs elsewhere.

---

## API Endpoints (Overview) 📡

Base: `/api/v1`

Auth
- `POST /auth/register` — register a new user
- `POST /auth/login` — login (returns token in cookie + response)
- `GET /auth/profile` — get current user (protected)
- `POST /auth/logout` — clear token cookie (protected)

Tasks (protected)
- `POST /task/` — create a task
- `GET /task/` — get tasks for logged-in user
- `PUT /task/:id` — update a task
- `DELETE /task/:id` — delete a task

Admin (protected, role = admin)
- `GET /admin/users` — list users
- `PUT /admin/users/:id/role` — change a user role
- `GET /admin/tasks` — list all tasks
- `DELETE /admin/task/:id` — delete any task

---

## Notes & Tips 💡

- I use JWT stored as an httpOnly cookie for auth. Keep `JWT_SECRET` secure.
- If you use MongoDB Atlas, add your IP to the whitelist or use proper connection string settings.
- To change the frontend origin, update the `cors` origin in `backend/app.js`.

---

## Contributing 🤝

This is my personal project. If you'd like to contribute or suggest improvements, feel free to open an issue or send a PR — I’ll review it and merge if appropriate.

---

## License & Author 📜

**License:** MIT

**Author:** *Your Name* — I built this project myself. (Replace `Your Name` with your name to make it fully personal.)

Maine ye project banaya hai. — (Made by me.)

---

If you want any changes in tone, more screenshots, or additional documentation (API docs, tests, deployment steps), tell me and I'll update the README. ✅

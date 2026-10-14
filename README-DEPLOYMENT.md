# RUVERSE Event Scheduling System — deployment guide

## Important database distinction

Use local MongoDB for development (`mongodb://127.0.0.1:27017/ruverse_events`). A public cloud deployment cannot connect to your laptop's `localhost`. For deployment, create a MongoDB Atlas database and set its connection string as `MONGODB_URI` on the backend host. Keep local MongoDB as your local development database.

## 1. Deploy the API to Render

1. Push this project to a GitHub repository.
2. Create a MongoDB Atlas cluster/database and a database user. Copy the connection string and replace the password placeholder. In Atlas Network Access, allow the Render service to connect (for a student demo, `0.0.0.0/0` is easiest, but use the narrowest possible access policy for production).
3. In Render, create a **Web Service** from the repository. Set **Root Directory** to `server`, **Build Command** to `npm install`, and **Start Command** to `npm start`. `render.yaml` provides these defaults if you use Blueprint deployment.
4. Add environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your Atlas connection string>`
   - `SESSION_SECRET=<a long random secret>`
   - `CLIENT_ORIGIN=https://YOUR-FRONTEND.vercel.app`
   - `COOKIE_SAME_SITE=none`
5. Wait for deployment, then visit `https://YOUR-API.onrender.com/api/health`. It should return JSON with `ok: true`.

## 2. Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel.
2. Set **Root Directory** to `client`.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Add environment variable `VITE_API_URL=https://YOUR-API.onrender.com` (no trailing `/api`).
5. Deploy. Copy the resulting frontend URL into Render's `CLIENT_ORIGIN` value and redeploy the backend.

The frontend uses `VITE_API_URL` rather than a hardcoded localhost API address. `client/vercel.json` handles client-side route fallback.

## 3. Create the first administrator

Sign up through the deployed website using the coordinator account that should become admin. Then use Render's Shell (if available) or a one-time local command connected to the same Atlas database:

```bash
cd server
MONGODB_URI='YOUR_ATLAS_URI' npm run make-admin -- admin@example.com
```

Use the exact email created in the signup form. Do not expose this command as a public API. Sign out and sign back in after promotion.

## 4. Local development

1. Start MongoDB Community Server locally.
2. Copy `server/.env.example` to `server/.env` and leave the local URI for development.
3. Optionally copy `client/.env.example` to `client/.env.local`.
4. From project root run `npm run install:all`, then `npm run dev`.
5. Frontend: `http://localhost:5173`; API health: `http://localhost:5000/api/health`.

## 5. Smoke-test before presenting

- `/api/health` responds successfully.
- Signup and login work on the deployed domain.
- Reload preserves the session.
- A coordinator can submit an event proposal and toggle interest.
- An administrator can approve/reject proposals.
- An approved venue booking cannot overlap another approved booking in that venue.
- Invalid time ranges and insufficient venue capacity are rejected.

## Troubleshooting

- **CORS error:** `CLIENT_ORIGIN` must exactly match the deployed frontend origin (`https://...`, no trailing slash). Comma-separated origins are supported.
- **Login works but session disappears:** use HTTPS on both deployments, `COOKIE_SAME_SITE=none`, and `NODE_ENV=production`; ensure browser cookies are allowed.
- **MongoDB connection failure:** check Atlas username/password, database user permissions, and Network Access rules.
- **API calls go to localhost after deployment:** set `VITE_API_URL` in Vercel and redeploy the frontend. Vite variables are embedded at build time.
- **Render sleeps on free tier:** the first request after inactivity may take longer.

## Build and runtime verification

Run `npm run build` at the repository root after installing dependencies. Test live database/authentication flows against a disposable database before production use. This codebase is a student project and should receive a security review before use with real student data.

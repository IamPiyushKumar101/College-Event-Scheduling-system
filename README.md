# RUVERSE — College Event Scheduling System

A MERN stack college event and venue coordination platform inspired by the RUVERSE TechFest 2026 brochure. The interface uses a dark space-inspired canvas, orbital graphics, and RUVERSE yellow accents (rather than copying brochure pages directly). No Java is used anywhere in the application.

1. Project Overview

- Project Title: RUVERSE — College Event Scheduling System
- Team Members:
  1. Akshat Hansraj — ERP 6606256
  2. Abhyanand Pathak — ERP 6606186
  3. Ankur Kumar Roy — ERP 6606621
  4. Piyush Kumar — ERP 6606739
  5. Abdullah — ERP 6606537
- Technology Stack: React.js, Vite, JavaScript, Node.js, Express.js, MongoDB, and Mongoose.
- Project Guide/Mentor: Aarshi Gupta
- Project Objective: To develop a centralized platform for managing college events, submitting event proposals, coordinating venues, and reducing scheduling conflicts.

2. Problem Statement

Managing college events involves coordination between student clubs, organizers, administrators, and venue managers. Manual scheduling can lead to overlapping events, venue conflicts, and inefficient communication.

The College Event Scheduling System provides a centralized web application where users can discover events, coordinators can submit event proposals, and administrators can review proposals and manage venue information. The system also includes scheduling analysis to help identify event conflicts.

3. Features

- Browse approved college events.
- Search and filter events by relevant criteria.
- Register and log in as a club coordinator.
- Submit event proposals with event details and timings.
- Request venues for events.
- Validate venue capacity and scheduling conflicts.
- Allow administrators to review and manage event proposals.
- Save or mark events of interest where supported.
- View venue information.
- Analyze scheduling conflicts and venue allocation.

4. Technology Stack

Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

Backend

- Node.js
- Express.js

Database

- MongoDB
- Mongoose

Authentication and Tools

- Passport Local Strategy
- bcrypt
- express-session
- npm
- Git and GitHub


## Stack
- **Frontend:** React 18, Vite, Lucide icons, responsive CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB local by default, Mongoose models and indexes
- **Authentication:** Passport Local Strategy, bcrypt password hashes, express-session stored in MongoDB
- **Scheduling / DSA:** interval overlap detection, conflict graph, min-heap interval partitioning, Welsh–Powell graph coloring, greedy best-fit venue allocation

## Deployment

See [`README-DEPLOYMENT.md`](./README-DEPLOYMENT.md) for the full Render + Vercel + MongoDB Atlas deployment guide. The frontend reads `VITE_API_URL` at build time; never deploy with the default localhost URL. Local development continues to use local MongoDB. A public deployment needs a reachable MongoDB Atlas URI because a cloud server cannot access your computer’s `localhost`.

## Requirements
- Node.js 20 LTS recommended
- npm
- MongoDB Community Server running locally

## Start locally
1. Start the MongoDB service. Default database URI: `mongodb://127.0.0.1:27017/ruverse_events`.
2. Copy `server/.env.example` to `server/.env`. Change `SESSION_SECRET` to a long random value.
3. From this project root, install dependencies:

   ```bash
   npm run install:all
   ```

4. Start API and frontend together:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`. API health check: `http://localhost:5000/api/health`.

The API seeds six example venues the first time it connects to an empty venue collection. It does not invent or seed events; coordinators can submit proposals after signing up.

## Authentication and administrator setup
- Sign-up creates a **coordinator** account and signs the user in.
- Passport serializes the user ID into a session; the session is stored in MongoDB (`sessions` collection).
- To grant admin access, create an account through the UI, then from `server/` run:

  ```bash
  npm run make-admin -- coordinator@example.com
  ```

  Sign out and sign in again so the session reflects the updated role. Do not expose this admin promotion command to public users in a deployed environment.

## Main features
- Event discovery with text search, category and date filters
- Club coordinator sign-up/sign-in and profile data
- Event proposal form with start/end validation and attendance validation
- Optional venue request; capacity and existing approved booking checks
- Admin review queue to approve/reject proposals; final approval checks venue/time conflicts again
- Interested / saved events
- Coordinator's own proposals
- Venue directory with capacities and venue type
- Scheduling analytics endpoint and DSA implementation

## Clubs included
**Fusion Tech Clubs:** Mechanical Club (MechNexus), Civil Club, ET+Ele Club, Mining Club, Management Club (R-Fusion), Commerce Club (R-Fincom), Law Club (R-LexHub), Biotechnology Club (R-BioVerse), Forensic Club, Education Club, UPSC Club, Film and Media Club (RUSH), Pharmacy Club, RuBI Club.

**IC-Tech Clubs:** GDG, Microsoft, AWS, GFG, GitHub, Cyber Security, HuggingFace, ICPC & CP Club.

Faculty contact details from the supplied screenshots are intentionally not copied into the public-facing app. Club/faculty names can be entered by the coordinator when registering.

## API overview
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API health |
| GET | `/api/auth/me` | Public | Current session user |
| POST | `/api/auth/signup` | Public | Create coordinator |
| POST | `/api/auth/login` | Public | Passport login |
| POST | `/api/auth/logout` | Signed in | End session |
| GET | `/api/events` | Public / signed in | Approved events (plus own proposals for coordinator) |
| GET | `/api/events/mine` | Signed in | Own proposals |
| GET | `/api/events/analytics` | Public | High-level approved event analytics |
| POST | `/api/events` | Signed in | Submit proposal |
| POST | `/api/events/:id/interest` | Signed in | Toggle interest |
| PATCH | `/api/events/:id/status` | Admin | Approve/reject/cancel |
| GET | `/api/events/scheduling/analysis` | Admin | DSA allocation analysis |
| GET | `/api/venues` | Public | Active venue list |
| POST/PATCH/DELETE | `/api/venues...` | Admin | Venue management |

## DSA used
- **Conflict rule:** `a.start < b.end && b.start < a.end`. Back-to-back events do not conflict.
- **Conflict graph:** events are vertices; overlapping intervals form edges.
- **Minimum rooms:** min-heap interval partitioning, `O(n log n)` after sorting.
- **Graph coloring:** Welsh–Powell heuristic, used to demonstrate conflict-free abstract room coloring.
- **Real venue allocation:** earliest-start ordering and best-fit capacity among non-conflicting active venues.

Capacity-constrained scheduling is not always solved optimally by a simple greedy algorithm. The application reports unscheduled events and reasons rather than claiming global optimality for every capacity-constrained case.

## Security / production notes
This is a student project starter intended for local demonstration. Before public deployment, set strong environment secrets, use HTTPS, add rate limiting and CSRF protection, configure secure cookies and a production CORS origin, add email verification/password reset, and review administrator provisioning. Passport sessions require the browser to send credentials; the included client does this.

## Troubleshooting
- **Cannot connect to API:** verify MongoDB is running and the API terminal says it is listening on port 5000.
- **Port conflict:** change `PORT` in `server/.env` and update `API` in `client/src/App.jsx`.
- **Login persists unexpectedly:** use Sign out; sessions are persisted in MongoDB for seven days.
- **Venue conflict:** an approved booking occupies a venue when `existing.start < requested.end` and `existing.end > requested.start`.

## Verification
Run `npm run build` at the project root to build the frontend. `npm run dev` starts both development processes. A successful build does not replace testing against a running local MongoDB instance; verify login, event submission, interest toggle, and admin approval in your environment before submission.

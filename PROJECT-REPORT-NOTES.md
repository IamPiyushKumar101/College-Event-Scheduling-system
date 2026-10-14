# Major Project Report Notes — RUVERSE College Event Scheduling System

## Abstract
RUVERSE is a MERN-based web application for centralizing college event discovery, club event proposals, and venue booking. It combines a React interface with an Express REST API, MongoDB persistence, Passport Local authentication, and scheduling algorithms to detect time overlaps and suggest conflict-free venue allocations.

## Problem
College clubs often coordinate events through separate messages and spreadsheets. This creates duplicated bookings, poor visibility of event dates/venues, and a lack of consistent review and approval.

## Objectives
1. Provide one searchable event listing and date/category filters.
2. Enable club coordinators to create accounts and submit event proposals.
3. Let administrators approve/reject proposals and manage active venues.
4. Validate time intervals and venue capacities; block approved venue conflicts.
5. Demonstrate DSA with interval partitioning, a conflict graph, Welsh–Powell coloring, and greedy best-fit venue assignment.

## Architecture
- React/Vite frontend communicates with Express through `/api` routes.
- Passport Local validates email/password; bcrypt stores password hashes.
- Express sessions are persisted to MongoDB via connect-mongo.
- Mongoose stores users, events, venues and interested-user references.
- Server-side route guards enforce authenticated coordinator and administrator access.

## DSA and complexity
- Conflict graph construction: pairwise comparison `O(n²)`.
- Interval partitioning: sort intervals and process a min-heap, `O(n log n)`.
- Welsh–Powell coloring: degree sorting plus neighbor-color checks; this implementation is approximately `O(n²)` for typical adjacency structures.
- Venue assignment: greedy chronological pass; each event tests eligible venues and their assigned intervals. Worst-case performance depends on event count, venue count and the number of assignments.

## Main data entities
**User:** name, email, password hash, role, club, faculty coordinator, phone.

**Venue:** name, building, capacity, type, amenities, active flag.

**Event:** title, description, category, club, coordinator, start/end, attendance, requested venue, status, booking note, interested users, priority.

## Important scheduling rule
Events conflict if `a.start < b.end && b.start < a.end`. Events where one ends exactly when the next begins may share a venue. An event proposal remains pending until an administrator approves it; the server checks the venue/time again at approval time.

## Testing checklist
- Sign-up rejects missing required fields and passwords under 8 characters.
- Login rejects incorrect credentials; logout destroys session.
- End time equal to or earlier than start time is rejected.
- Negative attendee counts are rejected.
- Venue capacity smaller than attendance is rejected.
- Approved overlapping bookings in the same venue cannot be approved.
- Back-to-back events do not conflict.
- Interested toggle can be switched on and off.
- Coordinators cannot approve events or edit other coordinators' proposals.
- Admin can approve/reject pending events.
- Empty event and venue lists render without crashing.

## Scope and limitations
This is an initial working project implementation. The greedy capacity-aware allocation is a heuristic, not a proof of global optimality. Multi-day recurrence, notifications, calendar export, and detailed audit logs are future enhancements. Administrator creation is a local CLI operation rather than public sign-up.

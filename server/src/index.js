
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import passport from './config/passport.js';

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import venueRoutes from './routes/venues.js';
import Venue from './models/Venue.js';

const app = express();
const PORT = process.env.PORT || 5000;

const uri =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/ruverse_events';

app.set('trust proxy', 1);

// Allow the deployed Vercel frontend and local development frontend.
const allowedOrigins = (
  process.env.CLIENT_ORIGIN ||
  'https://college-event-scheduling-system.vercel.app,http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header (e.g. health checks) are allowed.
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// CORS must be registered before API routes and session middleware.
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: '1mb' }));

app.use(
  session({
    name: 'ruverse.sid',
    secret:
      process.env.SESSION_SECRET ||
      'development-only-change-this-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      sameSite: process.env.COOKIE_SAME_SITE || 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'RUVERSE Event Scheduling API',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'A record with this value already exists.',
    });
  }

  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error',
  });
});

async function start() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.');

    const count = await Venue.countDocuments();

    if (!count) {
      await Venue.insertMany([
        {
          name: 'Main Auditorium',
          building: 'Central Block',
          capacity: 1200,
          type: 'Auditorium',
          amenities: ['Stage', 'Sound system', 'Projector'],
        },
        {
          name: 'Seminar Hall A',
          building: 'Academic Block',
          capacity: 180,
          type: 'Seminar Hall',
          amenities: ['Projector', 'Air conditioning'],
        },
        {
          name: 'Innovation Lab',
          building: 'Technology Block',
          capacity: 80,
          type: 'Lab',
          amenities: ['Wi-Fi', 'Workstations'],
        },
        {
          name: 'Open Air Theatre',
          building: 'Campus Grounds',
          capacity: 900,
          type: 'Open Air',
          amenities: ['Stage', 'Outdoor'],
        },
        {
          name: 'Conference Room 1',
          building: 'Admin Block',
          capacity: 35,
          type: 'Meeting Room',
          amenities: ['Display', 'Video conferencing'],
        },
        {
          name: 'Lecture Hall 204',
          building: 'Academic Block',
          capacity: 100,
          type: 'Lecture Hall',
          amenities: ['Projector', 'Whiteboard'],
        },
      ]);

      console.log('Default venues initialized.');
    }

    app.listen(PORT, () => {
      console.log(`RUVERSE API listening on port ${PORT}`);
      console.log('Allowed frontend origins:', allowedOrigins);
    });
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  }
}

start();

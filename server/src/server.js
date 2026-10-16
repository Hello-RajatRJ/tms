import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';
import projectRoutes from './routes/projectRoutes.js';
import teamMemberRoutes from './routes/teamMemberRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Universal CORS Configuration - Allows all origins, methods, and headers
const corsOptions = {
  origin: (origin, callback) => {
    // Dynamically reflect origin to support any client origin with credentials
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Request-Time',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Explicit manual preflight fallback & CORS header enforcement
app.use((req, res, next) => {
  const reqOrigin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', reqOrigin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Request-Time, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 TMS (Task Management System) API Server is Running',
    cors: 'Allowed for all origins (*)',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
      },
      projects: '/api/projects',
      teamMembers: '/api/team-members',
    },
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'TMS API Root',
    cors: 'Allowed for all origins (*)',
    endpoints: {
      health: '/api/health',
      login: 'POST /api/auth/login',
      projects: '/api/projects',
      teamMembers: '/api/team-members',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Friendly GET helper for login endpoint if visited via browser URL bar
app.get('/api/auth/login', (req, res) => {
  res.status(200).json({
    message: 'TMS Auth Login Endpoint: Please send a POST request with JSON payload { email, password }.',
    example: {
      method: 'POST',
      url: '/api/auth/login',
      body: { email: 'admin@tms.io', password: 'YourPassword123' },
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/team-members', teamMemberRoutes);

// Manual Seed Endpoint (useful for testing)
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.status(200).json({ success: true, message: 'Database seeded successfully' });
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 TMS Backend Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📋 Projects API: http://localhost:${PORT}/api/projects`);
      console.log(`👥 Team API:     http://localhost:${PORT}/api/team-members`);
      console.log(`=========================================`);
    });
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
};

startServer();

export default app;

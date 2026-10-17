import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { seedDatabase } from './services/seedService';
import projectRoutes from './routes/projectRoutes';
import teamMemberRoutes from './routes/teamMemberRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions: CorsOptions = {
  origin: (_origin, callback) => {
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

app.use((req: Request, res: Response, next: NextFunction) => {
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

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'TMS API Server',
    status: 'online',
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

app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'TMS API Root',
    endpoints: {
      health: '/api/health',
      login: 'POST /api/auth/login',
      projects: '/api/projects',
      teamMembers: '/api/team-members',
    },
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/auth/login', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Send a POST request with { email, password }.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/team-members', teamMemberRoutes);

app.post('/api/seed', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const force = req.query.force === 'true' || req.body?.force === true;
    await seedDatabase(force);
    res.status(200).json({ success: true, message: 'Database seeded successfully', force });
  } catch (err) {
    next(err);
  }
});

let dbPromise: Promise<void> | null = null;

const ensureDB = async () => {
  if (!dbPromise) {
    dbPromise = (async () => {
      await connectDB();
      await seedDatabase();
    })();
  }
  return dbPromise;
};

app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Initializes database and starts HTTP server listener when running in standalone mode.
 */
const startServer = async () => {
  try {
    await ensureDB();
    app.listen(PORT);
  } catch {
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;

import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global._mongooseCache || { conn: null, promise: null };
if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

let memoryServer: any = null;

/**
 * Establishes database connection with global caching for serverless environments (Vercel)
 * and automatic in-memory fallback for local development.
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  // If connection is already established and ready
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  // If a connection is already being negotiated, reuse the existing promise
  if (cached.promise) {
    const conn = await cached.promise;
    if (conn) return conn;
  }

  const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URI)?.trim();
  const isVercel = Boolean(process.env.VERCEL);

  if (mongoUri) {
    cached.promise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        dbName: 'tms',
      })
      .then((m) => {
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        if (isVercel) {
          throw new Error(
            `MongoDB Atlas connection failed (${err.message}). Please check: 1) MongoDB Atlas -> 'Network Access' -> Add IP Address: 0.0.0.0/0 (Allow from Anywhere). 2) MONGO_URI username, password, and database are correct in Vercel Environment Variables.`
          );
        }
        console.warn('Remote MongoDB Atlas unreachable, switching to in-memory DB:', err.message);
        return null;
      });

    const result = await cached.promise;
    if (result) {
      return result;
    }
  }

  // On Vercel, in-memory MongoDB cannot run inside serverless functions
  if (isVercel) {
    cached.promise = null;
    throw new Error(
      'Missing MONGO_URI environment variable on Vercel. Please add MONGO_URI to your Vercel Project Settings (Settings -> Environment Variables) and ensure MongoDB Atlas allows 0.0.0.0/0.'
    );
  }

  // Local development fallback to in-memory MongoDB
  cached.promise = (async () => {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    if (!memoryServer) {
      memoryServer = await MongoMemoryServer.create();
    }
    const inMemoryUri = memoryServer.getUri();
    const m = await mongoose.connect(inMemoryUri, { dbName: 'tms' });
    cached.conn = m;
    return m;
  })();

  const localConn = await cached.promise;
  if (!localConn) {
    throw new Error('Failed to start in-memory database instance.');
  }
  return localConn;
};

/**
 * Closes active MongoDB connections and stops any in-memory server instances.
 */
export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

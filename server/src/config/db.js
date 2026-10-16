import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        dbName: 'tms',
      });
      console.log(`[Database] Successfully connected to MongoDB host: ${conn.connection.host} (Database: ${conn.connection.name})`);
      return conn;
    } catch (err) {
      console.error(`[Database] Failed to connect to specified MONGO_URI: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
      console.log('[Database] Falling back to In-Memory MongoDB for local development and testing...');
    }
  } else {
    console.log('[Database] No MONGO_URI specified in .env. Initializing In-Memory MongoDB for development...');
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const inMemoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(inMemoryUri);
    console.log(`[Database] Connected to In-Memory MongoDB at ${inMemoryUri}`);
    console.log('[Database] Ready for local CRUD testing. (To connect to MongoDB Atlas, add your MONGO_URI in server/.env)');
    return conn;
  } catch (memErr) {
    console.error('[Database] Failed to start In-Memory MongoDB:', memErr.message);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

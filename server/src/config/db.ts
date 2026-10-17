import mongoose from 'mongoose';

let memoryServer: any = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (mongoUri) {
    try {
      console.log('[Database] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000,
        dbName: 'tms',
      });
      console.log(
        `[Database] ✅ Successfully connected to MongoDB Atlas host: ${conn.connection.host} (Database: ${conn.connection.name})`
      );
      return conn;
    } catch (err: any) {
      console.warn('================================================================');
      console.warn('⚠️ [Database] MongoDB Atlas Connection Error (IP / SSL Alert 80)');
      console.warn(`Reason: ${err.message}`);
      console.warn('----------------------------------------------------------------');
      console.warn('📌 TO CONNECT TO YOUR ATLAS CLUSTER:');
      console.warn('1. Log in to https://cloud.mongodb.com');
      console.warn('2. Click "Network Access" in the left sidebar.');
      console.warn('3. Click "Add IP Address" -> Select "Allow Access From Anywhere" (0.0.0.0/0).');
      console.warn('4. Confirm changes (takes ~30 seconds to apply on Atlas).');
      console.warn('----------------------------------------------------------------');
      console.warn('🚀 Falling back to In-Memory MongoDB so your app and login work right now!');
      console.warn('================================================================');
    }
  } else {
    console.log('[Database] No MONGO_URI specified in .env. Initializing In-Memory MongoDB...');
  }

  // Graceful fallback to fast In-Memory MongoDB
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const inMemoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(inMemoryUri, {
      dbName: 'tms',
    });
    console.log(`[Database] ✅ Connected to In-Memory MongoDB at ${inMemoryUri}`);
    return conn;
  } catch (memErr: any) {
    console.error('[Database] ❌ Failed to start In-Memory MongoDB fallback:', memErr.message);
    throw memErr;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

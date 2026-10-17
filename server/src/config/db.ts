import mongoose from 'mongoose';

let memoryServer: any = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (mongoUri) {
    try {
      return await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000,
        dbName: 'tms',
      });
    } catch {}
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const inMemoryUri = memoryServer.getUri();
  return mongoose.connect(inMemoryUri, {
    dbName: 'tms',
  });
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

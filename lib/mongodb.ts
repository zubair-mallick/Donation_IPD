import mongoose from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

/* Cached connection to prevent multiple connections */
let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;

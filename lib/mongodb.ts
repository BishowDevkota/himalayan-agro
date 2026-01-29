import mongoose from "mongoose";

declare global {
  // allow global `mongoose` var across hot-reloads in dev
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const globalAny: any = global;
globalAny._mongoose = globalAny._mongoose || { conn: null, promise: null };
const cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = globalAny._mongoose;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      // recommended options
      bufferCommands: false,
    } as mongoose.ConnectOptions;
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
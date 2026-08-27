import mongoose from 'mongoose';
import { env } from './environment.js';

export async function connectDatabase() {
  if (!env.mongoUri) throw new Error('MONGODB_URI is not configured');
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}

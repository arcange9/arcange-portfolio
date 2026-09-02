import 'dotenv/config';

const required = ['MONGODB_URI', 'SESSION_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'ADMIN_EMAIL', 'API_URL'];

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  webUrl: process.env.WEB_URL || 'http://localhost:5173',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
  uploadDir: process.env.UPLOAD_DIR || 'public/uploads'
};

export function validateEnvironment() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env, validateEnvironment } from './config/environment.js';
import { configurePassport } from './config/passport.js';

validateEnvironment();
configurePassport();
await connectDatabase();

createApp().listen(env.port, () => console.log(`API running on port ${env.port}`));

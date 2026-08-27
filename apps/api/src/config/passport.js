import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { env } from './environment.js';

export function configurePassport() {
  passport.use(new GoogleStrategy({
    clientID: env.googleClientId,
    clientSecret: env.googleClientSecret,
    callbackURL: `${env.webUrl.replace(/\/$/, '')}/api/auth/google/callback`,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.trim().toLowerCase();
      if (!email || email !== env.adminEmail) return done(null, false, { message: 'Unauthorized admin account' });
      const user = await User.findOneAndUpdate(
        { email },
        { googleId: profile.id, name: profile.displayName, photo: profile.photos?.[0]?.value, lastLogin: new Date(), role: 'SUPER_ADMIN', isActive: true },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (!user.isActive) return done(null, false, { message: 'Account disabled' });
      return done(null, user);
    } catch (error) { return done(error); }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try { done(null, await User.findById(id)); } catch (error) { done(error); }
  });
}

export default passport;

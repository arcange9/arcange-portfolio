import { Router } from 'express';
import passport from '../config/passport.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { env } from '../config/environment.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: `${env.adminUrl.replace(/\/$/, '')}/?error=unauthorized`
}), (_req, res) => res.redirect(env.adminUrl));
router.get('/me', requireAuth, (req, res) => res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, photo: req.user.photo, role: req.user.role } }));
router.post('/logout', (req, res, next) => req.logout((error) => { if (error) return next(error); req.session.destroy(() => res.status(204).end()); }));

export default router;

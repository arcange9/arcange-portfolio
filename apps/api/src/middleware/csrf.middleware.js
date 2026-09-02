import crypto from 'node:crypto';

const COOKIE = 'arcange_csrf';
const HEADER = 'x-csrf-token';

export function csrfToken(req, res) {
  if (!req.cookies?.[COOKIE]) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie(COOKIE, token, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'none', maxAge: 1000 * 60 * 60 * 8 });
    return res.json({ csrfToken: token });
  }
  return res.json({ csrfToken: req.cookies[COOKIE] });
}

export function requireCsrf(req, res, next) {
  if (!['POST','PATCH','PUT','DELETE'].includes(req.method)) return next();
  const cookie = req.cookies?.[COOKIE];
  const header = req.get(HEADER);
  if (!cookie || !header || cookie.length !== header.length || !crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(header))) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
}

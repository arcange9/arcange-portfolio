export function requireAuth(req, res, next) {
  if (req.isAuthenticated?.() && req.user?.isActive) return next();
  return res.status(401).json({ error: 'Authentication required' });
}

export function requireAdmin(req, res, next) {
  if (req.isAuthenticated?.() && req.user?.isActive && ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) return next();
  return res.status(403).json({ error: 'Admin access required' });
}

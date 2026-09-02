import { Router } from 'express';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();
router.use(requireAdmin);
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json(logs);
  } catch (e) { next(e); }
});
export default router;

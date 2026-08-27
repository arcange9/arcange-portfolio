import { Router } from 'express';
import PortfolioItem from '../models/PortfolioItem.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();
router.use(requireAdmin);

router.get('/items', async (req, res, next) => {
  try { res.json(await PortfolioItem.find().sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});

router.post('/items', async (req, res, next) => {
  try { res.status(201).json(await PortfolioItem.create(req.body)); }
  catch (error) { next(error); }
});

router.patch('/items/:id', async (req, res, next) => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) { next(error); }
});

router.delete('/items/:id', async (req, res, next) => {
  try {
    const item = await PortfolioItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;

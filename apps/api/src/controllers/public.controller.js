import PortfolioItem from '../models/PortfolioItem.js';

export async function getPublishedPortfolio(req, res, next) {
  try {
    const items = await PortfolioItem.find({ published: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { next(error); }
}

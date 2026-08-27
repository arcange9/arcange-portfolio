import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  kind: { type: String, enum: ['project','skill','education','experience','achievement','certificate','social','media','cv'], required: true },
  title: { type: String, required: true, trim: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PortfolioItem', portfolioItemSchema);

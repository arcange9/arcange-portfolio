import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  technologies: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  category: { type: String, default: '' },
  status: { type: String, default: 'completed' },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);

import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, default: '' },
  shortBio: { type: String, default: '' },
  longBio: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  resumeUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);

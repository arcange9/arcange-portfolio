import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Mukamyi Izere Arcange' },
  tagline: { type: String, default: '' },
  copyrightText: { type: String, default: 'All rights reserved.' },
  copyrightStartYear: { type: Number, default: new Date().getFullYear() },
  autoUpdateCopyrightYear: { type: Boolean, default: true },
  accent: { type: String, default: 'cyan-pink' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);

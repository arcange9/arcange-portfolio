import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Mukamyi Izere Arcange' },
  tagline: { type: String, default: '' },
  copyrightText: { type: String, default: 'All rights reserved.' },
  copyrightStartYear: { type: Number, default: new Date().getFullYear() },
  autoUpdateCopyrightYear: { type: Boolean, default: true },
  accent: { type: String, default: 'cyan-pink' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  colors: {
    primary: { type: String, default: '#8b5cf6' },
    secondary: { type: String, default: '#ff4ecd' },
    accent: { type: String, default: '#42e8ff' },
    background: { type: String, default: '#070711' },
    surface: { type: String, default: '#111120' },
    text: { type: String, default: '#f7f7fb' },
    muted: { type: String, default: '#aaaabd' }
  }
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);

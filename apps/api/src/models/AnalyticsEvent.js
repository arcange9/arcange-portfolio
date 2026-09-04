import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['page_view','project_view','project_click','contact_click','cv_download'], required: true },
  path: { type: String, trim: true, maxlength: 300, default: '' },
  target: { type: String, trim: true, maxlength: 200, default: '' },
  referrer: { type: String, trim: true, maxlength: 500, default: '' },
  userAgent: { type: String, trim: true, maxlength: 500, default: '' },
  createdAt: { type: Date, default: Date.now, index: true }
}, { versionKey: false });

analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ target: 1, createdAt: -1 });

export default mongoose.model('AnalyticsEvent', analyticsEventSchema);

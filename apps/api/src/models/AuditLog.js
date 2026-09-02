import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, enum: ['CREATE','UPDATE','DELETE','UPLOAD','LOGIN','LOGOUT','SETTINGS_CHANGE'] },
  resource: { type: String, required: true, trim: true, maxlength: 80 },
  resourceId: { type: String, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, maxlength: 300 },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  ip: { type: String, maxlength: 64 },
  userAgent: { type: String, maxlength: 500 },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true, versionKey: false });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actorEmail: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);

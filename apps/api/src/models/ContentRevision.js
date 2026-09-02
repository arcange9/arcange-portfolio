import mongoose from 'mongoose';

const contentRevisionSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true, maxlength: 50 },
  resourceId: { type: String, required: true, trim: true, maxlength: 80 },
  operation: { type: String, enum: ['UPDATE', 'DELETE'], required: true },
  snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 }
}, { timestamps: true, versionKey: false });

contentRevisionSchema.index({ type: 1, resourceId: 1, createdAt: -1 });
contentRevisionSchema.index({ operation: 1, createdAt: -1 });

export default mongoose.model('ContentRevision', contentRevisionSchema);

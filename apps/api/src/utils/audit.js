import AuditLog from '../models/AuditLog.js';

export async function audit(req, action, resource, description, resourceId = undefined, metadata = undefined) {
  try {
    await AuditLog.create({ action, resource, resourceId: resourceId ? String(resourceId) : undefined, description, actorId: req.user?._id, actorEmail: req.user?.email || 'unknown', ip: req.ip, userAgent: req.get('user-agent')?.slice(0, 500), metadata });
  } catch (error) { console.error('Audit log failed:', error.message); }
}

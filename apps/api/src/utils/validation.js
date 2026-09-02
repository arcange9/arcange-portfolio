const URL_FIELDS = new Set(['photoUrl','resumeUrl','imageUrl','githubUrl','liveUrl','url','link','credentialUrl']);
const MAX_STRING = 5000;

export function validateContentPayload(type, payload = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw Object.assign(new Error('Invalid request body'), { status: 400 });
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string' && value.length > MAX_STRING) throw Object.assign(new Error(`${key} is too long`), { status: 400 });
    if (URL_FIELDS.has(key) && value) validateSafeUrl(value, key);
    if (['published','featured','enabled','active'].includes(key) && value !== undefined && typeof value !== 'boolean') throw Object.assign(new Error(`${key} must be boolean`), { status: 400 });
    if (['level','sortOrder','startYear','endYear','year','size'].includes(key) && value !== undefined && (!Number.isInteger(Number(value)) || Number(value) < 0)) throw Object.assign(new Error(`${key} must be a valid non-negative integer`), { status: 400 });
  }
  if (type === 'skills' && payload.level !== undefined && Number(payload.level) > 100) throw Object.assign(new Error('Skill level must be 0-100'), { status: 400 });
  return payload;
}

export function validateSafeUrl(value, field = 'URL') {
  let url;
  try { url = new URL(String(value)); } catch { throw Object.assign(new Error(`${field} must be a valid URL`), { status: 400 }); }
  if (!['https:','http:'].includes(url.protocol)) throw Object.assign(new Error(`${field} must use HTTP or HTTPS`), { status: 400 });
  if (url.username || url.password) throw Object.assign(new Error(`${field} cannot contain credentials`), { status: 400 });
  return true;
}

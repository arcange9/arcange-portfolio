import crypto from 'node:crypto';
import { env } from '../config/environment.js';

const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

function requireStorageConfig() {
  if (!env.supabaseUrl || !env.supabaseSecretKey || !env.supabaseBucket) {
    throw Object.assign(new Error('Supabase Storage is not configured'), { status: 503 });
  }
}

function encodeStoragePath(value) {
  return String(value).split('/').map(encodeURIComponent).join('/');
}

function objectUrl(pathname) {
  return `${env.supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${encodeURIComponent(env.supabaseBucket)}/${encodeStoragePath(pathname)}`;
}

export function isManagedStorageUrl(value) {
  if (!value || !env.supabaseUrl || !env.supabaseBucket) return false;
  try {
    const url = new URL(value);
    return url.origin === new URL(env.supabaseUrl).origin &&
      url.pathname.startsWith(`/storage/v1/object/public/${env.supabaseBucket}/`);
  } catch {
    return false;
  }
}

export function getManagedStoragePath(value) {
  if (!isManagedStorageUrl(value)) return null;
  try {
    const url = new URL(value);
    const prefix = `/storage/v1/object/public/${env.supabaseBucket}/`;
    if (!url.pathname.startsWith(prefix)) return null;
    const pathname = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!pathname || pathname.includes('..') || pathname.startsWith('/')) return null;
    return pathname;
  } catch {
    return null;
  }
}

export async function uploadImage(buffer, mimeType, folder = 'images') {
  requireStorageConfig();
  const extension = IMAGE_EXTENSIONS[mimeType];
  if (!extension) throw Object.assign(new Error('Unsupported image MIME type'), { status: 415 });

  const filename = `${crypto.randomBytes(18).toString('hex')}.${extension}`;
  const storagePath = `${folder}/${filename}`;
  const endpoint = `${env.supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(env.supabaseBucket)}/${encodeStoragePath(storagePath)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey}`,
      apikey: env.supabaseSecretKey,
      'Content-Type': mimeType,
      'Cache-Control': '31536000',
      'x-upsert': 'false'
    },
    body: buffer
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw Object.assign(new Error(`Supabase upload failed${detail ? `: ${detail.slice(0, 240)}` : ''}`), { status: response.status >= 400 && response.status < 500 ? response.status : 502 });
  }

  return { filename, path: storagePath, url: objectUrl(storagePath) };
}

export async function deleteStorageObject(value) {
  requireStorageConfig();
  const storagePath = getManagedStoragePath(value);
  if (!storagePath) return false;

  const endpoint = `${env.supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(env.supabaseBucket)}/${encodeStoragePath(storagePath)}`;
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey}`,
      apikey: env.supabaseSecretKey
    }
  });

  if (response.ok || response.status === 404) return true;
  const detail = await response.text().catch(() => '');
  throw Object.assign(new Error(`Supabase delete failed${detail ? `: ${detail.slice(0, 240)}` : ''}`), { status: response.status >= 400 && response.status < 500 ? response.status : 502 });
}

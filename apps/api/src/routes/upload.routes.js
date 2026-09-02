import { Router } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/environment.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  png: { mime: 'image/png', ext: 'png' },
  webp: { mime: 'image/webp', ext: 'webp' },
  gif: { mime: 'image/gif', ext: 'gif' }
};

function detectImage(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return ALLOWED.png;
  if (buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([255,216,255]))) return ALLOWED.jpeg;
  if (buffer.length >= 6 && (buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a')) return ALLOWED.gif;
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return ALLOWED.webp;
  return null;
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!match) return reject(Object.assign(new Error('Invalid multipart request'), { status: 400 }));
    const boundary = Buffer.from(`--${match[1] || match[2]}`);
    const chunks = [];
    let total = 0;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BYTES + 1024 * 1024) {
        req.destroy();
        return reject(Object.assign(new Error('File is too large'), { status: 413 }));
      }
      chunks.push(chunk);
    });
    req.on('error', reject);
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks);
        const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd < 0) throw Object.assign(new Error('Invalid upload payload'), { status: 400 });
        const firstBoundary = body.indexOf(boundary);
        if (firstBoundary < 0 || firstBoundary > headerEnd) throw Object.assign(new Error('Invalid multipart boundary'), { status: 400 });
        const headers = body.subarray(firstBoundary + boundary.length + 2, headerEnd).toString('utf8');
        const filenameMatch = headers.match(/filename="([^"]*)"/i);
        if (!filenameMatch || !filenameMatch[1]) throw Object.assign(new Error('No image file supplied'), { status: 400 });
        const dataStart = headerEnd + 4;
        const dataEnd = body.indexOf(Buffer.from('\r\n'), dataStart);
        const nextBoundary = body.indexOf(boundary, dataEnd + 2);
        if (nextBoundary < 0) throw Object.assign(new Error('Invalid multipart file data'), { status: 400 });
        const file = body.subarray(dataStart, dataEnd > dataStart ? dataEnd : nextBoundary);
        resolve({ originalName: filenameMatch[1], buffer: file });
      } catch (error) { reject(error); }
    });
  });
}

router.post('/image', requireAdmin, async (req, res, next) => {
  try {
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('multipart/form-data')) {
      return res.status(415).json({ error: 'Use multipart/form-data for image uploads' });
    }
    const { originalName, buffer } = await parseMultipart(req);
    if (!buffer.length || buffer.length > MAX_BYTES) return res.status(413).json({ error: 'Image must be between 1 byte and 5 MB' });
    const detected = detectImage(buffer);
    if (!detected) return res.status(415).json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed' });

    fs.mkdirSync(env.uploadDir, { recursive: true });
    const filename = `${crypto.randomBytes(18).toString('hex')}.${detected.ext}`;
    const destination = path.join(env.uploadDir, filename);
    fs.writeFileSync(destination, buffer, { flag: 'wx', mode: 0o600 });
    const url = `${env.apiUrl}/uploads/${filename}`;
    res.status(201).json({ url, filename, mimeType: detected.mime, size: buffer.length, originalName });
  } catch (error) { next(error); }
});

export default router;

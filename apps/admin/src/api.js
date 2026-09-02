const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { message = (await response.json()).error || message; } catch {}
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

export const contentApi = {
  list: (type) => request(`/api/content/${type}`),
  create: (type, body) => request(`/api/content/${type}`, { method: 'POST', body: JSON.stringify(body) }),
  update: (type, id, body) => request(`/api/content/${type}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (type, id) => request(`/api/content/${type}/${id}`, { method: 'DELETE' })
};

export const siteApi = {
  get: async () => {
    const rows = await contentApi.list('settings');
    return rows[0] || null;
  },
  save: (id, body) => id
    ? contentApi.update('settings', id, body)
    : contentApi.create('settings', body)
};

export { API, request };

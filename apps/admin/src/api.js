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

export const portfolioApi = {
  list: () => request('/api/admin/items'),
  create: (body) => request('/api/admin/items', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/admin/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id) => request(`/api/admin/items/${id}`, { method: 'DELETE' })
};

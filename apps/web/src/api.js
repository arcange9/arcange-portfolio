const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getPortfolio() {
  const response = await fetch(`${API_URL}/api/content/public`);
  if (!response.ok) throw new Error('Unable to load portfolio content');
  return response.json();
}

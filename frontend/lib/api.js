const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiBase = API_BASE;

export const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const origin = API_BASE.replace(/\/api$/, '');
  return `${origin}${path}`;
};

export const parseMaybeJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    token,
    isFormData = false,
    cache = 'no-store'
  } = options;

  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('mda_token') : null);
  const nextHeaders = { ...headers };

  if (authToken) nextHeaders.Authorization = `Bearer ${authToken}`;
  if (!isFormData) nextHeaders['Content-Type'] = nextHeaders['Content-Type'] || 'application/json';

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: nextHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    cache
  });

  const text = await response.text();
  const payload = text ? parseMaybeJson(text) : null;

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
}

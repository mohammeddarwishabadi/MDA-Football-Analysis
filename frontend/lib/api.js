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

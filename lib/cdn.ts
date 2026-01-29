const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || '';
const CDN_ENABLED = process.env.NEXT_PUBLIC_CDN_ENABLED === 'true';

const CDN_ORIGINS = [
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'static.orulo.com.br',
  'images.pexels.com',
  'images.unsplash.com',
  'a0.muscache.com',
  'www.gstatic.com',
  's3.amazonaws.com',
  'api.smtximob.com.br',
  'smtximob.com.br',
  'lh3.googleusercontent.com',
  'dwvimagesv1.b-cdn.net',
  'www.youtube.com',
  'i.ytimg.com',
];

export function getCdnUrl(url: string | undefined | null): string {
  if (!url || !CDN_ENABLED || !CDN_BASE_URL) {
    return url || '';
  }

  try {
    const parsed = new URL(url);
    if (!CDN_ORIGINS.some((origin) => parsed.hostname.includes(origin))) {
      return url;
    }
    return `${CDN_BASE_URL}/?url=${url}`;
  } catch {
    return url;
  }
}

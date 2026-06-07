const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.smtximob.com';
const CDN_ENABLED = process.env.NEXT_PUBLIC_CDN_ENABLED === 'true';

const R2_BUCKET = 'smartimob-dev-test.appspot.com';

function firebaseKey(parsed: URL): string | null {
  if (parsed.hostname === 'firebasestorage.googleapis.com') {
    const m = parsed.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
    if (m && decodeURIComponent(m[1]) === R2_BUCKET) return decodeURIComponent(m[2]);
    return null;
  }
  if (parsed.hostname === 'storage.googleapis.com') {
    const prefix = `/${R2_BUCKET}/`;
    if (parsed.pathname.startsWith(prefix)) {
      return decodeURIComponent(parsed.pathname.slice(prefix.length));
    }
    return null;
  }
  return null;
}

export function applyCdn(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (!CDN_ENABLED || !CDN_BASE_URL) return url;

  try {
    const parsed = new URL(url);
    const key = firebaseKey(parsed);
    if (!key) return url;
    const encodedKey = key.split('/').map(encodeURIComponent).join('/');
    return `${CDN_BASE_URL}/${encodedKey}?`;
  } catch {
    return url;
  }
}

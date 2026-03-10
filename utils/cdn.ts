// CDN URL para cache de imagens
const CDN_URL = "https://smtx-image-cdn.raphael-martinez.workers.dev"

/**
 * Aplica CDN na URL da imagem do Firebase Storage
 * @param url URL original da imagem
 * @returns URL com CDN aplicada ou URL original se não for Firebase
 */
export function applyCdn(url: string | null | undefined): string | undefined {
  if (!url) return undefined

  // Só aplicar CDN em URLs do Firebase Storage
  if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
    return `${CDN_URL}/?url=${url}`
  }

  return url
}

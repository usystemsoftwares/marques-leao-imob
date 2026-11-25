/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Fotos vêm do CDN/Firebase em tamanho original (até ~4 MB). O otimizador
    // entrega cada uma no tamanho da tela, em WebP. As URLs têm UUID e não mudam.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        // Vídeo e poster da hero: cacheáveis pelo CDN do balanceador
        source: '/marqueseleao/:file*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;

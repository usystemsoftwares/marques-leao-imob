import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Headers de segurança
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Forçar HTTPS em produção
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http') {
      return NextResponse.redirect(
        `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`,
        301
      );
    }
    
    // HSTS - HTTP Strict Transport Security
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Content Security Policy para prevenir XSS
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://*.googletagmanager.com https://maps.googleapis.com https://connect.facebook.net https://www.clarity.ms",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://*.google.com.br https://googleads.g.doubleclick.net https://www.googleadservices.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://smtximob.com https://api.smtximob.com https://api.smtximob.com.br https://www.google-analytics.com https://analytics.google.com https://www.google.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://stats.g.doubleclick.net https://*.google.com.br https://servidor.marqueseleao.com",
    "frame-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com",
    "media-src 'self' https://firebasestorage.googleapis.com https://storage.googleapis.com data: blob:",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );
  
  // Cache control para assets estáticos
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // Cache control para imagens
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=43200'
    );
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
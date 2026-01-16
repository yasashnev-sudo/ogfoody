import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // ✅ Отключаем запрос разрешения на поиск устройств в локальной сети
  // Это предотвращает появление модалки "ogfoody.ru запрашивает разрешение на поиск устройств"
  response.headers.set(
    'Permissions-Policy',
    'local-network-access=(), bluetooth=(), usb=(), serial=(), camera=(), microphone=(), geolocation=()'
  )

  return response
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
}

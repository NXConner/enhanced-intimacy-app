import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const start = Date.now()
  // Lightweight request logging to stdout
  const { pathname, search } = req.nextUrl
  const method = req.method
  const ua = req.headers.get('user-agent') || ''
  // Defer logging until response is sent is not trivial in middleware; log ingress only
  console.log(`[REQ] ${method} ${pathname}${search || ''} ua="${ua.slice(0, 60)}" t=${start}`)
}

export const config = {
  matcher: ['/api/:path*']
}


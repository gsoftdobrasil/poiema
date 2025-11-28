// Middleware desabilitado para static export
// Será usado apenas em desenvolvimento (npm run dev)
// Para produção estática, a autenticação é gerenciada pelo cliente

import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  // Apenas em desenvolvimento (não funciona com output: 'export')
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_OUTPUT === 'export') {
    return
  }

  // Ignorar requisições para arquivos estáticos e API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return
  }

  // update user's auth session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}


import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, {
                ...options,
                // Garantir que cookies funcionem em produção
                sameSite: options?.sameSite || 'lax',
                secure: options?.secure ?? process.env.NODE_ENV === 'production',
                path: options?.path || '/',
              })
            )
          },
        },
      }
    );

    // Refreshing the auth token - com tratamento de erro
    try {
      await supabase.auth.getUser()
    } catch (error) {
      // Log do erro mas não quebra o fluxo
      console.error('Error refreshing auth token in middleware:', error)
    }
  } catch (error) {
    // Se houver erro crítico, ainda retorna a resposta
    console.error('Error in updateSession:', error)
  }

  return supabaseResponse
}


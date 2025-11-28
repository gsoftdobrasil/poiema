"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const loadingRef = useRef(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    // Verificar usuário atual com timeout
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (mounted) {
          if (error) {
            console.error('Auth error:', error)
            // Se houver erro, definir como não autenticado
            setUser(null)
          } else {
            setUser(user)
          }
          loadingRef.current = false
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        if (mounted) {
          setUser(null)
          loadingRef.current = false
          setLoading(false)
        }
      }
    }
    
    // Timeout de segurança para evitar loop infinito
    timeoutId = setTimeout(() => {
      if (mounted && loadingRef.current) {
        console.warn('Auth check timeout, setting loading to false')
        loadingRef.current = false
        setLoading(false)
      }
    }, 5000) // 5 segundos de timeout
    
    checkUser()

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        loadingRef.current = false
        setLoading(false)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

      }
    })

    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


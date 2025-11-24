"use client"

import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Só redirecionar se realmente não houver usuário após carregar
    // Aumentar delay para evitar loops
    if (!loading && !user) {
      const timer = setTimeout(() => {
        if (!user) {
          window.location.href = "/login"
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  )
}




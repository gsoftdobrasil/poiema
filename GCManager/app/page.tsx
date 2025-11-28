"use client"

import { AppLayout } from "@/components/app-layout"
import { Dashboard } from "@/components/dashboard"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Só redirecionar se realmente não houver usuário após carregar
    // Evitar loops com verificação mais rigorosa
    if (!loading && !user) {
      // Usar replace em vez de href para evitar histórico
      router.replace("/login")
    }
  }, [user, loading, router])

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
    <AppLayout>
      <Dashboard />
    </AppLayout>
  )
}




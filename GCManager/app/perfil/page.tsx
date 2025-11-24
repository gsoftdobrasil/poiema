"use client"

import { Sidebar } from "@/components/sidebar"
import { Perfil } from "@/components/perfil"

export default function PerfilPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Perfil />
      </main>
    </div>
  )
}





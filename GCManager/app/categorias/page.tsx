"use client"

import { Sidebar } from "@/components/sidebar"
import { CategoriasList } from "@/components/categorias-list"

export default function CategoriasPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <CategoriasList />
      </main>
    </div>
  )
}






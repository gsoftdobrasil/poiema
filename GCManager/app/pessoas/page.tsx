"use client"

import { Sidebar } from "@/components/sidebar"
import { PessoasList } from "@/components/pessoas-list"

export default function PessoasPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <PessoasList />
      </main>
    </div>
  )
}





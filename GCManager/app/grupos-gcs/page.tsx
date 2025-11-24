"use client"

import { Sidebar } from "@/components/sidebar"
import { GruposGcsList } from "@/components/grupos-gcs-list"

export default function GruposGcsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <GruposGcsList />
      </main>
    </div>
  )
}





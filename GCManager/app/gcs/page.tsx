"use client"

import { Sidebar } from "@/components/sidebar"
import { GcsList } from "@/components/gcs-list"

export default function GcsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <GcsList />
      </main>
    </div>
  )
}





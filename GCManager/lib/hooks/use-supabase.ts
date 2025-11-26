"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Category, GroupGc, Gc, Person, Profile } from "@/lib/types/database"

export function useSupabase() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    // Verificar usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { supabase, user, loading }
}

export function useCategories() {
  const { supabase, user } = useSupabase()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadCategories()
  }, [user])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("descricao")

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, refetch: loadCategories }
}

export function useGroupGcs() {
  const { supabase, user } = useSupabase()
  const [groupGcs, setGroupGcs] = useState<GroupGc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadGroupGcs()
  }, [user])

  const loadGroupGcs = async () => {
    try {
      const { data, error } = await supabase
        .from("group_gcs")
        .select("*")
        .order("nome_grupo")

      if (error) throw error
      setGroupGcs(data || [])
    } catch (error) {
      console.error("Error loading group_gcs:", error)
    } finally {
      setLoading(false)
    }
  }

  return { groupGcs, loading, refetch: loadGroupGcs }
}

export function useGcs() {
  const { supabase, user } = useSupabase()
  const [gcs, setGcs] = useState<Gc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadGcs()
  }, [user])

  const loadGcs = async () => {
    try {
      const { data, error } = await supabase
        .from("gcs")
        .select("*")
        .order("descricao")

      if (error) throw error
      setGcs(data || [])
    } catch (error) {
      console.error("Error loading gcs:", error)
    } finally {
      setLoading(false)
    }
  }

  return { gcs, loading, refetch: loadGcs }
}

export function usePeople() {
  const { supabase, user } = useSupabase()
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadPeople()
  }, [user])

  const loadPeople = async () => {
    try {
      const { data, error } = await supabase
        .from("people")
        .select("*")
        .order("nome")

      if (error) throw error
      setPeople(data || [])
    } catch (error) {
      console.error("Error loading people:", error)
    } finally {
      setLoading(false)
    }
  }

  return { people, loading, refetch: loadPeople }
}

export function useProfile() {
  const { supabase, user } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadProfile()
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error && error.code !== "PGRST116") throw error
      setProfile(data)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, refetch: loadProfile }
}




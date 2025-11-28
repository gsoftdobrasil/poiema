"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Category, GroupGc, Gc, Person, Profile, Family, FamilyMember, FinancialTransaction, Event, EventParticipant, Notification, AuditLog } from "@/lib/types/database"

export function useSupabase() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    // Verificar usuário atual
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (mounted) {
        if (error) {
          console.error("Error getting user:", error)
          setUser(null)
        } else {
          setUser(user)
        }
        setLoading(false)
      }
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  return { supabase, user, loading }
}

export function useCategories() {
  const { supabase, user } = useSupabase()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("descricao")

      if (error) {
        console.error("Error loading categories:", error)
        throw error
      }
      setCategories(data || [])
    } catch (error) {
      console.error("Error loading categories:", error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // Aguardar um pouco para garantir que a autenticação foi verificada
    const timer = setTimeout(() => {
      loadCategories()
    }, 100)

    return () => clearTimeout(timer)
  }, [loadCategories])

  return { categories, loading, refetch: loadCategories }
}

export function useGroupGcs() {
  const { supabase, user } = useSupabase()
  const [groupGcs, setGroupGcs] = useState<GroupGc[]>([])
  const [loading, setLoading] = useState(true)

  const loadGroupGcs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("group_gcs")
        .select("*")
        .order("nome_grupo")

      if (error) {
        console.error("Error loading group_gcs:", error)
        throw error
      }
      setGroupGcs(data || [])
    } catch (error) {
      console.error("Error loading group_gcs:", error)
      setGroupGcs([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // Aguardar um pouco para garantir que a autenticação foi verificada
    const timer = setTimeout(() => {
      loadGroupGcs()
    }, 100)

    return () => clearTimeout(timer)
  }, [loadGroupGcs])

  return { groupGcs, loading, refetch: loadGroupGcs }
}

export function useGcs() {
  const { supabase, user } = useSupabase()
  const [gcs, setGcs] = useState<Gc[]>([])
  const [loading, setLoading] = useState(true)

  const loadGcs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("gcs")
        .select("*")
        .order("descricao")

      if (error) {
        console.error("Error loading gcs:", error)
        throw error
      }
      setGcs(data || [])
    } catch (error) {
      console.error("Error loading gcs:", error)
      setGcs([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // Aguardar um pouco para garantir que a autenticação foi verificada
    const timer = setTimeout(() => {
      loadGcs()
    }, 100)

    return () => clearTimeout(timer)
  }, [loadGcs])

  return { gcs, loading, refetch: loadGcs }
}

export function usePeople() {
  const { supabase, user } = useSupabase()
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  const loadPeople = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("people")
        .select("*")
        .order("nome")

      if (error) {
        console.error("Error loading people:", error)
        throw error
      }
      setPeople(data || [])
    } catch (error) {
      console.error("Error loading people:", error)
      setPeople([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // Aguardar um pouco para garantir que a autenticação foi verificada
    const timer = setTimeout(() => {
      loadPeople()
    }, 100)

    return () => clearTimeout(timer)
  }, [loadPeople])

  return { people, loading, refetch: loadPeople }
}

export function useProfile() {
  const { supabase, user } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error && error.code !== "PGRST116") throw error
      setProfile(data)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadProfile()
  }, [user, loadProfile])

  return { profile, loading, refetch: loadProfile }
}

// Hook para Famílias
export function useFamilies() {
  const { supabase, user } = useSupabase()
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)

  const loadFamilies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("families")
        .select("*")
        .order("nome_familia")

      if (error) throw error
      setFamilies(data || [])
    } catch (error) {
      console.error("Error loading families:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadFamilies()
  }, [user, loadFamilies])

  return { families, loading, refetch: loadFamilies }
}

// Hook para Transações Financeiras
export function useFinancialTransactions() {
  const { supabase, user } = useSupabase()
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [loading, setLoading] = useState(true)

  const loadTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .order("data_transacao", { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadTransactions()
  }, [user, loadTransactions])

  return { transactions, loading, refetch: loadTransactions }
}

// Hook para Eventos
export function useEvents() {
  const { supabase, user } = useSupabase()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("data_inicio", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadEvents()
  }, [user, loadEvents])

  return { events, loading, refetch: loadEvents }
}

// Hook para Participantes de Eventos
export function useEventParticipants(eventId?: number) {
  const { supabase, user } = useSupabase()
  const [participants, setParticipants] = useState<EventParticipant[]>([])
  const [loading, setLoading] = useState(true)

  const loadParticipants = useCallback(async () => {
    if (!eventId) return
    try {
      const { data, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setParticipants(data || [])
    } catch (error) {
      console.error("Error loading participants:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, eventId])

  useEffect(() => {
    if (!user || !eventId) {
      setLoading(false)
      return
    }
    loadParticipants()
  }, [user, eventId, loadParticipants])

  return { participants, loading, refetch: loadParticipants }
}

// Hook para Notificações
export function useNotifications() {
  const { supabase, user } = useSupabase()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadNotifications()
  }, [user, loadNotifications])

  return { notifications, loading, refetch: loadNotifications }
}

// Hook para Audit Logs
export function useAuditLogs(limit: number = 100) {
  const { supabase, user } = useSupabase()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  const loadLogs = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error("Error loading audit logs:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, user, limit])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadLogs()
  }, [user, limit, loadLogs])

  return { logs, loading, refetch: loadLogs }
}




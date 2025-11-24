"use client"

import { useState, useEffect } from "react"
import {
  Category,
  GroupGc,
  Gc,
  Person,
  DashboardData,
  initialCategories,
  initialGroupGcs,
  initialGcs,
  initialPeople,
  initialDashboardData
} from "./mock-data"

export function useStore() {
  const [categories, setCategories] = useState<Category[]>([])
  const [groupGcs, setGroupGcs] = useState<GroupGc[]>([])
  const [gcs, setGcs] = useState<Gc[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData)

  useEffect(() => {
    // Carregar dados iniciais do localStorage ou usar mocks
    const storedCategories = localStorage.getItem("categories")
    const storedGroupGcs = localStorage.getItem("groupGcs")
    const storedGcs = localStorage.getItem("gcs")
    const storedPeople = localStorage.getItem("people")

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      setCategories(initialCategories)
      localStorage.setItem("categories", JSON.stringify(initialCategories))
    }

    if (storedGroupGcs) {
      setGroupGcs(JSON.parse(storedGroupGcs))
    } else {
      setGroupGcs(initialGroupGcs)
      localStorage.setItem("groupGcs", JSON.stringify(initialGroupGcs))
    }

    if (storedGcs) {
      setGcs(JSON.parse(storedGcs))
    } else {
      setGcs(initialGcs)
      localStorage.setItem("gcs", JSON.stringify(initialGcs))
    }

    if (storedPeople) {
      setPeople(JSON.parse(storedPeople))
    } else {
      setPeople(initialPeople)
      localStorage.setItem("people", JSON.stringify(initialPeople))
    }
  }, [])

  // Categories
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id), 0) + 1 : 1
    }
    const updated = [...categories, newCategory]
    setCategories(updated)
    localStorage.setItem("categories", JSON.stringify(updated))
    return newCategory
  }

  const updateCategory = (id: number, category: Partial<Category>) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...category } : c)
    setCategories(updated)
    localStorage.setItem("categories", JSON.stringify(updated))
  }

  const deleteCategory = (id: number) => {
    const updated = categories.filter(c => c.id !== id)
    setCategories(updated)
    localStorage.setItem("categories", JSON.stringify(updated))
  }

  // GroupGcs
  const addGroupGc = (groupGc: Omit<GroupGc, "id">) => {
    const newGroupGc: GroupGc = {
      ...groupGc,
      id: groupGcs.length > 0 ? Math.max(...groupGcs.map(g => g.id), 0) + 1 : 1
    }
    const updated = [...groupGcs, newGroupGc]
    setGroupGcs(updated)
    localStorage.setItem("groupGcs", JSON.stringify(updated))
    return newGroupGc
  }

  const updateGroupGc = (id: number, groupGc: Partial<GroupGc>) => {
    const updated = groupGcs.map(g => g.id === id ? { ...g, ...groupGc } : g)
    setGroupGcs(updated)
    localStorage.setItem("groupGcs", JSON.stringify(updated))
  }

  const deleteGroupGc = (id: number) => {
    const updated = groupGcs.filter(g => g.id !== id)
    setGroupGcs(updated)
    localStorage.setItem("groupGcs", JSON.stringify(updated))
  }

  // Gcs
  const addGc = (gc: Omit<Gc, "id">) => {
    const newGc: Gc = {
      ...gc,
      id: gcs.length > 0 ? Math.max(...gcs.map(g => g.id), 0) + 1 : 1
    }
    const updated = [...gcs, newGc]
    setGcs(updated)
    localStorage.setItem("gcs", JSON.stringify(updated))
    return newGc
  }

  const updateGc = (id: number, gc: Partial<Gc>) => {
    const updated = gcs.map(g => g.id === id ? { ...g, ...gc } : g)
    setGcs(updated)
    localStorage.setItem("gcs", JSON.stringify(updated))
  }

  const deleteGc = (id: number) => {
    const updated = gcs.filter(g => g.id !== id)
    setGcs(updated)
    localStorage.setItem("gcs", JSON.stringify(updated))
  }

  // People
  const addPerson = (person: Omit<Person, "id">) => {
    const newPerson: Person = {
      ...person,
      id: people.length > 0 ? Math.max(...people.map(p => p.id), 0) + 1 : 1
    }
    const updated = [...people, newPerson]
    setPeople(updated)
    localStorage.setItem("people", JSON.stringify(updated))
    return newPerson
  }

  const updatePerson = (id: number, person: Partial<Person>) => {
    const updated = people.map(p => p.id === id ? { ...p, ...person } : p)
    setPeople(updated)
    localStorage.setItem("people", JSON.stringify(updated))
  }

  const deletePerson = (id: number) => {
    const updated = people.filter(p => p.id !== id)
    setPeople(updated)
    localStorage.setItem("people", JSON.stringify(updated))
  }

  return {
    categories,
    groupGcs,
    gcs,
    people,
    dashboardData,
    addCategory,
    updateCategory,
    deleteCategory,
    addGroupGc,
    updateGroupGc,
    deleteGroupGc,
    addGc,
    updateGc,
    deleteGc,
    addPerson,
    updatePerson,
    deletePerson
  }
}


"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { usePeople } from "@/lib/hooks/use-supabase"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/utils/supabase/client"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']

export function Dashboard() {
  const { user } = useAuth()
  const supabase = createClient()
  const { people, loading: peopleLoading } = usePeople()
  const [period, setPeriod] = useState("total")
  const [category, setCategory] = useState("todas")
  const [kpis, setKpis] = useState({
    totalAbordagens: 0,
    totalEncaixes: 0,
    encaixesPendentes: 0,
    categoriaComMaisPessoas: "N/A"
  })
  const [captacaoPorMes, setCaptacaoPorMes] = useState<Array<{ mes: string; abordagens: number; encaixes: number }>>([])
  const [encaixesPorMes, setEncaixesPorMes] = useState<Array<{ mes: string; valor: number }>>([])
  const [categoriasDistribuicao, setCategoriasDistribuicao] = useState<Array<{ categoria: string; quantidade: number }>>([])
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    try {
      // Calcular período
      const now = new Date()
      let startDate: Date | null = null
      if (period === "7") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      } else if (period === "30") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }

      // Filtrar pessoas
      let filteredPeople = people
      if (startDate) {
        filteredPeople = people.filter(p => new Date(p.data_abordagem) >= startDate!)
      }

      // KPIs
      const totalAbordagens = filteredPeople.length
      const totalEncaixes = filteredPeople.filter(p => p.status_encaixe === "encaixado").length
      const encaixesPendentes = filteredPeople.filter(p => p.status_encaixe === "pendente").length

      // Categoria com mais pessoas
      const categoriaCounts: Record<number, number> = {}
      filteredPeople.forEach(p => {
        if (p.categoria_id) {
          categoriaCounts[p.categoria_id] = (categoriaCounts[p.categoria_id] || 0) + 1
        }
      })
      const categoriaMaisPessoas = Object.entries(categoriaCounts).sort((a, b) => b[1] - a[1])[0]
      let categoriaNome = "N/A"
      if (categoriaMaisPessoas) {
        const { data: cat } = await supabase
          .from("categories")
          .select("descricao")
          .eq("id", categoriaMaisPessoas[0])
          .single()
        categoriaNome = cat?.descricao || "N/A"
      }

      setKpis({
        totalAbordagens,
        totalEncaixes,
        encaixesPendentes,
        categoriaComMaisPessoas: categoriaNome
      })

      // Gráfico de captação por mês
      const meses: Record<string, { abordagens: number; encaixes: number }> = {}
      filteredPeople.forEach(p => {
        const date = new Date(p.data_abordagem)
        const mes = date.toLocaleDateString("pt-BR", { month: "short" })
        if (!meses[mes]) {
          meses[mes] = { abordagens: 0, encaixes: 0 }
        }
        meses[mes].abordagens++
        if (p.status_encaixe === "encaixado") {
          meses[mes].encaixes++
        }
      })
      setCaptacaoPorMes(Object.entries(meses).map(([mes, data]) => ({ mes, ...data })))

      // Gráfico de encaixes por mês
      const encaixesMeses: Record<string, number> = {}
      filteredPeople.filter(p => p.status_encaixe === "encaixado").forEach(p => {
        const date = new Date(p.data_abordagem)
        const mes = date.toLocaleDateString("pt-BR", { month: "short" })
        encaixesMeses[mes] = (encaixesMeses[mes] || 0) + 1
      })
      setEncaixesPorMes(Object.entries(encaixesMeses).map(([mes, valor]) => ({ mes, valor })))

      // Distribuição por categoria
      const { data: categories } = await supabase.from("categories").select("id, descricao")
      const distCategorias: Record<string, number> = {}
      filteredPeople.forEach(p => {
        if (p.categoria_id) {
          const cat = categories?.find(c => c.id === p.categoria_id)
          const nome = cat?.descricao || "Sem categoria"
          distCategorias[nome] = (distCategorias[nome] || 0) + 1
        }
      })
      setCategoriasDistribuicao(Object.entries(distCategorias).map(([categoria, quantidade]) => ({ categoria, quantidade })))

      // Insights
      const newInsights: string[] = []
      if (categoriaMaisPessoas) {
        newInsights.push(`${categoriaNome} é a categoria com maior número de pessoas encaixadas.`)
      }
      if (totalAbordagens > 0) {
        const mesMaisAbordagens = Object.entries(meses).sort((a, b) => b[1].abordagens - a[1].abordagens)[0]
        if (mesMaisAbordagens) {
          newInsights.push(`${mesMaisAbordagens[0]} foi o mês com maior número de abordagens.`)
        }
      }
      if (encaixesPendentes > 0) {
        newInsights.push(`Há ${encaixesPendentes} pessoas com encaixe pendente, priorizar follow-up nesta semana.`)
      }
      setInsights(newInsights)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [user, people, period, category, supabase])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    if (peopleLoading) return
    loadDashboardData()
  }, [user, people, period, category, peopleLoading, loadDashboardData])

  if (loading || peopleLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="text-lg">Carregando dados do dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Welcome</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das abordagens e encaixes
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dias</SelectItem>
              <SelectItem value="30">30 dias</SelectItem>
              <SelectItem value="total">Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="casais">Casais</SelectItem>
              <SelectItem value="jovens">Jovens</SelectItem>
              <SelectItem value="adolescentes">Adolescentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Abordagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalAbordagens}</div>
            <p className="text-xs text-muted-foreground">
              Pessoas abordadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Encaixes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalEncaixes}</div>
            <p className="text-xs text-muted-foreground">
              Pessoas encaixadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Encaixes Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.encaixesPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando encaixe
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categoria com Mais Pessoas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.categoriaComMaisPessoas}</div>
            <p className="text-xs text-muted-foreground">
              Maior captação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Captação de Pessoas por Mês</CardTitle>
            <CardDescription>Abordagens e encaixes mensais</CardDescription>
          </CardHeader>
          <CardContent>
            {captacaoPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={captacaoPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="abordagens" stroke="#8884d8" name="Abordagens" />
                  <Line type="monotone" dataKey="encaixes" stroke="#82ca9d" name="Encaixes" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados para exibir
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Encaixes por Mês</CardTitle>
            <CardDescription>Total de encaixes realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {encaixesPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={encaixesPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#8884d8" name="Encaixes" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados para exibir
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>Pessoas por categoria de GC</CardDescription>
          </CardHeader>
          <CardContent>
            {categoriasDistribuicao.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoriasDistribuicao}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {categoriasDistribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados para exibir
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>Análises e recomendações</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 text-sm"
                  >
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Nenhum insight disponível no momento
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

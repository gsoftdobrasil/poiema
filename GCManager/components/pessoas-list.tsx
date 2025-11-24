"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { usePeople, useCategories, useGcs, useSupabase, useProfile } from "@/lib/hooks/use-supabase"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import type { Person } from "@/lib/types/database"

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  encaixado: "Encaixado",
  recusou: "Recusou",
}

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  pendente: "secondary",
  encaixado: "default",
  recusou: "destructive",
}

export function PessoasList() {
  const { people, loading: peopleLoading, refetch: refetchPeople } = usePeople()
  const { categories, loading: categoriesLoading } = useCategories()
  const { gcs, loading: gcsLoading } = useGcs()
  const { supabase, user } = useSupabase()
  const { profile } = useProfile()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    idade: null as number | null,
    sexo: "M",
    estado_civil: "",
    endereco_rua: "",
    endereco_numero: "",
    endereco_bairro: "",
    endereco_cep: "",
    categoria_id: null as number | null,
    gc_id: null as number | null,
    status_encaixe: "pendente",
    data_abordagem: new Date().toISOString().split("T")[0],
    observacao: "",
    abordado_por: "",
  })

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.nome.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "todos" || person.status_encaixe === statusFilter
    return matchesSearch && matchesStatus
  })

  // Atualizar abordado_por quando o profile for carregado e o formulário estiver aberto para nova pessoa
  useEffect(() => {
    if (profile?.full_name && isDialogOpen && !selectedPerson && !formData.abordado_por) {
      setFormData(prev => ({ ...prev, abordado_por: profile.full_name || "" }))
    }
  }, [profile, isDialogOpen, selectedPerson])

  const handleOpenDialog = (person?: Person) => {
    if (person) {
      setSelectedPerson(person)
      setFormData({
        nome: person.nome,
        idade: person.idade,
        sexo: person.sexo,
        estado_civil: person.estado_civil || "",
        endereco_rua: person.endereco_rua || "",
        endereco_numero: person.endereco_numero || "",
        endereco_bairro: person.endereco_bairro || "",
        endereco_cep: person.endereco_cep || "",
        categoria_id: person.categoria_id,
        gc_id: person.gc_id,
        status_encaixe: person.status_encaixe,
        data_abordagem: person.data_abordagem,
        observacao: person.observacao || "",
        abordado_por: person.abordado_por || "",
      })
    } else {
      setSelectedPerson(null)
      setFormData({
        nome: "",
        idade: null,
        sexo: "M",
        estado_civil: "",
        endereco_rua: "",
        endereco_numero: "",
        endereco_bairro: "",
        endereco_cep: "",
        categoria_id: null,
        gc_id: null,
        status_encaixe: "pendente",
        data_abordagem: new Date().toISOString().split("T")[0],
        observacao: "",
        abordado_por: profile?.full_name || "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!user) return

    if (!formData.nome || !formData.categoria_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      if (selectedPerson) {
        const { error } = await supabase
          .from("people")
          .update({
            nome: formData.nome,
            idade: formData.idade,
            sexo: formData.sexo,
            estado_civil: formData.estado_civil,
            endereco_rua: formData.endereco_rua,
            endereco_numero: formData.endereco_numero,
            endereco_bairro: formData.endereco_bairro,
            endereco_cep: formData.endereco_cep,
            categoria_id: formData.categoria_id,
            gc_id: formData.gc_id,
            status_encaixe: formData.status_encaixe,
            data_abordagem: formData.data_abordagem,
            observacao: formData.observacao,
            abordado_por: formData.abordado_por,
          })
          .eq("id", selectedPerson.id)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Pessoa atualizada com sucesso",
        })
      } else {
        const { error } = await supabase
          .from("people")
          .insert({
            nome: formData.nome,
            idade: formData.idade,
            sexo: formData.sexo,
            estado_civil: formData.estado_civil,
            endereco_rua: formData.endereco_rua,
            endereco_numero: formData.endereco_numero,
            endereco_bairro: formData.endereco_bairro,
            endereco_cep: formData.endereco_cep,
            categoria_id: formData.categoria_id,
            gc_id: formData.gc_id,
            status_encaixe: formData.status_encaixe,
            data_abordagem: formData.data_abordagem,
            observacao: formData.observacao,
            user_id: user.id,
            abordado_por: formData.abordado_por || profile?.full_name || "",
          })

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Pessoa cadastrada com sucesso",
        })
      }
      setIsDialogOpen(false)
      refetchPeople()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (person: Person) => {
    setSelectedPerson(person)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPerson) return

    try {
      const { error } = await supabase
        .from("people")
        .delete()
        .eq("id", selectedPerson.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Pessoa excluída com sucesso",
      })
      setIsDeleteDialogOpen(false)
      setSelectedPerson(null)
      refetchPeople()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro",
        variant: "destructive",
      })
    }
  }

  const getCategoryName = (categoriaId: number | null) => {
    if (!categoriaId) return "N/A"
    return categories.find(c => c.id === categoriaId)?.descricao || "N/A"
  }

  const getGcName = (gcId: number | null) => {
    if (!gcId) return "Não encaixado"
    return gcs.find(g => g.id === gcId)?.descricao || "N/A"
  }

  const availableGcs = formData.categoria_id
    ? gcs.filter(gc => gc.categoria_id === formData.categoria_id)
    : []

  if (peopleLoading || categoriesLoading || gcsLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pessoas</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar pessoas e encaixes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pessoa
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="encaixado">Encaixado</SelectItem>
            <SelectItem value="recusou">Recusou</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Estado Civil</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>GC</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Abordagem</TableHead>
                <TableHead>Abordado por</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPeople.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhuma pessoa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredPeople.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.nome}</TableCell>
                    <TableCell>{person.idade || "-"}</TableCell>
                    <TableCell>{person.sexo}</TableCell>
                    <TableCell>{person.estado_civil || "-"}</TableCell>
                    <TableCell>{getCategoryName(person.categoria_id)}</TableCell>
                    <TableCell>{getGcName(person.gc_id)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[person.status_encaixe]}>
                        {statusLabels[person.status_encaixe]}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(person.data_abordagem).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{person.abordado_por || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(person)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(person)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPerson ? "Editar Pessoa" : "Nova Pessoa"}</DialogTitle>
            <DialogDescription>
              {selectedPerson ? "Atualize as informações da pessoa" : "Preencha os dados da nova pessoa"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={formData.idade || ""}
                  onChange={(e) => setFormData({ ...formData, idade: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sexo">Sexo *</Label>
                <Select
                  value={formData.sexo}
                  onValueChange={(value) => setFormData({ ...formData, sexo: value as "M" | "F" })}
                >
                  <SelectTrigger id="sexo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
              <Label htmlFor="estado_civil">Estado Civil</Label>
              <Select
                value={formData.estado_civil}
                onValueChange={(value) => setFormData({ ...formData, estado_civil: value })}
              >
                <SelectTrigger id="estado_civil">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria_id">Categoria *</Label>
              <Select
                value={formData.categoria_id?.toString() || ""}
                onValueChange={(value) => {
                  const catId = value ? parseInt(value) : null
                  setFormData({ ...formData, categoria_id: catId, gc_id: null })
                }}
              >
                <SelectTrigger id="categoria_id">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gc_id">GC</Label>
              <Select
                value={formData.gc_id?.toString() || "none"}
                onValueChange={(value) => setFormData({ ...formData, gc_id: value === "none" ? null : parseInt(value) })}
              >
                <SelectTrigger id="gc_id">
                  <SelectValue placeholder="Não encaixado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não encaixado</SelectItem>
                  {availableGcs.map((gc) => (
                    <SelectItem key={gc.id} value={gc.id.toString()}>
                      {gc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status_encaixe">Status do Encaixe</Label>
              <Select
                value={formData.status_encaixe}
                onValueChange={(value) => setFormData({ ...formData, status_encaixe: value })}
              >
                <SelectTrigger id="status_encaixe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="encaixado">Encaixado</SelectItem>
                  <SelectItem value="recusou">Recusou</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="data_abordagem">Data da Abordagem</Label>
                <Input
                  id="data_abordagem"
                  type="date"
                  value={formData.data_abordagem}
                  onChange={(e) => setFormData({ ...formData, data_abordagem: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="abordado_por">Abordado por</Label>
                <Input
                  id="abordado_por"
                  value={formData.abordado_por || profile?.full_name || ""}
                  onChange={(e) => setFormData({ ...formData, abordado_por: e.target.value })}
                  placeholder={profile?.full_name || "Nome do usuário"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="endereco_rua">Rua</Label>
                <Input
                  id="endereco_rua"
                  value={formData.endereco_rua}
                  onChange={(e) => setFormData({ ...formData, endereco_rua: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endereco_numero">Número</Label>
                <Input
                  id="endereco_numero"
                  value={formData.endereco_numero}
                  onChange={(e) => setFormData({ ...formData, endereco_numero: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="endereco_bairro">Bairro</Label>
                <Input
                  id="endereco_bairro"
                  value={formData.endereco_bairro}
                  onChange={(e) => setFormData({ ...formData, endereco_bairro: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endereco_cep">CEP</Label>
                <Input
                  id="endereco_cep"
                  value={formData.endereco_cep}
                  onChange={(e) => setFormData({ ...formData, endereco_cep: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                value={formData.observacao}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta pessoa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}




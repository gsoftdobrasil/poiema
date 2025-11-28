"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogTrigger,
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LazyImage } from "@/components/ui/lazy-image"
import { Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/lib/hooks/use-pagination"
import { PhotoUpload } from "@/components/ui/photo-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGcs, useGroupGcs, useCategories, useSupabase } from "@/lib/hooks/use-supabase"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import type { Gc } from "@/lib/types/database"

export function GcsList() {
  const { gcs, loading: gcsLoading, refetch: refetchGcs } = useGcs()
  const { groupGcs, loading: groupGcsLoading } = useGroupGcs()
  const { categories, loading: categoriesLoading } = useCategories()
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGc, setSelectedGc] = useState<Gc | null>(null)
  const [formData, setFormData] = useState({
    id_grupo: null as number | null,
    descricao: "",
    lider: "",
    lider_treinamento: "",
    contato_lider: "",
    contato_lider_treinamento: "",
    foto_lider: "",
    anfitrioes: "",
    contato_anfitrioes: "",
    descricao_local: "",
    ponto_referencia: "",
    endereco_rua: "",
    endereco_numero: "",
    endereco_bairro: "",
    endereco_cep: "",
    categoria_id: null as number | null,
    dia_semana: "",
    horario: "",
  })

  const filteredGcs = gcs.filter(gc =>
    gc.descricao.toLowerCase().includes(search.toLowerCase()) ||
    gc.lider.toLowerCase().includes(search.toLowerCase())
  )

  const { paginatedData, currentPage, totalPages, goToPage } = usePagination({
    data: filteredGcs,
    itemsPerPage: 10,
  })

  const handleOpenDialog = (gc?: Gc) => {
    if (gc) {
      setSelectedGc(gc)
      setFormData({
        id_grupo: gc.id_grupo,
        descricao: gc.descricao,
        lider: gc.lider,
        lider_treinamento: gc.lider_treinamento || "",
        contato_lider: gc.contato_lider || "",
        contato_lider_treinamento: gc.contato_lider_treinamento || "",
        foto_lider: gc.foto_lider || "",
        anfitrioes: gc.anfitrioes || "",
        contato_anfitrioes: gc.contato_anfitrioes || "",
        descricao_local: gc.descricao_local || "",
        ponto_referencia: gc.ponto_referencia || "",
        endereco_rua: gc.endereco_rua || "",
        endereco_numero: gc.endereco_numero || "",
        endereco_bairro: gc.endereco_bairro || "",
        endereco_cep: gc.endereco_cep || "",
        categoria_id: gc.categoria_id,
        dia_semana: gc.dia_semana || "",
        horario: gc.horario || "",
      })
    } else {
      setSelectedGc(null)
      setFormData({
        id_grupo: null,
        descricao: "",
        lider: "",
        lider_treinamento: "",
        contato_lider: "",
        contato_lider_treinamento: "",
        foto_lider: "",
        anfitrioes: "",
        contato_anfitrioes: "",
        descricao_local: "",
        ponto_referencia: "",
        endereco_rua: "",
        endereco_numero: "",
        endereco_bairro: "",
        endereco_cep: "",
        categoria_id: null,
        dia_semana: "",
        horario: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!user) return

    if (!formData.descricao || !formData.lider) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      if (selectedGc) {
        const { error } = await supabase
          .from("gcs")
          .update({
            id_grupo: formData.id_grupo,
            descricao: formData.descricao,
            lider: formData.lider,
            lider_treinamento: formData.lider_treinamento || null,
            contato_lider: formData.contato_lider || null,
            contato_lider_treinamento: formData.contato_lider_treinamento || null,
            foto_lider: formData.foto_lider || null,
            anfitrioes: formData.anfitrioes || null,
            contato_anfitrioes: formData.contato_anfitrioes || null,
            descricao_local: formData.descricao_local,
            ponto_referencia: formData.ponto_referencia || null,
            endereco_rua: formData.endereco_rua,
            endereco_numero: formData.endereco_numero,
            endereco_bairro: formData.endereco_bairro,
            endereco_cep: formData.endereco_cep,
            categoria_id: formData.categoria_id,
            dia_semana: formData.dia_semana,
            horario: formData.horario,
          })
          .eq("id", selectedGc.id)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "GC atualizado com sucesso",
        })
      } else {
        const { error } = await supabase
          .from("gcs")
          .insert({
            id_grupo: formData.id_grupo,
            descricao: formData.descricao,
            lider: formData.lider,
            lider_treinamento: formData.lider_treinamento || null,
            contato_lider: formData.contato_lider || null,
            contato_lider_treinamento: formData.contato_lider_treinamento || null,
            foto_lider: formData.foto_lider || null,
            anfitrioes: formData.anfitrioes || null,
            contato_anfitrioes: formData.contato_anfitrioes || null,
            descricao_local: formData.descricao_local,
            ponto_referencia: formData.ponto_referencia || null,
            endereco_rua: formData.endereco_rua,
            endereco_numero: formData.endereco_numero,
            endereco_bairro: formData.endereco_bairro,
            endereco_cep: formData.endereco_cep,
            categoria_id: formData.categoria_id,
            dia_semana: formData.dia_semana,
            horario: formData.horario,
            user_id: user.id,
          })

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "GC criado com sucesso",
        })
      }
      setIsDialogOpen(false)
      refetchGcs()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (gc: Gc) => {
    setSelectedGc(gc)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedGc) return

    try {
      const { error } = await supabase
        .from("gcs")
        .delete()
        .eq("id", selectedGc.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "GC excluído com sucesso",
      })
      setIsDeleteDialogOpen(false)
      setSelectedGc(null)
      refetchGcs()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro",
        variant: "destructive",
      })
    }
  }

  const getGroupName = (idGrupo: number | null) => {
    if (!idGrupo) return "N/A"
    return groupGcs.find(g => g.id === idGrupo)?.nome_grupo || "N/A"
  }

  const getCategoryName = (categoriaId: number | null) => {
    if (!categoriaId) return "N/A"
    return categories.find(c => c.id === categoriaId)?.descricao || "N/A"
  }

  if (gcsLoading || groupGcsLoading || categoriesLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GC&apos;s</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar GCs
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo GC
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição ou líder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Líder</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Dia/Horário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGcs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum GC encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((gc) => (
                <TableRow key={gc.id}>
                  <TableCell>
                    <LazyImage
                      src={gc.foto_lider}
                      alt={gc.lider}
                      avatar
                      size="md"
                      fallback={gc.lider.charAt(0).toUpperCase()}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{gc.descricao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {gc.foto_lider && (
                        <LazyImage
                          src={gc.foto_lider}
                          alt={gc.lider}
                          avatar
                          size="sm"
                          fallback={gc.lider.charAt(0)}
                        />
                      )}
                      <span>{gc.lider}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getGroupName(gc.id_grupo)}</TableCell>
                  <TableCell>{getCategoryName(gc.categoria_id)}</TableCell>
                  <TableCell>{gc.descricao_local || "-"}</TableCell>
                  <TableCell>
                    {gc.endereco_rua ? `${gc.endereco_rua}, ${gc.endereco_numero} - ${gc.endereco_bairro}` : "-"}
                  </TableCell>
                  <TableCell>
                    {gc.dia_semana} {gc.horario && `às ${gc.horario}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(gc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(gc)}
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedGc ? "Editar GC" : "Novo GC"}</DialogTitle>
            <DialogDescription>
              {selectedGc ? "Atualize as informações do GC" : "Preencha os dados do novo GC"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="grupo">Coordenador(es) *</Label>
              <Select
                value={formData.id_grupo?.toString() || undefined}
                onValueChange={(value) => setFormData({ ...formData, id_grupo: value ? parseInt(value) : null })}
              >
                <SelectTrigger id="grupo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groupGcs.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nenhum grupo cadastrado
                    </div>
                  ) : (
                    groupGcs.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.nome_grupo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria_id?.toString() || undefined}
                onValueChange={(value) => setFormData({ ...formData, categoria_id: value ? parseInt(value) : null })}
              >
                <SelectTrigger id="categoria">
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
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lider">Líder(es) *</Label>
                <Input
                  id="lider"
                  value={formData.lider}
                  onChange={(e) => setFormData({ ...formData, lider: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contato_lider">Contato (WhatsApp) do Líder</Label>
                <Input
                  id="contato_lider"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.contato_lider}
                  onChange={(e) => setFormData({ ...formData, contato_lider: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lider_treinamento">Líder em Treinamento</Label>
                <Input
                  id="lider_treinamento"
                  value={formData.lider_treinamento}
                  onChange={(e) => setFormData({ ...formData, lider_treinamento: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contato_lider_treinamento">Contato (WhatsApp)</Label>
                <Input
                  id="contato_lider_treinamento"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.contato_lider_treinamento}
                  onChange={(e) => setFormData({ ...formData, contato_lider_treinamento: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <PhotoUpload
                currentPhotoUrl={formData.foto_lider}
                onUploadComplete={(url) => setFormData({ ...formData, foto_lider: url })}
                folder="gcs"
                fileName={selectedGc ? `lider-${selectedGc.id}` : undefined}
                label="Foto do Líder"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="anfitrioes">Anfitriões</Label>
                <Input
                  id="anfitrioes"
                  value={formData.anfitrioes}
                  onChange={(e) => setFormData({ ...formData, anfitrioes: e.target.value })}
                  placeholder="Nome dos donos da casa"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contato_anfitrioes">Contato (WhatsApp) dos Anfitriões</Label>
                <Input
                  id="contato_anfitrioes"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.contato_anfitrioes}
                  onChange={(e) => setFormData({ ...formData, contato_anfitrioes: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ponto_referencia">Ponto de Referência do Local</Label>
              <Input
                id="ponto_referencia"
                value={formData.ponto_referencia}
                onChange={(e) => setFormData({ ...formData, ponto_referencia: e.target.value })}
                placeholder="Ex: Próximo ao mercado, em frente à praça..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao_local">Descrição do Local</Label>
              <Input
                id="descricao_local"
                value={formData.descricao_local}
                onChange={(e) => setFormData({ ...formData, descricao_local: e.target.value })}
              />
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dia_semana">Dia da Semana</Label>
                <Select
                  value={formData.dia_semana || undefined}
                  onValueChange={(value) => setFormData({ ...formData, dia_semana: value })}
                >
                  <SelectTrigger id="dia_semana">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Segunda">Segunda</SelectItem>
                    <SelectItem value="Terça">Terça</SelectItem>
                    <SelectItem value="Quarta">Quarta</SelectItem>
                    <SelectItem value="Quinta">Quinta</SelectItem>
                    <SelectItem value="Sexta">Sexta</SelectItem>
                    <SelectItem value="Sábado">Sábado</SelectItem>
                    <SelectItem value="Domingo">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="horario">Horário</Label>
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                />
              </div>
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
              Tem certeza que deseja excluir este GC? Esta ação não pode ser desfeita.
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




"use client"

import { useState } from "react"
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
import { useGroupGcs, useSupabase } from "@/lib/hooks/use-supabase"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import type { GroupGc } from "@/lib/types/database"

export function GruposGcsList() {
  const { groupGcs, loading, refetch } = useGroupGcs()
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGroupGc, setSelectedGroupGc] = useState<GroupGc | null>(null)
  const [formData, setFormData] = useState({
    nome_grupo: "",
    nome_lider: "",
    observacao: "",
  })

  const filteredGroupGcs = groupGcs.filter(group =>
    group.nome_grupo.toLowerCase().includes(search.toLowerCase()) ||
    group.nome_lider.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenDialog = (groupGc?: GroupGc) => {
    if (groupGc) {
      setSelectedGroupGc(groupGc)
      setFormData({
        nome_grupo: groupGc.nome_grupo,
        nome_lider: groupGc.nome_lider,
        observacao: groupGc.observacao || "",
      })
    } else {
      setSelectedGroupGc(null)
      setFormData({
        nome_grupo: "",
        nome_lider: "",
        observacao: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!user) return

    if (!formData.nome_grupo || !formData.nome_lider) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      if (selectedGroupGc) {
        const { error } = await supabase
          .from("group_gcs")
          .update({
            nome_grupo: formData.nome_grupo,
            nome_lider: formData.nome_lider,
            observacao: formData.observacao,
          })
          .eq("id", selectedGroupGc.id)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Grupo de GC atualizado com sucesso",
        })
      } else {
        const { error } = await supabase
          .from("group_gcs")
          .insert({
            nome_grupo: formData.nome_grupo,
            nome_lider: formData.nome_lider,
            observacao: formData.observacao,
            user_id: user.id,
          })

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Grupo de GC criado com sucesso",
        })
      }
      setIsDialogOpen(false)
      refetch()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (groupGc: GroupGc) => {
    setSelectedGroupGc(groupGc)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedGroupGc) return

    try {
      const { error } = await supabase
        .from("group_gcs")
        .delete()
        .eq("id", selectedGroupGc.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Grupo de GC excluído com sucesso",
      })
      setIsDeleteDialogOpen(false)
      setSelectedGroupGc(null)
      refetch()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro",
        variant: "destructive",
      })
    }
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold">Grupos de GC&apos;s</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar grupos de Grupos de Casas
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou líder..."
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
              <TableHead>Nome do Grupo</TableHead>
              <TableHead>Líder</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroupGcs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum grupo encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredGroupGcs.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.nome_grupo}</TableCell>
                  <TableCell>{group.nome_lider}</TableCell>
                  <TableCell className="max-w-md truncate">{group.observacao || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(group)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(group)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedGroupGc ? "Editar Grupo de GC" : "Novo Grupo de GC"}</DialogTitle>
            <DialogDescription>
              {selectedGroupGc ? "Atualize as informações do grupo" : "Preencha os dados do novo grupo"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome_grupo">Nome do Grupo *</Label>
              <Input
                id="nome_grupo"
                value={formData.nome_grupo}
                onChange={(e) => setFormData({ ...formData, nome_grupo: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nome_lider">Nome do Líder *</Label>
              <Input
                id="nome_lider"
                value={formData.nome_lider}
                onChange={(e) => setFormData({ ...formData, nome_lider: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                value={formData.observacao}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                rows={4}
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
              Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.
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




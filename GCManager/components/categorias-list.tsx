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
import { useCategories, useSupabase } from "@/lib/hooks/use-supabase"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import type { Category } from "@/lib/types/database"

const tipoLabels: Record<string, string> = {
  casais: "Casais",
  solteiros_m: "Solteiros Masculino",
  solteiros_f: "Solteiros Feminino",
  jovens_m: "Jovens Masculino",
  jovens_f: "Jovens Feminino",
  adolescentes: "Adolescentes",
}

export function CategoriasList() {
  const { categories, loading, refetch } = useCategories()
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    descricao: "",
    faixa_etaria_min: 0,
    faixa_etaria_max: 0,
    tipo: "casais",
  })

  const filteredCategories = categories.filter(cat =>
    cat.descricao.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setSelectedCategory(category)
      setFormData({
        descricao: category.descricao,
        faixa_etaria_min: category.faixa_etaria_min,
        faixa_etaria_max: category.faixa_etaria_max,
        tipo: category.tipo,
      })
    } else {
      setSelectedCategory(null)
      setFormData({
        descricao: "",
        faixa_etaria_min: 0,
        faixa_etaria_max: 0,
        tipo: "casais",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!user) return

    if (!formData.descricao || !formData.faixa_etaria_min || !formData.faixa_etaria_max) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      if (selectedCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            descricao: formData.descricao,
            faixa_etaria_min: formData.faixa_etaria_min,
            faixa_etaria_max: formData.faixa_etaria_max,
            tipo: formData.tipo,
          })
          .eq("id", selectedCategory.id)

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso",
        })
      } else {
        const { error } = await supabase
          .from("categories")
          .insert({
            descricao: formData.descricao,
            faixa_etaria_min: formData.faixa_etaria_min,
            faixa_etaria_max: formData.faixa_etaria_max,
            tipo: formData.tipo,
            user_id: user.id,
          })

        if (error) throw error

        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso",
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

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCategory) return

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", selectedCategory.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso",
      })
      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
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
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar categorias de GC's
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição..."
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
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Faixa Etária</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhuma categoria encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tipoLabels[category.tipo] || category.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    {category.faixa_etaria_min} - {category.faixa_etaria_max} anos
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category)}
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
            <DialogTitle>{selectedCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {selectedCategory ? "Atualize as informações da categoria" : "Preencha os dados da nova categoria"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casais">Casais</SelectItem>
                  <SelectItem value="solteiros_m">Solteiros Masculino</SelectItem>
                  <SelectItem value="solteiros_f">Solteiros Feminino</SelectItem>
                  <SelectItem value="jovens_m">Jovens Masculino</SelectItem>
                  <SelectItem value="jovens_f">Jovens Feminino</SelectItem>
                  <SelectItem value="adolescentes">Adolescentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="faixa_etaria_min">Idade Mínima *</Label>
                <Input
                  id="faixa_etaria_min"
                  type="number"
                  value={formData.faixa_etaria_min}
                  onChange={(e) => setFormData({ ...formData, faixa_etaria_min: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faixa_etaria_max">Idade Máxima *</Label>
                <Input
                  id="faixa_etaria_max"
                  type="number"
                  value={formData.faixa_etaria_max}
                  onChange={(e) => setFormData({ ...formData, faixa_etaria_max: parseInt(e.target.value) || 0 })}
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
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
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

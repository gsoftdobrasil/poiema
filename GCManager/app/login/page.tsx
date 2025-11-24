"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // REMOVIDO: Redirecionamento automático que estava causando loop
  // O usuário será redirecionado apenas após fazer login manualmente

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Verificar se profile existe, se não criar
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user?.id)
          .single()

        if (!profile && data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: data.user.email?.split("@")[0] || "Usuário",
            role: "viewer",
          })
        }

        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso",
        })
        
        // Aguardar um pouco para os cookies serem salvos
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Redirecionar simplesmente
        window.location.href = "/"
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          // Criar profile
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: fullName || email.split("@")[0],
            role: "viewer",
          })

          toast({
            title: "Sucesso",
            description: "Conta criada com sucesso! Você já está logado.",
          })
          
          // Aguardar um pouco para os cookies serem salvos
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Redirecionar simplesmente
          window.location.href = "/"
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>WelcomeApp</CardTitle>
          <CardDescription>
            {isLogin ? "Faça login para continuar" : "Crie sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin
                ? "Não tem conta? Criar conta"
                : "Já tem conta? Fazer login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


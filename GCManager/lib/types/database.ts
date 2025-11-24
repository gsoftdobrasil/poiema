export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string | null
          created_at?: string | null
        }
      }
      categories: {
        Row: {
          id: number
          descricao: string
          faixa_etaria_min: number
          faixa_etaria_max: number
          tipo: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: number
          descricao: string
          faixa_etaria_min: number
          faixa_etaria_max: number
          tipo: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: number
          descricao?: string
          faixa_etaria_min?: number
          faixa_etaria_max?: number
          tipo?: string
          user_id?: string
          created_at?: string | null
        }
      }
      group_gcs: {
        Row: {
          id: number
          nome_grupo: string
          nome_lider: string
          observacao: string | null
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: number
          nome_grupo: string
          nome_lider: string
          observacao?: string | null
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: number
          nome_grupo?: string
          nome_lider?: string
          observacao?: string | null
          user_id?: string
          created_at?: string | null
        }
      }
      gcs: {
        Row: {
          id: number
          id_grupo: number | null
          descricao: string
          lider: string
          descricao_local: string | null
          endereco_rua: string | null
          endereco_numero: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          categoria_id: number | null
          dia_semana: string | null
          horario: string | null
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: number
          id_grupo?: number | null
          descricao: string
          lider: string
          descricao_local?: string | null
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          categoria_id?: number | null
          dia_semana?: string | null
          horario?: string | null
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: number
          id_grupo?: number | null
          descricao?: string
          lider?: string
          descricao_local?: string | null
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          categoria_id?: number | null
          dia_semana?: string | null
          horario?: string | null
          user_id?: string
          created_at?: string | null
        }
      }
      people: {
        Row: {
          id: number
          nome: string
          idade: number | null
          sexo: string
          estado_civil: string | null
          endereco_rua: string | null
          endereco_numero: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          categoria_id: number | null
          gc_id: number | null
          status_encaixe: string
          data_abordagem: string
          observacao: string | null
          user_id: string
          abordado_por: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          nome: string
          idade?: number | null
          sexo: string
          estado_civil?: string | null
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          categoria_id?: number | null
          gc_id?: number | null
          status_encaixe?: string
          data_abordagem: string
          observacao?: string | null
          user_id: string
          abordado_por?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          nome?: string
          idade?: number | null
          sexo?: string
          estado_civil?: string | null
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          categoria_id?: number | null
          gc_id?: number | null
          status_encaixe?: string
          data_abordagem?: string
          observacao?: string | null
          user_id?: string
          abordado_por?: string | null
          created_at?: string | null
        }
      }
    }
  }
}

// Tipos auxiliares para facilitar o uso
export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type GroupGc = Database['public']['Tables']['group_gcs']['Row']
export type GroupGcInsert = Database['public']['Tables']['group_gcs']['Insert']
export type GroupGcUpdate = Database['public']['Tables']['group_gcs']['Update']

export type Gc = Database['public']['Tables']['gcs']['Row']
export type GcInsert = Database['public']['Tables']['gcs']['Insert']
export type GcUpdate = Database['public']['Tables']['gcs']['Update']

export type Person = Database['public']['Tables']['people']['Row']
export type PersonInsert = Database['public']['Tables']['people']['Insert']
export type PersonUpdate = Database['public']['Tables']['people']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']


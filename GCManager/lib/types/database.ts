export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string | null
          permissions: any | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string | null
          permissions?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string | null
          permissions?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          id: number
          descricao: string
          tipo: string
          cor: string | null
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: number
          descricao: string
          tipo: string
          cor?: string | null
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: number
          descricao?: string
          tipo?: string
          cor?: string | null
          user_id?: string
          created_at?: string | null
        }
      }
      group_gcs: {
        Row: {
          id: number
          nome_grupo: string
          nome_lider: string
          foto_coordenador: string | null
          contato_coordenador: string | null
          observacao: string | null
          user_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          nome_grupo: string
          nome_lider: string
          foto_coordenador?: string | null
          contato_coordenador?: string | null
          observacao?: string | null
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          nome_grupo?: string
          nome_lider?: string
          foto_coordenador?: string | null
          contato_coordenador?: string | null
          observacao?: string | null
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      gcs: {
        Row: {
          id: number
          id_grupo: number | null
          descricao: string
          lider: string
          lider_treinamento: string | null
          contato_lider: string | null
          contato_lider_treinamento: string | null
          foto_lider: string | null
          foto_lider_treinamento: string | null
          anfitrioes: string | null
          contato_anfitrioes: string | null
          descricao_local: string | null
          ponto_referencia: string | null
          endereco_rua: string | null
          endereco_numero: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          categoria_id: number | null
          dia_semana: string | null
          horario: string | null
          user_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          id_grupo?: number | null
          descricao: string
          lider: string
          lider_treinamento?: string | null
          contato_lider?: string | null
          contato_lider_treinamento?: string | null
          foto_lider?: string | null
          foto_lider_treinamento?: string | null
          anfitrioes?: string | null
          contato_anfitrioes?: string | null
          descricao_local?: string | null
          ponto_referencia?: string | null
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          categoria_id?: number | null
          dia_semana?: string | null
          horario?: string | null
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          id_grupo?: number | null
          descricao?: string
          lider?: string
          lider_treinamento?: string | null
          contato_lider?: string | null
          contato_lider_treinamento?: string | null
          foto_lider?: string | null
          foto_lider_treinamento?: string | null
          anfitrioes?: string | null
          contato_anfitrioes?: string | null
          descricao_local?: string | null
          ponto_referencia?: string | null
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          categoria_id?: number | null
          dia_semana?: string | null
          horario?: string | null
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
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
          foto: string | null
          status_membro: string
          telefone: string | null
          email: string | null
          data_nascimento: string | null
          rg: string | null
          cpf: string | null
          contato_emergencia_nome: string | null
          contato_emergencia_telefone: string | null
          anotacoes_privadas: string | null
          updated_at: string | null
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
          foto?: string | null
          status_membro?: string
          telefone?: string | null
          email?: string | null
          data_nascimento?: string | null
          rg?: string | null
          cpf?: string | null
          contato_emergencia_nome?: string | null
          contato_emergencia_telefone?: string | null
          anotacoes_privadas?: string | null
          updated_at?: string | null
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
          foto?: string | null
          status_membro?: string
          telefone?: string | null
          email?: string | null
          data_nascimento?: string | null
          rg?: string | null
          cpf?: string | null
          contato_emergencia_nome?: string | null
          contato_emergencia_telefone?: string | null
          anotacoes_privadas?: string | null
          updated_at?: string | null
        }
      }
      families: {
        Row: {
          id: number
          nome_familia: string
          endereco_rua: string | null
          endereco_numero: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          telefone_principal: string | null
          observacoes: string | null
          user_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          nome_familia: string
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          telefone_principal?: string | null
          observacoes?: string | null
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          nome_familia?: string
          endereco_rua?: string | null
          endereco_numero?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          telefone_principal?: string | null
          observacoes?: string | null
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      family_members: {
        Row: {
          id: number
          family_id: number
          person_id: number
          relacionamento: string
          created_at: string | null
        }
        Insert: {
          id?: number
          family_id: number
          person_id: number
          relacionamento: string
          created_at?: string | null
        }
        Update: {
          id?: number
          family_id?: number
          person_id?: number
          relacionamento?: string
          created_at?: string | null
        }
      }
      financial_transactions: {
        Row: {
          id: number
          tipo: string
          categoria: string
          valor: number
          descricao: string
          data_transacao: string
          pessoa_id: number | null
          user_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          tipo: string
          categoria: string
          valor: number
          descricao: string
          data_transacao?: string
          pessoa_id?: number | null
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          tipo?: string
          categoria?: string
          valor?: number
          descricao?: string
          data_transacao?: string
          pessoa_id?: number | null
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      events: {
        Row: {
          id: number
          titulo: string
          descricao: string | null
          data_inicio: string
          data_fim: string | null
          local: string | null
          capacidade_maxima: number | null
          status: string
          user_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          titulo: string
          descricao?: string | null
          data_inicio: string
          data_fim?: string | null
          local?: string | null
          capacidade_maxima?: number | null
          status?: string
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          titulo?: string
          descricao?: string | null
          data_inicio?: string
          data_fim?: string | null
          local?: string | null
          capacidade_maxima?: number | null
          status?: string
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      event_participants: {
        Row: {
          id: number
          event_id: number
          person_id: number
          status_inscricao: string
          observacoes: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          event_id: number
          person_id: number
          status_inscricao?: string
          observacoes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          event_id?: number
          person_id?: number
          status_inscricao?: string
          observacoes?: string | null
          created_at?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: number
          user_id: string
          acao: string
          tabela: string
          registro_id: number
          dados_anteriores: any | null
          dados_novos: any | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          acao: string
          tabela: string
          registro_id: number
          dados_anteriores?: any | null
          dados_novos?: any | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          acao?: string
          tabela?: string
          registro_id?: number
          dados_anteriores?: any | null
          dados_novos?: any | null
          created_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: number
          user_id: string
          tipo: string
          titulo: string
          mensagem: string
          lida: boolean
          link: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          tipo: string
          titulo: string
          mensagem: string
          lida?: boolean
          link?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          tipo?: string
          titulo?: string
          mensagem?: string
          lida?: boolean
          link?: string | null
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

// Novas tabelas da Fase 2
export type Family = Database['public']['Tables']['families']['Row']
export type FamilyInsert = Database['public']['Tables']['families']['Insert']
export type FamilyUpdate = Database['public']['Tables']['families']['Update']

export type FamilyMember = Database['public']['Tables']['family_members']['Row']
export type FamilyMemberInsert = Database['public']['Tables']['family_members']['Insert']
export type FamilyMemberUpdate = Database['public']['Tables']['family_members']['Update']

export type FinancialTransaction = Database['public']['Tables']['financial_transactions']['Row']
export type FinancialTransactionInsert = Database['public']['Tables']['financial_transactions']['Insert']
export type FinancialTransactionUpdate = Database['public']['Tables']['financial_transactions']['Update']

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type EventParticipant = Database['public']['Tables']['event_participants']['Row']
export type EventParticipantInsert = Database['public']['Tables']['event_participants']['Insert']
export type EventParticipantUpdate = Database['public']['Tables']['event_participants']['Update']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']


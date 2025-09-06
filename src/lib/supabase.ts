import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

// Cliente para uso no frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações de servidor (com privilégios administrativos)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string
          modalidade: string
          categoria: string
          subcategoria: string | null
          etapa: string
          label: string
          texto: string
          terminal: boolean
          ativo: boolean
          ordem: number
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          modalidade: string
          categoria: string
          subcategoria?: string | null
          etapa: string
          label: string
          texto: string
          terminal?: boolean
          ativo?: boolean
          ordem?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          modalidade?: string
          categoria?: string
          subcategoria?: string | null
          etapa?: string
          label?: string
          texto?: string
          terminal?: boolean
          ativo?: boolean
          ordem?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      laudos: {
        Row: {
          id: string
          usuario_id: string | null
          paciente: string
          idade: number | null
          sexo: string | null
          medico: string
          modalidade: string
          categoria: string
          subcategoria: string | null
          conteudo: string
          conteudo_original: string | null
          conteudo_melhorado: string | null
          templates_usados: string[] | null
          audio_url: string | null
          transcricao: string | null
          metadados: any
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id?: string | null
          paciente: string
          idade?: number | null
          sexo?: string | null
          medico: string
          modalidade: string
          categoria: string
          subcategoria?: string | null
          conteudo: string
          conteudo_original?: string | null
          conteudo_melhorado?: string | null
          templates_usados?: string[] | null
          audio_url?: string | null
          transcricao?: string | null
          metadados?: any
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string | null
          paciente?: string
          idade?: number | null
          sexo?: string | null
          medico?: string
          modalidade?: string
          categoria?: string
          subcategoria?: string | null
          conteudo?: string
          conteudo_original?: string | null
          conteudo_melhorado?: string | null
          templates_usados?: string[] | null
          audio_url?: string | null
          transcricao?: string | null
          metadados?: any
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Funções utilitárias
export async function checkConnection() {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('count', { count: 'exact', head: true })
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro de conexão com Supabase:', error)
    return false
  }
}


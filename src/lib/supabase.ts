import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações administrativas (server-side)
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

// Tipos TypeScript para as tabelas
export interface Categoria {
  id: string
  nome: string
  descricao?: string
  icone?: string
  cor?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  categoria_id: string
  nome: string
  descricao?: string
  modalidade: string
  regiao: string
  tipo_selecao: 'unica' | 'multipla'
  ativo: boolean
  ordem: number
  created_at: string
  updated_at: string
}

export interface TemplateOpcao {
  id: string
  template_id: string
  texto: string
  valor?: string
  grupo?: string
  ordem: number
  terminal: boolean
  ativo: boolean
  created_at: string
}

export interface Laudo {
  id: string
  template_id?: string
  titulo?: string
  conteudo: string
  opcoes_selecionadas?: any[]
  metadados?: any
  melhorado_ia: boolean
  versao_original?: string
  created_at: string
  updated_at: string
}

export interface Atividade {
  id: string
  tipo: string
  descricao?: string
  metadados?: any
  created_at: string
}

// Funções utilitárias
export async function buscarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  if (error) throw error
  return data as Categoria[]
}

export async function buscarTemplatesPorCategoria(categoriaId: string) {
  const { data, error } = await supabase
    .from('templates')
    .select(`
      *,
      categoria:categorias(nome, icone, cor),
      opcoes:template_opcoes(*)
    `)
    .eq('categoria_id', categoriaId)
    .eq('ativo', true)
    .order('ordem')

  if (error) throw error
  return data
}

export async function buscarOpcoesPorTemplate(templateId: string) {
  const { data, error } = await supabase
    .from('template_opcoes')
    .select('*')
    .eq('template_id', templateId)
    .eq('ativo', true)
    .order('grupo, ordem')

  if (error) throw error
  return data as TemplateOpcao[]
}

export async function salvarLaudo(laudo: Omit<Laudo, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('laudos')
    .insert(laudo)
    .select()
    .single()

  if (error) throw error
  return data as Laudo
}

export async function registrarAtividade(tipo: string, descricao?: string, metadados?: any) {
  const { error } = await supabase
    .from('atividades')
    .insert({
      tipo,
      descricao,
      metadados
    })

  if (error) throw error
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos TypeScript
export interface ExamType {
  id: string
  name: string
  slug: string
  title: string
  description?: string
  icon?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  exam_type_id: string
  name: string
  slug: string
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Option {
  id: string
  category_id: string
  label: string
  value: string
  keywords: string[]
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface ReportTemplate {
  id: string
  exam_type_id: string
  name: string
  structure: any
  ai_prompt?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  exam_type_id: string
  patient_name?: string
  patient_age?: string
  patient_gender?: string
  selected_options: string[]
  raw_text?: string
  ai_processed_text?: string
  final_report?: string
  additional_notes?: string
  created_at: string
  updated_at: string
}

// Funções para buscar dados
export class SupabaseService {
  
  // Buscar todos os tipos de exames
  static async getExamTypes(): Promise<ExamType[]> {
    const { data, error } = await supabase
      .from('exam_types')
      .select('*')
      .eq('active', true)
      .order('name')
    
    if (error) throw error
    return data || []
  }

  // Buscar exame por slug
  static async getExamBySlug(slug: string): Promise<ExamType | null> {
    const { data, error } = await supabase
      .from('exam_types')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  }

  // Buscar categorias de um exame
  static async getCategoriesByExam(examTypeId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('exam_type_id', examTypeId)
      .eq('active', true)
      .order('order_index')
    
    if (error) throw error
    return data || []
  }

  // Buscar opções de uma categoria
  static async getOptionsByCategory(categoryId: string): Promise<Option[]> {
    const { data, error } = await supabase
      .from('options')
      .select('*')
      .eq('category_id', categoryId)
      .eq('active', true)
      .order('order_index')
    
    if (error) throw error
    return data || []
  }

  // Buscar todas as opções de um exame (com categorias)
  static async getExamStructure(examTypeId: string) {
    // Buscar categorias
    const categories = await this.getCategoriesByExam(examTypeId)
    
    // Para cada categoria, buscar suas opções
    const structure = await Promise.all(
      categories.map(async (category) => {
        const options = await this.getOptionsByCategory(category.id)
        return {
          ...category,
          options
        }
      })
    )
    
    return structure
  }

  // Buscar template do exame
  static async getReportTemplate(examTypeId: string): Promise<ReportTemplate | null> {
    const { data, error } = await supabase
      .from('report_templates')
      .select('*')
      .eq('exam_type_id', examTypeId)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  }

  // Buscar opções por IDs
  static async getOptionsByIds(optionIds: string[]): Promise<Option[]> {
    const { data, error } = await supabase
      .from('options')
      .select('*')
      .in('id', optionIds)
    
    if (error) throw error
    return data || []
  }

  // Salvar laudo
  static async saveReport(reportData: Partial<Report>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Atualizar laudo
  static async updateReport(id: string, reportData: Partial<Report>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .update(reportData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Buscar laudos do usuário (se implementar autenticação)
  static async getUserReports(limit: number = 10): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        exam_types (name, title)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  }

  // Buscar laudo por ID
  static async getReportById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        exam_types (name, title)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

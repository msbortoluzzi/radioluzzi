import { supabase } from './supabase-dynamic'

export interface ReportMaskSection {
  id: string
  title: string
  order: number
  required: boolean
}

export interface ReportMask {
  id: string
  name: string
  modality: string
  exam_type: string
  sections: ReportMaskSection[] | { sections: ReportMaskSection[] }
  default_texts?: Record<string, string>
  default_text?: Record<string, string>
  formatting_rules: {
    title?: Record<string, any>
    section_title?: Record<string, any>
    body?: Record<string, any>
    impression?: Record<string, any>
  }
  active: boolean
  created_at: string
  updated_at: string
}

export class ReportMaskService {
  // Buscar todas as máscaras ativas
  static async getAllMasks(): Promise<ReportMask[]> {
    const { data, error } = await supabase
      .from('report_masks')
      .select('*')
      .eq('active', true)
      .order('modality', { ascending: true })
      .order('exam_type', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  // Buscar máscaras por modalidade
  static async getMasksByModality(modality: string): Promise<ReportMask[]> {
    const { data, error } = await supabase
      .from('report_masks')
      .select('*')
      .eq('modality', modality)
      .eq('active', true)
      .order('exam_type', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  // Buscar máscara por slug
  static async getMaskBySlug(slug: string): Promise<ReportMask | null> {
    const { data, error } = await supabase
      .from('report_masks')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  }

  // Listar modalidades disponíveis
  static async getAvailableModalities(): Promise<string[]> {
    const { data, error } = await supabase
      .from('report_masks')
      .select('modality')
      .eq('active', true)
    
    if (error) throw error
    
    // Remover duplicatas
    const modalities = [...new Set(data?.map(m => m.modality) || [])]
    return modalities
  }

  // Salvar laudo gerado
  static async saveEditorReport(reportData: {
    mask_id: string
    voice_input?: string
    ai_interpretation?: any
    generated_sections?: any
    final_content: string
    user_corrections?: any
    metadata?: any
  }) {
    const { data, error } = await supabase
      .from('editor_reports')
      .insert([reportData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Buscar histórico de laudos
  static async getReportHistory(limit: number = 10) {
    const { data, error } = await supabase
      .from('editor_reports')
      .select(`
        *,
        report_masks (modality, exam_type)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  }
}

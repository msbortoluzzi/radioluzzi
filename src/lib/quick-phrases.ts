import { createClient } from '@/lib/supabase-dynamic'

export interface QuickPhrase {
  id: string
  category: string
  label: string
  text: string
  keywords: string[]
  modality?: string
  exam_type?: string
  section_id?: string
  is_favorite: boolean
  usage_count: number
}

export class QuickPhrasesService {
  /**
   * Buscar todas as frases prontas
   */
  static async getAllPhrases(): Promise<QuickPhrase[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('quick_phrases')
      .select('*')
      .order('category', { ascending: true })
      .order('label', { ascending: true })
    
    if (error) {
      console.error('Erro ao buscar frases prontas:', error)
      return []
    }
    
    return data || []
  }
  
  /**
   * Buscar frases por modalidade e tipo de exame
   */
  static async getPhrasesByExam(
    modality?: string,
    examType?: string
  ): Promise<QuickPhrase[]> {
    const supabase = createClient()
    
    let query = supabase
      .from('quick_phrases')
      .select('*')
    
    if (modality) {
      query = query.or(`modality.eq.${modality},modality.is.null`)
    }
    
    if (examType) {
      query = query.or(`exam_type.eq.${examType},exam_type.is.null`)
    }
    
    query = query
      .order('category', { ascending: true })
      .order('label', { ascending: true })
    
    const { data, error } = await query
    
    if (error) {
      console.error('Erro ao buscar frases:', error)
      return []
    }
    
    return data || []
  }
  
  /**
   * Incrementar contador de uso de uma frase
   */
  static async incrementUsage(phraseId: string): Promise<void> {
    const supabase = createClient()
    
    await supabase.rpc('increment_phrase_usage', { phrase_id: phraseId })
  }
  
  /**
   * Adicionar nova frase pronta
   */
  static async addPhrase(phrase: Omit<QuickPhrase, 'id' | 'usage_count'>): Promise<QuickPhrase | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('quick_phrases')
      .insert([phrase])
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao adicionar frase:', error)
      return null
    }
    
    return data
  }
  
  /**
   * Atualizar frase existente
   */
  static async updatePhrase(
    phraseId: string,
    updates: Partial<QuickPhrase>
  ): Promise<QuickPhrase | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('quick_phrases')
      .update(updates)
      .eq('id', phraseId)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar frase:', error)
      return null
    }
    
    return data
  }
  
  /**
   * Deletar frase
   */
  static async deletePhrase(phraseId: string): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('quick_phrases')
      .delete()
      .eq('id', phraseId)
    
    if (error) {
      console.error('Erro ao deletar frase:', error)
      return false
    }
    
    return true
  }
}

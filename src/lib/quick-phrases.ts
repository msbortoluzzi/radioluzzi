import { supabase } from '@/lib/supabase-dynamic'

export interface QuickPhrase {
  id: string
  category: string
  label: string
  text: string
  keywords: string[]
  mask_id?: string
  modality?: string
  exam_type?: string
  section_id?: string
  is_favorite: boolean
  usage_count: number
}

export class QuickPhrasesService {
  static async getAllPhrases(): Promise<QuickPhrase[]> {
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

  static async getPhrasesByExam(
    modality?: string,
    examType?: string,
    maskId?: string
  ): Promise<QuickPhrase[]> {
    let query = supabase.from('quick_phrases').select('*')

    if (maskId) {
      query = query.eq('mask_id', maskId)
    }

    if (modality) {
      query = query.or(`modality.eq.${modality},modality.is.null`)
    }

    if (examType) {
      query = query.or(`exam_type.eq.${examType},exam_type.is.null`)
    }

    query = query.order('category', { ascending: true }).order('label', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar frases:', error)
      return []
    }

    return data || []
  }

  static async incrementUsage(phraseId: string): Promise<void> {
    await supabase.rpc('increment_phrase_usage', { phrase_id: phraseId })
  }

  static async addPhrase(
    phrase: Omit<QuickPhrase, 'id' | 'usage_count'>
  ): Promise<QuickPhrase | null> {
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

  static async updatePhrase(
    phraseId: string,
    updates: Partial<QuickPhrase>
  ): Promise<QuickPhrase | null> {
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

  static async deletePhrase(phraseId: string): Promise<boolean> {
    const { error } = await supabase.from('quick_phrases').delete().eq('id', phraseId)

    if (error) {
      console.error('Erro ao deletar frase:', error)
      return false
    }

    return true
  }
}

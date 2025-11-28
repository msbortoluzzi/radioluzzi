import OpenAI from 'openai'
import { supabase } from './supabase-dynamic'

let openaiInstance: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada')
    }
    openaiInstance = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
    })
  }
  return openaiInstance
}

export interface RadiologyKnowledge {
  id: string
  organ: string
  finding: string
  modality: string | null
  keywords: string[]
  description_template: string
  impression_template: string
  severity_levels: any
  additional_info: any
  active: boolean
}

export interface InterpretedFinding {
  organ: string
  finding: string
  severity?: string
  description: string
  impression: string
  confidence: number
}

export class RadiologyAIService {
  static async searchKnowledge(keywords: string[], modality?: string): Promise<RadiologyKnowledge[]> {
    let query = supabase
      .from('radiology_knowledge')
      .select('*')
      .eq('active', true)
      .overlaps('keywords', keywords)

    if (modality) {
      query = query.or(`modality.eq.${modality},modality.is.null`)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  static async interpretVoiceInput(
    voiceText: string,
    modality: string,
    currentSection?: string
  ): Promise<InterpretedFinding[]> {
    try {
      const systemPrompt = `Você é um assistente de radiologia especializado em interpretar ditados médicos.

Sua tarefa é extrair achados radiológicos de um texto ditado e estruturá-los em formato JSON.

Para cada achado identificado, retorne:
- organ: órgão ou estrutura anatômica (padronizado: "tireoide", "fígado", "vesícula biliar", etc.)
- finding: achado principal padronizado ("aumentada", "heterogênea", "nódulo", "cisto", "normal", etc.)
- severity: grau ou classificação (se mencionado)
- raw_description: descrição bruta do achado

IMPORTANTE: reconheça variações de linguagem natural e normalize termos.

Modalidade atual: ${modality}
${currentSection ? `Seção atual: ${currentSection}` : ''}`

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: voiceText }
        ],
        temperature: 0.2,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })

      const responseText = completion.choices[0]?.message?.content || '{}'
      const extracted = JSON.parse(responseText)

      const findings: InterpretedFinding[] = []
      const extractedFindings = Array.isArray(extracted) ? extracted : (extracted.findings || [])

      for (const item of extractedFindings) {
        const keywords = [item.finding, item.organ].filter(Boolean)
        const knowledge = await this.searchKnowledge(keywords, modality)

        if (knowledge.length > 0) {
          const match = knowledge[0]

          let description = match.description_template
          let impression = match.impression_template

          if (item.severity) {
            description = description.replace('{grau}', item.severity)
            impression = impression.replace('{grau}', item.severity)
          }

          findings.push({
            organ: item.organ,
            finding: item.finding,
            severity: item.severity,
            description,
            impression,
            confidence: 0.9
          })
        } else {
          const generatedDescription = await this.generateGenericDescription(
            item.organ,
            item.finding,
            item.severity,
            item.raw_description
          )

          findings.push({
            organ: item.organ,
            finding: item.finding,
            severity: item.severity,
            description: generatedDescription.description,
            impression: generatedDescription.impression,
            confidence: 0.6
          })
        }
      }

      return findings
    } catch (error) {
      console.error('Erro ao interpretar voz:', error)
      throw new Error('Erro ao processar ditado')
    }
  }

  private static async generateGenericDescription(
    organ: string,
    finding: string,
    severity?: string,
    rawDescription?: string
  ): Promise<{ description: string; impression: string }> {
    const prompt = `Gere uma descrição radiológica profissional para:
Órgão: ${organ}
Achado: ${finding}
${severity ? `Grau/Tamanho: ${severity}` : ''}
${rawDescription ? `Descrição bruta: ${rawDescription}` : ''}

Retorne um JSON com:
{
  "description": "frase completa para a seção ACHADOS do laudo",
  "impression": "frase resumida para a seção IMPRESSÃO DIAGNÓSTICA"
}`

    try {
      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um radiologista experiente gerando laudos médicos profissionais.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      })

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
      return {
        description: result.description || rawDescription || '',
        impression: result.impression || finding
      }
    } catch (error) {
      console.error('Erro ao gerar descrição genérica:', error)
      return {
        description: rawDescription || `${organ}: ${finding}${severity ? ' ' + severity : ''}`,
        impression: finding
      }
    }
  }

  static async enhanceReport(reportText: string, modality: string): Promise<string> {
    try {
      const systemPrompt = `Você é um radiologista sênior revisando um laudo de ${modality}.

Melhore o texto mantendo:
- Toda informação médica original
- Terminologia técnica adequada
- Estrutura de seções (TÉCNICA, ACHADOS, IMPRESSÃO)
- Formatação profissional

Não adicione informações novas nem remova achados.`

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: reportText }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      return completion.choices[0]?.message?.content || reportText
    } catch (error) {
      console.error('Erro ao melhorar laudo:', error)
      return reportText
    }
  }

  static async generateImpression(findingsText: string): Promise<string[]> {
    try {
      const systemPrompt = `Você é um radiologista gerando a IMPRESSÃO DIAGNÓSTICA de um laudo.

Baseado nos achados fornecidos, gere uma lista de impressões diagnósticas concisas em formato JSON:
{
  "impressions": ["- Impressão 1", "- Impressão 2"]
}

Regras: inicie com hífen, seja objetivo e ordene por relevância.`

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: findingsText }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
      return result.impressions || ['- Exame sem alterações significativas.']
    } catch (error) {
      console.error('Erro ao gerar impressão diagnóstica:', error)
      return ['- Erro ao gerar impressão diagnóstica.']
    }
  }
}

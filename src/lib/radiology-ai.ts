import OpenAI from 'openai'
import { supabase } from './supabase-dynamic'

// Lazy initialization para evitar erros em build time
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
  
  // Buscar conhecimento radiológico por palavras-chave
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

  // Interpretar texto ditado e extrair achados
  static async interpretVoiceInput(
    voiceText: string,
    modality: string,
    currentSection?: string
  ): Promise<InterpretedFinding[]> {
    try {
      // Usar IA para extrair achados estruturados
      const systemPrompt = `Você é um assistente de radiologia especializado em interpretar ditados médicos.
      
Sua tarefa é extrair achados radiológicos de um texto ditado e estruturá-los em formato JSON.

Para cada achado identificado, retorne:
- organ: órgão ou estrutura anatômica (padronizado: "tireoide", "fígado", "vesícula biliar", etc.)
- finding: achado principal padronizado ("aumentada", "heterogênea", "nódulo", "cisto", "normal", etc.)
- severity: grau ou classificação (se mencionado)
- raw_description: descrição bruta do achado

IMPORTANTE: Reconheça variações de linguagem natural:
- "tireoide aumentada" = "tireoide de dimensões aumentadas" = "tireoide com aumento"
- "ecotextura heterogênea" = "textura heterogênea" = "heterogênea"
- "nódulo" = "formação nodular" = "lesão nodular"

Modalidade atual: ${modality}
${currentSection ? `Seção atual: ${currentSection}` : ''}

Exemplos:
Input: "Tireoide de dimensões aumentadas"
Output: {
  "findings": [
    {
      "organ": "tireoide",
      "finding": "aumentada",
      "severity": null,
      "raw_description": "tireoide de dimensões aumentadas"
    }
  ]
}

Input: "Fígado aumentado, esteatose grau 2"
Output: {
  "findings": [
    {
      "organ": "fígado",
      "finding": "aumentada",
      "severity": null,
      "raw_description": "fígado aumentado"
    },
    {
      "organ": "fígado",
      "finding": "esteatose",
      "severity": "grau 2",
      "raw_description": "esteatose grau 2"
    }
  ]
}

Input: "Nódulo sólido no lobo esquerdo medindo 1.2cm"
Output: {
  "findings": [
    {
      "organ": "tireoide",
      "finding": "nódulo",
      "severity": "1.2cm",
      "raw_description": "nódulo sólido no lobo esquerdo medindo 1.2cm"
    }
  ]
}

Retorne SEMPRE no formato: {"findings": [...]}. Não retorne array direto.`

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4.1-mini',
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
      
      // Processar cada achado extraído
      const findings: InterpretedFinding[] = []
      const extractedFindings = Array.isArray(extracted) ? extracted : (extracted.findings || [])
      
      for (const item of extractedFindings) {
        // Buscar conhecimento correspondente
        const keywords = [item.finding, item.organ].filter(Boolean)
        const knowledge = await this.searchKnowledge(keywords, modality)
        
        if (knowledge.length > 0) {
          const match = knowledge[0]
          
          // Construir descrição e impressão
          let description = match.description_template
          let impression = match.impression_template
          
          // Substituir placeholders
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
          // Gerar descrição genérica com IA se não houver conhecimento
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

  // Gerar descrição genérica quando não há conhecimento específico
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
}

Use terminologia médica adequada e seja objetivo.`

    try {
      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4.1-mini',
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

  // Melhorar texto do laudo completo
  static async enhanceReport(reportText: string, modality: string): Promise<string> {
    try {
      const systemPrompt = `Você é um radiologista sênior revisando um laudo de ${modality}.

Sua tarefa é melhorar o texto do laudo mantendo:
- Toda informação médica original
- Terminologia técnica adequada
- Estrutura de seções (TÉCNICA, ACHADOS, IMPRESSÃO)
- Formatação profissional

Melhore:
- Fluidez e coerência
- Concordância e gramática
- Clareza das descrições

NÃO adicione informações que não estavam no texto original.
NÃO remova achados importantes.

Retorne apenas o laudo melhorado, sem comentários adicionais.`

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4.1-mini',
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

  // Gerar impressão diagnóstica automaticamente
  static async generateImpression(findingsText: string): Promise<string[]> {
    try {
      const systemPrompt = `Você é um radiologista gerando a IMPRESSÃO DIAGNÓSTICA de um laudo.

Baseado nos achados fornecidos, gere uma lista de impressões diagnósticas concisas.

Regras:
- Cada impressão deve começar com hífen (-)
- Seja objetivo e direto
- Use terminologia médica adequada
- Ordene por relevância clínica
- Se não houver achados, retorne apenas: "- Exame sem alterações significativas."

Retorne um JSON com array de strings:
{
  "impressions": ["- Impressão 1", "- Impressão 2"]
}`

      const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4.1-mini',
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
      console.error('Erro ao gerar impressão:', error)
      return ['- Erro ao gerar impressão diagnóstica.']
    }
  }
}

import { generateSimpleReport, type ReportGenerationData } from '@/lib/report-utils'

export class AIService {
  static async generateReport(data: ReportGenerationData): Promise<{
    rawText: string
    aiProcessedText: string
    finalReport: string
  }> {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(errorText || 'Falha ao gerar laudo com IA')
    }

    return response.json()
  }

  static generateSimpleReport = generateSimpleReport
}

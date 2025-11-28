import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { formatFinalReport, generateRawText, type ReportGenerationData } from '@/lib/report-utils'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY não configurada' }, { status: 500 })
    }

    const body = (await request.json()) as Partial<ReportGenerationData>
    if (!body || !body.categories || !body.selectedOptions || !body.template) {
      return NextResponse.json({ error: 'Dados insuficientes para gerar laudo' }, { status: 400 })
    }

    const data = body as ReportGenerationData
    const rawText = generateRawText(data)

    const systemPrompt =
      data.template.ai_prompt ||
      'Você é um radiologista experiente. Melhore o laudo mantendo precisão, clareza e sem inventar informações.'

    const patientInfo: string[] = []
    if (data.patientData?.name) patientInfo.push(`Nome: ${data.patientData.name}`)
    if (data.patientData?.age) patientInfo.push(`Idade: ${data.patientData.age}`)
    if (data.patientData?.gender) patientInfo.push(`Sexo: ${data.patientData.gender}`)

    const userPrompt = `
${patientInfo.length ? `Dados do paciente:\n${patientInfo.join('\n')}\n\n` : ''}
Laudo para revisar e melhorar:
${rawText}

${data.additionalNotes ? `Observações adicionais: ${data.additionalNotes}\n` : ''}
Mantenha a estrutura e não adicione nem remova achados clínicos.
`

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    const aiProcessedText = completion.choices[0]?.message?.content || rawText
    const finalReport = formatFinalReport(aiProcessedText, data.patientData || {})

    return NextResponse.json({ rawText, aiProcessedText, finalReport })
  } catch (error) {
    console.error('Erro ao gerar laudo com IA:', error)
    return NextResponse.json({ error: 'Erro ao gerar laudo com IA' }, { status: 500 })
  }
}

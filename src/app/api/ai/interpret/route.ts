import { NextRequest, NextResponse } from 'next/server'
import { RadiologyAIService } from '@/lib/radiology-ai'

export async function POST(request: NextRequest) {
  try {
    const { text, modality } = await request.json()
    
    if (!text || !modality) {
      return NextResponse.json(
        { error: 'Texto e modalidade são obrigatórios' },
        { status: 400 }
      )
    }
    
    const findings = await RadiologyAIService.interpretVoiceInput(text, modality)
    
    return NextResponse.json({ findings })
    
  } catch (error) {
    console.error('Erro na API de IA:', error)
    return NextResponse.json(
      { error: 'Erro ao processar com IA' },
      { status: 500 }
    )
  }
}

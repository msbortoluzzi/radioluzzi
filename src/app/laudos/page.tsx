'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { ReportMaskService, type ReportMask } from '@/lib/report-masks'
import {
  QuickPhrasesService,
  type QuickPhrase as ServiceQuickPhrase
} from '@/lib/quick-phrases'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { EditorSectionManager } from '@/lib/editor-section-manager'
import DictationArea from '@/components/DictationArea'
import QuickPhrasesPanel, {
  type QuickPhrase as PanelQuickPhrase
} from '@/components/QuickPhrasesPanel'

type AIInterpretFinding = {
  description: string
  impression?: string | null
}

type AIInterpretResponse = {
  findings?: AIInterpretFinding[]
}

const ReportEditor = dynamic(() => import('@/components/ReportEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-[#222222] rounded-lg bg-[#111111] p-6 min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-100 text-sm">Carregando editor...</p>
      </div>
    </div>
  )
})

const EditorLaudosPage: React.FC = () => {
  const [masks, setMasks] = useState<ReportMask[]>([])
  const [selectedMask, setSelectedMask] = useState<ReportMask | null>(null)
  const [modalities, setModalities] = useState<string[]>([])
  const [selectedModality, setSelectedModality] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editorContent, setEditorContent] = useState('')
  const [dictationText, setDictationText] = useState('')
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const [quickPhrases, setQuickPhrases] = useState<PanelQuickPhrase[]>([])

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    lang: 'pt-BR',
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setDictationText((prev) => (prev + ' ' + text).trim())
      }
    }
  })

  useEffect(() => {
    void loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [allMasks, availableModalities, phrases] = await Promise.all([
        ReportMaskService.getAllMasks(),
        ReportMaskService.getAvailableModalities(),
        QuickPhrasesService.getAllPhrases()
      ])

      setMasks(allMasks)
      setModalities(availableModalities)
      setQuickPhrases(phrases as unknown as PanelQuickPhrase[])

      if (availableModalities.length > 0) {
        setSelectedModality(availableModalities[0])
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar máscaras de laudos')
    } finally {
      setLoading(false)
    }
  }

  const filteredMasks = masks.filter(
    (mask) => !selectedModality || mask.modality === selectedModality
  )

  const handleSelectMask = useCallback((mask: ReportMask) => {
    setSelectedMask(mask)

    const sections = Array.isArray(mask.sections) ? mask.sections : mask.sections?.sections || []
    const defaultText = mask.default_texts || mask.default_text || {}

    const cleanedSections: string[] = []
    const impressionLines: string[] = []

    sections
      .sort((a, b) => a.order - b.order)
      .forEach((section) => {
        const raw = (defaultText[section.id] || '').replace(/\\n/g, '\n')
        const lines = raw
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .filter((l) => !l.toLowerCase().includes('clique aqui'))
          .filter((l) => l.toUpperCase() !== mask.name.toUpperCase())
          .filter((l) => l.toUpperCase() !== section.title.toUpperCase())

        if (section.title.toLowerCase().includes('impress')) {
          impressionLines.push(...lines)
        } else {
          cleanedSections.push(...lines)
        }
      })

    let initialContent =
      '<div style="font-family: Arial, sans-serif; font-size: 11pt; color: #e5e7eb; line-height: 1.6;">'
    initialContent += `<p style="text-align: center; font-weight: bold; font-size: 11pt; margin-bottom: 18pt;">ULTRASSONOGRAFIA DE TIREOIDE</p>`
    initialContent += `<p style="font-style: italic; margin-bottom: 16pt;">Indicação clínica:</p>`
    initialContent += `<p style="height: 8px; margin: 0 0 16pt 0;">&nbsp;</p>`
    initialContent += `<p style="font-weight: bold; font-size: 11pt; margin-bottom: 12pt;">RELATÓRIO:</p>`
    cleanedSections.forEach((line) => {
      initialContent += `<p style="font-size: 11pt; margin: 4px 0 10px 0;">${line}</p>`
    })
    initialContent += `<p style="height: 12px; margin: 0 0 12pt 0;">&nbsp;</p>`

    initialContent += `<p style="font-weight: bold; font-size: 11pt; margin-top: 18pt; margin-bottom: 10pt;">IMPRESSÃO:</p>`
    const finalImpression = impressionLines.length
      ? impressionLines
      : ['Exame sem alterações significativas.']
    finalImpression.forEach((line) => {
      initialContent += `<p style="font-size: 11pt; margin: 4px 0 8px 0;">${line}</p>`
    })
    initialContent += `<p style="height: 8px; margin: 0 0 8pt 0;">&nbsp;</p>`

    initialContent += '</div>'

    setEditorContent(initialContent)
    void loadQuickPhrasesForExam(mask.modality, mask.exam_type, mask.id)
  }, [])

  const loadQuickPhrasesForExam = async (modality: string, examType: string, maskId?: string) => {
    const phrases = await QuickPhrasesService.getPhrasesByExam(modality, examType, maskId)
    setQuickPhrases(phrases as unknown as PanelQuickPhrase[])
  }

  const selectedSections = useMemo(() => {
    if (!selectedMask) return []
    const sections = Array.isArray(selectedMask.sections)
      ? selectedMask.sections
      : selectedMask.sections?.sections || []
    return sections.map((s) => ({ id: s.id, title: s.title }))
  }, [selectedMask])

  const handleProcessWithAI = useCallback(async () => {
    if (!selectedMask || !dictationText.trim()) return

    try {
      setIsProcessingAI(true)

      const response = await fetch('/api/ai/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: dictationText,
          modality: selectedMask.modality
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao processar com IA')
      }

      const data = (await response.json()) as AIInterpretResponse
      const findings = Array.isArray(data.findings) ? data.findings : []

      if (findings.length === 0) {
        alert('IA não conseguiu interpretar os achados.')
        return
      }

      const normalize = (text: string) =>
        text
          .replace(/\{[^}]+\}/g, '')
          .replace(/_+/g, '')
          .replace(/\s+/g, ' ')
          .trim()

      const paragraphs: string[] = []

      findings.forEach((finding) => {
        const cleaned = normalize(finding.description)
        if (cleaned) paragraphs.push(cleaned)
      })

      const impressions = findings
        .map((f) => f.impression)
        .filter((i): i is string => !!i)
        .map((imp) => normalize(imp))
        .filter(Boolean)
        .map((imp) => `- ${imp}`)

      if (impressions.length) {
        paragraphs.push('IMPRESSÃO:')
        paragraphs.push(...impressions)
      }

      const seen = new Set<string>()
      const unique = paragraphs.filter((p) => {
        const key = p.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      const plain = unique.join('\n\n').trim()
      const html = `<div style="font-family: Arial, sans-serif; font-size: 11pt; color: #e5e7eb; line-height: 1.6;">${unique
        .map((p) => `<p style="margin: 6px 0;">${p}</p>`)
        .join('')}</div>`

      setDictationText(plain)
      setEditorContent((prev) => `${prev}<br/>${html}`)
    } catch (err) {
      console.error('Erro ao processar com IA:', err)
      alert('Erro ao processar com IA.')
    } finally {
      setIsProcessingAI(false)
    }
  }, [selectedMask, dictationText])

  const handleAddToReport = useCallback(() => {
    if (!selectedMask || !dictationText.trim()) return

    const sections = Array.isArray(selectedMask.sections)
      ? selectedMask.sections
      : selectedMask.sections?.sections || []

    const sectionIds = sections.map((s) => s.id)
    const sectionTitles: Record<string, string> = {}
    sections.forEach((s) => {
      sectionTitles[s.id] = s.title
    })

    const updatedContent = EditorSectionManager.processVoiceInput(
      editorContent,
      dictationText,
      `<p>${dictationText.replace(/\n/g, '<br>')}</p>`,
      sectionIds,
      sectionTitles
    )

    setEditorContent(updatedContent)
    setDictationText('')
  }, [selectedMask, dictationText, editorContent])

  const handleSelectQuickPhrase = useCallback((phrase: PanelQuickPhrase) => {
    setDictationText((prev) => (prev + ' ' + phrase.text).trim())
    void QuickPhrasesService.incrementUsage(phrase.id)
  }, [])

  const handleCopyReport = useCallback(() => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorContent
    const plainText = tempDiv.innerText || tempDiv.textContent || ''

    navigator.clipboard.writeText(plainText).then(() => {
      alert('Laudo copiado!')
    })
  }, [editorContent])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <p className="text-gray-400 italic text-lg">“No limiar, é só você, o laudo e a linha perfeita.”</p>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
              <h3 className="text-lg font-semibold mb-3">Modalidades</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {modalities.map((mod) => (
                  <button
                    key={mod}
                    onClick={() => setSelectedModality(mod)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedModality === mod
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#0f0f0f] text-gray-100 border border-[#222222] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredMasks.map((mask) => (
                  <button
                    key={mask.id}
                    onClick={() => handleSelectMask(mask)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedMask?.id === mask.id
                        ? 'bg-blue-600 text-white border-2 border-blue-500'
                        : 'bg-[#0f0f0f] text-gray-100 border border-[#222222] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {mask.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sticky top-4">
              {selectedMask ? (
                <QuickPhrasesPanel
                  phrases={quickPhrases}
                  onSelectPhrase={handleSelectQuickPhrase}
                  disabled={!selectedMask}
                  sections={selectedSections}
                />
              ) : (
                <div className="bg-[#111111] rounded-lg border border-[#222222] p-4 text-sm text-gray-400">
                  Selecione um exame para ver as frases prontas.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <DictationArea
              text={dictationText}
              isListening={isListening}
              isProcessing={isProcessingAI}
              onTextChange={setDictationText}
              onStartListening={startListening}
              onStopListening={stopListening}
              onProcessWithAI={handleProcessWithAI}
              onAddToReport={handleAddToReport}
              onClear={() => setDictationText('')}
              disabled={!selectedMask}
            />

            <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-semibold">Laudo Final</h3>
                <button
                  onClick={handleCopyReport}
                  disabled={!selectedMask}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Copiar
                </button>
              </div>

              {selectedMask ? (
                <ReportEditor content={editorContent} onChange={setEditorContent} editable={true} />
              ) : (
                <div className="border border-[#222222] rounded-lg bg-[#0f0f0f] p-12 text-center">
                  <p className="text-gray-400">Selecione uma máscara</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorLaudosPage

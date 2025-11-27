'use client'

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ReportMaskService, type ReportMask } from '@/lib/report-masks'
import { QuickPhrasesService, type QuickPhrase } from '@/lib/quick-phrases'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { EditorSectionManager } from '@/lib/editor-section-manager'
import DictationArea from '@/components/DictationArea'
import QuickPhrasesPanel from '@/components/QuickPhrasesPanel'

// Importar editor dinamicamente
const ReportEditor = dynamic(() => import('@/components/ReportEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg bg-white p-6 min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Carregando editor...</p>
      </div>
    </div>
  )
})

const EditorLaudosPage: React.FC = () => {
  // Estados principais
  const [masks, setMasks] = useState<ReportMask[]>([])
  const [selectedMask, setSelectedMask] = useState<ReportMask | null>(null)
  const [modalities, setModalities] = useState<string[]>([])
  const [selectedModality, setSelectedModality] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados do editor
  const [editorContent, setEditorContent] = useState('')
  
  // Estados da área de ditação
  const [dictationText, setDictationText] = useState('')
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  
  // Estados de frases prontas
  const [quickPhrases, setQuickPhrases] = useState<QuickPhrase[]>([])
  
  // Reconhecimento de voz
  const {
    isListening,
    startListening,
    stopListening
  } = useSpeechRecognition({
    lang: 'pt-BR',
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setDictationText(prev => (prev + ' ' + text).trim())
      }
    }
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
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
      setQuickPhrases(phrases)
      
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

  // Filtrar máscaras por modalidade
  const filteredMasks = masks.filter(mask => 
    !selectedModality || mask.modality === selectedModality
  )

  // Selecionar máscara e carregar template
  const handleSelectMask = useCallback((mask: ReportMask) => {
    setSelectedMask(mask)
    
    const sections = Array.isArray(mask.sections) ? mask.sections : (mask.sections?.sections || [])
    const defaultText = mask.default_texts || mask.default_text || {}
    
    let initialContent = `<h1 style="text-align: center;"><strong>${mask.name.toUpperCase()}</strong></h1><br>`
    
    sections
      .sort((a, b) => a.order - b.order)
      .forEach(section => {
        if (section.type === 'title') return
        
        initialContent += `<h2><strong>${section.title}</strong></h2>`
        
        const sectionContent = defaultText[section.id] || ''
        if (sectionContent) {
          const formattedContent = sectionContent.replace(/\\n/g, '<br>').replace(/\n/g, '<br>')
          initialContent += `<p>${formattedContent}</p>`
        } else {
          initialContent += `<p><em>Clique aqui ou dite para preencher...</em></p>`
        }
        
        initialContent += '<br>'
      })
    
    setEditorContent(initialContent)
    loadQuickPhrasesForExam(mask.modality, mask.exam_type)
  }, [])

  const loadQuickPhrasesForExam = async (modality: string, examType: string) => {
    const phrases = await QuickPhrasesService.getPhrasesByExam(modality, examType)
    setQuickPhrases(phrases)
  }

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
      
      const { findings } = await response.json()
      
      if (findings.length === 0) {
        alert('IA não conseguiu interpretar os achados.')
        return
      }
      
      let formattedText = ''
      findings.forEach(finding => {
        formattedText += `${finding.description}\n\n`
      })
      
      if (findings.some(f => f.impression)) {
        formattedText += 'IMPRESSÃO:\n'
        findings.forEach(finding => {
          if (finding.impression) {
            formattedText += `- ${finding.impression}\n`
          }
        })
      }
      
      setDictationText(formattedText.trim())
      
    } catch (error) {
      console.error('Erro ao processar com IA:', error)
      alert('Erro ao processar com IA.')
    } finally {
      setIsProcessingAI(false)
    }
  }, [selectedMask, dictationText])

  const handleAddToReport = useCallback(() => {
    if (!selectedMask || !dictationText.trim()) return
    
    const sections = Array.isArray(selectedMask.sections) 
      ? selectedMask.sections 
      : (selectedMask.sections?.sections || [])
    
    const sectionIds = sections.map(s => s.id)
    const sectionTitles: Record<string, string> = {}
    sections.forEach(s => {
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

  const handleSelectQuickPhrase = useCallback((phrase: QuickPhrase) => {
    setDictationText(prev => (prev + ' ' + phrase.text).trim())
    QuickPhrasesService.incrementUsage(phrase.id)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editor Inteligente de Laudos
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Máscaras */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">Máscaras</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Modalidade</label>
                <div className="flex flex-col gap-2">
                  {modalities.map(modality => (
                    <button
                      key={modality}
                      onClick={() => setSelectedModality(modality)}
                      className={`px-3 py-2 rounded-md text-sm ${
                        selectedModality === modality
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {modality}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filteredMasks.map(mask => (
                  <button
                    key={mask.id}
                    onClick={() => handleSelectMask(mask)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedMask?.id === mask.id
                        ? 'bg-blue-50 border-2 border-blue-600'
                        : 'bg-gray-50 border hover:bg-gray-100'
                    }`}
                  >
                    {mask.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ditação + Laudo */}
          <div className="lg:col-span-7 space-y-4">
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

            <div className="bg-white rounded-lg border p-4">
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
                <ReportEditor
                  content={editorContent}
                  onChange={setEditorContent}
                  editable={true}
                />
              ) : (
                <div className="border rounded-lg bg-gray-50 p-12 text-center">
                  <p className="text-gray-500">Selecione uma máscara</p>
                </div>
              )}
            </div>
          </div>

          {/* Frases Prontas */}
          <div className="lg:col-span-3">
            <div className="sticky top-4">
              <QuickPhrasesPanel
                phrases={quickPhrases}
                onSelectPhrase={handleSelectQuickPhrase}
                disabled={!selectedMask}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorLaudosPage

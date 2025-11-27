'use client'

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ReportMaskService, type ReportMask } from '@/lib/report-masks'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { RadiologyAIService } from '@/lib/radiology-ai'

// Importar editor dinamicamente para evitar problemas de SSR
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
  
  // Estados da IA
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true)
  
  // Processar texto com IA
  const processWithAI = useCallback(async (text: string) => {
    if (!selectedMask || !aiEnabled) return text
    
    try {
      setIsProcessingAI(true)
      
      // Interpretar achados
      const findings = await RadiologyAIService.interpretVoiceInput(
        text,
        selectedMask.modality
      )
      
      if (findings.length === 0) {
        return text
      }
      
      // Construir texto formatado
      let formattedText = ''
      findings.forEach(finding => {
        formattedText += `<p>${finding.description}</p>`
      })
      
      return formattedText
      
    } catch (error) {
      console.error('Erro ao processar com IA:', error)
      return `<p>${text}</p>`
    } finally {
      setIsProcessingAI(false)
    }
  }, [selectedMask, aiEnabled])
  
  // Reconhecimento de voz
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechSupported,
    error: speechError
  } = useSpeechRecognition({
    lang: 'pt-BR',
    continuous: true,
    interimResults: true,
    onResult: async (text, isFinal) => {
      if (isFinal && text.trim()) {
        // Processar com IA se habilitado
        const processedText = await processWithAI(text)
        
        // Adicionar ao editor
        setEditorContent(prev => {
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = prev
          const lastP = tempDiv.querySelector('p:last-child')
          
          if (lastP && lastP.innerHTML.includes('Clique aqui ou dite')) {
            lastP.innerHTML = processedText
          } else {
            tempDiv.innerHTML += processedText
          }
          
          return tempDiv.innerHTML
        })
      }
    },
    onError: (error) => {
      console.error('Erro de voz:', error)
    }
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [allMasks, availableModalities] = await Promise.all([
        ReportMaskService.getAllMasks(),
        ReportMaskService.getAvailableModalities()
      ])
      
      setMasks(allMasks)
      setModalities(availableModalities)
      
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
    
    // Montar conteúdo inicial do laudo
    const sections = Array.isArray(mask.sections) ? mask.sections : (mask.sections?.sections || [])
    const defaultText = mask.default_texts || mask.default_text || {}
    
    let initialContent = `<h1 style="text-align: center;"><strong>${mask.name.toUpperCase()}</strong></h1><br>`
    
    sections
      .sort((a, b) => a.order - b.order)
      .forEach(section => {
        initialContent += `<h2><strong>${section.title}</strong></h2>`
        
        const sectionContent = defaultText[section.id] || ''
        if (sectionContent) {
          initialContent += `<p>${sectionContent}</p>`
        } else {
          initialContent += `<p><em>Clique aqui ou dite para preencher...</em></p>`
        }
        
        initialContent += '<br>'
      })
    
    setEditorContent(initialContent)
  }, [])

  // Copiar laudo para área de transferência
  const handleCopyReport = useCallback(() => {
    if (!editorContent) return
    
    // Converter HTML para texto simples mantendo formatação básica
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorContent
    const textContent = tempDiv.innerText
    
    navigator.clipboard.writeText(textContent)
      .then(() => {
        alert('✅ Laudo copiado para a área de transferência!')
      })
      .catch(() => {
        alert('❌ Erro ao copiar laudo')
      })
  }, [editorContent])

  // Salvar laudo
  const handleSaveReport = useCallback(async () => {
    if (!selectedMask || !editorContent) return
    
    try {
      await ReportMaskService.saveEditorReport({
        mask_id: selectedMask.id,
        final_content: editorContent,
        metadata: {
          modality: selectedMask.modality,
          exam_name: selectedMask.exam_name,
          saved_at: new Date().toISOString()
        }
      })
      
      alert('✅ Laudo salvo com sucesso!')
    } catch (err) {
      console.error('Erro ao salvar laudo:', err)
      alert('❌ Erro ao salvar laudo')
    }
  }, [selectedMask, editorContent])

  // Limpar editor
  const handleClearEditor = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar o editor?')) {
      setEditorContent('')
      setSelectedMask(null)
    }
  }, [])

  // Ícones de modalidade
  const getModalityIcon = (modality: string) => {
    const icons: Record<string, string> = {
      'US': '🔊',
      'TC': '🔄',
      'RM': '🧲',
      'RX': '📷',
      'Mamografia': '🩺'
    }
    return icons[modality] || '📋'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema de laudos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadInitialData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editor Inteligente de Laudos
          </h1>
          <p className="text-gray-600">
            Selecione uma máscara e comece a ditar ou digitar seu laudo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Seleção de Máscaras */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Máscaras</h2>
              
              {/* Filtro por Modalidade */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidade
                </label>
                <div className="flex flex-wrap gap-2">
                  {modalities.map(modality => (
                    <button
                      key={modality}
                      onClick={() => setSelectedModality(modality)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedModality === modality
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getModalityIcon(modality)} {modality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Máscaras */}
              <div className="space-y-2">
                {filteredMasks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma máscara disponível
                  </p>
                ) : (
                  filteredMasks.map(mask => (
                    <button
                      key={mask.id}
                      onClick={() => handleSelectMask(mask)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedMask?.id === mask.id
                          ? 'bg-blue-50 border-2 border-blue-600 text-blue-900'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{mask.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {mask.modality}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Área Principal - Editor */}
          <div className="lg:col-span-3">
            {/* Barra de Ações */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (isListening) {
                        stopListening()
                      } else {
                        startListening()
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                      isListening
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={!selectedMask || !isSpeechSupported || isProcessingAI}
                    title={!isSpeechSupported ? 'Reconhecimento de voz não suportado neste navegador' : ''}
                  >
                    {isListening ? (
                      <>
                        <span className="animate-pulse">🎤</span>
                        Ditando... (Clique para parar)
                      </>
                    ) : (
                      <>
                        🎤 Iniciar Ditado
                      </>
                    )}
                  </button>
                  
                  {/* Toggle IA */}
                  <button
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      aiEnabled
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                    title={aiEnabled ? 'IA ativada - Clique para desativar' : 'IA desativada - Clique para ativar'}
                  >
                    {aiEnabled ? '✨ IA Ativa' : '⚫ IA Desativada'}
                  </button>
                  
                  {/* Indicador de processamento */}
                  {isProcessingAI && (
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span>Processando com IA...</span>
                    </div>
                  )}
                  
                  {/* Mostrar transcrição em tempo real */}
                  {(transcript || interimTranscript) && (
                    <div className="text-sm text-gray-600 max-w-md truncate">
                      {interimTranscript && (
                        <span className="italic text-gray-400">{interimTranscript}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Mostrar erro de voz */}
                  {speechError && (
                    <div className="text-sm text-red-600">
                      ⚠️ {speechError}
                    </div>
                  )}
                  
                  {selectedMask && (
                    <span className="text-sm text-gray-600">
                      Máscara: <strong>{selectedMask.exam_name}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    disabled={!editorContent}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📋 Copiar
                  </button>
                  <button
                    onClick={handleSaveReport}
                    disabled={!editorContent || !selectedMask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💾 Salvar
                  </button>
                  <button
                    onClick={handleClearEditor}
                    disabled={!editorContent}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🗑️ Limpar
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            {selectedMask ? (
              <ReportEditor
                content={editorContent}
                onChange={setEditorContent}
                placeholder="Selecione uma máscara e comece a ditar ou digitar..."
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecione uma Máscara
                </h3>
                <p className="text-gray-600">
                  Escolha uma modalidade e tipo de exame na barra lateral para começar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorLaudosPage

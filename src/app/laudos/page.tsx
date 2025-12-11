'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { ReportMaskService, type ReportMask } from '@/lib/report-masks'
import { QuickPhrasesService } from '@/lib/quick-phrases'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { EditorSectionManager } from '@/lib/editor-section-manager'
import DictationArea from '@/components/DictationArea'
import QuickPhrasesPanel, { type QuickPhrase as PanelQuickPhrase } from '@/components/QuickPhrasesPanel'
import { MaskManager } from '@/app/config/mask-manager'

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
  const [showConfig, setShowConfig] = useState(false)
  const [showPhraseManager, setShowPhraseManager] = useState(false)
  const [editingPhrase, setEditingPhrase] = useState<PanelQuickPhrase | null>(null)
  const [formText, setFormText] = useState('')
  const [formLabel, setFormLabel] = useState('')
  const [formSection, setFormSection] = useState<string>('')
  const [formLine, setFormLine] = useState<string>('')

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
      const [allMasks, availableModalities] = await Promise.all([
        ReportMaskService.getAllMasks(),
        ReportMaskService.getAvailableModalities()
      ])

      setMasks(allMasks)
      setModalities(availableModalities)

      if (availableModalities.length > 0) {
        setSelectedModality(availableModalities[0])
      } else if (allMasks.length > 0) {
        setSelectedModality(allMasks[0].modality)
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar máscaras de laudos')
    } finally {
      setLoading(false)
    }
  }

  const filteredMasks = masks.filter((mask) => !selectedModality || mask.modality === selectedModality)

  const handleSelectMask = useCallback((mask: ReportMask) => {
    setSelectedMask(mask)

    const sections = Array.isArray(mask.sections) ? mask.sections : mask.sections?.sections || []
    const defaultText = mask.default_texts || mask.default_text || {}

    const cleanedSections: { id: string; text: string; line: number }[] = []
    const impressionLines: { id: string; text: string; line: number }[] = []
    const indicacaoLines: { id: string; text: string; line: number }[] = []
    let headingFromSection = ''
    const lineCounter: Record<string, number> = {}

    sections
      .sort((a, b) => a.order - b.order)
      .forEach((section) => {
        const raw = (defaultText[section.id] || section.content || '').replace(/\\n/g, '\n')
        const lines = raw
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => !l.toLowerCase().includes('clique aqui'))
          .filter((l) => l.toUpperCase() !== mask.name?.toUpperCase())
          .filter((l) => l.toUpperCase() !== section.title?.toUpperCase())

        const idLower = (section.id || '').toString().toLowerCase()
        const titleLower = (section.title || '').toString().toLowerCase()

        if (titleLower.includes('titulo') || idLower.includes('titulo')) {
          headingFromSection = lines.join(' ')
        } else if (titleLower.includes('impress') || idLower.includes('impress')) {
          const sourceLines = lines.length ? lines : ['']
          sourceLines.forEach((line) => {
            const next = (lineCounter[section.id] || 0) + 1
            lineCounter[section.id] = next
            impressionLines.push({ id: section.id || 'impressao', text: line, line: next })
          })
        } else if (titleLower.includes('indicacao') || idLower.includes('indicacao')) {
          const sourceLines = lines.length ? lines : ['']
          sourceLines.forEach((line) => {
            const next = (lineCounter[section.id] || 0) + 1
            lineCounter[section.id] = next
            indicacaoLines.push({ id: section.id || 'indicacao', text: line, line: next })
          })
        } else {
          const sourceLines = lines.length ? lines : ['','','','','']
          sourceLines.forEach((line) => {
            const next = (lineCounter[section.id] || 0) + 1
            lineCounter[section.id] = next
            cleanedSections.push({ id: section.id || 'relatorio', text: line, line: next })
          })
        }
      })

    const examTitle = (headingFromSection || mask.exam_name || mask.name || mask.slug || 'Exame').toUpperCase()

    let initialContent =
      '<div class="line-numbered" style="font-family: Arial, sans-serif; font-size: 11pt; color: #e5e7eb; line-height: 1.6;">'
    initialContent += `<p style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 12pt;">${examTitle}</p>`
    initialContent += `<p style="height: 10pt;">&nbsp;</p>`

    const renderLine = (id: string, text: string, line: number, extraMargin = '4px 0 8px 0') => {
      initialContent += `<p data-section="${id}" data-line="${line}" style="margin:${extraMargin}; font-size:11pt; border-bottom:1px solid #1f1f1f; min-height:18px;">
        ${text || '&nbsp;'}
      </p>`
    }

    if (mask.show_indicacao) {
      if (indicacaoLines.length === 0) {
        renderLine('indicacao', '', 1)
      } else {
        indicacaoLines.forEach(({ id, text, line }) => renderLine(id, text, line))
      }
      initialContent += `<p style="height: 8pt;">&nbsp;</p>`
    }

    cleanedSections.forEach(({ id, text, line }) => renderLine(id, text, line))

    if (mask.show_impressao !== false && impressionLines.length) {
      initialContent += `<p style="font-weight: bold; margin-top: 10pt; margin-bottom: 6pt;">IMPRESSÃO:</p>`
      impressionLines.forEach(({ id, text, line }) => renderLine(id, text, line, '2px 0 6px 0'))
    }

    initialContent += '</div>'

    setEditorContent(initialContent)
    void loadQuickPhrasesForExam(mask.modality, mask.exam_type, mask.id)
  }, [])

  const loadQuickPhrasesForExam = async (modality: string, examType: string, maskId?: string) => {
    const phrases = await QuickPhrasesService.getPhrasesByExam(modality, examType, maskId)

    const filtered = (phrases as unknown as PanelQuickPhrase[]).filter((p) => {
      if (maskId && p.mask_id === maskId) return true
      if (maskId && p.mask_id && p.mask_id !== maskId) return false

      if (modality) {
        if (p.modality !== modality) return false
      } else if (p.modality) {
        return false
      }

      if (examType) {
        if (p.exam_type && p.exam_type !== examType) return false
      } else if (p.exam_type) {
        return false
      }

      return true
    })

    setQuickPhrases(filtered)
  }

  const selectedSections = useMemo(() => {
    if (!selectedMask) return []
    const sections = Array.isArray(selectedMask.sections)
      ? selectedMask.sections
      : selectedMask.sections?.sections || []
    return sections.map((s) => ({ id: s.id, title: s.title }))
  }, [selectedMask])

  useEffect(() => {
    if (selectedSections.length && !formSection) {
      setFormSection(selectedSections[0].id)
    }
  }, [selectedSections, formSection])

  const handleSelectQuickPhrase = useCallback(
    (phrase: PanelQuickPhrase) => {
      if (!selectedMask) return

      const sections = Array.isArray(selectedMask.sections)
        ? selectedMask.sections
        : selectedMask.sections?.sections || []
      const sectionTitles: Record<string, string> = {}
      sections.forEach((s) => {
        sectionTitles[s.id] = s.title
      })

      const lineKeyword = phrase.keywords?.find((k) => /^line:\d+$/i.test(k))
      const lineIndex = lineKeyword ? Number(lineKeyword.split(':')[1]) : undefined

      if (phrase.section_id) {
        const updated = EditorSectionManager.replaceSectionContent(
          editorContent,
          phrase.section_id,
          `<p>${phrase.text}</p>`,
          sectionTitles,
          lineIndex
        )
        setEditorContent(updated)
      } else {
        setEditorContent((prev) => prev + `<p>${phrase.text}</p>`)
      }

      void QuickPhrasesService.incrementUsage(phrase.id)
    },
    [selectedMask, editorContent]
  )

  const handlePhraseDeleted = useCallback((id: string) => {
    setQuickPhrases((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const handleSavePhrase = useCallback(async () => {
    if (!selectedMask || !formText.trim()) return
    const sectionId = formSection || selectedSections[0]?.id || null
    const label = formLabel.trim() || formText.trim().slice(0, 60)
    const lineNumber = formLine.trim() ? Number(formLine.trim()) : undefined
    const lineKeyword = lineNumber && lineNumber > 0 ? `line:${lineNumber}` : null

    const payload = {
      category: selectedSections.find((s) => s.id === sectionId)?.title || 'Geral',
      label,
      text: formText.trim(),
      keywords: lineKeyword ? [lineKeyword] : [],
      mask_id: selectedMask.id,
      modality: selectedMask.modality,
      exam_type: selectedMask.exam_type,
      section_id: sectionId,
      is_favorite: false
    }

    if (editingPhrase) {
      const updated = await QuickPhrasesService.updatePhrase(editingPhrase.id, payload as any)
      if (updated) {
        setQuickPhrases((prev) => prev.map((p) => (p.id === editingPhrase.id ? (updated as any) : p)))
      }
    } else {
      const created = await QuickPhrasesService.addPhrase(payload as any)
      if (created) {
        setQuickPhrases((prev) => [...prev, created as any])
      }
    }

    setEditingPhrase(null)
    setFormText('')
    setFormLabel('')
    setFormLine('')
    setShowPhraseManager(false)
  }, [selectedMask, formText, formLabel, formLine, formSection, selectedSections, editingPhrase])

  const handleProcessDictationWithAI = useCallback(async () => {
    if (!dictationText.trim()) return
    setIsProcessingAI(true)
    try {
      const res = await fetch('/api/ai/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: dictationText,
          modality: selectedMask?.modality || selectedModality || 'geral'
        })
      })

      if (!res.ok) {
        throw new Error('Falha ao processar texto com IA')
      }

      const data = (await res.json()) as { findings?: { description?: string; impression?: string }[] }
      const assembled =
        data.findings
          ?.map((f) => f.description || f.impression || '')
          .filter((t) => t && t.trim().length > 0)
          .join('\n') || ''

      if (assembled) {
        setDictationText(assembled)
      }
    } catch (err) {
      console.error('Erro no Radioluzzi+:', err)
    } finally {
      setIsProcessingAI(false)
    }
  }, [dictationText, selectedMask, selectedModality])

  const handleAddDictationToReport = useCallback(() => {
    if (!dictationText.trim()) return
    const lines = dictationText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => `<p data-section="relatorio">${l}</p>`)
      .join('')

    setEditorContent((prev) => prev + lines)
    setDictationText('')
  }, [dictationText])

  const handleCopyReport = useCallback(() => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorContent

    // Limpar marcadores visuais e atributos auxiliares
    tempDiv.querySelectorAll('[data-line-number]').forEach((el) => el.remove())
    tempDiv.querySelectorAll('[data-line]').forEach((el) => el.removeAttribute('data-line'))
    tempDiv.querySelectorAll('[data-section]').forEach((el) => el.removeAttribute('data-section'))

    const nodes = Array.from(tempDiv.querySelectorAll('p, div'))
    const paragraphs = nodes
      .map((p) => (p.textContent || '').replace(/\u00a0/g, ' ').trim())
      .filter((t) => t.length > 0)

    // Inserir espaçamento lógico no texto plano
    const plainLines: string[] = []
    paragraphs.forEach((line, idx) => {
      if (idx === 0) {
        plainLines.push(line, '') // título + linha em branco
      } else if (line.toUpperCase().startsWith('IMPRESS')) {
        plainLines.push('', line) // quebra antes da impressão
      } else {
        plainLines.push(line)
      }
    })
    const plainText = plainLines.join('\n').replace(/\n{3,}/g, '\n\n').trim()

    // HTML limpo com estilos mínimos (título central 12pt negrito, corpo 11pt)
    const htmlContent = `<div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000; line-height: 1.4;">
      ${paragraphs
        .map((text, idx) => {
          if (idx === 0) {
            return `<p style="text-align:center; font-weight:bold; font-size:12pt; margin:0 0 10pt 0;">${text}</p>`
          }
          if (text.toUpperCase().startsWith('IMPRESS')) {
            return `<p style="font-weight:bold; margin:10pt 0 6pt 0;">${text}</p>`
          }
          return `<p style="margin:0 0 6pt 0; font-size:11pt;">${text}</p>`
        })
        .join('')}
    </div>`

    if (navigator.clipboard && 'write' in navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const item = new ClipboardItem({
        'text/html': new Blob([htmlContent], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      })
      navigator.clipboard.write([item]).catch((err) => {
        console.error('Erro ao copiar laudo:', err)
      })
    } else {
      navigator.clipboard.writeText(plainText).catch((err) => {
        console.error('Erro ao copiar laudo:', err)
      })
    }
  }, [editorContent])

  const handleResetReport = useCallback(() => {
    if (selectedMask) {
      handleSelectMask(selectedMask)
    } else {
      setEditorContent('')
    }
    setDictationText('')
  }, [selectedMask, handleSelectMask])

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
    <>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 text-center">
            <p className="text-gray-400 italic text-lg">Painel de frases e laudo dinâmico.</p>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Máscaras</h3>
                  <button
                    onClick={() => setShowConfig(true)}
                    className="text-sm px-3 py-1 rounded-md border border-[#222222] text-gray-100 hover:bg-[#161616]"
                  >
                    Configurar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {modalities.map((mod) => (
                    <button
                      key={mod}
                      onClick={() => {
                        setSelectedModality(mod)
                        setSelectedMask(null)
                        setQuickPhrases([])
                        setEditorContent('')
                      }}
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
                    onManage={() => {
                      setEditingPhrase(null)
                      setFormText('')
                      setFormLabel('')
                      setFormLine('')
                      setFormSection(selectedSections[0]?.id || '')
                      setShowPhraseManager(true)
                    }}
                  />
                ) : (
                  <div className="bg-[#111111] rounded-lg border border-[#222222] p-4 text-sm text-gray-400">
                    Selecione uma máscara para ver as frases.
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
                onProcessWithAI={handleProcessDictationWithAI}
                onAddToReport={handleAddDictationToReport}
                onClear={() => setDictationText('')}
                disabled={!selectedMask}
              />

              <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
                <div className="flex justify-between items-center mb-3 gap-2">
                  <h3 className="text-lg font-semibold">Laudo Final</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetReport}
                      disabled={!selectedMask}
                    className="px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-[#444444] disabled:opacity-50"
                  >
                      ↻
                    </button>
                    <button
                      onClick={handleCopyReport}
                      disabled={!selectedMask}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      Copiar
                    </button>
                  </div>
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

        {showPhraseManager && selectedMask ? (
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex justify-center items-start p-4 pt-20">
            <div className="w-full max-w-2xl bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-100">Gerenciar frases</h2>
                  <p className="text-xs text-gray-400">Máscara: {selectedMask.exam_name || selectedMask.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowPhraseManager(false)
                    setEditingPhrase(null)
                  }}
                  className="text-sm text-gray-300 px-3 py-1 rounded-md border border-[#222222] hover:bg-[#161616]"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Seção</label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                  >
                    {selectedSections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Rotulo curto</label>
                  <input
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                    placeholder="Ex.: Afastar pneumonia no LID"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Linha (opcional)</label>
                  <input
                    value={formLine}
                    onChange={(e) => setFormLine(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-10 rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3"
                    placeholder="Ex.: 1, 2, 3..."
                    inputMode="numeric"
                  />
                  <p className="text-xs text-gray-500">
                    Define qual linha da secao sera trocada. Deixe em branco para substituir a primeira.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Texto para alterar</label>
                  <textarea
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full min-h-[140px] rounded-md border border-[#1f1f1f] bg-[#111111] text-gray-100 px-3 py-2"
                    placeholder="Conteudo que sera aplicado na secao/linha selecionada"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {editingPhrase ? (
                  <button
                    onClick={() => {
                      setFormText('')
                      setFormLabel('')
                      setFormLine('')
                      setEditingPhrase(null)
                    }}
                    className="px-4 py-2 rounded-md border border-[#222222] text-gray-200 hover:bg-[#161616]"
                  >
                    Limpar
                  </button>
                ) : null}
                <button
                  onClick={handleSavePhrase}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingPhrase ? 'Salvar alteracoes' : 'Salvar frase'}
                </button>
              </div>

              <div className="border border-[#1f1f1f] rounded-lg overflow-hidden">
                <div className="bg-[#161616] px-4 py-2 text-sm font-semibold text-gray-100">
                  Frases desta mascara ({quickPhrases.length})
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#1f1f1f]">
                  {quickPhrases.length === 0 ? (
                    <div className="p-4 text-sm text-gray-400">Nenhuma frase cadastrada.</div>
                  ) : (
                    quickPhrases.map((p) => {
                      const sectionName = selectedSections.find((s) => s.id === p.section_id)?.title || 'Outros'
                      const lineKw = p.keywords?.find((k) => /^line:\d+$/i.test(k))
                      const lineTxt = lineKw ? lineKw.split(':')[1] : ''
                      return (
                        <div key={p.id} className="p-3 space-y-1">
                          <div className="flex justify-between text-sm text-gray-300">
                            <span className="font-semibold text-gray-100">{p.label}</span>
                            <span className="text-xs text-gray-400">
                              {sectionName}{lineTxt ? ` · linha ${lineTxt}` : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-200">{p.text}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingPhrase(p)
                                setFormSection(p.section_id || selectedSections[0]?.id || '')
                                setFormLabel(p.label || '')
                                setFormText(p.text || '')
                                setFormLine(lineTxt || '')
                                setShowPhraseManager(true)
                              }}
                              className="text-xs text-blue-400 hover:text-blue-200"
                            >
                              Editar
                            </button>
                            <button
                              onClick={async () => {
                                const ok = await QuickPhrasesService.deletePhrase(p.id)
                                if (ok) {
                                  handlePhraseDeleted(p.id)
                                }
                              }}
                              className="text-xs text-red-400 hover:text-red-200"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showConfig ? (
          <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex justify-center items-start p-4 pt-20">
            <div className="w-full max-w-5xl bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-100">Configurar máscaras</h2>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-sm text-gray-300 px-3 py-1 rounded-md border border-[#222222] hover:bg-[#161616]"
                >
                  Fechar
                </button>
              </div>
              <MaskManager />
            </div>
          </div>
        ) : null}
      </div>
      <style jsx global>{`
        [data-line] {
          position: relative;
          padding-left: 48px;
        }
        [data-line]::before {
          content: attr(data-line) ".";
          position: absolute;
          left: 12px;
          top: 4px;
          width: 28px;
          color: #6b7280;
          font-size: 10px;
          text-align: right;
          user-select: none;
          pointer-events: none;
        }
        [data-line]::after {
          content: '';
          position: absolute;
          left: 40px;
          top: 0;
          bottom: 0;
          border-left: 1px dashed #3b3b3b;
          pointer-events: none;
        }
      `}</style>
    </>
  )
}

export default EditorLaudosPage

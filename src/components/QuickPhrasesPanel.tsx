'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface QuickPhrase {
  id: string
  category: string
  label: string
  text: string
  keywords: string[]
  target_type?: 'section' | 'title' | 'impression'
  insert_mode?: 'replace' | 'before' | 'after' | 'inline'
  subsection?: string
  section_id?: string
  mask_id?: string
  modality?: string
  exam_type?: string
}

interface QuickPhrasesPanelProps {
  phrases: QuickPhrase[]
  onSelectPhrase: (phrase: QuickPhrase) => void
  disabled?: boolean
  sections?: { id: string; title: string }[]
  onManage?: () => void
  title?: string
}

const QuickPhrasesPanel: React.FC<QuickPhrasesPanelProps> = ({
  phrases,
  onSelectPhrase,
  disabled = false,
  sections = [],
  onManage,
  title = 'Frases'
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const hasSections = sections.length > 0

  const toggle = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  const renderPhraseButton = (phrase: QuickPhrase) => {
    const shortText = phrase.label?.trim() || phrase.text?.trim() || 'Frase'
    const meta: string[] = []
    if (phrase.subsection) meta.push(phrase.subsection)
    if (phrase.insert_mode === 'before') meta.push('acima')
    else if (phrase.insert_mode === 'after') meta.push('abaixo')
    else if (phrase.insert_mode === 'inline') meta.push('mesma linha')
    return (
      <button
        key={phrase.id}
        onClick={() => onSelectPhrase(phrase)}
        disabled={disabled}
        className="w-full text-left px-4 py-3 text-sm hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-t border-[#222222] first:border-t-0"
      >
        <div className="font-medium text-gray-100">{shortText}</div>
        {meta.length ? <div className="text-xs text-gray-500">{meta.join(' · ')}</div> : null}
      </button>
    )
  }

  const renderSections = () => (
    <div className="space-y-2">
      {sections.map((section) => {
        const sectionPhrases = phrases.filter((p) => p.section_id === section.id)
        const isOpen = expanded.has(section.id) || sectionPhrases.length === 0

        // Agrupar por subseção para reduzir a lista
        const groupedBySub = sectionPhrases.reduce<Record<string, QuickPhrase[]>>((acc, phrase) => {
          const key = phrase.subsection?.trim() || 'sem-sub'
          acc[key] = acc[key] || []
          acc[key].push(phrase)
          return acc
        }, {})

        return (
          <div key={section.id} className="border border-[#222222] rounded-md overflow-hidden">
            <button
              onClick={() => toggle(section.id)}
              className="w-full px-3 py-2 bg-[#1a1a1a] hover:bg-[#222222] flex items-center justify-between transition-colors"
            >
              <span className="font-medium text-gray-100 text-sm">{section.title}</span>
              <span className="text-gray-400 text-xs">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="bg-[#0f0f0f]">
                {sectionPhrases.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-gray-400">Nenhuma frase nesta seção.</div>
                ) : (
                  Object.entries(groupedBySub).map(([subKey, list]) => {
                    if (subKey === 'sem-sub') {
                      return list.map(renderPhraseButton)
                    }
                    const subOpenId = `${section.id}::${subKey}`
                    const subOpen = expanded.has(subOpenId)
                    return (
                      <div key={subKey} className="border-t border-[#1f1f1f]">
                        <button
                          onClick={() => toggle(subOpenId)}
                          className="w-full px-3 py-2 bg-[#0f0f0f] hover:bg-[#161616] flex items-center justify-between transition-colors text-left"
                        >
                          <span className="text-sm font-medium text-gray-200">{subKey}</span>
                          <span className="text-gray-500 text-xs">{subOpen ? '−' : '+'}</span>
                        </button>
                        {subOpen && <div>{list.map(renderPhraseButton)}</div>}
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )
      })}

      {phrases.some((p) => !p.section_id) && (
        <div className="border border-[#222222] rounded-md overflow-hidden">
          <button
            onClick={() => toggle('outros')}
            className="w-full px-3 py-2 bg-[#1a1a1a] hover:bg-[#222222] flex items-center justify-between transition-colors"
          >
            <span className="font-medium text-gray-100 text-sm">Outros</span>
            <span className="text-gray-400 text-xs">{expanded.has('outros') ? '−' : '+'}</span>
          </button>
          {expanded.has('outros') && (
            <div className="bg-[#0f0f0f]">
              {phrases.filter((p) => !p.section_id).map(renderPhraseButton)}
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-[#111111] rounded-lg border border-[#222222] p-4 h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        {onManage ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onManage}
            disabled={disabled}
            className="shrink-0"
          >
            +
          </Button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto">
        {hasSections ? renderSections() : (
          <div className="space-y-1">
            {phrases.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nenhuma frase cadastrada.</p>
            ) : (
              phrases.map(renderPhraseButton)
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickPhrasesPanel

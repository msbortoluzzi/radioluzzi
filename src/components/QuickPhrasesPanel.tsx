'use client'

import React, { useState } from 'react'

export interface QuickPhrase {
  id: string
  category: string
  label: string
  text: string
  keywords: string[]
  section_id?: string
}

interface QuickPhrasesPanelProps {
  phrases: QuickPhrase[]
  onSelectPhrase: (phrase: QuickPhrase) => void
  disabled?: boolean
  sections?: { id: string; title: string }[]
}

const QuickPhrasesPanel: React.FC<QuickPhrasesPanelProps> = ({
  phrases,
  onSelectPhrase,
  disabled = false,
  sections = []
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const hasSections = sections.length > 0

  const filteredPhrases = searchTerm.trim()
    ? phrases.filter((p) =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : null

  const toggle = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  const renderPhraseButton = (phrase: QuickPhrase) => (
    <button
      key={phrase.id}
      onClick={() => onSelectPhrase(phrase)}
      disabled={disabled}
      className="w-full text-left px-4 py-2 text-sm hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-t border-[#222222] first:border-t-0"
    >
      <div className="font-medium text-gray-100">• {phrase.label}</div>
      <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{phrase.text}</div>
    </button>
  )

  const renderSections = () => (
    <div className="space-y-2">
      {sections.map((section) => {
        const sectionPhrases = phrases.filter((p) => p.section_id === section.id)
        if (sectionPhrases.length === 0) return null
        const isOpen = expanded.has(section.id)
        return (
          <div key={section.id} className="border border-[#222222] rounded-md overflow-hidden">
            <button
              onClick={() => toggle(section.id)}
              className="w-full px-3 py-2 bg-[#1a1a1a] hover:bg-[#222222] flex items-center justify-between transition-colors"
            >
              <span className="font-medium text-gray-100 text-sm">✦ {section.title}</span>
              <span className="text-gray-400 text-xs">{isOpen ? '–' : '+'}</span>
            </button>
            {isOpen && <div className="bg-[#0f0f0f]">{sectionPhrases.map(renderPhraseButton)}</div>}
          </div>
        )
      })}

      {phrases.some((p) => !p.section_id) && (
        <div className="border border-[#222222] rounded-md overflow-hidden">
          <button
            onClick={() => toggle('outros')}
            className="w-full px-3 py-2 bg-[#1a1a1a] hover:bg-[#222222] flex items-center justify-between transition-colors"
          >
            <span className="font-medium text-gray-100 text-sm">✦ Outros</span>
            <span className="text-gray-400 text-xs">{expanded.has('outros') ? '–' : '+'}</span>
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

  const renderCategories = () => {
    const grouped = phrases.reduce((acc, phrase) => {
      if (!acc[phrase.category]) acc[phrase.category] = []
      acc[phrase.category].push(phrase)
      return acc
    }, {} as Record<string, QuickPhrase[]>)

    return (
      <div className="space-y-2">
        {Object.entries(grouped).map(([category, categoryPhrases]) => {
          const isOpen = expanded.has(category)
          return (
            <div key={category} className="border border-[#222222] rounded-md overflow-hidden">
              <button
                onClick={() => toggle(category)}
                className="w-full px-3 py-2 bg-[#1a1a1a] hover:bg-[#222222] flex items-center justify-between transition-colors"
              >
                <span className="font-medium text-gray-100 text-sm">✦ {category}</span>
                <span className="text-gray-400 text-xs">{isOpen ? '–' : '+'}</span>
              </button>
              {isOpen && <div className="bg-[#0f0f0f]">{categoryPhrases.map(renderPhraseButton)}</div>}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-[#111111] rounded-lg border border-[#222222] p-4 h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Frases Prontas</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar frase..."
          className="w-full px-3 py-2 border border-[#333333] bg-[#0a0a0a] text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredPhrases ? (
          <div className="space-y-1">
            {filteredPhrases.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nenhuma frase encontrada</p>
            ) : (
              filteredPhrases.map((phrase) => (
                <button
                  key={phrase.id}
                  onClick={() => onSelectPhrase(phrase)}
                  disabled={disabled}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-blue-200"
                >
                  <div className="font-medium text-gray-100">{phrase.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{phrase.text}</div>
                </button>
              ))
            )}
          </div>
        ) : hasSections ? (
          renderSections()
        ) : (
          renderCategories()
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-[#222222]">
        <p className="text-xs text-gray-400 text-center">{phrases.length} frases disponíveis</p>
      </div>
    </div>
  )
}

export default QuickPhrasesPanel

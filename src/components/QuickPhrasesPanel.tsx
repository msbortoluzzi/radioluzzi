'use client'

import React, { useState } from 'react'

export interface QuickPhrase {
  id: string
  category: string
  label: string
  text: string
  keywords: string[]
}

interface QuickPhrasesPanelProps {
  phrases: QuickPhrase[]
  onSelectPhrase: (phrase: QuickPhrase) => void
  disabled?: boolean
}

const QuickPhrasesPanel: React.FC<QuickPhrasesPanelProps> = ({
  phrases,
  onSelectPhrase,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Agrupar frases por categoria
  const phrasesByCategory = phrases.reduce((acc, phrase) => {
    if (!acc[phrase.category]) {
      acc[phrase.category] = []
    }
    acc[phrase.category].push(phrase)
    return acc
  }, {} as Record<string, QuickPhrase[]>)

  // Filtrar por busca
  const filteredPhrases = searchTerm.trim()
    ? phrases.filter(p =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : null

  // Toggle categoria
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <div className="bg-[#111111] rounded-lg border border-[#222222] p-4 h-full flex flex-col">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          ⚡ Frases Prontas
        </h3>
        
        {/* Busca */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Buscar frase..."
          className="w-full px-3 py-2 border border-[#333333] bg-[#0a0a0a] text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />
      </div>

      {/* Lista de Frases */}
      <div className="flex-1 overflow-y-auto">
        {filteredPhrases ? (
          // Modo busca
          <div className="space-y-1">
            {filteredPhrases.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Nenhuma frase encontrada
              </p>
            ) : (
              filteredPhrases.map(phrase => (
                <button
                  key={phrase.id}
                  onClick={() => onSelectPhrase(phrase)}
                  disabled={disabled}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-blue-200"
                >
                  <div className="font-medium text-gray-100">{phrase.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    {phrase.text}
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          // Modo categorias
          <div className="space-y-2">
            {Object.entries(phrasesByCategory).map(([category, categoryPhrases]) => {
              const isExpanded = expandedCategories.has(category)
              
              return (
                <div key={category} className="border border-[#222222] rounded-md overflow-hidden">
                  {/* Categoria Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] hover:bg-[#222222] flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-gray-100 text-sm">
                      📁 {category}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {/* Frases da Categoria */}
                  {isExpanded && (
                    <div className="bg-[#0f0f0f]">
                      {categoryPhrases.map(phrase => (
                        <button
                          key={phrase.id}
                          onClick={() => onSelectPhrase(phrase)}
                          disabled={disabled}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-t border-[#222222] first:border-t-0"
                        >
                          <div className="font-medium text-gray-100">• {phrase.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                            {phrase.text}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer com contador */}
      <div className="mt-3 pt-3 border-t border-[#222222]">
        <p className="text-xs text-gray-400 text-center">
          {phrases.length} frases disponíveis
        </p>
      </div>
    </div>
  )
}

export default QuickPhrasesPanel

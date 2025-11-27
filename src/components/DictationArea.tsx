'use client'

import React from 'react'

interface DictationAreaProps {
  text: string
  isListening: boolean
  isProcessing: boolean
  onTextChange: (text: string) => void
  onStartListening: () => void
  onStopListening: () => void
  onProcessWithAI: () => void
  onAddToReport: () => void
  onClear: () => void
  disabled?: boolean
}

const DictationArea: React.FC<DictationAreaProps> = ({
  text,
  isListening,
  isProcessing,
  onTextChange,
  onStartListening,
  onStopListening,
  onProcessWithAI,
  onAddToReport,
  onClear,
  disabled = false
}) => {
  const hasText = text.trim().length > 0

  return (
    <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-100">
          📝 Área de Ditação
        </h3>
        
        {/* Botão de Microfone */}
        <button
          onClick={isListening ? onStopListening : onStartListening}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            isListening
              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isListening ? '⏹️ Parar Ditado' : '🎤 Iniciar Ditado'}
        </button>
      </div>

      {/* Área de Texto */}
      <div className="mb-3">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Clique no microfone e comece a ditar, ou digite aqui..."
          disabled={disabled || isListening}
          className="w-full h-40 p-3 border border-[#333333] bg-[#0a0a0a] text-gray-100 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#0f0f0f] disabled:cursor-not-allowed placeholder-gray-500"
        />
        
        {/* Indicador de caracteres */}
        <div className="text-xs text-gray-400 mt-1 text-right">
          {text.length} caracteres
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 flex-wrap">
        {/* Processar com IA */}
        <button
          onClick={onProcessWithAI}
          disabled={!hasText || isProcessing || disabled}
          className="flex-1 min-w-[140px] px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <>
              <span className="inline-block animate-spin mr-2">⚙️</span>
              Processando...
            </>
          ) : (
            <>✨ Processar com IA</>
          )}
        </button>

        {/* Adicionar ao Laudo */}
        <button
          onClick={onAddToReport}
          disabled={!hasText || isProcessing || disabled}
          className="flex-1 min-w-[140px] px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ➕ Adicionar ao Laudo
        </button>

        {/* Limpar */}
        <button
          onClick={onClear}
          disabled={!hasText || isProcessing || disabled}
          className="px-4 py-2 bg-[#333333] text-white rounded-md font-medium hover:bg-[#444444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          🗑️ Limpar
        </button>
      </div>

      {/* Dicas */}
      {!hasText && !isListening && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> Fale livremente sobre os achados. 
            Depois você pode processar com IA para gerar frases profissionais, 
            ou adicionar direto ao laudo.
          </p>
        </div>
      )}

      {/* Indicador de escuta */}
      {isListening && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          <p className="text-sm text-red-800 font-medium">
            🎤 Escutando... Fale agora!
          </p>
        </div>
      )}
    </div>
  )
}

export default DictationArea

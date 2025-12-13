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
  compact?: boolean
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
  disabled = false,
  compact = false
}) => {
  const hasText = text.trim().length > 0

  return (
    <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-100">Área de ditado</h3>
        <button
          onClick={isListening ? onStopListening : onStartListening}
          disabled={disabled}
          className={`px-3 py-2 rounded-md text-sm border border-[#1f1f1f] flex items-center gap-2 ${
            isListening ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Ativar/pausar microfone"
        >
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-200' : 'bg-white'}`} />
          {isListening ? 'Pausar' : 'Microfone'}
        </button>
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Digite ou cole o texto aqui..."
          disabled={disabled || isListening}
          className={`w-full ${compact ? 'h-28' : 'h-36'} p-3 border border-[#1f1f1f] bg-[#0a0a0a] text-gray-100 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-[#0f0f0f] disabled:cursor-not-allowed placeholder-gray-500`}
        />
        <div className="text-xs text-gray-500 mt-1 text-right">{text.length} caracteres</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onProcessWithAI}
          disabled={!hasText || isProcessing || disabled}
          className="flex-1 min-w-[170px] px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Gerando IA...
            </>
          ) : (
            <>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-blue-600 text-xs font-bold">
                IA
              </span>
              Interpretar
            </>
          )}
        </button>

        <button
          onClick={onAddToReport}
          disabled={!hasText || isProcessing || disabled}
          className="flex-1 min-w-[140px] px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar ao laudo
        </button>

        <button
          onClick={onClear}
          disabled={!hasText || isProcessing || disabled}
          className="px-3 py-2 bg-[#1a1a1a] text-gray-200 rounded-md text-sm border border-[#1f1f1f] hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpar
        </button>
      </div>

      {isListening && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-300">
          <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          Escutando...
        </div>
      )}
    </div>
  )
}

export default DictationArea

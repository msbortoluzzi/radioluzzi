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
    <div className="bg-[#111111] rounded-lg border border-[#222222] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-100">Área de ditado</h3>
        <button
          onClick={isListening ? onStopListening : onStartListening}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
            isListening ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-200' : 'bg-white'}`} />
          <span>{isListening ? 'Parar ditado' : 'Iniciar ditado'}</span>
        </button>
      </div>

      <div className="mb-3">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Clique no microfone e comece a ditar, ou digite aqui..."
          disabled={disabled || isListening}
          className={`w-full ${compact ? 'h-32' : 'h-40'} p-3 border border-[#333333] bg-[#0a0a0a] text-gray-100 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#0f0f0f] disabled:cursor-not-allowed placeholder-gray-500`}
        />

        <div className="text-xs text-gray-400 mt-1 text-right">{text.length} caracteres</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onProcessWithAI}
          disabled={!hasText || isProcessing || disabled}
          className="flex-1 min-w-[180px] px-5 py-3 rounded-md font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Radioluzzi...
            </>
          ) : (
            <>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-600 font-bold">
                R
              </span>
              <span>Radioluzzi+</span>
            </>
          )}
        </button>

        <button
          onClick={onAddToReport}
          disabled={!hasText || isProcessing || disabled}
          className="flex-1 min-w-[140px] px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Enviar ao laudo
        </button>

        <button
          onClick={onClear}
          disabled={!hasText || isProcessing || disabled}
          className="px-4 py-2 bg-[#333333] text-white rounded-md font-medium hover:bg-[#444444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Limpar
        </button>
      </div>

      {isListening && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          <p className="text-sm text-red-800 font-medium">Escutando... fale agora</p>
        </div>
      )}
    </div>
  )
}

export default DictationArea

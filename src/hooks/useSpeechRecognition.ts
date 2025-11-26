'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseSpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  isSupported: boolean
  error: string | null
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    lang = 'pt-BR',
    continuous = true,
    interimResults = true,
    onResult,
    onError
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)

  // Verificar suporte do navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        
        // Configurar reconhecimento
        recognitionRef.current.lang = lang
        recognitionRef.current.continuous = continuous
        recognitionRef.current.interimResults = interimResults
        recognitionRef.current.maxAlternatives = 1

        // Evento: resultado do reconhecimento
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ''
          let interimText = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const transcriptPart = result[0].transcript

            if (result.isFinal) {
              finalTranscript += transcriptPart + ' '
            } else {
              interimText += transcriptPart
            }
          }

          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript)
            setInterimTranscript('')
            
            if (onResult) {
              onResult(finalTranscript.trim(), true)
            }
          } else if (interimText) {
            setInterimTranscript(interimText)
            
            if (onResult) {
              onResult(interimText, false)
            }
          }
        }

        // Evento: erro
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          
          let errorMessage = 'Erro no reconhecimento de voz'
          
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'Nenhuma fala detectada. Tente novamente.'
              break
            case 'audio-capture':
              errorMessage = 'Microfone não encontrado ou sem permissão.'
              break
            case 'not-allowed':
              errorMessage = 'Permissão de microfone negada.'
              break
            case 'network':
              errorMessage = 'Erro de rede. Verifique sua conexão.'
              break
            case 'aborted':
              errorMessage = 'Reconhecimento de voz abortado.'
              break
          }
          
          setError(errorMessage)
          setIsListening(false)
          
          if (onError) {
            onError(errorMessage)
          }
        }

        // Evento: fim do reconhecimento
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        // Evento: início do reconhecimento
        recognitionRef.current.onstart = () => {
          setError(null)
        }
      } else {
        setIsSupported(false)
        setError('Reconhecimento de voz não suportado neste navegador')
      }
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }
  }, [lang, continuous, interimResults, onResult, onError, isListening])

  // Iniciar reconhecimento
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Reconhecimento de voz não disponível')
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
      setError(null)
    } catch (err: any) {
      if (err.message?.includes('already started')) {
        // Já está rodando, apenas atualizar estado
        setIsListening(true)
      } else {
        console.error('Erro ao iniciar reconhecimento:', err)
        setError('Erro ao iniciar reconhecimento de voz')
      }
    }
  }, [isSupported])

  // Parar reconhecimento
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (err) {
        console.error('Erro ao parar reconhecimento:', err)
      }
    }
  }, [isListening])

  // Resetar transcrição
  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error
  }
}

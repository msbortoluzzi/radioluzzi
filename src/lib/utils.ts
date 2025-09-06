import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitários para formatação
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Utilitários para texto
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9 -]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim()
}

// Utilitários para validação
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidCRM(crm: string): boolean {
  // Formato: 12345-SP ou 12345/SP
  const crmRegex = /^\d{4,6}[-\/][A-Z]{2}$/
  return crmRegex.test(crm)
}

// Utilitários para áudio
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Utilitários para laudo
export function joinSentences(parts: string[]): string {
  return parts
    .map(s => (s || '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\.([^\s\)\]\}])/g, '. $1') // Adiciona espaço após ponto
    .replace(/\s+\./g, '.') // Remove espaços antes do ponto
    .replace(/\s+,/g, ',') // Remove espaços antes da vírgula
    .replace(/\s+;/g, ';') // Remove espaços antes do ponto e vírgula
    .trim()
}

export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Remove espaços extras
    .replace(/\n+/g, '\n') // Remove quebras de linha extras
    .trim()
}

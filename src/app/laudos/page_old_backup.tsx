'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { SupabaseService, ExamType } from '../../lib/supabase-dynamic'

const LaudosPage: React.FC = () => {
  const [examTypes, setExamTypes] = useState<ExamType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadExamTypes()
  }, [])

  const loadExamTypes = async () => {
    try {
      setLoading(true)
      const types = await SupabaseService.getExamTypes()
      setExamTypes(types)
    } catch (err) {
      console.error('Erro ao carregar tipos de exames:', err)
      setError('Erro ao carregar tipos de exames')
    } finally {
      setLoading(false)
    }
  }

  const getIconSvg = (iconName?: string) => {
    switch (iconName) {
      case 'lungs':
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'brain':
        return (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando tipos de exames...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadExamTypes}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema de Laudos Médicos
            </h1>
            <p className="text-gray-600">
              Selecione o tipo de exame para gerar o laudo
            </p>
          </div>

          {/* Cards de Exames Dinâmicos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examTypes.map((examType) => (
              <div key={examType.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getIconSvg(examType.icon)}
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">{examType.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {examType.description || 'Laudos médicos especializados'}
                  </p>
                  <div className="space-y-2">
                    <Link 
                      href={`/laudos/${examType.slug}`}
                      className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Gerar Laudo
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Card para adicionar novos exames (se admin) */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Adicionar Novo Exame</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Configure novos tipos de exames no Supabase
                </p>
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => window.open('https://supabase.com', '_blank')}
                >
                  Acessar Supabase →
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas Dinâmicas */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {examTypes.length}
                </div>
                <div className="text-sm text-gray-600">Tipos de Exames</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  0
                </div>
                <div className="text-sm text-gray-600">Laudos Gerados Hoje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  0
                </div>
                <div className="text-sm text-gray-600">Templates Ativos</div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/laudos/historico"
                className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Ver Histórico de Laudos</span>
              </Link>
              <Link 
                href="/laudos/configuracoes"
                className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">Configurações do Sistema</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LaudosPage

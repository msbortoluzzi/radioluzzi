'use client'

import React from 'react'
import Link from 'next/link'

const LaudosPage: React.FC = () => {
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

          {/* Cards de Exames */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Radiografia */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Radiografia</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Laudos de exames radiográficos
                </p>
                <div className="space-y-2">
                  <Link 
                    href="/laudos/radiografia/torax"
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Tórax
                  </Link>
                  <button 
                    className="block w-full bg-gray-100 text-gray-400 text-center py-2 px-4 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Abdome (Em breve)
                  </button>
                  <button 
                    className="block w-full bg-gray-100 text-gray-400 text-center py-2 px-4 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Membros (Em breve)
                  </button>
                </div>
              </div>
            </div>

            {/* Tomografia */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-400">Tomografia</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Em desenvolvimento
                </p>
                <button 
                  className="block w-full bg-gray-100 text-gray-400 text-center py-2 px-4 rounded-md cursor-not-allowed"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>

            {/* Ressonância */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-400">Ressonância</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Em desenvolvimento
                </p>
                <button 
                  className="block w-full bg-gray-100 text-gray-400 text-center py-2 px-4 rounded-md cursor-not-allowed"
                  disabled
                >
                  Em breve
                </button>
              </div>
            </div>

          </div>

          {/* Estatísticas */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-gray-600">Exame Disponível</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">0</div>
                <div className="text-sm text-gray-600">Laudos Gerados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">0</div>
                <div className="text-sm text-gray-600">Templates Salvos</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LaudosPage


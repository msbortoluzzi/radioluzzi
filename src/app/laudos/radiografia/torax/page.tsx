'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface LaudoData {
  paciente: string
  idade: string
  sexo: string
  tecnica: string[]
  achados: string[]
  conclusao: string[]
  observacoes: string
}

const ToraxPage: React.FC = () => {
  const [laudoData, setLaudoData] = useState<LaudoData>({
    paciente: '',
    idade: '',
    sexo: '',
    tecnica: [],
    achados: [],
    conclusao: [],
    observacoes: ''
  })

  const [laudoFinal, setLaudoFinal] = useState<string>('')

  // Opções pré-definidas
  const opcoesTecnica = [
    'Radiografia simples do tórax em incidências PA e perfil',
    'Radiografia simples do tórax em incidência PA',
    'Radiografia simples do tórax em incidência AP no leito',
    'Exame realizado com técnica adequada'
  ]

  const opcoesAchados = [
    'Pulmões expandidos e transparentes',
    'Não há sinais de condensação pulmonar',
    'Não há sinais de derrame pleural',
    'Seios costofrênicos livres',
    'Área cardíaca dentro dos limites da normalidade',
    'Mediastino centrado',
    'Estruturas ósseas íntegras',
    'Partes moles preservadas',
    'Opacidade em base direita',
    'Opacidade em base esquerda',
    'Opacidade em ápice direito',
    'Opacidade em ápice esquerdo',
    'Cardiomegalia',
    'Derrame pleural à direita',
    'Derrame pleural à esquerda',
    'Pneumotórax à direita',
    'Pneumotórax à esquerda'
  ]

  const opcoesConclusao = [
    'Exame radiológico do tórax sem alterações',
    'Pneumonia em base direita',
    'Pneumonia em base esquerda',
    'Cardiomegalia',
    'Derrame pleural',
    'Pneumotórax',
    'Sugestivo de processo inflamatório/infeccioso'
  ]

  const toggleOption = (categoria: keyof LaudoData, opcao: string) => {
    setLaudoData(prev => {
      const currentArray = prev[categoria] as string[]
      const isSelected = currentArray.includes(opcao)
      
      return {
        ...prev,
        [categoria]: isSelected 
          ? currentArray.filter(item => item !== opcao)
          : [...currentArray, opcao]
      }
    })
  }

  const gerarLaudo = () => {
    let laudo = ''
    
    // Cabeçalho
    laudo += 'RADIOGRAFIA DE TÓRAX\n\n'
    
    if (laudoData.paciente) {
      laudo += `Paciente: ${laudoData.paciente}\n`
    }
    if (laudoData.idade) {
      laudo += `Idade: ${laudoData.idade}\n`
    }
    if (laudoData.sexo) {
      laudo += `Sexo: ${laudoData.sexo}\n`
    }
    
    laudo += '\n'
    
    // Técnica
    if (laudoData.tecnica.length > 0) {
      laudo += 'TÉCNICA:\n'
      laudoData.tecnica.forEach(item => {
        laudo += `${item}.\n`
      })
      laudo += '\n'
    }
    
    // Achados
    if (laudoData.achados.length > 0) {
      laudo += 'ACHADOS:\n'
      laudoData.achados.forEach(item => {
        laudo += `${item}.\n`
      })
      laudo += '\n'
    }
    
    // Conclusão
    if (laudoData.conclusao.length > 0) {
      laudo += 'CONCLUSÃO:\n'
      laudoData.conclusao.forEach(item => {
        laudo += `- ${item}.\n`
      })
      laudo += '\n'
    }
    
    // Observações
    if (laudoData.observacoes) {
      laudo += 'OBSERVAÇÕES:\n'
      laudo += `${laudoData.observacoes}\n`
    }
    
    setLaudoFinal(laudo)
  }

  const copiarLaudo = () => {
    if (navigator.clipboard && laudoFinal) {
      navigator.clipboard.writeText(laudoFinal)
      alert('Laudo copiado para a área de transferência!')
    }
  }

  const limparFormulario = () => {
    setLaudoData({
      paciente: '',
      idade: '',
      sexo: '',
      tecnica: [],
      achados: [],
      conclusao: [],
      observacoes: ''
    })
    setLaudoFinal('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/laudos" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar aos Laudos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Laudo de Radiografia de Tórax</h1>
            <p className="text-gray-600 mt-2">Preencha os dados e selecione as opções para gerar o laudo</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Formulário */}
            <div className="space-y-6">
              
              {/* Dados do Paciente */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Paciente</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                    <input
                      type="text"
                      value={laudoData.paciente}
                      onChange={(e) => setLaudoData(prev => ({...prev, paciente: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite o nome do paciente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                      <input
                        type="text"
                        value={laudoData.idade}
                        onChange={(e) => setLaudoData(prev => ({...prev, idade: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: 45 anos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                      <select
                        value={laudoData.sexo}
                        onChange={(e) => setLaudoData(prev => ({...prev, sexo: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Técnica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Técnica</h2>
                <div className="space-y-2">
                  {opcoesTecnica.map((opcao, index) => (
                    <button
                      key={index}
                      onClick={() => toggleOption('tecnica', opcao)}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        laudoData.tecnica.includes(opcao)
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>

              {/* Achados */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Achados</h2>
                <div className="space-y-2">
                  {opcoesAchados.map((opcao, index) => (
                    <button
                      key={index}
                      onClick={() => toggleOption('achados', opcao)}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        laudoData.achados.includes(opcao)
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conclusão */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Conclusão</h2>
                <div className="space-y-2">
                  {opcoesConclusao.map((opcao, index) => (
                    <button
                      key={index}
                      onClick={() => toggleOption('conclusao', opcao)}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        laudoData.conclusao.includes(opcao)
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações Adicionais</h2>
                <textarea
                  value={laudoData.observacoes}
                  onChange={(e) => setLaudoData(prev => ({...prev, observacoes: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Digite observações adicionais..."
                />
              </div>

            </div>

            {/* Preview do Laudo */}
            <div className="space-y-6">
              
              {/* Botões de Ação */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={gerarLaudo}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Gerar Laudo
                  </button>
                  <button
                    onClick={copiarLaudo}
                    disabled={!laudoFinal}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Copiar Laudo
                  </button>
                  <button
                    onClick={limparFormulario}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Laudo Gerado */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview do Laudo</h2>
                <div className="bg-gray-50 rounded-md p-4 min-h-96">
                  {laudoFinal ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {laudoFinal}
                    </pre>
                  ) : (
                    <p className="text-gray-500 italic">
                      Clique em "Gerar Laudo" para visualizar o resultado
                    </p>
                  )}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {laudoData.tecnica.length + laudoData.achados.length + laudoData.conclusao.length}
                    </div>
                    <div className="text-sm text-gray-600">Opções Selecionadas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {laudoFinal ? laudoFinal.length : 0}
                    </div>
                    <div className="text-sm text-gray-600">Caracteres no Laudo</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default ToraxPage


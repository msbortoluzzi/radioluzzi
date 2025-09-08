'use client'

import { useState } from 'react'

interface TemplateOption {
  id: string
  label: string
  text: string
  category: string
}

interface LaudoTemplateProps {
  title: string
  patientFields?: boolean
  templateOptions: TemplateOption[]
  onLaudoGenerated?: (laudo: string) => void
}

export default function LaudoTemplate({ 
  title, 
  patientFields = true, 
  templateOptions,
  onLaudoGenerated 
}: LaudoTemplateProps) {
  const [patientData, setPatientData] = useState({
    nome: '',
    idade: '',
    sexo: ''
  })

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [observacoes, setObservacoes] = useState('')
  const [laudoFinal, setLaudoFinal] = useState('')

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const gerarLaudo = () => {
    let laudo = `${title.toUpperCase()}\n\n`
    
    // Dados do paciente
    if (patientFields) {
      if (patientData.nome) laudo += `Paciente: ${patientData.nome}\n`
      if (patientData.idade) laudo += `Idade: ${patientData.idade}\n`
      if (patientData.sexo) laudo += `Sexo: ${patientData.sexo}\n`
      laudo += '\n'
    }

    // Agrupar opções por categoria
    const categorias: string[] = Array.from(new Set(templateOptions.map((opt: TemplateOption) => opt.category)))
    
    categorias.forEach((categoria: string) => {
      const opcoesDaCategoria = templateOptions.filter((opt: TemplateOption) => 
        opt.category === categoria && selectedOptions.includes(opt.id)
      )
      
      if (opcoesDaCategoria.length > 0) {
        laudo += `${categoria.toUpperCase()}:\n`
        opcoesDaCategoria.forEach((opcao: TemplateOption) => {
          laudo += `${opcao.text}.\n`
        })
        laudo += '\n'
      }
    })

    // Observações
    if (observacoes) {
      laudo += 'OBSERVAÇÕES:\n'
      laudo += `${observacoes}\n`
    }

    setLaudoFinal(laudo)
    if (onLaudoGenerated) {
      onLaudoGenerated(laudo)
    }
  }

  const copiarLaudo = () => {
    if (navigator.clipboard && laudoFinal) {
      navigator.clipboard.writeText(laudoFinal)
      alert('Laudo copiado para a área de transferência!')
    }
  }

  const limparFormulario = () => {
    setPatientData({ nome: '', idade: '', sexo: '' })
    setSelectedOptions([])
    setObservacoes('')
    setLaudoFinal('')
  }

  // Agrupar opções por categoria para exibição
  const categorias: string[] = Array.from(new Set(templateOptions.map((opt: TemplateOption) => opt.category)))

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      
      {/* Formulário */}
      <div className="space-y-6">
        
        {/* Dados do Paciente */}
        {patientFields && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Paciente</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                <input
                  type="text"
                  value={patientData.nome}
                  onChange={(e) => setPatientData(prev => ({...prev, nome: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do paciente"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input
                    type="text"
                    value={patientData.idade}
                    onChange={(e) => setPatientData(prev => ({...prev, idade: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 45 anos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                  <select
                    value={patientData.sexo}
                    onChange={(e) => setPatientData(prev => ({...prev, sexo: e.target.value}))}
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
        )}

        {/* Seções por Categoria */}
        {categorias.map((categoria: string) => (
          <div key={categoria} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{categoria}</h2>
            <div className="space-y-2">
              {templateOptions
                .filter((opt: TemplateOption) => opt.category === categoria)
                .map((opcao: TemplateOption) => (
                  <button
                    key={opcao.id}
                    onClick={() => toggleOption(opcao.id)}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${
                      selectedOptions.includes(opcao.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opcao.label}
                  </button>
                ))}
            </div>
          </div>
        ))}

        {/* Observações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações Adicionais</h2>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
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

      </div>

    </div>
  )
}

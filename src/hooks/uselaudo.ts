'use client'

import { useState, useCallback } from 'react'

interface PatientData {
  nome: string
  idade: string
  sexo: string
}

interface TemplateOption {
  id: string
  label: string
  text: string
  category: string
}

interface LaudoState {
  patientData: PatientData
  selectedOptions: string[]
  observacoes: string
  laudoFinal: string
}

interface UseLaudoReturn {
  state: LaudoState
  updatePatientData: (data: Partial<PatientData>) => void
  toggleOption: (optionId: string) => void
  setObservacoes: (observacoes: string) => void
  gerarLaudo: (title: string, templateOptions: TemplateOption[]) => void
  copiarLaudo: () => void
  limparFormulario: () => void
  salvarLaudo: () => Promise<void>
}

export const useLaudo = (): UseLaudoReturn => {
  const [state, setState] = useState<LaudoState>({
    patientData: {
      nome: '',
      idade: '',
      sexo: ''
    },
    selectedOptions: [],
    observacoes: '',
    laudoFinal: ''
  })

  const updatePatientData = useCallback((data: Partial<PatientData>) => {
    setState(prev => ({
      ...prev,
      patientData: { ...prev.patientData, ...data }
    }))
  }, [])

  const toggleOption = useCallback((optionId: string) => {
    setState(prev => ({
      ...prev,
      selectedOptions: prev.selectedOptions.includes(optionId)
        ? prev.selectedOptions.filter(id => id !== optionId)
        : [...prev.selectedOptions, optionId]
    }))
  }, [])

  const setObservacoes = useCallback((observacoes: string) => {
    setState(prev => ({ ...prev, observacoes }))
  }, [])

  const gerarLaudo = useCallback((title: string, templateOptions: TemplateOption[]) => {
    let laudo = `${title.toUpperCase()}\n\n`
    
    // Dados do paciente
    if (state.patientData.nome) laudo += `Paciente: ${state.patientData.nome}\n`
    if (state.patientData.idade) laudo += `Idade: ${state.patientData.idade}\n`
    if (state.patientData.sexo) laudo += `Sexo: ${state.patientData.sexo}\n`
    laudo += '\n'

    // Agrupar opções por categoria
    const categorias: string[] = Array.from(new Set(templateOptions.map((opt: TemplateOption) => opt.category)))
    
    categorias.forEach((categoria: string) => {
      const opcoesDaCategoria = templateOptions.filter((opt: TemplateOption) => 
        opt.category === categoria && state.selectedOptions.includes(opt.id)
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
    if (state.observacoes) {
      laudo += 'OBSERVAÇÕES:\n'
      laudo += `${state.observacoes}\n`
    }

    setState(prev => ({ ...prev, laudoFinal: laudo }))
  }, [state.patientData, state.selectedOptions, state.observacoes])

  const copiarLaudo = useCallback(() => {
    if (state.laudoFinal && navigator.clipboard) {
      navigator.clipboard.writeText(state.laudoFinal)
      alert('Laudo copiado para a área de transferência!')
    }
  }, [state.laudoFinal])

  const limparFormulario = useCallback(() => {
    setState({
      patientData: { nome: '', idade: '', sexo: '' },
      selectedOptions: [],
      observacoes: '',
      laudoFinal: ''
    })
  }, [])

  const salvarLaudo = useCallback(async () => {
    try {
      // Aqui você pode implementar a lógica para salvar no Supabase
      const laudoData = {
        paciente: state.patientData.nome,
        idade: state.patientData.idade,
        sexo: state.patientData.sexo,
        opcoes_selecionadas: state.selectedOptions,
        observacoes: state.observacoes,
        laudo_final: state.laudoFinal,
        data_criacao: new Date().toISOString()
      }

      console.log('Salvando laudo:', laudoData)
      
      // Implementar chamada para Supabase aqui
      // const { data, error } = await supabase
      //   .from('laudos')
      //   .insert([laudoData])
      
      alert('Laudo salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar laudo:', error)
      alert('Erro ao salvar laudo. Tente novamente.')
    }
  }, [state])

  return {
    state,
    updatePatientData,
    toggleOption,
    setObservacoes,
    gerarLaudo,
    copiarLaudo,
    limparFormulario,
    salvarLaudo
  }
}

export interface TemplateOption {
  id: string
  label: string
  text: string
  category: string
}

export interface ExamTemplate {
  id: string
  name: string
  title: string
  options: TemplateOption[]
}

// Template para Radiografia de Tórax
export const toraxTemplate: ExamTemplate = {
  id: 'torax',
  name: 'Radiografia de Tórax',
  title: 'Radiografia de Tórax',
  options: [
    // Técnica
    {
      id: 'tecnica_1',
      label: 'Radiografia simples do tórax em incidências PA e perfil',
      text: 'Radiografia simples do tórax em incidências PA e perfil',
      category: 'Técnica'
    },
    {
      id: 'tecnica_2',
      label: 'Radiografia simples do tórax em incidência PA',
      text: 'Radiografia simples do tórax em incidência PA',
      category: 'Técnica'
    },
    {
      id: 'tecnica_3',
      label: 'Radiografia simples do tórax em incidência AP no leito',
      text: 'Radiografia simples do tórax em incidência AP no leito',
      category: 'Técnica'
    },
    {
      id: 'tecnica_4',
      label: 'Exame realizado com técnica adequada',
      text: 'Exame realizado com técnica adequada',
      category: 'Técnica'
    },

    // Achados Normais
    {
      id: 'normal_1',
      label: 'Pulmões expandidos e transparentes',
      text: 'Pulmões expandidos e transparentes',
      category: 'Achados'
    },
    {
      id: 'normal_2',
      label: 'Não há sinais de condensação pulmonar',
      text: 'Não há sinais de condensação pulmonar',
      category: 'Achados'
    },
    {
      id: 'normal_3',
      label: 'Não há sinais de derrame pleural',
      text: 'Não há sinais de derrame pleural',
      category: 'Achados'
    },
    {
      id: 'normal_4',
      label: 'Seios costofrênicos livres',
      text: 'Seios costofrênicos livres',
      category: 'Achados'
    },
    {
      id: 'normal_5',
      label: 'Área cardíaca dentro dos limites da normalidade',
      text: 'Área cardíaca dentro dos limites da normalidade',
      category: 'Achados'
    },
    {
      id: 'normal_6',
      label: 'Mediastino centrado',
      text: 'Mediastino centrado',
      category: 'Achados'
    },
    {
      id: 'normal_7',
      label: 'Estruturas ósseas íntegras',
      text: 'Estruturas ósseas íntegras',
      category: 'Achados'
    },
    {
      id: 'normal_8',
      label: 'Partes moles preservadas',
      text: 'Partes moles preservadas',
      category: 'Achados'
    },

    // Achados Patológicos
    {
      id: 'patol_1',
      label: 'Opacidade em base direita',
      text: 'Opacidade em base direita',
      category: 'Achados'
    },
    {
      id: 'patol_2',
      label: 'Opacidade em base esquerda',
      text: 'Opacidade em base esquerda',
      category: 'Achados'
    },
    {
      id: 'patol_3',
      label: 'Opacidade em ápice direito',
      text: 'Opacidade em ápice direito',
      category: 'Achados'
    },
    {
      id: 'patol_4',
      label: 'Opacidade em ápice esquerdo',
      text: 'Opacidade em ápice esquerdo',
      category: 'Achados'
    },
    {
      id: 'patol_5',
      label: 'Cardiomegalia',
      text: 'Cardiomegalia',
      category: 'Achados'
    },
    {
      id: 'patol_6',
      label: 'Derrame pleural à direita',
      text: 'Derrame pleural à direita',
      category: 'Achados'
    },
    {
      id: 'patol_7',
      label: 'Derrame pleural à esquerda',
      text: 'Derrame pleural à esquerda',
      category: 'Achados'
    },
    {
      id: 'patol_8',
      label: 'Infiltrado intersticial bilateral',
      text: 'Infiltrado intersticial bilateral',
      category: 'Achados'
    },
    {
      id: 'patol_9',
      label: 'Pneumotórax à direita',
      text: 'Pneumotórax à direita',
      category: 'Achados'
    },
    {
      id: 'patol_10',
      label: 'Pneumotórax à esquerda',
      text: 'Pneumotórax à esquerda',
      category: 'Achados'
    },
    {
      id: 'patol_11',
      label: 'Atelectasia em base direita',
      text: 'Atelectasia em base direita',
      category: 'Achados'
    },
    {
      id: 'patol_12',
      label: 'Atelectasia em base esquerda',
      text: 'Atelectasia em base esquerda',
      category: 'Achados'
    },

    // Conclusões
    {
      id: 'concl_1',
      label: 'Exame radiológico do tórax sem alterações',
      text: 'Exame radiológico do tórax sem alterações',
      category: 'Conclusão'
    },
    {
      id: 'concl_2',
      label: 'Pneumonia em base direita',
      text: 'Pneumonia em base direita',
      category: 'Conclusão'
    },
    {
      id: 'concl_3',
      label: 'Pneumonia em base esquerda',
      text: 'Pneumonia em base esquerda',
      category: 'Conclusão'
    },
    {
      id: 'concl_4',
      label: 'Cardiomegalia',
      text: 'Cardiomegalia',
      category: 'Conclusão'
    },
    {
      id: 'concl_5',
      label: 'Derrame pleural',
      text: 'Derrame pleural',
      category: 'Conclusão'
    },
    {
      id: 'concl_6',
      label: 'Sugestivo de processo inflamatório/infeccioso',
      text: 'Sugestivo de processo inflamatório/infeccioso',
      category: 'Conclusão'
    },
    {
      id: 'concl_7',
      label: 'Pneumotórax',
      text: 'Pneumotórax',
      category: 'Conclusão'
    },
    {
      id: 'concl_8',
      label: 'Doença pulmonar intersticial',
      text: 'Doença pulmonar intersticial',
      category: 'Conclusão'
    },
    {
      id: 'concl_9',
      label: 'Atelectasia',
      text: 'Atelectasia',
      category: 'Conclusão'
    },
    {
      id: 'concl_10',
      label: 'Correlacionar com dados clínicos',
      text: 'Correlacionar com dados clínicos',
      category: 'Conclusão'
    }
  ]
}

// Template para Radiografia de Abdome (exemplo para futuro)
export const abdomeTemplate: ExamTemplate = {
  id: 'abdome',
  name: 'Radiografia de Abdome',
  title: 'Radiografia de Abdome',
  options: [
    {
      id: 'abd_tecnica_1',
      label: 'Radiografia simples do abdome em incidência AP',
      text: 'Radiografia simples do abdome em incidência AP',
      category: 'Técnica'
    },
    {
      id: 'abd_normal_1',
      label: 'Distribuição gasosa normal',
      text: 'Distribuição gasosa normal',
      category: 'Achados'
    },
    {
      id: 'abd_concl_1',
      label: 'Exame radiológico do abdome sem alterações',
      text: 'Exame radiológico do abdome sem alterações',
      category: 'Conclusão'
    }
  ]
}

// Lista de todos os templates disponíveis
export const allTemplates: ExamTemplate[] = [
  toraxTemplate,
  abdomeTemplate
]

// Função para buscar template por ID
export const getTemplateById = (id: string): ExamTemplate | undefined => {
  return allTemplates.find((template: ExamTemplate) => template.id === id)
}

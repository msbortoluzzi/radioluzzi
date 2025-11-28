import type { Category, Option, ReportTemplate } from '@/lib/supabase-dynamic'

export interface PatientData {
  name?: string
  age?: string
  gender?: string
}

export interface ReportGenerationData {
  patientData: PatientData
  selectedOptions: Option[]
  categories: Category[]
  template: ReportTemplate
  additionalNotes?: string
}

export function generateRawText(data: ReportGenerationData): string {
  const { selectedOptions, categories } = data
  const categoryMap: Record<string, Category> = {}

  categories.forEach((cat) => {
    categoryMap[cat.id] = cat
  })

  const groupedOptions: Record<string, Option[]> = {}
  selectedOptions.forEach((option) => {
    const category = categoryMap[option.category_id]
    if (!category) return

    const slug = category.slug
    if (!groupedOptions[slug]) {
      groupedOptions[slug] = []
    }
    groupedOptions[slug].push(option)
  })

  let rawText = ''
  const orderedCategories = [...categories].sort((a, b) => a.order_index - b.order_index)

  orderedCategories.forEach((category) => {
    const categoryOptions = groupedOptions[category.slug]
    if (!categoryOptions || categoryOptions.length === 0) return

    rawText += `${category.name.toUpperCase()}:\n`
    categoryOptions.forEach((option) => {
      const prefix = category.slug === 'conclusao' ? '- ' : ''
      rawText += `${prefix}${option.value}.\n`
    })
    rawText += '\n'
  })

  return rawText
}

export function formatFinalReport(aiText: string, patientData: PatientData): string {
  let finalReport = 'RADIOGRAFIA DE TÓRAX\n\n'

  if (patientData.name) finalReport += `Paciente: ${patientData.name}\n`
  if (patientData.age) finalReport += `Idade: ${patientData.age}\n`
  if (patientData.gender) finalReport += `Sexo: ${patientData.gender}\n`

  if (patientData.name || patientData.age || patientData.gender) {
    finalReport += '\n'
  }

  finalReport += aiText
  finalReport += '\n\n'
  finalReport += `Data do laudo: ${new Date().toLocaleDateString('pt-BR')}\n`
  finalReport += `Hora: ${new Date().toLocaleTimeString('pt-BR')}`

  return finalReport
}

export function generateSimpleReport(data: ReportGenerationData): string {
  const rawText = generateRawText(data)
  return formatFinalReport(rawText, data.patientData)
}

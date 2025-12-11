export type FieldTipo = "select" | "texto" | "numero" | "checkbox";

export interface ExamTypeConfig {
  id: string;
  slug: string;
  nome: string;
  modalidade: string;
  ativo: boolean;
}

export interface ReportSection {
  id: string;
  exam_type_id: string;
  titulo: string;
  ordem: number;
}

export interface Field {
  id: string;
  section_id: string;
  nome: string;
  tipo: FieldTipo;
  obrigatorio: boolean;
  ordem: number;
  placeholder?: string | null;
}

export interface FieldOption {
  id: string;
  field_id: string;
  label: string;
  valor_laudo: string;
  sinonimos_voz?: string[] | null;
  ordem: number;
}

export interface ReportTemplate {
  id: string;
  exam_type_id: string;
  nome: string;
  modelo_texto: string;
}

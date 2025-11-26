-- Tabela de Máscaras de Laudos (Templates por Modalidade)
CREATE TABLE IF NOT EXISTS report_masks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modality VARCHAR(50) NOT NULL, -- US, TC, RM, RX, Mamografia
  exam_name VARCHAR(255) NOT NULL, -- Abdome Total, Tórax, Crânio, etc.
  slug VARCHAR(255) NOT NULL UNIQUE,
  sections JSONB NOT NULL, -- Estrutura das seções do laudo
  default_text JSONB, -- Textos padrão para cada seção
  formatting_rules JSONB, -- Regras de formatação específicas
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para report_masks
CREATE INDEX IF NOT EXISTS idx_report_masks_modality ON report_masks(modality);
CREATE INDEX IF NOT EXISTS idx_report_masks_slug ON report_masks(slug);
CREATE INDEX IF NOT EXISTS idx_report_masks_active ON report_masks(active);

-- Tabela de Conhecimento Radiológico (Base de Achados e Frases)
CREATE TABLE IF NOT EXISTS radiology_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organ VARCHAR(100) NOT NULL, -- Fígado, Vesícula, Pâncreas, etc.
  finding VARCHAR(255) NOT NULL, -- Esteatose, Cálculo, Nódulo, etc.
  modality VARCHAR(50), -- US, TC, RM, RX (null = todos)
  keywords TEXT[] NOT NULL, -- Palavras-chave para reconhecimento
  description_template TEXT NOT NULL, -- Template para seção ACHADOS
  impression_template TEXT NOT NULL, -- Template para seção IMPRESSÃO
  severity_levels JSONB, -- Graus/classificações (leve, moderado, grave, etc.)
  additional_info JSONB, -- Informações complementares
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para radiology_knowledge
CREATE INDEX IF NOT EXISTS idx_radiology_knowledge_organ ON radiology_knowledge(organ);
CREATE INDEX IF NOT EXISTS idx_radiology_knowledge_finding ON radiology_knowledge(finding);
CREATE INDEX IF NOT EXISTS idx_radiology_knowledge_modality ON radiology_knowledge(modality);
CREATE INDEX IF NOT EXISTS idx_radiology_knowledge_keywords ON radiology_knowledge USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_radiology_knowledge_active ON radiology_knowledge(active);

-- Tabela de Histórico de Laudos Gerados (para aprendizado da IA)
CREATE TABLE IF NOT EXISTS editor_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mask_id UUID REFERENCES report_masks(id),
  voice_input TEXT, -- Texto reconhecido por voz
  ai_interpretation JSONB, -- Como a IA interpretou os achados
  generated_sections JSONB, -- Seções geradas automaticamente
  final_content TEXT NOT NULL, -- Conteúdo final do laudo
  user_corrections JSONB, -- Correções feitas pelo usuário (para aprendizado)
  metadata JSONB, -- Dados adicionais (paciente, data, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para editor_reports
CREATE INDEX IF NOT EXISTS idx_editor_reports_mask_id ON editor_reports(mask_id);
CREATE INDEX IF NOT EXISTS idx_editor_reports_created_at ON editor_reports(created_at DESC);

-- Tabela de Frases Frequentes do Usuário (personalização)
CREATE TABLE IF NOT EXISTS user_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organ VARCHAR(100) NOT NULL,
  finding VARCHAR(255) NOT NULL,
  user_preferred_phrase TEXT NOT NULL, -- Frase preferida do usuário
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para user_phrases
CREATE INDEX IF NOT EXISTS idx_user_phrases_organ_finding ON user_phrases(organ, finding);
CREATE INDEX IF NOT EXISTS idx_user_phrases_usage_count ON user_phrases(usage_count DESC);

-- Comentários nas tabelas
COMMENT ON TABLE report_masks IS 'Máscaras/templates de laudos organizados por modalidade e tipo de exame';
COMMENT ON TABLE radiology_knowledge IS 'Base de conhecimento radiológico com achados e templates de frases';
COMMENT ON TABLE editor_reports IS 'Histórico de laudos gerados pelo editor inteligente';
COMMENT ON TABLE user_phrases IS 'Frases personalizadas preferidas pelo usuário para aprendizado contínuo';

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_report_masks_updated_at BEFORE UPDATE ON report_masks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_radiology_knowledge_updated_at BEFORE UPDATE ON radiology_knowledge
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_editor_reports_updated_at BEFORE UPDATE ON editor_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

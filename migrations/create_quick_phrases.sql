-- Criar tabela de frases prontas

CREATE TABLE IF NOT EXISTS quick_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  text TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  target_type TEXT DEFAULT 'section',
  insert_mode TEXT DEFAULT 'replace',
  subsection TEXT,
  modality TEXT,
  exam_type TEXT,
  section_id TEXT,
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quick_phrases_category ON quick_phrases(category);
CREATE INDEX IF NOT EXISTS idx_quick_phrases_modality ON quick_phrases(modality);
CREATE INDEX IF NOT EXISTS idx_quick_phrases_keywords ON quick_phrases USING GIN(keywords);

-- Popular com frases iniciais de Tireoide

INSERT INTO quick_phrases (category, label, text, keywords, modality, exam_type, section_id) VALUES
-- Tireoide
('Tireoide', 'Normal', 'Tireoide com dimensões normais e ecotextura preservada.', ARRAY['normal', 'preservada'], 'US', 'tireoide', 'tireoide'),
('Tireoide', 'Aumentada', 'Tireoide com dimensões aumentadas.', ARRAY['aumentada', 'bócio'], 'US', 'tireoide', 'tireoide'),
('Tireoide', 'Heterogênea', 'Tireoide com ecotextura heterogênea.', ARRAY['heterogênea', 'tireoidite'], 'US', 'tireoide', 'tireoide'),
('Tireoide', 'Aumentada e Heterogênea', 'Tireoide com dimensões aumentadas e ecotextura heterogênea.', ARRAY['aumentada', 'heterogênea'], 'US', 'tireoide', 'tireoide'),

-- Nódulos
('Nódulos', 'Sólido Isoecogênico', 'Nódulo sólido, isoecogênico, contornos regulares.', ARRAY['nódulo', 'sólido', 'isoecogênico'], 'US', 'tireoide', 'tireoide'),
('Nódulos', 'Sólido Hipoecogênico', 'Nódulo sólido, hipoecogênico, contornos regulares.', ARRAY['nódulo', 'sólido', 'hipoecogênico'], 'US', 'tireoide', 'tireoide'),
('Nódulos', 'Cístico Simples', 'Nódulo cístico simples, anecoico, contornos regulares.', ARRAY['nódulo', 'cístico', 'cisto'], 'US', 'tireoide', 'tireoide'),
('Nódulos', 'Misto Sólido-Cístico', 'Nódulo misto sólido-cístico.', ARRAY['nódulo', 'misto'], 'US', 'tireoide', 'tireoide'),
('Nódulos', 'Com Microcalcificações', 'Nódulo com focos ecogênicos compatíveis com microcalcificações.', ARRAY['nódulo', 'microcalcificações', 'calcificações'], 'US', 'tireoide', 'tireoide'),

-- Linfonodos
('Linfonodos', 'Sem Linfonodomegalias', 'Não observamos linfonodomegalias cervicais.', ARRAY['linfonodo', 'normal'], 'US', 'tireoide', 'linfonodos'),
('Linfonodos', 'Linfonodo Aumentado', 'Linfonodo cervical aumentado.', ARRAY['linfonodo', 'linfonodomegalia', 'adenomegalia'], 'US', 'tireoide', 'linfonodos'),
('Linfonodos', 'Linfonodo Reativo', 'Linfonodo oval com hilo ecogênico presente, sugestivo de aspecto reativo.', ARRAY['linfonodo', 'reativo'], 'US', 'tireoide', 'linfonodos'),

-- Vascularização
('Vascularização', 'Preservada', 'Trajetos vasculares preservados.', ARRAY['vasos', 'normal'], 'US', 'tireoide', 'vasos'),
('Vascularização', 'Fluxo Aumentado', 'Vascularização aumentada ao estudo Doppler.', ARRAY['doppler', 'fluxo', 'vascularização'], 'US', 'tireoide', 'vasos'),

-- Impressão
('Impressão', 'Normal', 'Exame sem alterações significativas.', ARRAY['normal', 'sem alterações'], 'US', 'tireoide', 'impressao'),
('Impressão', 'Bócio', 'Tireoide com dimensões aumentadas (bócio).', ARRAY['bócio', 'aumentada'], 'US', 'tireoide', 'impressao'),
('Impressão', 'Nódulos para TI-RADS', 'Nódulos tireoidianos (sugestão: classificação TI-RADS).', ARRAY['nódulos', 'tirads'], 'US', 'tireoide', 'impressao');

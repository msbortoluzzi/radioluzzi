-- Estrutura de configuracao dinamica do Radioluzzi

-- exam_types: cadastra tipos/modalidades
CREATE TABLE IF NOT EXISTS exam_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  modalidade TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exam_types ADD COLUMN IF NOT EXISTS nome TEXT;
ALTER TABLE exam_types ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE exam_types ADD COLUMN IF NOT EXISTS modalidade TEXT;
ALTER TABLE exam_types ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE;
ALTER TABLE exam_types ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- report_sections: seções ordenadas por exame
CREATE TABLE IF NOT EXISTS report_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type_id UUID REFERENCES exam_types(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_sections_exam ON report_sections(exam_type_id, ordem);

-- fields: campos dentro de uma seção
CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES report_sections(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('select', 'texto', 'numero', 'checkbox')),
  obrigatorio BOOLEAN DEFAULT FALSE,
  ordem INT NOT NULL DEFAULT 0,
  placeholder TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fields_section ON fields(section_id, ordem);

-- field_options: opções/preenchimento estruturado
CREATE TABLE IF NOT EXISTS field_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  valor_laudo TEXT NOT NULL,
  sinonimos_voz TEXT[] DEFAULT '{}',
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_options_field ON field_options(field_id, ordem);
CREATE INDEX IF NOT EXISTS idx_field_options_voice ON field_options USING GIN(sinonimos_voz);

-- report_templates: modelo textual com placeholders
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type_id UUID REFERENCES exam_types(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  modelo_texto TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_templates_exam ON report_templates(exam_type_id);

-- ui_blocks: blocos de interface configuráveis
CREATE TABLE IF NOT EXISTS ui_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  tipo TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ui_blocks_page ON ui_blocks(page, ordem);

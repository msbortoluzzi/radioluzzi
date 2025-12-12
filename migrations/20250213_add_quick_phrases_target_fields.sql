-- Garante colunas de alvo/posição/subseção em quick_phrases
ALTER TABLE quick_phrases
  ADD COLUMN IF NOT EXISTS target_type TEXT DEFAULT 'section',
  ADD COLUMN IF NOT EXISTS insert_mode TEXT DEFAULT 'replace',
  ADD COLUMN IF NOT EXISTS subsection TEXT;

-- Ajusta registros existentes para usar defaults
UPDATE quick_phrases
SET
  target_type = COALESCE(target_type, 'section'),
  insert_mode = COALESCE(insert_mode, 'replace')
WHERE target_type IS NULL
   OR insert_mode IS NULL;

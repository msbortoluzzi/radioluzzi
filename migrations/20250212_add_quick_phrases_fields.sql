-- Campos extras para frases prontas: tipo de alvo, subseção e posicionamento
ALTER TABLE quick_phrases
  ADD COLUMN IF NOT EXISTS target_type TEXT DEFAULT 'section',
  ADD COLUMN IF NOT EXISTS subsection TEXT,
  ADD COLUMN IF NOT EXISTS insert_mode TEXT DEFAULT 'replace';

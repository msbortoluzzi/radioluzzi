-- Inserir Máscaras de Laudos Iniciais

-- 1. Ultrassom - Abdome Total
INSERT INTO report_masks (modality, exam_name, slug, sections, default_text, formatting_rules) VALUES (
  'US',
  'Abdome Total',
  'us-abdome-total',
  '{
    "sections": [
      {"id": "tecnica", "title": "TÉCNICA", "order": 1, "required": true},
      {"id": "figado", "title": "FÍGADO", "order": 2, "required": true},
      {"id": "vesicula", "title": "VESÍCULA BILIAR", "order": 3, "required": true},
      {"id": "vias_biliares", "title": "VIAS BILIARES", "order": 4, "required": true},
      {"id": "pancreas", "title": "PÂNCREAS", "order": 5, "required": true},
      {"id": "baco", "title": "BAÇO", "order": 6, "required": true},
      {"id": "rins", "title": "RINS", "order": 7, "required": true},
      {"id": "bexiga", "title": "BEXIGA", "order": 8, "required": false},
      {"id": "liquido_livre", "title": "LÍQUIDO LIVRE", "order": 9, "required": false},
      {"id": "impressao", "title": "IMPRESSÃO DIAGNÓSTICA", "order": 10, "required": true}
    ]
  }'::jsonb,
  '{
    "tecnica": "Exame realizado com transdutor convexo multifrequencial.",
    "figado": "",
    "vesicula": "",
    "vias_biliares": "",
    "pancreas": "",
    "baco": "",
    "rins": "",
    "bexiga": "",
    "liquido_livre": "",
    "impressao": ""
  }'::jsonb,
  '{
    "title": {"font": "Arial", "size": 12, "bold": true, "align": "center", "uppercase": true},
    "section_title": {"font": "Arial", "size": 11, "bold": true},
    "body": {"font": "Arial", "size": 11},
    "impression": {"font": "Arial", "size": 11, "prefix": "- "}
  }'::jsonb
);

-- 2. Tomografia - Tórax
INSERT INTO report_masks (modality, exam_name, slug, sections, default_text, formatting_rules) VALUES (
  'TC',
  'Tórax',
  'tc-torax',
  '{
    "sections": [
      {"id": "tecnica", "title": "TÉCNICA", "order": 1, "required": true},
      {"id": "pulmoes", "title": "PULMÕES", "order": 2, "required": true},
      {"id": "pleura", "title": "PLEURA", "order": 3, "required": true},
      {"id": "mediastino", "title": "MEDIASTINO", "order": 4, "required": true},
      {"id": "coracao", "title": "CORAÇÃO", "order": 5, "required": true},
      {"id": "parede_toracica", "title": "PAREDE TORÁCICA", "order": 6, "required": false},
      {"id": "impressao", "title": "IMPRESSÃO DIAGNÓSTICA", "order": 7, "required": true}
    ]
  }'::jsonb,
  '{
    "tecnica": "Exame realizado em equipamento multislice, sem administração de contraste endovenoso.",
    "pulmoes": "",
    "pleura": "",
    "mediastino": "",
    "coracao": "",
    "parede_toracica": "",
    "impressao": ""
  }'::jsonb,
  '{
    "title": {"font": "Arial", "size": 12, "bold": true, "align": "center", "uppercase": true},
    "section_title": {"font": "Arial", "size": 11, "bold": true},
    "body": {"font": "Arial", "size": 11},
    "impression": {"font": "Arial", "size": 11, "prefix": "- "}
  }'::jsonb
);

-- 3. Ressonância Magnética - Crânio
INSERT INTO report_masks (modality, exam_name, slug, sections, default_text, formatting_rules) VALUES (
  'RM',
  'Crânio',
  'rm-cranio',
  '{
    "sections": [
      {"id": "tecnica", "title": "TÉCNICA", "order": 1, "required": true},
      {"id": "parenquima", "title": "PARÊNQUIMA ENCEFÁLICO", "order": 2, "required": true},
      {"id": "ventriculos", "title": "VENTRÍCULOS E CISTERNAS", "order": 3, "required": true},
      {"id": "linha_media", "title": "LINHA MÉDIA", "order": 4, "required": true},
      {"id": "orbitas", "title": "ÓRBITAS", "order": 5, "required": false},
      {"id": "seios_paranasais", "title": "SEIOS PARANASAIS", "order": 6, "required": false},
      {"id": "impressao", "title": "IMPRESSÃO DIAGNÓSTICA", "order": 7, "required": true}
    ]
  }'::jsonb,
  '{
    "tecnica": "Exame realizado em equipamento de alto campo, com sequências ponderadas em T1, T2 e FLAIR.",
    "parenquima": "",
    "ventriculos": "",
    "linha_media": "",
    "orbitas": "",
    "seios_paranasais": "",
    "impressao": ""
  }'::jsonb,
  '{
    "title": {"font": "Arial", "size": 12, "bold": true, "align": "center", "uppercase": true},
    "section_title": {"font": "Arial", "size": 11, "bold": true},
    "body": {"font": "Arial", "size": 11},
    "impression": {"font": "Arial", "size": 11, "prefix": "- "}
  }'::jsonb
);

-- 4. Radiografia - Tórax
INSERT INTO report_masks (modality, exam_name, slug, sections, default_text, formatting_rules) VALUES (
  'RX',
  'Tórax',
  'rx-torax',
  '{
    "sections": [
      {"id": "tecnica", "title": "TÉCNICA", "order": 1, "required": true},
      {"id": "pulmoes", "title": "PULMÕES", "order": 2, "required": true},
      {"id": "pleura", "title": "PLEURA", "order": 3, "required": true},
      {"id": "mediastino", "title": "MEDIASTINO", "order": 4, "required": true},
      {"id": "coracao", "title": "CORAÇÃO", "order": 5, "required": true},
      {"id": "arcabouço", "title": "ARCABOUÇO ÓSSEO", "order": 6, "required": false},
      {"id": "impressao", "title": "IMPRESSÃO DIAGNÓSTICA", "order": 7, "required": true}
    ]
  }'::jsonb,
  '{
    "tecnica": "Radiografia de tórax em incidências PA e perfil.",
    "pulmoes": "",
    "pleura": "",
    "mediastino": "",
    "coracao": "",
    "arcabouço": "",
    "impressao": ""
  }'::jsonb,
  '{
    "title": {"font": "Arial", "size": 12, "bold": true, "align": "center", "uppercase": true},
    "section_title": {"font": "Arial", "size": 11, "bold": true},
    "body": {"font": "Arial", "size": 11},
    "impression": {"font": "Arial", "size": 11, "prefix": "- "}
  }'::jsonb
);

-- 5. Mamografia
INSERT INTO report_masks (modality, exam_name, slug, sections, default_text, formatting_rules) VALUES (
  'Mamografia',
  'Mamografia Bilateral',
  'mamografia-bilateral',
  '{
    "sections": [
      {"id": "tecnica", "title": "TÉCNICA", "order": 1, "required": true},
      {"id": "mama_direita", "title": "MAMA DIREITA", "order": 2, "required": true},
      {"id": "mama_esquerda", "title": "MAMA ESQUERDA", "order": 3, "required": true},
      {"id": "axilas", "title": "AXILAS", "order": 4, "required": false},
      {"id": "birads", "title": "CLASSIFICAÇÃO BI-RADS", "order": 5, "required": true},
      {"id": "impressao", "title": "IMPRESSÃO DIAGNÓSTICA", "order": 6, "required": true}
    ]
  }'::jsonb,
  '{
    "tecnica": "Mamografia digital bilateral nas incidências crânio-caudal (CC) e médio-lateral oblíqua (MLO).",
    "mama_direita": "",
    "mama_esquerda": "",
    "axilas": "",
    "birads": "",
    "impressao": ""
  }'::jsonb,
  '{
    "title": {"font": "Arial", "size": 12, "bold": true, "align": "center", "uppercase": true},
    "section_title": {"font": "Arial", "size": 11, "bold": true},
    "body": {"font": "Arial", "size": 11},
    "impression": {"font": "Arial", "size": 11, "prefix": "- "}
  }'::jsonb
);

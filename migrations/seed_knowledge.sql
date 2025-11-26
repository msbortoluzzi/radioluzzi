-- Popular Base de Conhecimento Radiológico
-- Achados comuns em Ultrassom de Abdome Total

-- FÍGADO
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'fígado',
  'esteatose',
  'US',
  ARRAY['esteatose', 'gordura', 'fígado gorduroso', 'infiltração gordurosa', 'esteatose hepática'],
  'Fígado com ecotextura difusamente hiperecogênica, compatível com esteatose hepática {grau}.',
  'Esteatose hepática {grau}.',
  '{"levels": ["leve", "moderada", "acentuada", "grau I", "grau II", "grau III"]}'::jsonb
),
(
  'fígado',
  'hepatomegalia',
  'US',
  ARRAY['hepatomegalia', 'fígado aumentado', 'aumento do fígado', 'fígado grande'],
  'Fígado de dimensões aumentadas, com ecotextura homogênea.',
  'Hepatomegalia.',
  NULL
),
(
  'fígado',
  'normal',
  'US',
  ARRAY['fígado normal', 'sem alterações', 'normal'],
  'Fígado de dimensões normais, contornos regulares, ecotextura homogênea, sem evidência de lesões focais.',
  NULL,
  NULL
),
(
  'fígado',
  'cisto',
  'US',
  ARRAY['cisto', 'lesão cística', 'formação cística'],
  'Presença de imagem anecoica de contornos regulares no fígado, medindo {tamanho}, compatível com cisto simples.',
  'Cisto hepático simples.',
  NULL
),
(
  'fígado',
  'hemangioma',
  'US',
  ARRAY['hemangioma', 'lesão hiperecogênica'],
  'Presença de imagem hiperecogênica de contornos regulares no fígado, medindo {tamanho}, compatível com hemangioma.',
  'Hemangioma hepático.',
  NULL
);

-- VESÍCULA BILIAR
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'vesícula biliar',
  'cálculo',
  'US',
  ARRAY['cálculo', 'colelitíase', 'pedra', 'cálculo vesicular'],
  'Vesícula biliar de paredes finas, contendo imagem hiperecogênica com sombra acústica posterior medindo {tamanho}, compatível com cálculo.',
  'Colecistolitíase.',
  NULL
),
(
  'vesícula biliar',
  'normal',
  'US',
  ARRAY['vesícula normal', 'sem cálculos', 'sem alterações'],
  'Vesícula biliar de paredes finas, sem cálculos ou sinais de processo inflamatório.',
  NULL,
  NULL
),
(
  'vesícula biliar',
  'espessamento parietal',
  'US',
  ARRAY['espessamento', 'parede espessada', 'colecistite'],
  'Vesícula biliar com espessamento parietal difuso, medindo {espessura}.',
  'Espessamento parietal da vesícula biliar, a correlacionar com quadro clínico.',
  NULL
),
(
  'vesícula biliar',
  'pólipo',
  'US',
  ARRAY['pólipo', 'pólipo vesicular', 'formação polipoide'],
  'Presença de imagem hiperecogênica aderida à parede da vesícula biliar, sem sombra acústica, medindo {tamanho}, compatível com pólipo.',
  'Pólipo vesicular.',
  NULL
);

-- VIAS BILIARES
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'vias biliares',
  'dilatação',
  'US',
  ARRAY['dilatação', 'vias dilatadas', 'colédoco dilatado'],
  'Vias biliares intra e extra-hepáticas dilatadas, com colédoco medindo {calibre}.',
  'Dilatação das vias biliares.',
  NULL
),
(
  'vias biliares',
  'normal',
  'US',
  ARRAY['vias normais', 'não dilatadas', 'calibre normal'],
  'Vias biliares intra e extra-hepáticas de calibre normal.',
  NULL,
  NULL
);

-- PÂNCREAS
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'pâncreas',
  'não visualizado',
  'US',
  ARRAY['não visualizado', 'interposição gasosa', 'gás'],
  'Pâncreas não visualizado por interposição gasosa.',
  NULL,
  NULL
),
(
  'pâncreas',
  'normal',
  'US',
  ARRAY['pâncreas normal', 'sem alterações'],
  'Pâncreas de dimensões e ecotextura normais.',
  NULL,
  NULL
);

-- BAÇO
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'baço',
  'esplenomegalia',
  'US',
  ARRAY['esplenomegalia', 'baço aumentado', 'aumento do baço'],
  'Baço de dimensões aumentadas, medindo {tamanho} no maior eixo longitudinal.',
  'Esplenomegalia.',
  NULL
),
(
  'baço',
  'normal',
  'US',
  ARRAY['baço normal', 'dimensões normais'],
  'Baço de dimensões e ecotextura normais.',
  NULL,
  NULL
);

-- RINS
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'rins',
  'cisto',
  'US',
  ARRAY['cisto renal', 'lesão cística', 'cisto'],
  'Presença de imagem anecoica de contornos regulares no rim {lado}, medindo {tamanho}, compatível com cisto simples.',
  'Cisto renal simples {lado}.',
  NULL
),
(
  'rins',
  'cálculo',
  'US',
  ARRAY['cálculo renal', 'litíase', 'pedra', 'nefrolitíase'],
  'Presença de imagem hiperecogênica com sombra acústica posterior no rim {lado}, medindo {tamanho}, compatível com cálculo.',
  'Nefrolitíase {lado}.',
  NULL
),
(
  'rins',
  'hidronefrose',
  'US',
  ARRAY['hidronefrose', 'dilatação pielocalicial', 'dilatação'],
  'Dilatação pielocalicial {grau} no rim {lado}.',
  'Hidronefrose {grau} {lado}.',
  '{"levels": ["leve", "moderada", "acentuada"]}'::jsonb
),
(
  'rins',
  'normal',
  'US',
  ARRAY['rins normais', 'sem dilatação', 'tópicos'],
  'Rins tópicos, de dimensões e ecotextura normais, sem dilatação pielocalicial ou cálculos.',
  NULL,
  NULL
);

-- BEXIGA
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'bexiga',
  'normal',
  'US',
  ARRAY['bexiga normal', 'sem alterações'],
  'Bexiga de paredes finas e regulares, sem lesões.',
  NULL,
  NULL
),
(
  'bexiga',
  'espessamento parietal',
  'US',
  ARRAY['espessamento', 'parede espessada'],
  'Bexiga com espessamento parietal difuso.',
  'Espessamento parietal vesical, a correlacionar com quadro clínico.',
  NULL
);

-- LÍQUIDO LIVRE
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'cavidade abdominal',
  'líquido livre',
  'US',
  ARRAY['líquido livre', 'ascite', 'líquido'],
  '{quantidade} de líquido livre {localização}.',
  'Líquido livre {localização}.',
  '{"quantities": ["Pequena quantidade", "Moderada quantidade", "Grande quantidade"], "locations": ["na pelve", "no abdome inferior", "no abdome superior", "peri-hepático", "peri-esplênico", "em todo abdome"]}'::jsonb
),
(
  'cavidade abdominal',
  'sem líquido',
  'US',
  ARRAY['sem líquido', 'ausência de líquido'],
  'Ausência de líquido livre na cavidade abdominal.',
  NULL,
  NULL
);

-- Achados GERAIS/NORMAIS
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'geral',
  'sem alterações',
  'US',
  ARRAY['sem alterações', 'normal', 'exame normal'],
  'Exame ultrassonográfico sem alterações significativas.',
  'Exame sem alterações significativas.',
  NULL
);

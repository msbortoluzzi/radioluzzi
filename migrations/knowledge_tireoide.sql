-- Base de Conhecimento: Ultrassonografia de Tireoide
-- Achados radiológicos personalizados

-- TIREOIDE NORMAL
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'tireoide',
  'normal',
  'US',
  ARRAY['normal', 'sem alterações', 'preservada', 'dimensões normais'],
  'Tireoide com dimensões normais e ecotextura preservada.
-Lobo direito mede cerca de: {medida_direita} cm (volume de {volume_direito} cm³).
-Lobo esquerdo mede cerca de: {medida_esquerda} cm (volume de {volume_esquerdo} cm³).
-Istmo com espessura máxima de: {istmo} cm.
-Volume de {volume_total} cm³ (normal 10-15 cm³).
Não observamos nódulos dominantes.
Não observamos linfonodomegalias cervicais.
Trajetos vasculares preservados.',
  'Exame sem alterações significativas.',
  NULL
);

-- TIREOIDE AUMENTADA
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'tireoide',
  'aumentada',
  'US',
  ARRAY['aumentada', 'bócio', 'aumento', 'volumosa'],
  'Tireoide com dimensões aumentadas e ecotextura {tipo_ecotextura}.
-Lobo direito mede cerca de: {medida_direita} cm (volume de {volume_direito} cm³).
-Lobo esquerdo mede cerca de: {medida_esquerda} cm (volume de {volume_esquerdo} cm³).
-Istmo com espessura máxima de: {istmo} cm.
-Volume de {volume_total} cm³ (normal 10-15 cm³).',
  'Tireoide com dimensões aumentadas e ecotextura {tipo_ecotextura} podendo corresponder a tireoidite ou bócio multinodular.',
  '{"ecotextura": ["heterogênea", "finamente heterogênea", "grosseiramente heterogênea", "preservada"]}'::jsonb
);

-- TIREOIDE DIMINUÍDA
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'tireoide',
  'diminuída',
  'US',
  ARRAY['diminuída', 'reduzida', 'atrófica', 'hipoplásica'],
  'Tireoide com dimensões reduzidas e ecotextura {tipo_ecotextura}.
-Lobo direito mede cerca de: {medida_direita} cm (volume de {volume_direito} cm³).
-Lobo esquerdo mede cerca de: {medida_esquerda} cm (volume de {volume_esquerdo} cm³).
-Istmo com espessura máxima de: {istmo} cm.
-Volume de {volume_total} cm³ (normal 10-15 cm³).',
  'Tireoide com dimensões reduzidas.',
  '{"ecotextura": ["heterogênea", "preservada"]}'::jsonb
);

-- ECOTEXTURA HETEROGÊNEA
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, severity_levels) VALUES
(
  'tireoide',
  'ecotextura heterogênea',
  'US',
  ARRAY['heterogênea', 'ecotextura alterada', 'tireoidite'],
  'Tireoide com dimensões {dimensao} e ecotextura {tipo_heterogeneidade}.',
  'Tireoide com ecotextura {tipo_heterogeneidade} podendo corresponder a tireoidite.',
  '{"dimensao": ["normais", "aumentadas", "reduzidas"], "tipo_heterogeneidade": ["heterogênea", "finamente heterogênea", "grosseiramente heterogênea"]}'::jsonb
);

-- NÓDULO TIREOIDIANO
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, additional_info) VALUES
(
  'tireoide',
  'nódulo',
  'US',
  ARRAY['nódulo', 'nódulos', 'lesão nodular', 'formação nodular'],
  '**N{numero}**: nódulo {composicao}, {ecogenicidade}, {forma}, com margens {margens}, {calcificacoes}, localizado no terço {localizacao_terco} do lobo tireoidiano {lado} medindo {medidas} cm (ACR TI-RADS {tirads}).',
  'Nódulos tireoidianos (ACR TI-RADS {tirads}).',
  '{
    "composicao": ["sólido", "misto sólido-cístico", "cístico", "espongiforme"],
    "ecogenicidade": ["hipoecogênico", "isoecogênico", "hiperecogênico", "anecogênico"],
    "forma": ["mais largo que alto", "mais alto que largo", "oval"],
    "margens": ["regulares", "mal definidas", "irregulares", "lobuladas"],
    "calcificacoes": ["sem calcificações", "com focos ecogênicos: microcalcificações", "com macrocalcificações", "com calcificações periféricas"],
    "localizacao_terco": ["superior", "médio", "inferior"],
    "lado": ["direito", "esquerdo"],
    "tirads_options": ["1", "2", "3", "4", "5"],
    "link_calculadora": "/calculadoras/tirads"
  }'::jsonb
);

-- NÓDULOS MÚLTIPLOS / BÓCIO MULTINODULAR
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template) VALUES
(
  'tireoide',
  'bócio multinodular',
  'US',
  ARRAY['múltiplos nódulos', 'bócio multinodular', 'vários nódulos'],
  'Tireoide com dimensões aumentadas e ecotextura heterogênea às custas de nódulos assim descritos:
{lista_nodulos}',
  'Bócio multinodular (ACR TI-RADS {tirads_maior}).',
  NULL
);

-- CISTO TIREOIDIANO
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template) VALUES
(
  'tireoide',
  'cisto',
  'US',
  ARRAY['cisto', 'lesão cística', 'formação cística', 'anecogênico'],
  'Imagem anecoica de contornos regulares no lobo tireoidiano {lado}, medindo {medidas} cm, compatível com cisto simples (ACR TI-RADS 2).',
  'Cisto tireoidiano simples (ACR TI-RADS 2).',
  NULL
);

-- LINFONODOMEGALIA CERVICAL
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template, additional_info) VALUES
(
  'linfonodo cervical',
  'linfonodomegalia',
  'US',
  ARRAY['linfonodo', 'linfonodomegalia', 'adenomegalia', 'gânglio'],
  'Linfonodo {forma} com hilo ecogênico {hilo}, {ecogenicidade}, {calcificacoes}, margens {margens} e vascularização {vascularizacao} ao estudo Doppler localizado no nível cervical {nivel} {lado} medindo {medidas} cm.',
  'Linfonodomegalia cervical {lado}.',
  '{
    "forma": ["oval", "arredondado"],
    "hilo": ["presente", "ausente"],
    "ecogenicidade": ["hipoecogênico", "isoecogênico", "hiperecogênico"],
    "calcificacoes": ["sem microcalcificações", "com microcalcificações"],
    "margens": ["regulares", "irregulares"],
    "vascularizacao": ["hilar", "periférica", "mista", "ausente"],
    "nivel": ["I", "II", "III", "IV", "V", "VI"],
    "lado": ["direito", "esquerdo", "bilateral"],
    "link_calculadora": "/calculadoras/linfadenopatias"
  }'::jsonb
);

-- SEM LINFONODOMEGALIAS
INSERT INTO radiology_knowledge (organ, finding, modality, keywords, description_template, impression_template) VALUES
(
  'linfonodo cervical',
  'sem linfonodomegalias',
  'US',
  ARRAY['sem linfonodomegalias', 'linfonodos normais', 'ausência de adenomegalias'],
  'Não observamos linfonodomegalias cervicais.',
  NULL,
  NULL
);

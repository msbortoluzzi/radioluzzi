-- Atualizar máscara de tireoide com textos padrão completos

UPDATE report_masks 
SET default_texts = '{
  "indicacao": "",
  "tireoide": "Tireoide com dimensões normais e ecotextura preservada.\n-Lobo direito mede cerca de: ___ cm (volume de ___ cm³).\n-Lobo esquerdo mede cerca de: ___ cm (volume de ___ cm³).\n-Istmo com espessura máxima de: ___ cm.\n-Volume de ___ cm³ (normal 10-15 cm³).\nNão observamos nódulos dominantes.",
  "linfonodos": "Não observamos linfonodomegalias cervicais.",
  "vasos": "Trajetos vasculares preservados.",
  "impressao": "Exame sem alterações significativas."
}'::jsonb
WHERE exam_type = 'tireoide';

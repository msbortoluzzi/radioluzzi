-- Máscara Personalizada: Ultrassonografia de Tireoide
-- Baseada no padrão do Dr. Bortoluzzi

INSERT INTO report_masks (name, modality, exam_type, sections, default_texts, formatting_rules) VALUES
(
  'Ultrassonografia de Tireoide',
  'US',
  'tireoide',
  '[
    {
      "id": "titulo",
      "title": "ULTRASSONOGRAFIA DE TIREOIDE",
      "order": 1,
      "type": "title"
    },
    {
      "id": "indicacao",
      "title": "Indicação clínica",
      "order": 2,
      "type": "text",
      "editable": true
    },
    {
      "id": "tireoide",
      "title": "TIREOIDE",
      "order": 3,
      "type": "structured",
      "subsections": [
        "dimensoes",
        "ecotextura",
        "nodulos",
        "medidas"
      ]
    },
    {
      "id": "linfonodos",
      "title": "LINFONODOS",
      "order": 4,
      "type": "structured"
    },
    {
      "id": "vasos",
      "title": "VASCULARIZAÇÃO",
      "order": 5,
      "type": "text"
    },
    {
      "id": "impressao",
      "title": "IMPRESSÃO",
      "order": 6,
      "type": "conclusion"
    }
  ]'::jsonb,
  '{
    "titulo": "ULTRASSONOGRAFIA DE TIREOIDE",
    "vasos": "Trajetos vasculares preservados."
  }'::jsonb,
  '{
    "font": "Arial",
    "fontSize": 11,
    "titleSize": 12,
    "titleBold": true,
    "titleAlign": "center",
    "sectionBold": true,
    "impressionPrefix": "- "
  }'::jsonb
)
ON CONFLICT DO NOTHING;

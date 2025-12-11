-- Modalidades padrão para Radioluzzi
insert into exam_types (id, slug, nome, modalidade, ativo)
values
  (gen_random_uuid(), 'radiografia', 'Radiografia', 'RX', true),
  (gen_random_uuid(), 'mamografia', 'Mamografia', 'MAMO', true),
  (gen_random_uuid(), 'ultrassonografia', 'Ultrassonografia', 'US', true),
  (gen_random_uuid(), 'tomografia-computadorizada', 'Tomografia Computadorizada', 'TC', true),
  (gen_random_uuid(), 'ressonancia-magnetica', 'Ressonância Magnética', 'RM', true)
on conflict (slug) do update
set nome = excluded.nome,
    modalidade = excluded.modalidade,
    ativo = excluded.ativo;

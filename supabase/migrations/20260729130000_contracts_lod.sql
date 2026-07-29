-- Agrega soporte para Letter of Direction (LOD) y datos estructurados de contrato
alter table contracts drop constraint if exists contracts_contract_type_check;
alter table contracts add constraint contracts_contract_type_check check (contract_type in (
  'producer_agreement','management_agreement','publishing_agreement',
  'beat_license','nda','photo_release','video_release','work_for_hire','letter_of_direction'
));
alter table contracts add column if not exists contract_data jsonb default '{}'::jsonb;
alter table contracts add column if not exists title text;

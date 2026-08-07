-- Agrega un tipo de contrato específico para España: cesión de derechos
-- patrimoniales, distinto de "work_for_hire" porque en España los derechos
-- morales del autor son inalienables y no pueden cederse por contrato.
alter table contracts drop constraint if exists contracts_contract_type_check;
alter table contracts add constraint contracts_contract_type_check check (contract_type in (
  'producer_agreement','management_agreement','publishing_agreement',
  'beat_license','nda','photo_release','video_release','work_for_hire',
  'letter_of_direction','cesion_derechos_es'
));

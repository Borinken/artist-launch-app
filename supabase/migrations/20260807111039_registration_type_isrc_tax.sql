-- Amplía el catálogo de registros con dos tipos nuevos que surgieron de la
-- auditoría de costos: prefijo ISRC propio y formulario de retención fiscal
-- (W-8BEN para artistas no residentes en EE.UU. que cobran regalías de EE.UU.).
do $$
declare
  con_name text;
begin
  select conname into con_name
  from pg_constraint
  where conrelid = 'registrations'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%registration_type%';

  if con_name is not null then
    execute format('alter table registrations drop constraint %I', con_name);
  end if;
end $$;

alter table registrations add constraint registrations_registration_type_check
  check (registration_type in (
    'pro_affiliation','copyright','the_mlc','distribution',
    'publishing_admin','soundexchange','spotify_verified','apple_verified',
    'isrc','tax_form'
  ));

-- Agrega costo estimado a los registros (editable por el operador, no un precio fijo de terceros)
alter table registrations add column if not exists cost_cents integer;
alter table registrations add column if not exists currency text default 'usd';

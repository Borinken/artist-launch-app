// Costos investigados en las páginas oficiales de cada proveedor (jul 2026).
// Son el costo del PROVEEDOR, no tu tarifa de gestión — verifica antes de
// cobrar porque estos precios cambian con el tiempo.
export type CatalogEntry = {
  value: string;          // registration_type en la base de datos
  provider: string;
  label: string;
  cost: number;            // costo sugerido en la moneda de la región
  detail: string;          // explicación corta del costo (ej. "+ 20% comisión")
};

const US_PR_CATALOG: CatalogEntry[] = [
  { value: 'pro_affiliation', provider: 'ASCAP', label: 'Afiliación a PRO — ASCAP', cost: 0, detail: 'Gratis para compositores, sin cuota anual. Afiliación exclusiva por catálogo — no se puede repartir por canción entre PROs' },
  { value: 'pro_affiliation', provider: 'BMI', label: 'Afiliación a PRO — BMI', cost: 0, detail: 'Gratis para compositores. Afiliación como editor (publisher) cuesta aparte (~$150-500 según tipo de entidad) — verificar en bmi.com' },
  { value: 'copyright', provider: 'Copyright.gov (US Copyright Office) — obra individual', label: 'Registro de copyright (un autor, un reclamante)', cost: 45, detail: 'Tarifa reducida para el caso más común de artista solo. Registra la composición (PA) O la grabación (SR) — son copyrights separados, revisa cuál necesitas' },
  { value: 'copyright', provider: 'Copyright.gov (US Copyright Office) — estándar', label: 'Registro de copyright (solicitud estándar)', cost: 65, detail: 'Para casos con varios autores/reclamantes o combinando PA+SR. Sube a $85 a mediados de noviembre 2026 (tarifa final presentada al Congreso el 14 jul 2026) — actualiza este número esa fecha' },
  { value: 'soundexchange', provider: 'SoundExchange', label: 'Registro de SoundExchange', cost: 0, detail: 'Gratis — cobra regalías digitales de la grabación (radio satelital, webcasting no interactivo)' },
  { value: 'the_mlc', provider: 'The MLC', label: 'The MLC (mecánicas de streaming en EE.UU.)', cost: 0, detail: 'Gratis. Solo cubre mecánicas digitales dentro de EE.UU. — no cubre sync, ni mecánicas físicas (CD/vinil, todavía vía Harry Fox), ni cobro internacional' },
  { value: 'isrc', provider: 'USISRC.org', label: 'Prefijo ISRC propio', cost: 95, detail: 'Único, de por vida, hasta 100,000 códigos/año. El distribuidor también los emite gratis, pero quedan ligados a su prefijo (menos portable si cambias de distribuidor)' },
  { value: 'publishing_admin', provider: 'TuneCore Publishing', label: 'Publishing Administration — TuneCore', cost: 75, detail: '$75 por compositor + 20% de comisión sobre publishing general — pero 50% de comisión específicamente en licencias de sync (desde 2023)' },
  { value: 'publishing_admin', provider: 'Songtrust', label: 'Publishing Administration — Songtrust', cost: 100, detail: '$100 único por compositor + 15% performance / 20% mecánicas' },
  { value: 'tax_form', provider: 'IRS — W-8BEN', label: 'Formulario de retención fiscal (no residentes de EE.UU.)', cost: 0, detail: 'Obligatorio para artistas fuera de EE.UU. que cobran regalías de PROs/MLC/distribuidoras de EE.UU. Sin este formulario aplica 30% de retención automática. Reduce la retención si hay tratado fiscal (ej. España). Expira a los 3 años, hay que renovarlo' },
  { value: 'spotify_verified', provider: 'Spotify for Artists', label: 'Verificación de artista', cost: 0, detail: 'Gratis' },
  { value: 'apple_verified', provider: 'Apple Music for Artists', label: 'Verificación de artista', cost: 0, detail: 'Gratis' },
];

const SPAIN_CATALOG: CatalogEntry[] = [
  { value: 'pro_affiliation', provider: 'SGAE', label: 'Afiliación a SGAE', cost: 15, detail: 'Pago único de alta online, sin cuota anual — confirmado en sgae.es/autores-editores/alta-online y fuentes independientes (ago 2026)' },
  { value: 'pro_affiliation', provider: 'SEDA / Unison', label: 'Alternativa a SGAE', cost: 0, detail: 'Gestoras alternativas autorizadas tras la liberalización del mercado de gestión colectiva en España — verificar condiciones antes de ofrecerlas' },
  { value: 'copyright', provider: 'Registro de la Propiedad Intelectual', label: 'Registro de Propiedad Intelectual', cost: 25, detail: 'Rango €8-25 según comunidad autónoma (cada una fija su propia tarifa) — NO obligatorio para tener derechos, la protección es automática al crear la obra (Convenio de Berna); solo sirve como prueba de fecha/autoría' },
  { value: 'the_mlc', provider: 'AGEDI', label: 'Derechos de productor/máster — AGEDI', cost: 0, detail: 'Cuota de afiliación NO CONFIRMADA — contactar agedi-aie.es directamente antes de publicar un precio' },
  { value: 'soundexchange', provider: 'AIE', label: 'Derechos de artista intérprete — AIE', cost: 0, detail: 'Cuota de afiliación NO CONFIRMADA — contactar agedi-aie.es directamente antes de publicar un precio' },
  { value: 'publishing_admin', provider: 'TuneCore Publishing', label: 'Publishing Administration — TuneCore', cost: 75, detail: '$75 por compositor + 20% de comisión sobre publishing general — 50% de comisión específicamente en sync' },
  { value: 'publishing_admin', provider: 'Songtrust', label: 'Publishing Administration — Songtrust', cost: 100, detail: '$100 único por compositor + 15% performance / 20% mecánicas' },
  { value: 'spotify_verified', provider: 'Spotify for Artists', label: 'Verificación de artista', cost: 0, detail: 'Gratis' },
  { value: 'apple_verified', provider: 'Apple Music for Artists', label: 'Verificación de artista', cost: 0, detail: 'Gratis' },
];

const SPAIN_COUNTRY_NAMES = ['españa', 'spain', 'es'];

export function getRegistrationCatalog(country?: string | null): CatalogEntry[] {
  if (country && SPAIN_COUNTRY_NAMES.includes(country.trim().toLowerCase())) return SPAIN_CATALOG;
  return US_PR_CATALOG;
}

export function catalogKey(entry: { value: string; provider: string }): string {
  return `${entry.value}::${entry.provider}`;
}

export const REGISTRATION_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  [...US_PR_CATALOG, ...SPAIN_CATALOG].map((t) => [t.value, t.label.replace(/ — .*/, '')])
);

export function formatCost(costCents: number | null | undefined, currency: string = 'usd'): string {
  if (costCents === null || costCents === undefined) return 'Sin costo definido';
  if (costCents === 0) return 'Sin costo';
  return new Intl.NumberFormat('es', { style: 'currency', currency: currency.toUpperCase() }).format(costCents / 100);
}

// Referencia informativa del distribuidor (no es lo que tú cobras).
export const DISTRIBUTION_REFERENCE = {
  provider: 'TuneCore',
  plans: [
    { label: 'Single (pago por lanzamiento)', cost: '$24.99/año' },
    { label: 'Álbum/EP (pago por lanzamiento)', cost: '$44.99 primer año, $56.49 renovación' },
    { label: 'Plan ilimitado — Rising Artist', cost: '$24.99/año' },
    { label: 'Plan ilimitado — Breakout Artist', cost: '$44.99/año' },
    { label: 'Plan ilimitado — Professional', cost: '$54.99/año' },
  ],
  coverArtSpec: 'JPG/PNG cuadrado, entre 1600x1600 y 3000x3000px, menos de 10MB, en RGB',
  audioSpec: 'WAV o FLAC — mínimo 44.1kHz/16-bit, se recomienda 24-bit/192kHz',
  leadTime: 'Enviar assets al menos 10 días hábiles antes de la fecha de lanzamiento deseada',
};

export const OUR_DISTRIBUTION_FEE = {
  amount: 10,
  currency: 'eur',
  detail: 'Tarifa fija por gestionar el envío y entregar tu reporte de resultados — el costo del distribuidor (TuneCore) se factura aparte',
};

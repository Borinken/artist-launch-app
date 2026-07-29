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
  { value: 'pro_affiliation', provider: 'ASCAP', label: 'Afiliación a PRO — ASCAP', cost: 0, detail: 'Gratis para compositores, sin cuota anual' },
  { value: 'pro_affiliation', provider: 'BMI', label: 'Afiliación a PRO — BMI', cost: 0, detail: 'Gratis para compositores, sin cuota anual' },
  { value: 'copyright', provider: 'Copyright.gov (US Copyright Office)', label: 'Registro de copyright', cost: 65, detail: 'Tarifa oficial de solicitud estándar electrónica por obra' },
  { value: 'soundexchange', provider: 'SoundExchange', label: 'Registro de SoundExchange', cost: 0, detail: 'Gratis' },
  { value: 'the_mlc', provider: 'The MLC', label: 'The MLC (mechanical royalties)', cost: 0, detail: 'Gratis' },
  { value: 'publishing_admin', provider: 'TuneCore Publishing', label: 'Publishing Administration — TuneCore', cost: 75, detail: '$75 por compositor + 20% de comisión sobre lo cobrado' },
  { value: 'publishing_admin', provider: 'Songtrust', label: 'Publishing Administration — Songtrust', cost: 100, detail: '$100 único por compositor + 15% performance / 20% mecánicas' },
  { value: 'spotify_verified', provider: 'Spotify for Artists', label: 'Verificación de artista', cost: 0, detail: 'Gratis' },
  { value: 'apple_verified', provider: 'Apple Music for Artists', label: 'Verificación de artista', cost: 0, detail: 'Gratis' },
];

const SPAIN_CATALOG: CatalogEntry[] = [
  { value: 'pro_affiliation', provider: 'SGAE', label: 'Afiliación a SGAE', cost: 0, detail: 'Cuota de inscripción — verifica tarifa vigente con SGAE' },
  { value: 'copyright', provider: 'Registro de la Propiedad Intelectual', label: 'Registro de Propiedad Intelectual', cost: 25, detail: 'Estimado — varía por comunidad autónoma' },
  { value: 'the_mlc', provider: 'AGEDI', label: 'Derechos de productor — AGEDI', cost: 0, detail: 'Estimado — verifica tarifa vigente' },
  { value: 'soundexchange', provider: 'AIE', label: 'Derechos de artista intérprete — AIE', cost: 0, detail: 'Estimado — verifica tarifa vigente' },
  { value: 'publishing_admin', provider: 'TuneCore Publishing', label: 'Publishing Administration — TuneCore', cost: 75, detail: '$75 por compositor + 20% de comisión sobre lo cobrado' },
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

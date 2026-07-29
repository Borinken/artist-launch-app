export const ROYALTY_SOURCES: { value: string; label: string; color: string }[] = [
  { value: 'composition_pro', label: 'Composición (PRO/mecánicos)', color: '#d4af37' },
  { value: 'master_distribution', label: 'Máster (distribución)', color: '#e8c766' },
  { value: 'youtube_content_id', label: 'YouTube Content ID', color: '#f87171' },
  { value: 'shows', label: 'Shows/conciertos', color: '#34d399' },
  { value: 'merch', label: 'Merch', color: '#818cf8' },
  { value: 'sync', label: 'Sync/licencias', color: '#c084fc' },
];

export const ROYALTY_SOURCE_LABELS: Record<string, string> = Object.fromEntries(
  ROYALTY_SOURCES.map((s) => [s.value, s.label])
);

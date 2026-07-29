export const TRACK_STATUSES: { value: string; label: string }[] = [
  { value: 'unreleased', label: 'Inédito' },
  { value: 'recorded', label: 'Grabado' },
  { value: 'mixed', label: 'Mezclado' },
  { value: 'mastered', label: 'Masterizado' },
  { value: 'published', label: 'Publicado' },
];

export const TRACK_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  TRACK_STATUSES.map((s) => [s.value, s.label])
);

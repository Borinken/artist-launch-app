// Cuando no hay nada todavía: decir qué pasa y qué hacer, nunca una pantalla vacía.
export default function EmptyState({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {text}
      {href && cta && (
        <div style={{ marginTop: 14 }}>
          <a href={href} className="btn btn-primary">{cta}</a>
        </div>
      )}
    </div>
  );
}

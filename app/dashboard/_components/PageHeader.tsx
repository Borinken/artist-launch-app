// Encabezado de cada pantalla: qué es esto, dicho en palabras simples,
// y (opcional) una nota "qué tienes que hacer aquí".
export default function PageHeader({
  title,
  subtitle,
  tip,
  action,
}: {
  title: string;
  subtitle: string;
  tip?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px' }}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {tip && (
        <div className="tip">
          <span aria-hidden="true" style={{ fontSize: 18 }}>💡</span>
          <div>{tip}</div>
        </div>
      )}
    </header>
  );
}

import './globals.css';

export const metadata = {
  title: 'Artist Launch OS',
  description: 'El sistema operativo para lanzar y administrar tu carrera musical.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

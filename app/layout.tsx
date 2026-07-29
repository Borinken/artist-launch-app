export const metadata = {
  title: 'Artist Launch OS',
  description: 'Backend de gestión de artistas: base de datos, APIs y dashboard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

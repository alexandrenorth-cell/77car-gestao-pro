import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: '77 Car Service | Sistema de Gestão',
  description: 'CRM, Ordens de Serviço, Estoque e Templates - Padrão Concessionária',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="dark">
      <body className="font-inter antialiased bg-racing-darker text-white">{children}</body>
    </html>
  )
}
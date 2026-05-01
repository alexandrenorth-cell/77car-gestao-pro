'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import CRM from '@/components/CRM'
import OrdensServico from '@/components/OrdensServico'
import Estoque from '@/components/Estoque'
import Templates from '@/components/Templates'
import Config from '@/components/Config'
import RegistroServico from '@/components/RegistroServico'
import AprovacoesLista from '@/components/AprovacoesLista'

type Page = 'dashboard' | 'crm' | 'os' | 'estoque' | 'templates' | 'config' | 'registro' | 'aprovacoes'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />
      case 'crm': return <CRM />
      case 'os': return <OrdensServico />
      case 'estoque': return <Estoque />
      case 'templates': return <Templates />
      case 'config': return <Config />
      case 'registro': return <RegistroServico />
      case 'aprovacoes': return <AprovacoesLista />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
          <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2 hover:bg-slate-800 rounded-lg transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center font-black text-sm italic">77</div>
            <span className="font-black text-sm uppercase italic">Car Service</span>
          </div>
          <div className="w-6" />
        </div>
        {renderPage()}
      </main>
    </div>
  )
}

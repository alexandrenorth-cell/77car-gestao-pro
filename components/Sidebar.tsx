'use client'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Wrench, Package, FileText, Settings, X, Zap, Camera, ThumbsUp } from 'lucide-react'

type Page = 'dashboard' | 'crm' | 'os' | 'estoque' | 'templates' | 'config' | 'registro' | 'aprovacoes'

interface SidebarProps { currentPage: Page; onNavigate: (page: Page) => void; mobileOpen: boolean; onMobileClose: () => void }

const menuItems: { id: Page; label: string; icon: any; badge?: string; badgeClass?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM / Clientes', icon: Users, badge: 'NOVO' },
  { id: 'os', label: 'Ordens de Serviço', icon: Wrench },
  { id: 'registro', label: '📸 Registrar Serviço', icon: Camera, badge: 'FOTO/VIDEO', badgeClass: 'from-green-500 to-emerald-500' },
  { id: 'aprovacoes', label: '✅ Aprovações', icon: ThumbsUp, badge: 'NOVO', badgeClass: 'from-green-500 to-emerald-500' },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'config', label: 'Configurações', icon: Settings },
]

export default function Sidebar({ currentPage, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  const sidebarContent = (
    <>
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl flex items-center justify-center font-black text-lg italic shadow-lg shadow-blue-600/30">77</div>
          <div className="flex flex-col">
            <span className="font-black text-sm uppercase italic tracking-tighter leading-none">Car Service</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-blue-400 font-bold">Gestão Pro</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button key={item.id} onClick={() => { onNavigate(item.id); onMobileClose() }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && <span className={`text-[9px] font-black bg-gradient-to-r ${item.badgeClass || 'from-amber-500 to-orange-500'} text-black px-2 py-0.5 rounded-full uppercase tracking-wider`}>{item.badge}</span>}
              {isActive && <motion.div layoutId="activeIndicator" className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Zap className="w-4 h-4 text-amber-500" /><span className="font-bold uppercase tracking-wider">77 Pro v1.2</span></div>
          <div className="text-[10px] text-slate-600">© 2026 77 Car Service</div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800 h-screen sticky top-0">{sidebarContent}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="absolute top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-800 flex flex-col">
            <button onClick={onMobileClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"><X className="w-5 h-5" /></button>
            {sidebarContent}
          </motion.aside>
        </div>
      )}
    </>
  )
}

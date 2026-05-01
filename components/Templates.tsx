'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, Printer, Plus, FileCheck, FileDigit, FileBarChart } from 'lucide-react'

interface Template { id: string; nome: string; descricao: string; categoria: string; icon: any; cor: string }

const templates: Template[] = [
  { id: '1', nome: 'Ordem de Serviço', descricao: 'Template completo de O.S. com check-list técnico', categoria: 'Operacional', icon: FileCheck, cor: 'text-blue-400 bg-blue-600/10' },
  { id: '2', nome: 'Check-list de Revisão', descricao: 'Checklist digital de revisão preventiva por km', categoria: 'Operacional', icon: FileDigit, cor: 'text-green-400 bg-green-600/10' },
  { id: '3', nome: 'Orçamento Rápido', descricao: 'Template de orçamento para envio ao cliente', categoria: 'Comercial', icon: FileBarChart, cor: 'text-amber-400 bg-amber-600/10' },
  { id: '4', nome: 'Relatório Diagnóstico', descricao: 'Laudo técnico com fotos e scanner', categoria: 'Técnico', icon: FileText, cor: 'text-purple-400 bg-purple-600/10' },
  { id: '5', nome: 'Ficha de Avaliação', descricao: 'Avaliação cautelar para compra/venda', categoria: 'Técnico', icon: FileCheck, cor: 'text-red-400 bg-red-600/10' },
  { id: '6', nome: 'Recibo de Pagamento', descricao: 'Comprovante de pagamento para cliente', categoria: 'Financeiro', icon: FileDigit, cor: 'text-teal-400 bg-teal-600/10' },
  { id: '7', nome: 'Controle de Garantia', descricao: 'Termo de garantia de serviço (30/60/90 dias)', categoria: 'Jurídico', icon: FileText, cor: 'text-cyan-400 bg-cyan-600/10' },
  { id: '8', nome: 'Relatório Mensal', descricao: 'Resumo financeiro e operacional do mês', categoria: 'Financeiro', icon: FileBarChart, cor: 'text-indigo-400 bg-indigo-600/10' },
]

export default function Templates() {
  const [categoriaFilter, setCategoriaFilter] = useState('todas')
  const categorias = ['todas', ...Array.from(new Set(templates.map(t => t.categoria)))]
  const filtered = categoriaFilter === 'todas' ? templates : templates.filter(t => t.categoria === categoriaFilter)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter"><span className="text-blue-500">Templates</span> & Documentos</h1><p className="text-slate-500 text-sm mt-1">Modelos prontos para imprimir ou enviar ao cliente</p></div>
        <button className="btn-primary flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Criar Template</button>
      </motion.div>

      <div className="flex gap-2 flex-wrap">{categorias.map(cat => <button key={cat} onClick={() => setCategoriaFilter(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${categoriaFilter === cat ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'}`}>{cat}</button>)}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t, i) => {
          const Icon = t.icon
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-77 group cursor-pointer">
              <div className="flex items-start justify-between mb-4"><div className={`p-3 rounded-xl ${t.cor}`}><Icon className="w-6 h-6" /></div><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-2 hover:bg-slate-700 rounded-lg transition"><Eye className="w-4 h-4" /></button><button className="p-2 hover:bg-slate-700 rounded-lg transition"><Download className="w-4 h-4" /></button></div></div>
              <h3 className="font-bold text-lg mb-1">{t.nome}</h3>
              <p className="text-slate-400 text-sm mb-4">{t.descricao}</p>
              <div className="flex items-center justify-between"><span className="badge-blue">{t.categoria}</span><button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition"><Printer className="w-3 h-3" /> Usar</button></div>
            </motion.div>
          )
        })}
      </div>

      <div className="card-77">
        <h2 className="font-black text-lg uppercase italic mb-4">Templates Mais Usados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-blue-500/30 transition"><div className="p-2 bg-blue-600/10 rounded-lg"><FileCheck className="w-5 h-5 text-blue-400" /></div><div><p className="font-bold text-sm">Ordem de Serviço</p><p className="text-[10px] text-slate-500">Usada 38x este mês</p></div></div>
          <div className="glass rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-green-500/30 transition"><div className="p-2 bg-green-600/10 rounded-lg"><FileDigit className="w-5 h-5 text-green-400" /></div><div><p className="font-bold text-sm">Check-list Revisão</p><p className="text-[10px] text-slate-500">Usada 42x este mês</p></div></div>
          <div className="glass rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-amber-500/30 transition"><div className="p-2 bg-amber-600/10 rounded-lg"><FileBarChart className="w-5 h-5 text-amber-400" /></div><div><p className="font-bold text-sm">Orçamento Rápido</p><p className="text-[10px] text-slate-500">Usada 27x este mês</p></div></div>
        </div>
      </div>
    </div>
  )
}
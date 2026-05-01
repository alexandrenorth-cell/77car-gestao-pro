'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Download, Wrench, Clock, CheckCircle, XCircle, Printer, Camera } from 'lucide-react'

interface OS { id: string; cliente: string; veiculo: string; placa: string; servico: string; status: 'em_andamento' | 'concluido' | 'aguardando' | 'cancelado'; valor: string; entrada: string; prazo: string; tecnico: string }

const statusConfig = {
  em_andamento: { label: 'Em Andamento', icon: Wrench, className: 'badge-blue' },
  concluido: { label: 'Concluído', icon: CheckCircle, className: 'badge-green' },
  aguardando: { label: 'Aguardando Peça', icon: Clock, className: 'badge-yellow' },
  cancelado: { label: 'Cancelado', icon: XCircle, className: 'badge-red' },
}

const osMock: OS[] = [
  { id: '#077', cliente: 'Carlos Eduardo Silva', veiculo: 'BMW X1 2022', placa: 'ABC-1234', servico: 'Revisão 40.000km completa', status: 'em_andamento', valor: 'R$ 2.350', entrada: '29/04/2026', prazo: '02/05/2026', tecnico: 'Anderson Alves' },
  { id: '#076', cliente: 'Ana Paula Costa', veiculo: 'VW T-Cross 2023', placa: 'DEF-5678', servico: 'Troca de pastilhas dianteiras', status: 'concluido', valor: 'R$ 890', entrada: '28/04/2026', prazo: '28/04/2026', tecnico: 'Anderson Alves' },
  { id: '#075', cliente: 'Roberto Lima', veiculo: 'Jeep Compass 2021', placa: 'GHI-9012', servico: 'Diagnóstico elétrico completo', status: 'aguardando', valor: 'R$ 1.670', entrada: '27/04/2026', prazo: '03/05/2026', tecnico: 'Anderson Alves' },
  { id: '#074', cliente: 'Fernanda Souza', veiculo: 'Honda Civic 2020', placa: 'JKL-3456', servico: 'Alinhamento + Balanceamento', status: 'concluido', valor: 'R$ 320', entrada: '26/04/2026', prazo: '26/04/2026', tecnico: 'Anderson Alves' },
  { id: '#073', cliente: 'Marcos Vinicius', veiculo: 'Toyota Corolla 2024', placa: 'MNO-7890', servico: 'Troca de óleo e filtros', status: 'concluido', valor: 'R$ 450', entrada: '25/04/2026', prazo: '25/04/2026', tecnico: 'Anderson Alves' },
]

function navegarParaRegistro() {
  window.dispatchEvent(new CustomEvent('navigate', { detail: 'registro' }))
}

export default function OrdensServico() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  const filtered = osMock.filter(os => {
    const matchSearch = os.cliente.toLowerCase().includes(search.toLowerCase()) || os.id.toLowerCase().includes(search.toLowerCase()) || os.placa.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || os.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">Ordens de <span className="text-blue-500">Serviço</span></h1><p className="text-slate-500 text-sm mt-1">Gerencie todas as O.S. da oficina</p></div>
        <div className="flex gap-2"><button className="btn-primary flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Nova O.S.</button><button className="bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"><Download className="w-4 h-4" /> Exportar</button></div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" placeholder="Buscar por cliente, O.S. ou placa..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-77 pl-11" /></div>
        <div className="flex gap-2">
          {['todos', 'em_andamento', 'aguardando', 'concluido'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === s ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'}`}>{s === 'todos' ? 'Todos' : statusConfig[s as keyof typeof statusConfig]?.label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((os, i) => {
          const status = statusConfig[os.status]
          const StatusIcon = status.icon
          return (
            <motion.div key={os.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-77 hover:border-blue-600/30 cursor-pointer group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${os.status === 'em_andamento' ? 'bg-blue-600/10' : os.status === 'concluido' ? 'bg-green-600/10' : os.status === 'aguardando' ? 'bg-amber-600/10' : 'bg-red-600/10'}`}><StatusIcon className={`w-5 h-5 ${os.status === 'em_andamento' ? 'text-blue-400' : os.status === 'concluido' ? 'text-green-400' : os.status === 'aguardando' ? 'text-amber-400' : 'text-red-400'}`} /></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1"><span className="font-mono text-blue-400 font-bold text-sm">{os.id}</span><span className={status.className}>{status.label}</span></div>
                    <p className="font-bold text-lg">{os.cliente}</p>
                    <p className="text-slate-400 text-sm">{os.veiculo} • Placa: {os.placa}</p>
                    <p className="text-slate-500 text-sm mt-1">{os.servico}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
                  <div className="text-sm"><p className="text-slate-500">Técnico</p><p className="font-bold">{os.tecnico}</p></div>
                  <div className="text-sm"><p className="text-slate-500">Entrada</p><p className="font-bold">{os.entrada}</p></div>
                  <div className="text-sm"><p className="text-slate-500">Prazo</p><p className="font-bold text-amber-400">{os.prazo}</p></div>
                  <div className="text-right"><p className="text-2xl font-black text-green-400">{os.valor}</p></div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); navegarParaRegistro() }}
                      className="p-2.5 bg-blue-600/10 hover:bg-blue-600/30 rounded-xl transition border border-blue-500/20 hover:border-blue-500/50 group-hover:scale-110"
                      title="📸 Registrar Serviço (Foto/Vídeo + WhatsApp)"
                    >
                      <Camera className="w-4 h-4 text-blue-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition opacity-0 group-hover:opacity-100"><Printer className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-77 text-center"><p className="text-3xl font-black text-blue-400">{osMock.length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total de O.S.</p></div>
        <div className="card-77 text-center"><p className="text-3xl font-black text-green-400">{osMock.filter(o => o.status === 'concluido').length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Concluídas</p></div>
        <div className="card-77 text-center"><p className="text-3xl font-black text-amber-400">{osMock.filter(o => o.status === 'em_andamento' || o.status === 'aguardando').length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Em Aberto</p></div>
        <div className="card-77 text-center"><p className="text-3xl font-black text-white">R$ 5.680</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Faturamento Mês</p></div>
      </div>
    </div>
  )
}

'use client'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Wrench, DollarSign, Package, ChevronUp, ChevronDown, Clock, AlertTriangle } from 'lucide-react'

const stats = [
  { label: 'Faturamento Mensal', value: 'R$ 47.850', change: '+12%', up: true, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-600/10' },
  { label: 'Ordens de Serviço', value: '38', change: '+8%', up: true, icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-600/10' },
  { label: 'Clientes Ativos', value: '156', change: '+24%', up: true, icon: Users, color: 'text-purple-400', bg: 'bg-purple-600/10' },
  { label: 'Peças em Estoque', value: '1.247', change: '-3%', up: false, icon: Package, color: 'text-amber-400', bg: 'bg-amber-600/10' },
]

const recentOS = [
  { id: '#077', cliente: 'Carlos Eduardo', veiculo: 'BMW X1 2022', servico: 'Revisão 40.000km', status: 'Em andamento', valor: 'R$ 2.350' },
  { id: '#076', cliente: 'Ana Paula', veiculo: 'VW T-Cross 2023', servico: 'Troca de pastilhas', status: 'Concluído', valor: 'R$ 890' },
  { id: '#075', cliente: 'Roberto Lima', veiculo: 'Jeep Compass 2021', servico: 'Diagnóstico elétrico', status: 'Aguardando peça', valor: 'R$ 1.670' },
  { id: '#074', cliente: 'Fernanda Souza', veiculo: 'Honda Civic 2020', servico: 'Alinhamento 3D', status: 'Concluído', valor: 'R$ 320' },
]

const statusColors: Record<string, string> = {
  'Em andamento': 'badge-blue', 'Concluído': 'badge-green', 'Aguardando peça': 'badge-yellow', 'Cancelado': 'badge-red',
}

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">Dashboard <span className="text-blue-500">77</span></h1>
          <p className="text-slate-500 text-sm mt-1">Visão geral da sua operação em tempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs text-slate-400"><Clock className="w-4 h-4" />Atualizado há 5 minutos</span>
          <button className="btn-primary text-xs px-4 py-2 rounded-lg">Nova O.S.</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-77 group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-xl`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-green-400' : 'text-red-400'}`}>{stat.up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{stat.change}</div>
              </div>
              <p className="text-2xl font-black tracking-tight mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 card-77">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-lg uppercase italic">Ordens Recentes</h2>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">Ver todas →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b border-slate-800"><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">O.S.</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cliente</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Veículo</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Serviço</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Valor</th></tr></thead>
              <tbody>
                {recentOS.map((os) => (
                  <tr key={os.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                    <td className="py-3 font-mono text-blue-400 text-xs font-bold">{os.id}</td>
                    <td className="py-3 font-medium">{os.cliente}</td>
                    <td className="py-3 text-slate-400 hidden md:table-cell">{os.veiculo}</td>
                    <td className="py-3 text-slate-400 hidden md:table-cell">{os.servico}</td>
                    <td className="py-3"><span className={statusColors[os.status]}>{os.status}</span></td>
                    <td className="py-3 text-right font-bold">{os.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-77 space-y-4">
          <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /><h2 className="font-black text-lg uppercase italic">Alertas</h2></div>
          <div className="space-y-3">
            <div className="bg-amber-600/10 border border-amber-600/20 rounded-xl p-4"><p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Estoque Baixo</p><p className="text-sm text-slate-300">Filtro de óleo BMW N20 — apenas 2 unidades</p></div>
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4"><p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">OS Aguardando</p><p className="text-sm text-slate-300">3 veículos aguardando peças para conclusão</p></div>
            <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-4"><p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Meta Batida!</p><p className="text-sm text-slate-300">Faturamento semanal acima da meta em 15%</p></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Phone, Mail, Car, MapPin, Star, Users } from 'lucide-react'

interface Cliente { id: string; nome: string; telefone: string; email: string; veiculo: string; placa: string; ultimaVisita: string; totalGasto: string; rating: number }

const clientesMock: Cliente[] = [
  { id: '1', nome: 'Carlos Eduardo Silva', telefone: '(31) 99999-0001', email: 'carlos@email.com', veiculo: 'BMW X1 2022', placa: 'ABC-1234', ultimaVisita: '28/04/2026', totalGasto: 'R$ 8.450', rating: 5 },
  { id: '2', nome: 'Ana Paula Costa', telefone: '(31) 99999-0002', email: 'ana@email.com', veiculo: 'VW T-Cross 2023', placa: 'DEF-5678', ultimaVisita: '25/04/2026', totalGasto: 'R$ 3.200', rating: 5 },
  { id: '3', nome: 'Roberto Lima', telefone: '(31) 99999-0003', email: 'roberto@email.com', veiculo: 'Jeep Compass 2021', placa: 'GHI-9012', ultimaVisita: '20/04/2026', totalGasto: 'R$ 5.780', rating: 4 },
  { id: '4', nome: 'Fernanda Souza', telefone: '(31) 99999-0004', email: 'fernanda@email.com', veiculo: 'Honda Civic 2020', placa: 'JKL-3456', ultimaVisita: '15/04/2026', totalGasto: 'R$ 2.100', rating: 5 },
  { id: '5', nome: 'Marcos Vinicius', telefone: '(31) 99999-0005', email: 'marcos@email.com', veiculo: 'Toyota Corolla 2024', placa: 'MNO-7890', ultimaVisita: '10/04/2026', totalGasto: 'R$ 1.890', rating: 4 },
  { id: '6', nome: 'Juliana Martins', telefone: '(31) 99999-0006', email: 'juliana@email.com', veiculo: 'BMW 320i 2023', placa: 'PQR-1234', ultimaVisita: '05/04/2026', totalGasto: 'R$ 12.300', rating: 5 },
]

export default function CRM() {
  const [search, setSearch] = useState('')
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  const filtered = clientesMock.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.veiculo.toLowerCase().includes(search.toLowerCase()) || c.placa.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">CRM <span className="text-blue-500">Clientes</span></h1><p className="text-slate-500 text-sm mt-1">Gerencie sua base de clientes e histórico</p></div>
        <button className="btn-primary flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Novo Cliente</button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-77">
          <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" placeholder="Buscar por nome, veículo ou placa..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-77 pl-11" /></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b border-slate-800"><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cliente</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Veículo</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden lg:table-cell">Última Visita</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Total Gasto</th></tr></thead>
              <tbody>
                {filtered.map((cliente, i) => (
                  <motion.tr key={cliente.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedCliente(cliente)} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer ${selectedCliente?.id === cliente.id ? 'bg-blue-600/10 border-blue-500/30' : ''}`}>
                    <td className="py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center font-black text-sm">{cliente.nome.charAt(0)}</div><div><p className="font-bold">{cliente.nome}</p><p className="text-xs text-slate-500">{cliente.telefone}</p></div></div></td>
                    <td className="py-4 hidden md:table-cell"><div className="flex items-center gap-2"><Car className="w-4 h-4 text-slate-500" /><span className="text-slate-300">{cliente.veiculo}</span></div><p className="text-xs text-slate-500 mt-0.5">Placa: {cliente.placa}</p></td>
                    <td className="py-4 hidden lg:table-cell text-slate-400">{cliente.ultimaVisita}</td>
                    <td className="py-4 text-right"><p className="font-bold text-green-400">{cliente.totalGasto}</p><div className="flex gap-0.5 justify-end mt-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < cliente.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />)}</div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-bold uppercase tracking-wider text-sm">Nenhum cliente encontrado</p></div>}
        </div>

        <div className="card-77">
          {selectedCliente ? (
            <motion.div key={selectedCliente.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center font-black text-3xl mx-auto mb-3">{selectedCliente.nome.charAt(0)}</div><h3 className="font-black text-lg">{selectedCliente.nome}</h3><div className="flex justify-center gap-1 mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < selectedCliente.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />)}</div></div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-slate-500" /><span className="text-slate-300">{selectedCliente.telefone}</span></div>
                <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-slate-500" /><span className="text-slate-300">{selectedCliente.email}</span></div>
                <div className="flex items-center gap-3 text-sm"><Car className="w-4 h-4 text-slate-500" /><span className="text-slate-300">{selectedCliente.veiculo}</span></div>
                <div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-slate-500" /><span className="text-slate-300">Placa: {selectedCliente.placa}</span></div>
              </div>
              <div className="glass rounded-xl p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Gasto</p><p className="text-2xl font-black text-green-400">{selectedCliente.totalGasto}</p></div>
              <div className="flex gap-2"><button className="btn-wpp flex-1 flex items-center justify-center gap-2 text-xs py-2 rounded-lg"><Phone className="w-3 h-3" /> WhatsApp</button><button className="btn-primary flex-1 text-xs py-2 rounded-lg">Nova O.S.</button></div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-slate-500"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-bold uppercase tracking-wider text-sm">Selecione um cliente</p><p className="text-xs mt-1">para ver os detalhes</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
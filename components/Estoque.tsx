'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Package, AlertTriangle, TrendingDown, TrendingUp, Download } from 'lucide-react'

interface Peca { id: string; nome: string; codigo: string; categoria: string; quantidade: number; minimo: number; valorUnitario: string; valorTotal: string; fornecedor: string; ultimaCompra: string }

const pecasMock: Peca[] = [
  { id: '1', nome: 'Filtro de Óleo BMW N20', codigo: '11427557012', categoria: 'Filtros', quantidade: 2, minimo: 5, valorUnitario: 'R$ 89,90', valorTotal: 'R$ 179,80', fornecedor: 'Auto Peças Premium', ultimaCompra: '15/04/2026' },
  { id: '2', nome: 'Pastilha de Freio Dianteira VW', codigo: '5Q0698151B', categoria: 'Freios', quantidade: 8, minimo: 4, valorUnitario: 'R$ 245,00', valorTotal: 'R$ 1.960,00', fornecedor: 'VW Peças Originais', ultimaCompra: '20/04/2026' },
  { id: '3', nome: 'Óleo Sintético 5W30 (1L)', codigo: 'MOT-5W30-1L', categoria: 'Lubrificantes', quantidade: 24, minimo: 10, valorUnitario: 'R$ 52,00', valorTotal: 'R$ 1.248,00', fornecedor: 'Distribuidora Lubrax', ultimaCompra: '28/04/2026' },
  { id: '4', nome: 'Filtro de Ar Jeep Compass', codigo: '68233730AA', categoria: 'Filtros', quantidade: 3, minimo: 4, valorUnitario: 'R$ 78,50', valorTotal: 'R$ 235,50', fornecedor: 'Auto Peças Premium', ultimaCompra: '10/04/2026' },
  { id: '5', nome: 'Bateria 60Ah Moura', codigo: 'M60GD', categoria: 'Elétrica', quantidade: 4, minimo: 3, valorUnitario: 'R$ 389,00', valorTotal: 'R$ 1.556,00', fornecedor: 'Moura Baterias', ultimaCompra: '05/04/2026' },
  { id: '6', nome: 'Disco de Freio BMW X1', codigo: '34116785673', categoria: 'Freios', quantidade: 0, minimo: 2, valorUnitario: 'R$ 420,00', valorTotal: 'R$ 0,00', fornecedor: 'BMW Parts', ultimaCompra: '01/03/2026' },
  { id: '7', nome: 'Kit Amortecedor Dianteiro Civic', codigo: '51621-TBA-A01', categoria: 'Suspensão', quantidade: 2, minimo: 2, valorUnitario: 'R$ 890,00', valorTotal: 'R$ 1.780,00', fornecedor: 'Honda Genuine', ultimaCompra: '18/04/2026' },
]

export default function Estoque() {
  const [search, setSearch] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('todas')
  const categorias = ['todas', ...Array.from(new Set(pecasMock.map(p => p.categoria)))]

  const filtered = pecasMock.filter(p => { const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase()); const matchCat = categoriaFilter === 'todas' || p.categoria === categoriaFilter; return matchSearch && matchCat })
  const baixoEstoque = pecasMock.filter(p => p.quantidade <= p.minimo && p.quantidade > 0)
  const semEstoque = pecasMock.filter(p => p.quantidade === 0)
  const valorTotalEstoque = pecasMock.reduce((acc, p) => acc + (p.quantidade * parseFloat(p.valorUnitario.replace('R$ ', '').replace(',', '.'))), 0)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">Controle de <span className="text-blue-500">Estoque</span></h1><p className="text-slate-500 text-sm mt-1">Gerencie peças, filtros e insumos</p></div>
        <div className="flex gap-2"><button className="btn-primary flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Nova Peça</button><button className="bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"><Download className="w-4 h-4" /> Exportar</button></div>
      </motion.div>

      {(baixoEstoque.length > 0 || semEstoque.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {baixoEstoque.length > 0 && (<div className="bg-amber-600/10 border border-amber-600/20 rounded-2xl p-5 flex items-start gap-4"><div className="p-2.5 bg-amber-600/20 rounded-xl"><TrendingDown className="w-5 h-5 text-amber-400" /></div><div><p className="font-bold text-amber-400 uppercase tracking-wider text-xs">Estoque Baixo</p><p className="text-slate-300 text-sm mt-1">{baixoEstoque.length} itens abaixo do mínimo</p><div className="flex flex-wrap gap-1 mt-2">{baixoEstoque.map(p => <span key={p.id} className="text-[10px] bg-amber-600/20 text-amber-300 px-2 py-0.5 rounded-full">{p.nome}</span>)}</div></div></div>)}
          {semEstoque.length > 0 && (<div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-5 flex items-start gap-4"><div className="p-2.5 bg-red-600/20 rounded-xl"><AlertTriangle className="w-5 h-5 text-red-400" /></div><div><p className="font-bold text-red-400 uppercase tracking-wider text-xs">Sem Estoque!</p><p className="text-slate-300 text-sm mt-1">{semEstoque.length} itens zerados</p><div className="flex flex-wrap gap-1 mt-2">{semEstoque.map(p => <span key={p.id} className="text-[10px] bg-red-600/20 text-red-300 px-2 py-0.5 rounded-full">{p.nome}</span>)}</div></div></div>)}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" placeholder="Buscar por nome ou código..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-77 pl-11" /></div>
        <div className="flex gap-2 flex-wrap">{categorias.map(cat => <button key={cat} onClick={() => setCategoriaFilter(cat)} className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${categoriaFilter === cat ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'}`}>{cat}</button>)}</div>
      </div>

      <div className="card-77 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b border-slate-800"><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Peça</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Código</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Categoria</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Qtd</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right hidden md:table-cell">Valor Un.</th><th className="pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Total</th></tr></thead>
          <tbody>
            {filtered.map((peca, i) => (
              <motion.tr key={peca.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                <td className="py-4"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${peca.quantidade === 0 ? 'bg-red-600/10' : peca.quantidade <= peca.minimo ? 'bg-amber-600/10' : 'bg-blue-600/10'}`}><Package className={`w-4 h-4 ${peca.quantidade === 0 ? 'text-red-400' : peca.quantidade <= peca.minimo ? 'text-amber-400' : 'text-blue-400'}`} /></div><span className="font-bold">{peca.nome}</span></div></td>
                <td className="py-4 font-mono text-xs text-slate-400">{peca.codigo}</td>
                <td className="py-4 hidden md:table-cell"><span className="badge-blue">{peca.categoria}</span></td>
                <td className="py-4 text-center"><span className={`font-black text-lg ${peca.quantidade === 0 ? 'text-red-400' : peca.quantidade <= peca.minimo ? 'text-amber-400' : 'text-green-400'}`}>{peca.quantidade}</span><span className="text-[10px] text-slate-600 block">min: {peca.minimo}</span></td>
                <td className="py-4 text-right hidden md:table-cell text-slate-400">{peca.valorUnitario}</td>
                <td className="py-4 text-right font-bold text-green-400">{peca.valorTotal}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-77 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4"><div className="p-3 bg-green-600/10 rounded-xl"><TrendingUp className="w-6 h-6 text-green-400" /></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Valor Total em Estoque</p><p className="text-3xl font-black text-green-400">R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div></div>
        <div className="flex gap-4 text-center"><div><p className="text-2xl font-black text-blue-400">{pecasMock.length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Itens</p></div><div><p className="text-2xl font-black text-amber-400">{baixoEstoque.length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Alertas</p></div></div>
      </div>
    </div>
  )
}
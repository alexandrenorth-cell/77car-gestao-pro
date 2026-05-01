'use client'
import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Wrench, Eye, ChevronDown, AlertTriangle, CheckCircle2, 
  DollarSign, ExternalLink, BookOpen, ArrowRight, ArrowUpRight, 
  ShoppingCart, Copy, Send, X, MessageCircle, User, Phone, Car,
  CheckSquare, Square, Sparkles
} from 'lucide-react'

// ============================================================
// 📚 BASE DE DADOS DE MANUTENÇÃO PREVENTIVA (7 MARCAS TOP BR)
// Fonte: Manuais de fabricante + dados compilados de mercado
// ============================================================

interface ItemManutencao {
  componente: string
  acao: 'substituir' | 'conferir'
  detalhe?: string
  custoMedio?: number
  prioridade: 'alta' | 'media' | 'baixa'
}

interface DadosKm {
  km: number
  itens: ItemManutencao[]
  estimativaTotal: { min: number; max: number }
  notas?: string[]
}

const DADOS_UNIVERSAIS: Record<number, ItemManutencao[]> = {
  10000: [
    { componente: 'Óleo do motor + Filtro de óleo', acao: 'substituir', detalhe: 'Verificar viscosidade no manual', custoMedio: 250, prioridade: 'alta' },
    { componente: 'Fluido de freio', acao: 'conferir', detalhe: 'Nível e umidade', prioridade: 'media' },
    { componente: 'Fluido de arrefecimento', acao: 'conferir', detalhe: 'Nível e coloração', prioridade: 'media' },
    { componente: 'Pressão e estado dos pneus', acao: 'conferir', detalhe: 'Incluindo estepe', prioridade: 'alta' },
    { componente: 'Sistema de iluminação', acao: 'conferir', detalhe: 'Faróis, lanternas, setas', prioridade: 'media' },
    { componente: 'Bateria', acao: 'conferir', detalhe: 'Terminais e carga', prioridade: 'baixa' },
  ],
  20000: [
    { componente: 'Óleo do motor + Filtro de óleo', acao: 'substituir', custoMedio: 250, prioridade: 'alta' },
    { componente: 'Filtro de ar do motor', acao: 'substituir', custoMedio: 80, prioridade: 'alta' },
    { componente: 'Filtro de combustível', acao: 'substituir', detalhe: 'Se aplicável ao modelo', custoMedio: 120, prioridade: 'media' },
    { componente: 'Filtro de cabine (ar-condicionado)', acao: 'substituir', custoMedio: 60, prioridade: 'media' },
    { componente: 'Pastilhas de freio dianteiras', acao: 'conferir', detalhe: 'Desgaste mínimo: 3mm', prioridade: 'alta' },
    { componente: 'Correias auxiliares', acao: 'conferir', detalhe: 'Trincas e tensão', prioridade: 'media' },
    { componente: 'Sistema de arrefecimento', acao: 'conferir', detalhe: 'Mangueiras e conexões', prioridade: 'baixa' },
  ],
  30000: [
    { componente: 'Óleo do motor + Filtro de óleo', acao: 'substituir', custoMedio: 250, prioridade: 'alta' },
    { componente: 'Fluido de freio', acao: 'substituir', detalhe: 'Troca completa (DOT 3 ou 4)', custoMedio: 150, prioridade: 'alta' },
    { componente: 'Velas de ignição', acao: 'substituir', detalhe: 'Verificar tipo (irídio/platina)', custoMedio: 200, prioridade: 'media' },
    { componente: 'Filtro de ar do motor', acao: 'conferir', prioridade: 'media' },
    { componente: 'Sistema de injeção eletrônica', acao: 'conferir', detalhe: 'Limpeza se necessário', prioridade: 'baixa' },
    { componente: 'Suspensão (amortecedores)', acao: 'conferir', detalhe: 'Vazamentos e folgas', prioridade: 'media' },
    { componente: 'Embreagem', acao: 'conferir', detalhe: 'Curso e patinação', prioridade: 'baixa' },
  ],
  40000: [
    { componente: 'Óleo do motor + Filtro de óleo', acao: 'substituir', custoMedio: 250, prioridade: 'alta' },
    { componente: 'Velas de ignição', acao: 'substituir', detalhe: 'Se não trocadas aos 30k', custoMedio: 200, prioridade: 'alta' },
    { componente: 'Correia de acessórios (poly-V)', acao: 'substituir', detalhe: 'Junto com tensor', custoMedio: 350, prioridade: 'alta' },
    { componente: 'Óleo do diferencial (4x4)', acao: 'substituir', detalhe: 'Se aplicável', custoMedio: 180, prioridade: 'media' },
    { componente: 'Filtro de combustível', acao: 'conferir', detalhe: 'Substituir se não trocado aos 20k', prioridade: 'media' },
    { componente: 'Transmissão (automática)', acao: 'conferir', detalhe: 'Fluido e funcionamento', prioridade: 'media' },
    { componente: 'Amortecedores e terminais', acao: 'conferir', detalhe: 'Desgaste e vazamentos', prioridade: 'media' },
    { componente: 'Sistema de escape', acao: 'conferir', detalhe: 'Corrosão e fixação', prioridade: 'baixa' },
  ],
  50000: [
    { componente: 'Óleo do motor + Filtro de óleo', acao: 'substituir', custoMedio: 250, prioridade: 'alta' },
    { componente: 'Fluido de arrefecimento', acao: 'substituir', detalhe: 'Troca completa do líquido', custoMedio: 200, prioridade: 'alta' },
    { componente: 'Pastilhas de freio (dianteiras)', acao: 'substituir', detalhe: 'Se desgaste > 70%', custoMedio: 350, prioridade: 'alta' },
    { componente: 'Óleo da transmissão', acao: 'substituir', detalhe: 'Manual ou automática', custoMedio: 400, prioridade: 'media' },
    { componente: 'Filtro de ar do motor', acao: 'substituir', custoMedio: 80, prioridade: 'media' },
    { componente: 'Direção hidráulica/elétrica', acao: 'conferir', detalhe: 'Fluido e folgas', prioridade: 'media' },
    { componente: 'Bomba de combustível', acao: 'conferir', detalhe: 'Pressão e ruídos', prioridade: 'baixa' },
  ],
  60000: [
    { componente: 'Óleo do motor + Filtro de óleo', acao: 'substituir', custoMedio: 250, prioridade: 'alta' },
    { componente: 'Correia dentada (ou corrente)', acao: 'substituir', detalhe: '⚠️ CRÍTICO! Junto com tensor e bomba d\'água', custoMedio: 1200, prioridade: 'alta' },
    { componente: 'Todos os fluidos', acao: 'substituir', detalhe: 'Freio, arrefecimento, transmissão, direção', custoMedio: 600, prioridade: 'alta' },
    { componente: 'Velas de ignição', acao: 'substituir', detalhe: 'Se não trocadas ainda', custoMedio: 200, prioridade: 'alta' },
    { componente: 'Filtro de combustível', acao: 'substituir', custoMedio: 120, prioridade: 'media' },
    { componente: 'Filtro de cabine', acao: 'substituir', custoMedio: 60, prioridade: 'media' },
    { componente: 'Revisão geral de eletrônica', acao: 'conferir', detalhe: 'Scanner completo', prioridade: 'media' },
    { componente: 'Coxins e buchas', acao: 'conferir', detalhe: 'Motor, câmbio, suspensão', prioridade: 'baixa' },
  ],
}

const NOTAS_MARCA: Record<string, Record<number, string[]>> = {
  'Volkswagen': {
    40000: ['⚠️ Motores TSI: verificar bomba d\'água — falha comum', 'Corrente de comando: inspecionar esticador'],
    60000: ['⚠️ Câmbio DSG: troca de óleo obrigatória a cada 60.000 km', 'Corrente de comando: avaliar substituição preventiva'],
  },
  'Fiat': {
    40000: ['Motores Fire/EVO: correia dentada a cada 48.000 km ou 4 anos', 'Sistema Multiair: usar óleo especificado API SN Plus'],
    60000: ['⚠️ Correia dentada: substituição obrigatória!', 'Caixa de direção: verificar folgas — desgaste precoce'],
  },
  'Chevrolet': {
    40000: ['Motores Ecotec: velas a cada 40.000 km (irídio)', '⚠️ Onix/Tracker: atenção ao sistema de arrefecimento'],
    60000: ['Correia dentada nos motores 1.0/1.4: troca a cada 60.000 km', 'Câmbio automático GF6: troca de óleo recomendada'],
  },
  'Ford': {
    40000: ['Motores EcoBoost: velas de irídio — verificar gap', '⚠️ Ranger 3.2: óleo do cárter a cada 5.000 km (uso severo)'],
    60000: ['Corrente de comando EcoBoost: inspeção do esticador', 'Transmissão Powershift: TROCA OBRIGATÓRIA do fluido'],
  },
  'Honda': {
    40000: ['⚠️ CVT: troca de óleo a cada 40.000 km (HCF-2)', 'Velas: NGK Iridium específicas — não use paralelas'],
    60000: ['Corrente de comando: inspeção (não requer troca programada)', 'Sistema i-VTEC: verificar solenoide e filtro de tela'],
  },
  'Hyundai': {
    40000: ['Motores Gamma/Nu: velas de irídio a cada 40.000 km', '⚠️ HB20/Creta: atenção ao sistema de direção elétrica'],
    60000: ['Corrente de comando: geralmente vitalícia, mas inspecionar', 'Fluido de transmissão automática: troca recomendada'],
  },
  'Nissan': {
    40000: ['⚠️ CVT Xtronic: troca de óleo a cada 40.000 km (NS-3)', 'Motores MR: velas de irídio a cada 40-50.000 km'],
    60000: ['CVT: troca adicional do filtro interno', 'Corrente de comando: inspeção de ruídos e esticador'],
  },
}

const MARCAS = [
  { nome: 'Volkswagen', modelos: ['Polo', 'T-Cross', 'Nivus', 'Saveiro', 'Virtus', 'Taos'] },
  { nome: 'Fiat', modelos: ['Strada', 'Argo', 'Mobi', 'Toro', 'Pulse', 'Fastback'] },
  { nome: 'Chevrolet', modelos: ['Onix', 'Tracker', 'Onix Plus', 'Spin', 'Montana'] },
  { nome: 'Ford', modelos: ['Ranger', 'Territory', 'Bronco', 'Maverick'] },
  { nome: 'Honda', modelos: ['HR-V', 'City', 'Civic'] },
  { nome: 'Hyundai', modelos: ['HB20', 'Creta', 'Tucson'] },
  { nome: 'Nissan', modelos: ['Kicks', 'Frontier', 'Versa'] },
]

const INTERVALOS_KM = [10000, 20000, 30000, 40000, 50000, 60000]

const formatarDinheiro = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Manuais() {
  // Estados de busca
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [modeloSelecionado, setModeloSelecionado] = useState('')
  const [kmSelecionado, setKmSelecionado] = useState<number | null>(null)
  const [resultadoVisivel, setResultadoVisivel] = useState(false)
  
  // Estados de orçamento
  const [itensSelecionados, setItensSelecionados] = useState<Set<string>>(new Set())
  const [nomeCliente, setNomeCliente] = useState('')
  const [telefoneCliente, setTelefoneCliente] = useState('')
  const [showToast, setShowToast] = useState('')

  const modelosDisponiveis = useMemo(() => {
    const marca = MARCAS.find(m => m.nome === marcaSelecionada)
    return marca ? marca.modelos : []
  }, [marcaSelecionada])

  const dadosManutencao = useMemo((): DadosKm | null => {
    if (!kmSelecionado) return null
    const itens = DADOS_UNIVERSAIS[kmSelecionado]
    if (!itens) return null
    const totalItens = itens.filter(i => i.custoMedio).reduce((acc, i) => acc + (i.custoMedio || 0), 0)
    const min = Math.round(totalItens * 0.85)
    const max = Math.round(totalItens * 1.25)
    return {
      km: kmSelecionado,
      itens,
      estimativaTotal: { min, max },
      notas: marcaSelecionada ? NOTAS_MARCA[marcaSelecionada]?.[kmSelecionado] : undefined,
    }
  }, [kmSelecionado, marcaSelecionada])

  const handleConsultar = () => {
    if (marcaSelecionada && modeloSelecionado && kmSelecionado) {
      setResultadoVisivel(true)
      setItensSelecionados(new Set())
      setNomeCliente('')
      setTelefoneCliente('')
    }
  }

  const toggleItem = useCallback((componente: string) => {
    setItensSelecionados(prev => {
      const novo = new Set(prev)
      if (novo.has(componente)) novo.delete(componente)
      else novo.add(componente)
      return novo
    })
  }, [])

  const selecionarTodosSubstituir = useCallback(() => {
    if (!dadosManutencao) return
    const todos = dadosManutencao.itens.filter(i => i.custoMedio).map(i => i.componente)
    setItensSelecionados(new Set(todos))
  }, [dadosManutencao])

  const limparSelecao = useCallback(() => {
    setItensSelecionados(new Set())
  }, [])

  const itensSelecionadosArray = useMemo(() => {
    return dadosManutencao?.itens.filter(i => itensSelecionados.has(i.componente) && i.custoMedio) || []
  }, [itensSelecionados, dadosManutencao])

  const totalOrcamento = useMemo(() => {
    return itensSelecionadosArray.reduce((acc, i) => acc + (i.custoMedio || 0), 0)
  }, [itensSelecionadosArray])

  const gerarMensagemWhatsApp = useCallback(() => {
    let msg = `🚗 *Orçamento 77 Car Service*\n\n`
    msg += `*Veículo:* ${marcaSelecionada} ${modeloSelecionado}\n`
    msg += `*Quilometragem:* ${kmSelecionado?.toLocaleString('pt-BR')} km\n`
    if (nomeCliente.trim()) msg += `*Cliente:* ${nomeCliente.trim()}\n`
    msg += `\n✅ *Serviços Selecionados:*\n`
    itensSelecionadosArray.forEach(i => {
      msg += `  • ${i.componente} — ${formatarDinheiro(i.custoMedio || 0)}\n`
    })
    msg += `\n💰 *Total: ${formatarDinheiro(totalOrcamento)}*\n`
    msg += `\n⏱ Prazo estimado: a combinar\n`
    msg += `📅 *77 Car Service — Sua oficina de confiança!*\n`
    msg += `📞 (31) 9XXXX-XXXX`
    return msg
  }, [marcaSelecionada, modeloSelecionado, kmSelecionado, nomeCliente, itensSelecionadosArray, totalOrcamento])

  const abrirWhatsApp = useCallback(() => {
    const msg = gerarMensagemWhatsApp()
    const numero = telefoneCliente.replace(/\D/g, '')
    const url = numero 
      ? `https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }, [gerarMensagemWhatsApp, telefoneCliente])

  const copiarOrcamento = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(gerarMensagemWhatsApp())
      setShowToast('copiado')
      setTimeout(() => setShowToast(''), 2000)
    } catch {
      setShowToast('erro')
      setTimeout(() => setShowToast(''), 2000)
    }
  }, [gerarMensagemWhatsApp])

  const itensSubstituir = dadosManutencao?.itens.filter(i => i.acao === 'substituir') || []
  const itensConferir = dadosManutencao?.itens.filter(i => i.acao === 'conferir') || []

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto relative">
      {/* Toast */}
      <AnimatePresence>
        {showToast === 'copiado' && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl px-6 py-3 shadow-2xl">
            <p className="text-green-400 font-bold text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Orçamento copiado!</p>
          </motion.div>
        )}
        {showToast === 'erro' && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl px-6 py-3 shadow-2xl">
            <p className="text-red-400 font-bold text-sm">Erro ao copiar. Tente novamente.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabeçalho */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">Cardápio Técnico</h1>
            <p className="text-xs text-slate-400 uppercase tracking-[0.15em] font-bold">Consulte o manual + monte o orçamento em segundos</p>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-400 text-sm font-bold mb-1">⚠️ Aviso Importante</p>
          <p className="text-amber-300/70 text-xs leading-relaxed">
            Estas informações são baseadas em manuais de fabricante e dados compilados de mercado. 
            <strong>SEMPRE consulte o manual do proprietário do veículo.</strong> Os custos são estimativas de mercado.
          </p>
        </div>
      </motion.div>

      {/* Painel de Consulta */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-3xl p-6 lg:p-8 border border-slate-800 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">🚗 Marca</label>
            <div className="relative">
              <select value={marcaSelecionada} onChange={(e) => { setMarcaSelecionada(e.target.value); setModeloSelecionado(''); setResultadoVisivel(false) }}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none cursor-pointer hover:border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                <option value="">Selecionar marca...</option>
                {MARCAS.map(m => <option key={m.nome} value={m.nome}>{m.nome}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">📋 Modelo</label>
            <div className="relative">
              <select value={modeloSelecionado} onChange={(e) => { setModeloSelecionado(e.target.value); setResultadoVisivel(false) }}
                disabled={!marcaSelecionada}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none cursor-pointer hover:border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <option value="">Selecionar modelo...</option>
                {modelosDisponiveis.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">🔢 Quilometragem</label>
            <div className="relative">
              <select value={kmSelecionado || ''} onChange={(e) => { setKmSelecionado(e.target.value ? Number(e.target.value) : null); setResultadoVisivel(false) }}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none cursor-pointer hover:border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all">
                <option value="">Selecionar km...</option>
                {INTERVALOS_KM.map(km => <option key={km} value={km}>{km.toLocaleString('pt-BR')} km</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={handleConsultar}
              disabled={!marcaSelecionada || !modeloSelecionado || !kmSelecionado}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black py-3 px-6 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              CONSULTAR
            </button>
          </div>
        </div>
      </motion.div>

      {/* Resultado */}
      <AnimatePresence>
        {resultadoVisivel && dadosManutencao && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: 0.1 }}>
            
            {/* Cabeçalho do Resultado */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-black italic uppercase">{marcaSelecionada} {modeloSelecionado}</h2>
                  <span className="px-3 py-1 bg-emerald-600/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black">{kmSelecionado?.toLocaleString('pt-BR')} km</span>
                  {itensSelecionados.size > 0 && (
                    <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-black">{itensSelecionados.size} selecionados</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={selecionarTodosSubstituir}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl px-4 py-2 transition-all flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  SELECIONAR TODOS
                </button>
                {itensSelecionados.size > 0 && (
                  <button onClick={limparSelecao}
                    className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 transition-all flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" />
                    LIMPAR
                  </button>
                )}
              </div>
            </div>

            {/* Grid: Checklists + Painel Orçamento */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Coluna dos Checklists (2/3 no desktop) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* SUBSTITUIR */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="glass rounded-2xl border border-red-500/20 overflow-hidden">
                  <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-red-400 uppercase text-sm">🔧 SUBSTITUIR</h3>
                      <p className="text-[10px] text-red-400/60">{itensSubstituir.length} itens — marque os que serão feitos</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    {itensSubstituir.map((item, idx) => {
                      const isSelected = itensSelecionados.has(item.componente)
                      const temCusto = !!item.custoMedio
                      return (
                        <button key={idx} onClick={() => temCusto && toggleItem(item.componente)}
                          disabled={!temCusto}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl transition group text-left ${temCusto ? 'cursor-pointer hover:bg-slate-800/30' : 'cursor-default opacity-60'} ${isSelected ? 'bg-emerald-500/10 border border-emerald-500/30' : 'border border-transparent'}`}>
                          {temCusto ? (
                            isSelected ? <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <Square className="w-5 h-5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5 transition-colors" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold transition ${isSelected ? 'text-emerald-300' : 'text-white group-hover:text-red-300'}`}>{item.componente}</p>
                            {item.detalhe && <p className="text-xs text-slate-500 mt-0.5">{item.detalhe}</p>}
                          </div>
                          {item.custoMedio && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap transition ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                              ~{formatarDinheiro(item.custoMedio)}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>

                {/* CONFERIR */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="glass rounded-2xl border border-amber-500/20 overflow-hidden">
                  <div className="bg-amber-500/10 px-6 py-4 border-b border-amber-500/20 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-amber-400 uppercase text-sm">👀 CONFERIR</h3>
                      <p className="text-[10px] text-amber-400/60">{itensConferir.length} itens de inspeção visual</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {itensConferir.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition group">
                        <Eye className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-amber-300 transition">{item.componente}</p>
                          {item.detalhe && <p className="text-xs text-slate-500 mt-0.5">{item.detalhe}</p>}
                        </div>
                        {item.prioridade === 'alta' && (
                          <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full uppercase">Prioridade</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Notas Específicas da Marca */}
                {dadosManutencao.notas && dadosManutencao.notas.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="glass rounded-2xl border border-blue-500/20 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-blue-400" />
                      <h3 className="font-black text-blue-400 uppercase text-sm">⚠️ Alertas Específicos — {marcaSelecionada}</h3>
                    </div>
                    <ul className="space-y-2">
                      {dadosManutencao.notas.map((nota, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-blue-300/80">
                          <ArrowRight className="w-3 h-3 flex-shrink-0 mt-1 text-blue-500" />
                          {nota}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Painel de Orçamento (1/3 no desktop) */}
              <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                  className="glass rounded-3xl border border-emerald-500/20 p-6 lg:sticky lg:top-6">
                  
                  {/* Ícone + Título */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-white uppercase text-sm">💰 Orçamento</h3>
                      <p className="text-[10px] text-slate-500">{itensSelecionados.size > 0 ? `${itensSelecionados.size} itens selecionados` : 'Nenhum item'}</p>
                    </div>
                  </div>

                  {/* Lista de Itens Selecionados */}
                  {itensSelecionadosArray.length > 0 ? (
                    <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                      {itensSelecionadosArray.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/50">
                          <span className="text-xs text-slate-300 flex-1 min-w-0 pr-2">{item.componente}</span>
                          <span className="text-xs font-bold text-emerald-400 whitespace-nowrap">{formatarDinheiro(item.custoMedio || 0)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 mb-6">
                      <ShoppingCart className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-xs text-slate-600">Selecione os serviços no checklist ao lado</p>
                      <p className="text-[10px] text-slate-700 mt-1">Clique nos itens com preço para adicionar</p>
                    </div>
                  )}

                  {/* Total */}
                  {itensSelecionadosArray.length > 0 && (
                    <>
                      <div className="border-t border-slate-800 pt-4 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-300">TOTAL</span>
                          <motion.span key={totalOrcamento} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
                            className="text-2xl font-black text-emerald-400 italic">{formatarDinheiro(totalOrcamento)}</motion.span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1">⏱ Prazo estimado: a combinar</p>
                      </div>

                      {/* Campos do Cliente */}
                      <div className="space-y-3 mb-4">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input type="text" placeholder="Nome do cliente" value={nomeCliente}
                            onChange={(e) => setNomeCliente(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input type="tel" placeholder="WhatsApp do cliente" value={telefoneCliente}
                            onChange={(e) => setTelefoneCliente(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="space-y-2">
                        <button onClick={abrirWhatsApp}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-3.5 px-4 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          ENVIAR WHATSAPP
                        </button>
                        <button onClick={copiarOrcamento}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 border border-slate-700 flex items-center justify-center gap-2">
                          <Copy className="w-3.5 h-3.5" />
                          COPIAR ORÇAMENTO
                        </button>
                      </div>
                    </>
                  )}

                  {/* Dica do Consultor */}
                  {itensSelecionadosArray.length === 0 && (
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <p className="text-[10px] font-bold text-blue-400 uppercase">💡 Dica do Consultor</p>
                      </div>
                      <p className="text-[10px] text-blue-400/60 leading-relaxed">
                        Selecione os serviços recomendados e gere um orçamento profissional em segundos. Aumente o ticket médio com a credibilidade do manual do fabricante!
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Botão Manual Oficial */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex justify-center">
              <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 border border-slate-700 flex items-center gap-2 shadow-lg">
                <ExternalLink className="w-4 h-4" />
                BUSCAR MANUAL OFICIAL DO FABRICANTE
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado Vazio */}
      {!resultadoVisivel && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center py-16">
          <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-400 mb-2">Monte o orçamento do cliente</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Selecione a <strong className="text-slate-400">marca</strong>, o <strong className="text-slate-400">modelo</strong> e a <strong className="text-slate-400">quilometragem</strong> acima para visualizar o checklist completo de manutenção preventiva.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {INTERVALOS_KM.map(km => (
              <button key={km} onClick={() => setKmSelecionado(km)}
                className="px-4 py-2 bg-slate-800/50 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500/30 rounded-xl text-sm font-bold text-slate-400 hover:text-emerald-400 transition-all">
                {km.toLocaleString('pt-BR')} km
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Rodapé */}
      <div className="mt-12 pt-6 border-t border-slate-800/50 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
          Dados compilados de manuais oficiais de fabricantes • Atualizado em Maio/2026 • 77 Car Service
        </p>
      </div>
    </div>
  )
}
'use client'
import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Wrench, Eye, ChevronDown, AlertTriangle, CheckCircle2, DollarSign, ExternalLink, BookOpen, ArrowRight, ArrowUpRight, Send, User, Phone, ShoppingCart, X, MessageCircle, ClipboardCheck, CheckSquare, Square, Copy, Check, Star, Sparkles } from 'lucide-react'

// ============================================================
// 📚 BASE DE DADOS DE MANUTENÇÃO PREVENTIVA (7 MARCAS TOP BR)
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

// ⚙️ CONFIGURAÇÃO: Número do WhatsApp da 77 Car Service (DDI+DDD+Número)
const WHATSAPP_77CAR = '5531993810753' // 📱 Anderson Martins — 77 Car Service

// ============================================================
// 💰 PACOTES DE SERVIÇO (Preços definidos pelo Anderson)
// ============================================================

interface PacoteInfo {
  id: 'basica' | 'recomendada' | 'avancada'
  nome: string
  icone: string
  descricao: string
  extras: string[]
  custoExtra: number
  cor: string
  corBg: string
  corBorder: string
  corTexto: string
}

const PACOTES: Record<string, PacoteInfo> = {
  basica: {
    id: 'basica',
    nome: 'BÁSICA',
    icone: '🥉',
    descricao: 'Apenas itens do Manual de Manutenção',
    extras: [],
    custoExtra: 0,
    cor: 'from-slate-500 to-slate-600',
    corBg: 'bg-slate-500/10',
    corBorder: 'border-slate-500/20',
    corTexto: 'text-slate-400',
  },
  recomendada: {
    id: 'recomendada',
    nome: 'RECOMENDADA',
    icone: '🥈',
    descricao: 'Básica + Alinhamento, Balanceamento, Higienização Ar e Oxisanitização',
    extras: ['Alinhamento (4 rodas)', 'Balanceamento (4 rodas)', 'Higienização ar-condicionado', 'Oxisanitização'],
    custoExtra: 450,
    cor: 'from-blue-600 to-cyan-600',
    corBg: 'bg-blue-500/10',
    corBorder: 'border-blue-500/30',
    corTexto: 'text-blue-400',
  },
  avancada: {
    id: 'avancada',
    nome: 'AVANÇADA',
    icone: '🥇',
    descricao: 'Recomendada + Lavagem Detalhada Completa',
    extras: ['Alinhamento (4 rodas)', 'Balanceamento (4 rodas)', 'Higienização ar-condicionado', 'Oxisanitização', 'Lavagem detalhada completa (interna + externa + cera)'],
    custoExtra: 590,
    cor: 'from-amber-500 to-orange-500',
    corBg: 'bg-amber-500/10',
    corBorder: 'border-amber-500/30',
    corTexto: 'text-amber-400',
  },
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

export default function Manuais() {
  // Estados de consulta
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [modeloSelecionado, setModeloSelecionado] = useState('')
  const [kmSelecionado, setKmSelecionado] = useState<number | null>(null)
  const [resultadoVisivel, setResultadoVisivel] = useState(false)

  // Estados do orçamento
  const [itensSelecionados, setItensSelecionados] = useState<Set<string>>(new Set())
  const [pacoteSelecionado, setPacoteSelecionado] = useState<'basica' | 'recomendada' | 'avancada'>('basica')
  const [nomeCliente, setNomeCliente] = useState('')
  const [telefoneCliente, setTelefoneCliente] = useState('')
  const [mostrarPainelOrcamento, setMostrarPainelOrcamento] = useState(false)
  const [copiado, setCopiado] = useState(false)

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
      setPacoteSelecionado('basica')
      setMostrarPainelOrcamento(false)
    }
  }

  const toggleItem = useCallback((itemKey: string) => {
    setItensSelecionados(prev => {
      const next = new Set(prev)
      if (next.has(itemKey)) {
        next.delete(itemKey)
      } else {
        next.add(itemKey)
      }
      return next
    })
  }, [])

  const selecionarTodos = useCallback(() => {
    if (!dadosManutencao) return
    const todas = dadosManutencao.itens.map((_, idx) => `item-${idx}`)
    setItensSelecionados(new Set(todas))
  }, [dadosManutencao])

  const limparSelecao = useCallback(() => {
    setItensSelecionados(new Set())
    setPacoteSelecionado('basica')
  }, [])

  const itensSelecionadosArray = useMemo(() => {
    if (!dadosManutencao) return []
    return dadosManutencao.itens.filter((_, idx) => itensSelecionados.has(`item-${idx}`))
  }, [dadosManutencao, itensSelecionados])

  const totalManual = useMemo(() => {
    return itensSelecionadosArray.reduce((acc, i) => acc + (i.custoMedio || 0), 0)
  }, [itensSelecionadosArray])

  const pacoteAtual = PACOTES[pacoteSelecionado]
  const totalComPacote = totalManual + pacoteAtual.custoExtra

  const itensSubstituir = dadosManutencao?.itens.filter(i => i.acao === 'substituir') || []
  const itensConferir = dadosManutencao?.itens.filter(i => i.acao === 'conferir') || []

  const formatarDinheiro = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const gerarMensagemWhatsApp = (): string => {
    if (!dadosManutencao) return ''
    const selecionadosSubstituir = itensSelecionadosArray.filter(i => i.acao === 'substituir')
    const selecionadosConferir = itensSelecionadosArray.filter(i => i.acao === 'conferir')
    
    let msg = `🚗 *ORÇAMENTO 77 CAR SERVICE*\n\n`
    msg += `👤 *Cliente:* ${nomeCliente || '(não informado)'}\n`
    msg += `📞 *Telefone:* ${telefoneCliente || '(não informado)'}\n\n`
    msg += `🚙 *Veículo:* ${marcaSelecionada} ${modeloSelecionado}\n`
    msg += `🔢 *Quilometragem:* ${kmSelecionado?.toLocaleString('pt-BR')} km\n`
    msg += `📦 *Pacote:* ${pacoteAtual.icone} ${pacoteAtual.nome}\n\n`
    
    if (selecionadosSubstituir.length > 0) {
      msg += `🔧 *SERVIÇOS A SUBSTITUIR:*\n`
      selecionadosSubstituir.forEach((item, idx) => {
        const custo = item.custoMedio ? ` — ~${formatarDinheiro(item.custoMedio)}` : ''
        msg += `  ${idx + 1}. ${item.componente}${custo}\n`
      })
      msg += `\n`
    }
    
    if (selecionadosConferir.length > 0) {
      msg += `👀 *SERVIÇOS A CONFERIR:*\n`
      selecionadosConferir.forEach((item, idx) => {
        msg += `  ${idx + 1}. ${item.componente}\n`
      })
      msg += `\n`
    }

    if (pacoteAtual.extras.length > 0) {
      msg += `✨ *EXTRAS DO PACOTE ${pacoteAtual.nome}:*\n`
      pacoteAtual.extras.forEach((extra, idx) => {
        msg += `  ${idx + 1}. ${extra}\n`
      })
      msg += `  💰 Valor extra: ${formatarDinheiro(pacoteAtual.custoExtra)}\n\n`
    }
    
    const totalSubstituir = selecionadosSubstituir.reduce((acc, i) => acc + (i.custoMedio || 0), 0)
    if (totalComPacote > 0) {
      msg += `💰 *ESTIMATIVA TOTAL:* ${formatarDinheiro(totalComPacote)}\n`
      if (pacoteAtual.custoExtra > 0) {
        msg += `   (Manual: ${formatarDinheiro(totalSubstituir)} + ${pacoteAtual.nome}: ${formatarDinheiro(pacoteAtual.custoExtra)})\n`
      }
      msg += `\n`
    }
    
    msg += `📅 *Gostaria de agendar uma visita?*\n`
    msg += `📍 *77 Car Service — Estética e Manutenção Automotiva*`
    
    return msg
  }

  const enviarWhatsApp = () => {
    if (itensSelecionadosArray.length === 0) return
    if (!nomeCliente.trim()) return
    if (!telefoneCliente.trim()) return
    
    const mensagem = gerarMensagemWhatsApp()
    const url = `https://wa.me/${WHATSAPP_77CAR}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const copiarOrcamento = async () => {
    if (itensSelecionadosArray.length === 0) return
    const mensagem = gerarMensagemWhatsApp()
    try {
      await navigator.clipboard.writeText(mensagem)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = mensagem
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  const podeEnviar = itensSelecionadosArray.length > 0 && nomeCliente.trim() && telefoneCliente.trim()

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
        {/* Cabeçalho */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">Manuais de Manutenção</h1>
              <p className="text-xs text-slate-400 uppercase tracking-[0.15em] font-bold">Checklists por quilometragem + Orçamento via WhatsApp</p>
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
              <strong> SEMPRE consulte o manual do proprietário do veículo.</strong> As especificações podem variar conforme ano/modelo e condições de uso.
            </p>
          </div>
        </motion.div>

        {/* Painel de Consulta */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 lg:p-8 border border-slate-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">🚗 Marca</label>
              <div className="relative">
                <select value={marcaSelecionada} onChange={(e) => { setMarcaSelecionada(e.target.value); setModeloSelecionado(''); setResultadoVisivel(false) }}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none cursor-pointer hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
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
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none cursor-pointer hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
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
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none cursor-pointer hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                  <option value="">Selecionar km...</option>
                  {INTERVALOS_KM.map(km => <option key={km} value={km}>{km.toLocaleString('pt-BR')} km</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <button onClick={handleConsultar}
                disabled={!marcaSelecionada || !modeloSelecionado || !kmSelecionado}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black py-3 px-6 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                CONSULTAR
              </button>
            </div>
          </div>

          {/* Chips de km rápido */}
          <div className="flex flex-wrap gap-2">
            {INTERVALOS_KM.map(km => (
              <button key={km} onClick={() => setKmSelecionado(km)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${kmSelecionado === km ? 'bg-blue-600/30 border border-blue-500/40 text-blue-400' : 'bg-slate-800/50 border border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-600'}`}>
                {km.toLocaleString('pt-BR')} km
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resultado + Painel de Orçamento (Layout Desktop: Grid 3 colunas) */}
        <AnimatePresence>
          {resultadoVisivel && dadosManutencao && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: 0.1 }}>
              
              {/* Cabeçalho do Resultado */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black italic uppercase">{marcaSelecionada} {modeloSelecionado}</h2>
                    <span className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-black">{kmSelecionado?.toLocaleString('pt-BR')} km</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">✅ Selecione os serviços, escolha o pacote e gere o orçamento via WhatsApp</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={selecionarTodos}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5" />
                    Todos
                  </button>
                  <button onClick={limparSelecao}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2">
                    <X className="w-3.5 h-3.5" />
                    Limpar
                  </button>
                  <div className="glass rounded-xl px-4 py-2.5 text-center min-w-[140px]">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Est. de Custo Manual</p>
                    <p className="text-lg font-black text-blue-400 italic">
                      {formatarDinheiro(dadosManutencao.estimativaTotal.min)} – {formatarDinheiro(dadosManutencao.estimativaTotal.max)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid Principal: Checklists + Painel Orçamento */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Coluna Esquerda: SUBSTITUIR */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="glass rounded-2xl border border-red-500/20 overflow-hidden">
                  <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-black text-red-400 uppercase text-sm">🔧 SUBSTITUIR</h3>
                        <p className="text-[10px] text-red-400/60">{itensSubstituir.length} itens</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1 max-h-[500px] overflow-y-auto">
                    {itensSubstituir.map((item, idx) => {
                      const globalIdx = dadosManutencao.itens.indexOf(item)
                      const itemKey = `item-${globalIdx}`
                      const selecionado = itensSelecionados.has(itemKey)
                      return (
                        <button key={itemKey} onClick={() => toggleItem(itemKey)}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group ${selecionado ? 'bg-red-500/10 border border-red-500/30' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                          <div className="flex-shrink-0 mt-0.5">
                            {selecionado ? (
                              <CheckSquare className="w-4 h-4 text-red-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold transition ${selecionado ? 'text-red-300' : 'text-white group-hover:text-red-200'}`}>{item.componente}</p>
                            {item.detalhe && <p className="text-xs text-slate-500 mt-0.5">{item.detalhe}</p>}
                          </div>
                          {item.custoMedio && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap transition ${selecionado ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-400'}`}>
                              ~{formatarDinheiro(item.custoMedio)}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Coluna Meio: CONFERIR */}
                <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                  className="glass rounded-2xl border border-amber-500/20 overflow-hidden">
                  <div className="bg-amber-500/10 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-black text-amber-400 uppercase text-sm">👀 CONFERIR</h3>
                        <p className="text-[10px] text-amber-400/60">{itensConferir.length} itens</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1 max-h-[500px] overflow-y-auto">
                    {itensConferir.map((item, idx) => {
                      const globalIdx = dadosManutencao.itens.indexOf(item)
                      const itemKey = `item-${globalIdx}`
                      const selecionado = itensSelecionados.has(itemKey)
                      return (
                        <button key={itemKey} onClick={() => toggleItem(itemKey)}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group ${selecionado ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-slate-800/30 border border-transparent'}`}>
                          <div className="flex-shrink-0 mt-0.5">
                            {selecionado ? (
                              <CheckSquare className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold transition ${selecionado ? 'text-amber-300' : 'text-white group-hover:text-amber-200'}`}>{item.componente}</p>
                            {item.detalhe && <p className="text-xs text-slate-500 mt-0.5">{item.detalhe}</p>}
                          </div>
                          {item.prioridade === 'alta' && (
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase transition ${selecionado ? 'bg-amber-500/30 text-amber-300' : 'bg-amber-500/20 text-amber-400'}`}>Prioridade</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Coluna Direita: PAINEL DE ORÇAMENTO */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="glass rounded-2xl border border-green-500/20 overflow-hidden flex flex-col">
                  <div className="bg-green-500/10 px-6 py-4 border-b border-green-500/20 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-green-400 uppercase text-sm">📋 ORÇAMENTO</h3>
                      <p className="text-[10px] text-green-400/60">{itensSelecionadosArray.length} itens • Pacote {pacoteAtual.nome}</p>
                    </div>
                  </div>

                  {/* Itens Selecionados */}
                  <div className="flex-1 p-4 space-y-2 max-h-[220px] overflow-y-auto">
                    {itensSelecionadosArray.length === 0 ? (
                      <div className="text-center py-8">
                        <ClipboardCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Nenhum serviço selecionado</p>
                        <p className="text-xs text-slate-600 mt-1">Marque os checklists ao lado</p>
                      </div>
                    ) : (
                      <>
                        {itensSelecionadosArray.filter(i => i.acao === 'substituir').map((item, idx) => (
                          <div key={`sel-s-${idx}`} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                            <div className="flex items-center gap-2 min-w-0">
                              <Wrench className="w-3 h-3 text-red-400 flex-shrink-0" />
                              <span className="text-xs text-slate-300 truncate">{item.componente}</span>
                            </div>
                            {item.custoMedio && <span className="text-xs font-bold text-red-400 whitespace-nowrap ml-2">{formatarDinheiro(item.custoMedio)}</span>}
                          </div>
                        ))}
                        {itensSelecionadosArray.filter(i => i.acao === 'conferir').map((item, idx) => (
                          <div key={`sel-c-${idx}`} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                            <div className="flex items-center gap-2 min-w-0">
                              <Eye className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span className="text-xs text-slate-300 truncate">{item.componente}</span>
                            </div>
                            <span className="text-xs text-amber-400 whitespace-nowrap ml-2">Inspeção</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* 🔥 SELETOR DE PACOTE — NOVO! */}
                  {itensSelecionadosArray.length > 0 && (
                    <div className="p-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Escolha o Pacote</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.values(PACOTES).map((pacote) => {
                          const ativo = pacoteSelecionado === pacote.id
                          return (
                            <button
                              key={pacote.id}
                              onClick={() => setPacoteSelecionado(pacote.id)}
                              className={`text-left p-3 rounded-xl border transition-all duration-200 group ${
                                ativo
                                  ? `${pacote.corBg} ${pacote.corBorder} shadow-lg`
                                  : 'border-slate-800 hover:border-slate-700 bg-transparent hover:bg-slate-800/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{pacote.icone}</span>
                                  <span className={`text-xs font-black uppercase tracking-wider ${ativo ? pacote.corTexto : 'text-slate-400'}`}>
                                    {pacote.nome}
                                  </span>
                                  {ativo && <Check className="w-3.5 h-3.5 text-green-400" />}
                                </div>
                                {pacote.custoExtra > 0 && (
                                  <span className={`text-sm font-black ${ativo ? pacote.corTexto : 'text-slate-500'}`}>
                                    +{formatarDinheiro(pacote.custoExtra)}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed">{pacote.descricao}</p>
                              {ativo && pacote.extras.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-slate-800/50">
                                  <div className="flex flex-wrap gap-1">
                                    {pacote.extras.map((extra, idx) => (
                                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                                        {extra}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total + Formulário */}
                  <div className="p-4 border-t border-slate-800 space-y-4">
                    {totalComPacote > 0 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div>
                          <span className="text-sm font-bold text-green-400">💰 TOTAL</span>
                          <p className="text-[9px] text-green-400/50">{pacoteAtual.icone} Pacote {pacoteAtual.nome}</p>
                        </div>
                        <span className="text-xl font-black text-green-300 italic">{formatarDinheiro(totalComPacote)}</span>
                      </div>
                    )}

                    {pacoteAtual.custoExtra > 0 && totalManual > 0 && (
                      <div className="text-[10px] text-slate-500 text-right">
                        Manual: {formatarDinheiro(totalManual)} + {pacoteAtual.nome}: {formatarDinheiro(pacoteAtual.custoExtra)}
                      </div>
                    )}

                    {/* Dados do Cliente */}
                    <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="Nome do cliente" value={nomeCliente}
                          onChange={(e) => setNomeCliente(e.target.value)}
                          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="tel" placeholder="WhatsApp do cliente" value={telefoneCliente}
                          onChange={(e) => setTelefoneCliente(e.target.value)}
                          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all" />
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="space-y-2">
                      <button onClick={enviarWhatsApp}
                        disabled={!podeEnviar}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-3.5 px-6 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-green-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        ENVIAR ORÇAMENTO VIA WHATSAPP
                      </button>
                      <button onClick={copiarOrcamento}
                        disabled={itensSelecionadosArray.length === 0}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {copiado ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiado ? 'COPIADO!' : 'COPIAR ORÇAMENTO'}
                      </button>
                    </div>

                    <p className="text-[9px] text-slate-600 text-center">
                      Abre o WhatsApp com a mensagem pronta para o cliente
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Notas Específicas da Marca */}
              {dadosManutencao.notas && dadosManutencao.notas.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="glass rounded-2xl border border-blue-500/20 p-6 mb-8">
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

              {/* Botão Manual Oficial */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex justify-center">
                <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 border border-slate-700 flex items-center gap-2">
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
              <BookOpen className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-400 mb-2">Consulte o manual de manutenção</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Selecione a <strong className="text-slate-400">marca</strong>, o <strong className="text-slate-400">modelo</strong> e a <strong className="text-slate-400">quilometragem</strong> acima para visualizar o checklist completo e montar orçamentos via WhatsApp.
            </p>
          </motion.div>
        )}

        {/* Rodapé */}
        <div className="mt-12 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
            Dados compilados de manuais oficiais de fabricantes • Atualizado em Maio/2026 • 77 Car Service
          </p>
        </div>
      </div>
    </div>
  )
}
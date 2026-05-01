'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Wrench, Eye, BookOpen, ChevronDown, ChevronRight, ArrowRight, ExternalLink, Download, AlertTriangle } from 'lucide-react'
import dadosManuais from '@/data/manuais-base.json'

interface ItemChecklist {
  item: string
  detalhe: string
  custo_estimado?: number
}

interface ChecklistKm {
  km: number
  itens_substituir: ItemChecklist[]
  itens_conferir: ItemChecklist[]
}

interface ModeloManual {
  id: string
  marca: string
  modelo: string
  categoria: string
  ano_inicio: number
  ano_fim: number
  checklists: ChecklistKm[]
}

export default function Manuais() {
  const [marcaSelecionada, setMarcaSelecionada] = useState<string>('')
  const [modeloSelecionado, setModeloSelecionado] = useState<string>('')
  const [kmSelecionado, setKmSelecionado] = useState<number>(10000)
  const [busca, setBusca] = useState('')
  const [mostrarBuscaOnline, setMostrarBuscaOnline] = useState(false)

  // Extrair marcas únicas
  const marcas = useMemo(() => {
    const marcasSet = new Set((dadosManuais.modelos as ModeloManual[]).map(m => m.marca))
    return Array.from(marcasSet).sort()
  }, [])

  // Filtrar modelos por marca
  const modelosFiltrados = useMemo(() => {
    if (!marcaSelecionada) return []
    return (dadosManuais.modelos as ModeloManual[]).filter(m => m.marca === marcaSelecionada)
  }, [marcaSelecionada])

  // Obter modelo selecionado
  const modeloAtual = useMemo(() => {
    if (!modeloSelecionado) return null
    return (dadosManuais.modelos as ModeloManual[]).find(m => m.id === modeloSelecionado) || null
  }, [modeloSelecionado])

  // Obter checklist para o km selecionado
  const checklistAtual = useMemo(() => {
    if (!modeloAtual) return null
    return modeloAtual.checklists.find(c => c.km === kmSelecionado) || null
  }, [modeloAtual, kmSelecionado])

  // Calcular custo total estimado
  const custoTotal = useMemo(() => {
    if (!checklistAtual) return 0
    return checklistAtual.itens_substituir.reduce((sum, item) => sum + (item.custo_estimado || 0), 0)
  }, [checklistAtual])

  const kms = [10000, 20000, 30000, 40000, 50000, 60000]

  // Buscar modelos por texto
  const modelosBusca = useMemo(() => {
    if (!busca || busca.length < 2) return []
    const query = busca.toLowerCase()
    return (dadosManuais.modelos as ModeloManual[]).filter(m =>
      m.modelo.toLowerCase().includes(query) ||
      m.marca.toLowerCase().includes(query) ||
      m.categoria.toLowerCase().includes(query)
    ).slice(0, 8)
  }, [busca])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Manuais de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">Manutenção</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Checklists preventivos baseados nos manuais dos fabricantes</p>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-4 mb-6 border border-amber-500/20 bg-amber-500/5 flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300/80 text-xs md:text-sm">
          <strong className="text-amber-300">Aviso importante:</strong> Os dados apresentados são informativos e baseados nos manuais dos fabricantes. 
          Sempre consulte o manual do proprietário do veículo específico. As recomendações podem variar conforme versão do motor, 
          tipo de uso e ano de fabricação.
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {/* Busca rápida */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar modelo ou marca..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              if (e.target.value.length >= 2) {
                setMarcaSelecionada('')
                setModeloSelecionado('')
              }
            }}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
          />
          {/* Dropdown de busca */}
          <AnimatePresence>
            {modelosBusca.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-50"
              >
                {modelosBusca.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMarcaSelecionada(m.marca)
                      setModeloSelecionado(m.id)
                      setBusca('')
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-white text-sm font-medium">{m.marca} {m.modelo}</span>
                      <span className="text-slate-500 text-xs block">{m.ano_inicio}-{m.ano_fim} · {m.categoria}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Select Marca */}
        <select
          value={marcaSelecionada}
          onChange={(e) => {
            setMarcaSelecionada(e.target.value)
            setModeloSelecionado('')
            setBusca('')
          }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
        >
          <option value="">Todas as marcas</option>
          {marcas.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Select Modelo */}
        <select
          value={modeloSelecionado}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          disabled={!marcaSelecionada}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">Selecione o modelo</option>
          {modelosFiltrados.map(m => (
            <option key={m.id} value={m.id}>{m.modelo} ({m.ano_inicio}-{m.ano_fim})</option>
          ))}
        </select>

        {/* Select Km */}
        <select
          value={kmSelecionado}
          onChange={(e) => setKmSelecionado(Number(e.target.value))}
          disabled={!modeloSelecionado}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {kms.map(km => (
            <option key={km} value={km}>{km.toLocaleString('pt-BR')} km</option>
          ))}
        </select>
      </motion.div>

      {/* Conteúdo Principal */}
      <AnimatePresence mode="wait">
        {!modeloAtual && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
              <BookOpen className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-300 mb-2">Selecione um veículo</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Escolha a marca e o modelo para visualizar os checklists de manutenção preventiva por quilometragem.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> Substituir</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Conferir</span>
            </div>
          </motion.div>
        )}

        {modeloAtual && checklistAtual && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Info do modelo */}
            <div className="glass rounded-2xl p-6 mb-6 border border-slate-700/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{modeloAtual.categoria}</span>
                    <span className="text-xs text-slate-500">{modeloAtual.ano_inicio}-{modeloAtual.ano_fim}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{modeloAtual.marca} {modeloAtual.modelo}</h2>
                  <p className="text-slate-400 text-sm mt-1">Checklist de manutenção</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">{kmSelecionado.toLocaleString('pt-BR')}</div>
                    <div className="text-xs text-slate-500">quilômetros</div>
                  </div>
                  <div className="w-px h-12 bg-slate-700/50" />
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-slate-500">custo estimado</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards: Substituir + Conferir */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 🔧 SUBSTITUIR */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden"
              >
                <div className="p-5 border-b border-red-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-red-300 uppercase tracking-wide">Substituir</h3>
                      <p className="text-xs text-slate-500">{checklistAtual.itens_substituir.length} itens recomendados</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {checklistAtual.itens_substituir.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-red-500/20 transition-all group"
                    >
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-black text-red-400">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{item.item}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{item.detalhe}</p>
                      </div>
                      {item.custo_estimado && (
                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">R$ {item.custo_estimado.toFixed(2)}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* 👀 CONFERIR */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="glass rounded-2xl border border-amber-500/20 bg-amber-500/5 overflow-hidden"
              >
                <div className="p-5 border-b border-amber-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Eye className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-amber-300 uppercase tracking-wide">Conferir</h3>
                      <p className="text-xs text-slate-500">{checklistAtual.itens_conferir.length} itens a inspecionar</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {checklistAtual.itens_conferir.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + idx * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-amber-500/20 transition-all group"
                    >
                      <Eye className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{item.item}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{item.detalhe}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Rodapé com ações e fonte */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 glass rounded-2xl p-5 border border-slate-700/50"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  📅 Atualizado em: <span className="text-slate-400">01/05/2026</span> · 
                  📋 Fontes: Manuais dos fabricantes · 
                  ⚠️ Consulte sempre o manual do proprietário
                </div>
                <div className="flex items-center gap-3">
                  {!modeloAtual && (
                    <button
                      onClick={() => setMostrarBuscaOnline(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all border border-slate-700/50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buscar online
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                    <Download className="w-4 h-4" />
                    Exportar PDF
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Seletor rápido de Km */}
            <div className="mt-6 flex items-center gap-2 justify-center">
              {kms.map((km, idx) => (
                <button
                  key={km}
                  onClick={() => setKmSelecionado(km)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    kmSelecionado === km
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/30'
                  }`}
                >
                  {km.toLocaleString('pt-BR')}
                  <span className="block text-[10px] opacity-60">km</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modelo não encontrado */}
        {modeloAtual && !checklistAtual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">Checklist não encontrado</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Não encontramos dados de manutenção para {modeloAtual.marca} {modeloAtual.modelo} aos {kmSelecionado.toLocaleString('pt-BR')} km.
            </p>
            <button
              onClick={() => setMostrarBuscaOnline(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <ExternalLink className="w-4 h-4" />
              Buscar informações na internet
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de busca online */}
      <AnimatePresence>
        {mostrarBuscaOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setMostrarBuscaOnline(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Buscar online</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Esta funcionalidade permite buscar informações de manutenção atualizadas diretamente 
                da internet para modelos que ainda não estão na nossa base.
              </p>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700/50">
                <p className="text-xs text-amber-400 mb-2">⚠️ Atenção</p>
                <p className="text-xs text-slate-400">
                  Os resultados da busca online são gerados automaticamente e podem conter imprecisões. 
                  Sempre valide com o manual oficial do fabricante antes de executar qualquer serviço.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarBuscaOnline(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const query = modeloAtual
                      ? `${modeloAtual.marca} ${modeloAtual.modelo} manutenção preventiva ${kmSelecionado} km checklist`
                      : 'manutenção preventiva automotiva checklist quilometragem'
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')
                    setMostrarBuscaOnline(false)
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-bold transition-all"
                >
                  <ArrowRight className="w-4 h-4 inline mr-1" />
                  Pesquisar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

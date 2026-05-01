'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, ExternalLink, RefreshCw, ThumbsUp, Eye } from 'lucide-react'

interface Aprovacao {
  token: string
  osId: string
  cliente: string
  veiculo: string
  placa: string
  servico: string
  valor: string
  prazo: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
  link: string
  createdAt: string
}

const statusConfig = {
  pendente: { label: 'Aguardando', icon: Clock, className: 'text-amber-400 bg-amber-400/10 border-amber-500/30' },
  aprovado: { label: 'Aprovado', icon: CheckCircle, className: 'text-green-400 bg-green-400/10 border-green-500/30' },
  rejeitado: { label: 'Rejeitado', icon: XCircle, className: 'text-red-400 bg-red-400/10 border-red-500/30' }
}

export default function AprovacoesLista() {
  const [aprovacoes, setAprovacoes] = useState<Aprovacao[]>([])
  const [loading, setLoading] = useState(true)

  const loadAprovacoes = () => {
    setLoading(true)
    const local = JSON.parse(localStorage.getItem('77car_aprovacoes') || '[]')
    setAprovacoes(local.sort((a: Aprovacao, b: Aprovacao) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setLoading(false)
  }

  useEffect(() => {
    loadAprovacoes()
    // Listen for approval/rejection from iframe
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'ORCAMENTO_APROVADO' || e.data?.type === 'ORCAMENTO_REJEITADO') {
        const novoStatus = e.data.type === 'ORCAMENTO_APROVADO' ? 'aprovado' : 'rejeitado'
        const aprovs = JSON.parse(localStorage.getItem('77car_aprovacoes') || '[]')
        const idx = aprovs.findIndex((a: Aprovacao) => a.token === e.data.token)
        if (idx !== -1) {
          aprovs[idx].status = novoStatus
          localStorage.setItem('77car_aprovacoes', JSON.stringify(aprovs))
          loadAprovacoes()
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const pendentes = aprovacoes.filter(a => a.status === 'pendente').length
  const aprovados = aprovacoes.filter(a => a.status === 'aprovado').length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">
            Aprovação de <span className="text-green-400">Orçamentos</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Envie orçamentos e acompanhe aprovações em tempo real</p>
        </div>
        <button onClick={loadAprovacoes} className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-77 text-center">
          <p className="text-3xl font-black text-amber-400">{pendentes}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aguardando</p>
        </div>
        <div className="card-77 text-center">
          <p className="text-3xl font-black text-green-400">{aprovados}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aprovados</p>
        </div>
        <div className="card-77 text-center">
          <p className="text-3xl font-black text-white">{aprovacoes.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total</p>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Carregando...</div>
        ) : aprovacoes.length === 0 ? (
          <div className="card-77 text-center py-12">
            <ThumbsUp className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Nenhum orçamento enviado</p>
            <p className="text-xs text-slate-600 mt-1">Vá em Ordens de Serviço e clique em "Enviar para Aprovação"</p>
          </div>
        ) : (
          aprovacoes.map((ap, i) => {
            const StatusIcon = statusConfig[ap.status].icon
            return (
              <motion.div key={ap.token} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-77">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${statusConfig[ap.status].className}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-blue-400 font-bold text-sm">{ap.osId}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusConfig[ap.status].className}`}>
                          {statusConfig[ap.status].label}
                        </span>
                      </div>
                      <p className="font-bold text-lg">{ap.cliente}</p>
                      <p className="text-slate-400 text-sm">{ap.veiculo} • {ap.servico}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-black text-green-400">{ap.valor}</p>
                      <p className="text-[10px] text-slate-500">{new Date(ap.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <a href={ap.link} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Copy, Check, Link, Eye, ThumbsUp, Smartphone, ExternalLink, Sparkles, Clock, RefreshCw } from 'lucide-react'

const APPROVAL_BASE_URL = 'https://jarvis-magic-napkin-m2z6y.vercel.app'

interface Servico { nome: string; valor: number }

interface AprovacaoOrcamentoProps {
  osId: string
  cliente: string
  veiculo: string
  placa: string
  servico: string
  valor: string
  prazo: string
  clientePhone: string
  servicosDetalhados?: Servico[]
  onClose: () => void
}

export default function AprovacaoOrcamento({ osId, cliente, veiculo, placa, servico, valor, prazo, clientePhone, servicosDetalhados, onClose }: AprovacaoOrcamentoProps) {
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentAt, setSentAt] = useState<string | null>(null)
  const [token] = useState(() => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15))

  const servicosArr: Servico[] = servicosDetalhados || [
    { nome: servico, valor: parseFloat(valor.replace(/[^0-9,]/g, '').replace(',', '.')) }
  ]
  const valorNumerico = parseFloat(valor.replace(/[^0-9,]/g, '').replace(',', '.')) || 0

  const params = new URLSearchParams({
    os: osId,
    cliente,
    veiculo,
    servicos: JSON.stringify(servicosArr),
    total: valorNumerico.toFixed(2).replace('.', ','),
    prazo,
    data: new Date().toLocaleDateString('pt-BR'),
    token
  })

  const approvalLink = `${APPROVAL_BASE_URL}?${params.toString()}`

  const whatsappMessage = encodeURIComponent(
    `🔵 77CAR SERVICE — ORÇAMENTO PARA APROVAÇÃO 🔵\n\n` +
    `📋 OS: ${osId}\n` +
    `👤 Cliente: ${cliente}\n` +
    `🚗 Veículo: ${veiculo}\n` +
    `📝 Serviço: ${servico}\n` +
    `💰 Valor: ${valor}\n` +
    `⏱️ Prazo: ${prazo}\n\n` +
    `👉 Para APROVAR ou REJEITAR, acesse o link abaixo:\n` +
    `${approvalLink}\n\n` +
    `⚡ Basta 1 clique! Resposta rápida agiliza seu serviço.\n\n` +
    `🔵 #77CarService #Premium`
  )

  const followupMessage = encodeURIComponent(
    `🔄 77CAR SERVICE — LEMBRETE DE APROVAÇÃO 🔄\n\n` +
    `📋 OS: ${osId}\n` +
    `👤 ${cliente}\n` +
    `🚗 ${veiculo}\n\n` +
    `⏰ Nosso orçamento enviado há algumas horas ainda aguarda sua aprovação.\n\n` +
    `👉 Para APROVAR ou REJEITAR, acesse:\n` +
    `${approvalLink}\n\n` +
    `💡 Resposta rápida = serviço mais rápido!\n\n` +
    `🔵 #77CarService`
  )

  const whatsappLink = `https://wa.me/55${clientePhone.replace(/\D/g, '')}?text=${whatsappMessage}`
  const followupLink = `https://wa.me/55${clientePhone.replace(/\D/g, '')}?text=${followupMessage}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(approvalLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveToStorage = (status: string) => {
    // Save to localStorage
    const aprovacoes = JSON.parse(localStorage.getItem('77car_aprovacoes') || '[]')
    const existingIdx = aprovacoes.findIndex((a: any) => a.token === token)
    const now = new Date().toISOString()
    
    const record = {
      token,
      osId,
      cliente,
      veiculo,
      placa,
      servico,
      valor,
      prazo,
      status,
      link: approvalLink,
      clientePhone,
      createdAt: existingIdx >= 0 ? aprovacoes[existingIdx].createdAt : now,
      updatedAt: now,
      sentAt: sentAt || now,
      followupSent: false
    }
    
    if (existingIdx >= 0) {
      aprovacoes[existingIdx] = record
    } else {
      aprovacoes.push(record)
    }
    localStorage.setItem('77car_aprovacoes', JSON.stringify(aprovacoes))
  }

  const handleSendWhatsApp = () => {
    const now = new Date().toISOString()
    setSentAt(now)
    setSent(true)
    
    saveToStorage('pendente')

    // Save to Supabase
    fetch('https://pszaavkjymlciemaoxdr.supabase.co/rest/v1/orcamentos_aprovacao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzemFhdmtqeW1sY2llbWFveGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjUyMjQsImV4cCI6MjA2MTY0MTIyNH0.YDMrKfVb8T0InQYhHqBeWkNWrDvJgFGTPg7SJdQhX_I',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        token,
        os_id: osId,
        cliente_nome: cliente,
        cliente_telefone: clientePhone,
        veiculo,
        servicos: JSON.stringify(servicosArr),
        valor_total: valorNumerico,
        prazo,
        status: 'pendente',
        created_at: now,
        ultimo_envio: now,
        followup_enviado: false
      })
    }).catch(() => {})

    window.open(whatsappLink, '_blank')
  }

  const handleSendFollowup = () => {
    const now = new Date().toISOString()
    
    // Update localStorage
    const aprovacoes = JSON.parse(localStorage.getItem('77car_aprovacoes') || '[]')
    const idx = aprovacoes.findIndex((a: any) => a.token === token)
    if (idx >= 0) {
      aprovacoes[idx].followupSent = true
      aprovacoes[idx].updatedAt = now
      localStorage.setItem('77car_aprovacoes', JSON.stringify(aprovacoes))
    }

    // Update Supabase
    fetch(`https://pszaavkjymlciemaoxdr.supabase.co/rest/v1/orcamentos_aprovacao?token=eq.${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzemFhdmtqeW1sY2llbWFveGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjUyMjQsImV4cCI6MjA2MTY0MTIyNH0.YDMrKfVb8T0InQYhHqBeWkNWrDvJgFGTPg7SJdQhX_I',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        followup_enviado: true,
        ultimo_envio: now,
        updated_at: now
      })
    }).catch(() => {})

    window.open(followupLink, '_blank')
  }

  // Check if 6h passed since last send
  const canSendFollowup = sentAt && (Date.now() - new Date(sentAt).getTime()) > 6 * 60 * 60 * 1000

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-green-900/20 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-600/20 border border-green-500/30 flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black italic uppercase">Solicitar Aprovação</h2>
                  <p className="text-xs text-slate-500">{osId} — {cliente}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Resumo */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Resumo do Orçamento</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  {sent ? 'Enviado ✓' : 'Pendente'}
                </span>
              </div>
              <p className="text-white font-bold">{servico}</p>
              <p className="text-sm text-slate-400">{veiculo} • {placa}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                <span className="text-slate-400 text-sm">Valor Total</span>
                <span className="text-xl font-black text-green-400">{valor}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Prazo: {prazo}</p>
            </div>

            {/* Link Gerado */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Link className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Link de Aprovação</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-blue-300 bg-black/30 rounded-lg px-3 py-2 truncate border border-slate-700/30 font-mono">{approvalLink}</code>
                <button onClick={copyToClipboard} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition border border-blue-500/30 flex-shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
                </button>
              </div>
            </div>

            {/* Follow-up Section */}
            {sent && (
              <div className="bg-amber-900/10 rounded-xl p-4 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Acompanhamento</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Enviado {sentAt ? new Date(sentAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}.
                  {canSendFollowup 
                    ? ' Já se passaram 6 horas sem resposta.'
                    : ' O follow-up estará disponível 6 horas após o envio.'}
                </p>
                <button
                  onClick={handleSendFollowup}
                  disabled={!canSendFollowup}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-4 h-4" />
                  {canSendFollowup ? 'REENVIAR WHATSAPP (FOLLOW-UP)' : 'AGUARDE 6H PARA FOLLOW-UP'}
                </button>
              </div>
            )}

            {/* Preview Toggle */}
            <button onClick={() => setShowPreview(!showPreview)} className="w-full flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/20 hover:border-slate-600/50 transition text-sm">
              <span className="flex items-center gap-2 text-slate-300">
                <Eye className="w-4 h-4 text-amber-400" />
                Visualizar como cliente
              </span>
              <span className="text-xs text-slate-500">{showPreview ? 'Ocultar ▲' : 'Mostrar ▼'}</span>
            </button>

            {/* Preview iframe */}
            {showPreview && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden rounded-xl border-2 border-blue-500/30">
                <div className="bg-slate-950 p-2 flex items-center gap-2 text-[10px] text-slate-500 border-b border-slate-800">
                  <Smartphone className="w-3 h-3" />
                  <span>Pré-visualização Mobile</span>
                </div>
                <iframe src={approvalLink} className="w-full h-[500px] bg-[#0a0f1a]" title="Preview" />
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 space-y-3">
            {!sent ? (
              <button
                onClick={handleSendWhatsApp}
                disabled={!clientePhone}
                className="w-full btn-primary py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                ENVIAR WHATSAPP PARA APROVAÇÃO
              </button>
            ) : (
              <div className="text-center">
                <p className="text-green-400 text-sm font-bold flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Orçamento enviado!
                </p>
                <p className="text-xs text-slate-500 mt-1">Acompanhe o status em "✅ Aprovações" no menu lateral</p>
              </div>
            )}
            {!clientePhone && (
              <p className="text-amber-400 text-xs text-center">⚠️ Cadastre o telefone do cliente para enviar WhatsApp</p>
            )}
            <p className="text-[10px] text-slate-600 text-center">
              O cliente receberá um link para aprovar ou rejeitar o orçamento com 1 clique.<br />
              Sem resposta em 6h → botão de follow-up liberado.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

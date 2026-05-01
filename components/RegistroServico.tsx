'use client'
import { motion } from 'framer-motion'
import { Camera, ExternalLink, Smartphone } from 'lucide-react'

const PWA_URL = 'https://jarvis-magic-napkin-0srak.vercel.app'

interface OSData {
  id: string
  cliente: string
  veiculo: string
  placa: string
  servico: string
  valor: string
  prazo: string
  whatsapp?: string
}

function abrirRegistroApp(os: OSData) {
  const osJson = encodeURIComponent(JSON.stringify({ ...os, whatsapp: os.whatsapp || '5531999999999' }))
  window.open(`${PWA_URL}?os=${osJson}`, '_blank')
}

export default function RegistroServico() {
  const osMock: OSData[] = [
    { id: '#077', cliente: 'Carlos Eduardo Silva', veiculo: 'BMW X1 2022', placa: 'ABC-1234', servico: 'Revisão 40.000km completa', valor: 'R$ 2.350', prazo: '02/05/2026' },
    { id: '#076', cliente: 'Ana Paula Costa', veiculo: 'VW T-Cross 2023', placa: 'DEF-5678', servico: 'Troca de pastilhas dianteiras', valor: 'R$ 890', prazo: '28/04/2026' },
    { id: '#075', cliente: 'Roberto Lima', veiculo: 'Jeep Compass 2021', placa: 'GHI-9012', servico: 'Diagnóstico elétrico completo', valor: 'R$ 1.670', prazo: '03/05/2026' },
    { id: '#074', cliente: 'Fernanda Souza', veiculo: 'Honda Civic 2020', placa: 'JKL-3456', servico: 'Alinhamento + Balanceamento', valor: 'R$ 320', prazo: '26/04/2026' },
    { id: '#073', cliente: 'Marcos Vinicius', veiculo: 'Toyota Corolla 2024', placa: 'MNO-7890', servico: 'Troca de óleo e filtros', valor: 'R$ 450', prazo: '25/04/2026' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">Registro de <span className="text-blue-500">Serviço</span></h1>
          <p className="text-slate-500 text-sm mt-1">Capture fotos e vídeos e envie direto ao WhatsApp do cliente</p>
        </div>
        <button onClick={() => window.open(PWA_URL, '_blank')} className="bg-gradient-to-r from-tech-blue to-blue-600 hover:from-tech-blue hover:to-blue-500 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-tech-blue/20">
          <Smartphone className="w-4 h-4" /> Abrir App no Celular
        </button>
      </motion.div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-tech-blue/10"><Camera className="w-6 h-6 text-blue-400" /></div>
          <div>
            <h2 className="font-bold text-lg">📸 Como funciona</h2>
            <p className="text-slate-400 text-sm">3 passos simples para manter seu cliente atualizado</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
            <div className="text-3xl mb-2">1️⃣</div>
            <p className="font-bold text-sm">Selecione a O.S.</p>
            <p className="text-xs text-slate-500 mt-1">Escolha o serviço em andamento</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
            <div className="text-3xl mb-2">2️⃣</div>
            <p className="font-bold text-sm">Capture Fotos/Vídeos</p>
            <p className="text-xs text-slate-500 mt-1">Use a câmera do celular no app</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
            <div className="text-3xl mb-2">3️⃣</div>
            <p className="font-bold text-sm">Envie via WhatsApp</p>
            <p className="text-xs text-slate-500 mt-1">Compartilhe direto com o cliente</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">📋 Selecione uma O.S. para registrar</h2>
        {osMock.map((os, i) => (
          <motion.div key={os.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-77 hover:border-tech-blue/50 cursor-pointer group" onClick={() => abrirRegistroApp(os)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-tech-blue/10"><Camera className="w-5 h-5 text-blue-400 group-hover:text-tech-neon transition" /></div>
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="font-mono text-blue-400 font-bold text-sm">{os.id}</span><span className="text-slate-400 text-sm">{os.cliente}</span></div>
                  <p className="text-slate-500 text-xs">{os.veiculo} • {os.servico}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right"><p className="text-lg font-black text-green-400">{os.valor}</p><p className="text-[10px] text-slate-500">{os.prazo}</p></div>
                <button className="bg-tech-blue/20 hover:bg-tech-blue/40 text-blue-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition">
                  <Camera className="w-3.5 h-3.5" /> Registrar
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-slate-600">
          💡 <span className="font-bold text-slate-500">Dica:</span> Instale este app na tela inicial do celular para acesso rápido como um aplicativo nativo.
        </p>
      </div>
    </div>
  )
}

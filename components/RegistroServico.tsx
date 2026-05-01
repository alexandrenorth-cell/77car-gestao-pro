'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Video, Send, Trash2, X, Check, ChevronRight, RefreshCw, Play, Square, Smartphone } from 'lucide-react'

// ─── Tipos ───
interface OSItem {
  id: string; cliente: string; veiculo: string; placa: string
  servico: string; valor: string; prazo: string; tecnico: string; whatsapp: string
}

interface MidiaItem {
  id: string; type: 'photo' | 'video'; dataUrl: string; timestamp: number; selected: boolean
}

// ─── Mock ───
const osList: OSItem[] = [
  { id: '#077', cliente: 'Carlos Eduardo Silva', veiculo: 'BMW X1 2022', placa: 'ABC-1234', servico: 'Revisão 40.000km completa', valor: 'R$ 2.350', prazo: '02/05/2026', tecnico: 'Anderson Alves', whatsapp: '5531999999999' },
  { id: '#076', cliente: 'Ana Paula Costa', veiculo: 'VW T-Cross 2023', placa: 'DEF-5678', servico: 'Troca de pastilhas dianteiras', valor: 'R$ 890', prazo: '28/04/2026', tecnico: 'Anderson Alves', whatsapp: '5531999999999' },
  { id: '#075', cliente: 'Roberto Lima', veiculo: 'Jeep Compass 2021', placa: 'GHI-9012', servico: 'Diagnóstico elétrico completo', valor: 'R$ 1.670', prazo: '03/05/2026', tecnico: 'Anderson Alves', whatsapp: '5531999999999' },
  { id: '#074', cliente: 'Fernanda Souza', veiculo: 'Honda Civic 2020', placa: 'JKL-3456', servico: 'Alinhamento + Balanceamento', valor: 'R$ 320', prazo: '26/04/2026', tecnico: 'Anderson Alves', whatsapp: '5531999999999' },
  { id: '#073', cliente: 'Marcos Vinicius', veiculo: 'Toyota Corolla 2024', placa: 'MNO-7890', servico: 'Troca de óleo e filtros', valor: 'R$ 450', prazo: '25/04/2026', tecnico: 'Anderson Alves', whatsapp: '5531999999999' },
]

export default function RegistroServico() {
  const [osSelecionada, setOsSelecionada] = useState<OSItem | null>(null)
  const [mode, setMode] = useState<'foto' | 'video'>('foto')
  const [mediaItems, setMediaItems] = useState<MidiaItem[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [whatsAppOptions, setWhatsAppOptions] = useState({
    fotos: true, videos: true, descricao: true, valor: true, placa: true
  })
  const [customMsg, setCustomMsg] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setCameraReady(true)
    } catch (e: any) {
      setCameraError('Permita o acesso à câmera nas configurações do navegador.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop()
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    setCameraReady(false); setIsRecording(false); setRecordingTime(0)
  }, [])

  useEffect(() => { return () => { stopCamera() } }, [])

  const capturePhoto = () => {
    const video = videoRef.current; const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth || 1280; canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setMediaItems(prev => [...prev, { id: `photo-${Date.now()}`, type: 'photo', dataUrl, timestamp: Date.now(), selected: true }])
  }

  const startRecording = () => {
    if (!streamRef.current) return
    chunksRef.current = []
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm'
    const recorder = new MediaRecorder(streamRef.current, { mimeType })
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const reader = new FileReader()
      reader.onload = () => setMediaItems(prev => [...prev, { id: `video-${Date.now()}`, type: 'video', dataUrl: reader.result as string, timestamp: Date.now(), selected: true }])
      reader.readAsDataURL(blob)
    }
    recorder.start(200); mediaRecorderRef.current = recorder; setIsRecording(true); setRecordingTime(0)
    let s = 0
    timerRef.current = setInterval(() => { s++; setRecordingTime(s); if (s >= 30) stopRecording() }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false); setRecordingTime(0)
  }

  const toggleSelect = (id: string) => setMediaItems(prev => prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m))
  const removeMedia = (id: string) => setMediaItems(prev => prev.filter(m => m.id !== id))
  const clearAll = () => { if (confirm('Limpar todas as mídias?')) setMediaItems([]) }

  const buildMessage = () => {
    if (!osSelecionada) return ''
    let msg = '*🔵 77 CAR SERVICE 🔵*\n━━━━━━━━━━━━━━━\n'
    msg += `📋 *${osSelecionada.id}*\n`
    if (whatsAppOptions.descricao) msg += `\n🔧 *Serviço:* ${osSelecionada.servico}\n🚗 *Veículo:* ${osSelecionada.veiculo}\n`
    if (whatsAppOptions.placa) msg += `🔢 *Placa:* ${osSelecionada.placa}\n`
    if (whatsAppOptions.valor) msg += `💰 *Valor:* ${osSelecionada.valor}\n`
    const selPhotos = mediaItems.filter(m => m.type === 'photo' && m.selected)
    const selVideos = mediaItems.filter(m => m.type === 'video' && m.selected)
    if ((whatsAppOptions.fotos && selPhotos.length) || (whatsAppOptions.videos && selVideos.length)) {
      msg += '\n📸 *Mídias do serviço:*\n'
      if (whatsAppOptions.fotos && selPhotos.length) msg += `   📷 ${selPhotos.length} foto(s)\n`
      if (whatsAppOptions.videos && selVideos.length) msg += `   🎥 ${selVideos.length} vídeo(s)\n`
      msg += '   ⚠️ _Mídias enviadas separadamente_\n'
    }
    if (customMsg.trim()) msg += `\n💬 ${customMsg.trim()}\n`
    msg += '\n━━━━━━━━━━━━━━━\n🙏 Obrigado pela confiança!\n🏍️ _77 Car Service_'
    return msg
  }

  const sendWhatsApp = () => {
    if (!osSelecionada) return
    window.open(`https://wa.me/${osSelecionada.whatsapp}?text=${encodeURIComponent(buildMessage())}`, '_blank')
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter">📸 Registrar <span className="text-blue-500">Serviço</span></h1>
          <p className="text-slate-500 text-sm mt-1">Capture fotos e vídeos do serviço e envie direto ao WhatsApp do cliente</p>
        </div>
        {osSelecionada && mediaItems.length > 0 && (
          <button onClick={sendWhatsApp} className="btn-wpp flex items-center gap-2 text-xs px-6 py-3">
            <Send className="w-4 h-4" /> Enviar ao Cliente
          </button>
        )}
      </motion.div>

      {!osSelecionada ? (
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600/10"><Smartphone className="w-6 h-6 text-blue-400" /></div>
              <div>
                <h2 className="font-bold text-lg">Como funciona</h2>
                <p className="text-slate-400 text-sm">3 passos: selecione a O.S. → capture as mídias → envie ao cliente</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { num: '1️⃣', title: 'Selecione a O.S.', desc: 'Escolha o serviço em andamento' },
                { num: '2️⃣', title: 'Capture Fotos/Vídeos', desc: 'Use a câmera integrada no app' },
                { num: '3️⃣', title: 'Envie via WhatsApp', desc: 'Compartilhe direto com o cliente' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                  <div className="text-3xl mb-2">{s.num}</div>
                  <p className="font-bold text-sm">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mt-6">📋 Selecione uma O.S.</h2>
          <div className="space-y-3">
            {osList.map((os, i) => (
              <motion.div key={os.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setOsSelecionada(os)} className="card-77 hover:border-blue-600/50 cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-600/10 group-hover:bg-blue-600/20 transition">
                      <Camera className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-blue-400 font-bold text-sm">{os.id}</span>
                        <span className="text-slate-400 text-sm">{os.cliente}</span>
                      </div>
                      <p className="text-slate-500 text-xs">{os.veiculo} • {os.servico}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-black text-green-400">{os.valor}</p>
                      <p className="text-[10px] text-slate-500">{os.prazo}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card-77 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-blue-400 font-bold">{osSelecionada.id}</span>
                <span className="badge-blue">Registrando</span>
              </div>
              <p className="font-bold text-lg">{osSelecionada.cliente}</p>
              <p className="text-slate-400 text-sm">{osSelecionada.veiculo} • {osSelecionada.servico}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-lg font-black text-green-400">{osSelecionada.valor}</p>
                <p className="text-[10px] text-slate-500">{osSelecionada.prazo}</p>
              </div>
              <button onClick={() => { setOsSelecionada(null); setMediaItems([]); stopCamera() }}
                className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="card-77 space-y-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">📸 Capturar Mídia</p>
            <div className="flex gap-2">
              <button onClick={() => setMode('foto')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${mode === 'foto' ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400'}`}>
                <Camera className="w-4 h-4" /> Foto
              </button>
              <button onClick={() => setMode('video')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${mode === 'video' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-slate-800 text-slate-400'}`}>
                <Video className="w-4 h-4" /> Vídeo
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black" style={{ minHeight: 280 }}>
              {!cameraReady ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {cameraError ? (
                    <>
                      <X className="w-10 h-10 text-red-400 mb-1" />
                      <p className="text-red-400 text-sm font-bold">{cameraError}</p>
                      <button onClick={startCamera} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5" /> Tentar Novamente
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl">📸</div>
                      <button onClick={startCamera} className="btn-primary text-xs px-6 py-3 flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Ligar Câmera
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full" style={{ minHeight: 280, objectFit: 'cover' }} />
              )}
              <canvas ref={canvasRef} className="hidden" />
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 backdrop-blur px-3 py-1.5 rounded-full animate-pulse">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  <span className="text-xs font-bold">{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            {cameraReady && (
              mode === 'foto' ? (
                <button onClick={capturePhoto} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-sm active:scale-95">
                  <Camera className="w-4 h-4" /> Tirar Foto
                </button>
              ) : (
                <button onClick={isRecording ? stopRecording : startRecording}
                  className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 ${isRecording ? 'bg-slate-700 border border-red-500/50 text-red-400' : 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20'}`}>
                  {isRecording ? <><Square className="w-4 h-4 fill-red-400 text-red-400" /> Parar Gravação</> : <><Play className="w-4 h-4 fill-white text-white" /> Gravar Vídeo</>}
                  {isRecording && <span className="text-xs opacity-70">(máx 30s)</span>}
                </button>
              )
            )}
          </div>

          <div className="card-77 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">🖼️ Galeria</p>
              <span className="text-[10px] text-slate-500 font-bold">
                {mediaItems.filter(m => m.type === 'photo').length > 0 && `📷 ${mediaItems.filter(m => m.type === 'photo').length} `}
                {mediaItems.filter(m => m.type === 'video').length > 0 && `🎥 ${mediaItems.filter(m => m.type === 'video').length}`}
                {mediaItems.length === 0 && 'Vazio'}
              </span>
            </div>
            {mediaItems.length === 0 ? (
              <div className="text-center py-10 text-slate-600 text-sm">Nenhuma mídia capturada ainda</div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {mediaItems.map(item => (
                  <div key={item.id} className="relative group cursor-pointer" onClick={() => toggleSelect(item.id)}>
                    {item.type === 'photo' ? (
                      <img src={item.dataUrl} className={`w-full aspect-square object-cover rounded-xl border-2 transition-all ${item.selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60'}`} />
                    ) : (
                      <video src={item.dataUrl} className={`w-full aspect-square object-cover rounded-xl border-2 transition-all ${item.selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60'}`} muted />
                    )}
                    <div className={`absolute top-1.5 left-1.5 text-[10px] font-black px-1.5 py-0.5 rounded ${item.type === 'photo' ? 'bg-blue-600' : 'bg-red-600'}`}>{item.type === 'photo' ? '📷' : '🎥'}</div>
                    {item.selected && <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    <button onClick={(e) => { e.stopPropagation(); removeMedia(item.id) }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
            {mediaItems.length > 0 && (
              <button onClick={clearAll} className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition flex items-center justify-center gap-2">
                <Trash2 className="w-3 h-3" /> Limpar Tudo
              </button>
            )}
          </div>

          <div className="card-77 space-y-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">📋 O que vai na mensagem?</p>
            <div className="space-y-2">
              {[
                { key: 'descricao', label: '📝 Descrição do Serviço' },
                { key: 'valor', label: '💰 Valor (Peças + Mão de Obra)' },
                { key: 'placa', label: '🔢 Placa do Veículo' },
                { key: 'fotos', label: '📷 Menção às Fotos' },
                { key: 'videos', label: '🎥 Menção aos Vídeos' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition">
                  <input type="checkbox" checked={whatsAppOptions[opt.key as keyof typeof whatsAppOptions]}
                    onChange={(e) => setWhatsAppOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                    className="w-4 h-4 rounded accent-blue-600" />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            <textarea value={customMsg} onChange={(e) => setCustomMsg(e.target.value)} rows={2}
              placeholder="Mensagem adicional (opcional)..." className="input-77 text-sm resize-none" />
          </div>

          <div className="card-77 space-y-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">💬 Pré-visualização</p>
            <div className="bg-[#202c33] rounded-lg p-3 text-sm text-white/90 whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {buildMessage()}
            </div>
          </div>

          <button onClick={sendWhatsApp} disabled={mediaItems.length === 0}
            className="btn-wpp w-full py-4 flex items-center justify-center gap-2 text-base font-black disabled:opacity-40 disabled:cursor-not-allowed active:scale-95">
            <Send className="w-5 h-5" /> 📱 ENVIAR AO CLIENTE
          </button>
        </div>
      )}

      <div className="text-center pt-2">
        <p className="text-xs text-slate-600">
          💡 <span className="font-bold text-slate-500">Dica:</span> As mídias são processadas localmente. Após o envio, o cliente recebe a mensagem com todos os detalhes do serviço.
        </p>
      </div>
    </div>
  )
}

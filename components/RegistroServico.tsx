'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Video, Send, Trash2, X, Check, Phone, MessageCircle } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'photo' | 'video'
  dataUrl: string
  timestamp: number
  selected: boolean
}

interface RegistroServicoProps {
  osId: string
  cliente: string
  veiculo: string
  placa: string
  servico: string
  valor: string
  tecnico: string
  clientePhone?: string
  onClose: () => void
}

export default function RegistroServico({ osId, cliente, veiculo, placa, servico, valor, tecnico, clientePhone, onClose }: RegistroServicoProps) {
  const [mode, setMode] = useState<'foto' | 'video'>('foto')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showWhatsAppConfig, setShowWhatsAppConfig] = useState(false)
  const [whatsAppOptions, setWhatsAppOptions] = useState({
    fotos: true,
    videos: true,
    descricao: true,
    valor: true,
  })
  const [customMsg, setCustomMsg] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(clientePhone || '')
  const [cameraReady, setCameraReady] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraReady(true)
    } catch (e: any) {
      console.error('Camera error:', e)
      alert('Erro ao acessar câmera. Permita o acesso nas configurações do navegador.')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startCamera, stopCamera])

  // Capture photo
  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth || 1920
    canvas.height = video.videoHeight || 1080
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)

    setMediaItems(prev => [...prev, {
      id: `photo-${Date.now()}`,
      type: 'photo',
      dataUrl,
      timestamp: Date.now(),
      selected: true
    }])

    // Flash effect
    if (video) {
      video.style.opacity = '0.4'
      setTimeout(() => { if (video) video.style.opacity = '1' }, 150)
    }
  }

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
    if (!streamRef.current) return
    chunksRef.current = []
    const recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9,opus' })
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const reader = new FileReader()
      reader.onload = () => {
        setMediaItems(prev => [...prev, {
          id: `video-${Date.now()}`,
          type: 'video',
          dataUrl: reader.result as string,
          timestamp: Date.now(),
          selected: true
        }])
      }
      reader.readAsDataURL(blob)
    }
    recorder.start()
    mediaRecorderRef.current = recorder
    setIsRecording(true)
    setRecordingTime(0)
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 29) {
          stopRecording()
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setRecordingTime(0)
  }

  // Toggle media selection
  const toggleSelect = (id: string) => {
    setMediaItems(prev => prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m))
  }

  // Remove media
  const removeMedia = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id))
  }

  // Clear all
  const clearAll = () => {
    if (mediaItems.length > 0 && confirm('Limpar todas as mídias capturadas?')) {
      setMediaItems([])
    }
  }

  // Build WhatsApp message
  const buildWhatsAppMessage = () => {
    let msg = '*🔵 77 CAR SERVICE 🔵*\n'
    msg += '━━━━━━━━━━━━━━━\n'
    msg += `📋 *${osId}*\n`

    if (whatsAppOptions.descricao) {
      msg += `\n🔧 *Serviço:* ${servico}\n`
      msg += `🚗 *Veículo:* ${veiculo} • ${placa}\n`
    }
    if (whatsAppOptions.valor) {
      msg += `💰 *Valor:* ${valor}\n`
    }

    const selectedPhotos = mediaItems.filter(m => m.type === 'photo' && m.selected)
    const selectedVideos = mediaItems.filter(m => m.type === 'video' && m.selected)

    if ((whatsAppOptions.fotos && selectedPhotos.length > 0) || (whatsAppOptions.videos && selectedVideos.length > 0)) {
      msg += '\n📸 *Mídias do serviço:*\n'
      if (whatsAppOptions.fotos && selectedPhotos.length > 0) msg += `   📷 ${selectedPhotos.length} foto(s)\n`
      if (whatsAppOptions.videos && selectedVideos.length > 0) msg += `   🎥 ${selectedVideos.length} vídeo(s)\n`
      msg += '   ⚠️ _As mídias serão enviadas separadamente_\n'
    }

    if (customMsg.trim()) msg += `\n💬 ${customMsg.trim()}\n`

    msg += '\n━━━━━━━━━━━━━━━\n'
    msg += '🙏 Obrigado pela confiança!\n'
    msg += `🏍️ _${tecnico} | 77 Car Service_`

    return msg
  }

  // Send to WhatsApp
  const sendWhatsApp = () => {
    const phone = phoneNumber.replace(/\D/g, '')
    if (!phone || phone.length < 10) {
      alert('Número de telefone do cliente inválido. Preencha com DDD + número.')
      return
    }
    const msg = encodeURIComponent(buildWhatsAppMessage())
    window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank')
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const photoCount = mediaItems.filter(m => m.type === 'photo').length
  const videoCount = mediaItems.filter(m => m.type === 'video').length

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-xl overflow-y-auto"
      >
        {/* Header */}
        <div className="glass sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center font-black text-sm italic">77</div>
            <div>
              <p className="font-black text-sm uppercase italic tracking-tight">Registro de Serviço</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{osId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-w-lg mx-auto pb-24">
          {/* Client Info */}
          <div className="card-77 space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cliente</p>
            <p className="font-bold text-lg">{cliente}</p>
            <p className="text-sm text-slate-400">{veiculo} • {placa}</p>
            <p className="text-xs text-slate-500">{servico}</p>
            <div className="flex gap-4 mt-2 pt-2 border-t border-slate-800">
              <div><p className="text-[10px] text-slate-500 uppercase">Valor</p><p className="font-black text-green-400">{valor}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase">Técnico</p><p className="font-bold text-white text-sm">{tecnico}</p></div>
            </div>
          </div>

          {/* Camera */}
          <div className="card-77 space-y-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">📸 Capturar Mídia</p>

            {/* Mode Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode('foto')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  mode === 'foto' ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Camera className="w-4 h-4" /> Foto
              </button>
              <button
                onClick={() => setMode('video')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  mode === 'video' ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Video className="w-4 h-4" /> Vídeo
              </button>
            </div>

            {/* Viewfinder */}
            <div className="relative rounded-xl overflow-hidden bg-black" style={{ minHeight: 260 }}>
              <video ref={videoRef} autoPlay playsInline muted className="w-full" style={{ minHeight: 260, objectFit: 'cover' }} />
              <canvas ref={canvasRef} className="hidden" />
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 backdrop-blur px-3 py-1.5 rounded-full">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold">{formatTime(recordingTime)}</span>
                </div>
              )}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Capture Buttons */}
            {mode === 'foto' ? (
              <button onClick={capturePhoto} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-sm active:scale-95">
                <Camera className="w-4 h-4" /> Tirar Foto
              </button>
            ) : (
              <button
                onClick={toggleRecording}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  isRecording
                    ? 'bg-slate-700 border border-red-500/50 text-red-400'
                    : 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20 hover:from-red-500 hover:to-red-400'
                }`}
              >
                {isRecording ? (
                  <>
                    <div className="w-3 h-3 bg-red-400 rounded-sm" /> Parar Gravação
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-white rounded-full" /> Gravar Vídeo
                  </>
                )}
                {isRecording && <span className="text-xs opacity-70">(máx 30s)</span>}
              </button>
            )}
          </div>

          {/* Gallery */}
          <div className="card-77 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">🖼️ Galeria</p>
              <span className="text-[10px] text-slate-500 font-bold">
                {photoCount > 0 && `📷 ${photoCount}`} {videoCount > 0 && `🎥 ${videoCount}`}
                {photoCount === 0 && videoCount === 0 && 'Vazio'}
              </span>
            </div>

            {mediaItems.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-xs">Nenhuma mídia capturada ainda</div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {mediaItems.map(item => (
                  <div key={item.id} className="relative group cursor-pointer" onClick={() => toggleSelect(item.id)}>
                    {item.type === 'photo' ? (
                      <img
                        src={item.dataUrl}
                        className={`w-full aspect-square object-cover rounded-xl border-2 transition-all ${
                          item.selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60'
                        }`}
                      />
                    ) : (
                      <video
                        src={item.dataUrl}
                        className={`w-full aspect-square object-cover rounded-xl border-2 transition-all ${
                          item.selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60'
                        }`}
                        muted
                      />
                    )}
                    <div className={`absolute top-1.5 left-1.5 text-[10px] font-black px-1.5 py-0.5 rounded ${
                      item.type === 'photo' ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                      {item.type === 'photo' ? '📷' : '🎥'}
                    </div>
                    {item.selected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeMedia(item.id) }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
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

          {/* WhatsApp Config */}
          <div className="card-77 space-y-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">📋 Configurar Envio</p>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">WhatsApp do Cliente</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(31) 99999-9999"
                className="input-77 text-sm"
              />
            </div>

            <div className="space-y-2">
              {[
                { key: 'fotos', label: '📷 Fotos capturadas', icon: '📷' },
                { key: 'videos', label: '🎥 Vídeos capturados', icon: '🎥' },
                { key: 'descricao', label: '📝 Descrição do serviço', icon: '📝' },
                { key: 'valor', label: '💰 Valor (Peças + Mão de Obra)', icon: '💰' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition">
                  <input
                    type="checkbox"
                    checked={whatsAppOptions[opt.key as keyof typeof whatsAppOptions]}
                    onChange={(e) => setWhatsAppOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>

            <textarea
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              rows={2}
              placeholder="Mensagem adicional (opcional)..."
              className="input-77 text-sm resize-none"
            />
          </div>

          {/* Preview */}
          <div className="card-77 space-y-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">💬 Pré-visualização</p>
            <div className="bg-[#202c33] rounded-lg p-3 text-sm text-white/90 whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {buildWhatsAppMessage()}
            </div>
          </div>
        </div>

        {/* Fixed Bottom: Send Button */}
        <div className="glass sticky bottom-0 z-10 p-4">
          <button
            onClick={sendWhatsApp}
            disabled={mediaItems.length === 0}
            className="btn-wpp w-full py-4 flex items-center justify-center gap-2 text-base font-black disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-5 h-5" />
            📱 ENVIAR AO CLIENTE
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
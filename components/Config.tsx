'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Bell, Palette, Database, Wrench } from 'lucide-react'

const settingsSections = [
  { id: 'geral', label: 'Geral', icon: Settings },
  { id: 'oficina', label: 'Oficina', icon: Wrench },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'dados', label: 'Dados', icon: Database },
]

export default function Config() {
  const [activeSection, setActiveSection] = useState('geral')

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter"><span className="text-blue-500">Configurações</span> do Sistema</h1><p className="text-slate-500 text-sm mt-1">Personalize o 77 Gestão Pro para sua oficina</p></motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-1">{settingsSections.map(s => { const Icon = s.icon; const isActive = activeSection === s.id; return (<button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}><Icon className="w-4 h-4" />{s.label}</button>) })}</div>
        <div className="lg:col-span-3 card-77 space-y-6">
          {activeSection === 'geral' && (<><h2 className="font-black text-lg uppercase italic">Informações da Oficina</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Nome da Oficina</label><input type="text" defaultValue="77 Car Service" className="input-77" /></div><div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">CNPJ</label><input type="text" defaultValue="XX.XXX.XXX/0001-XX" className="input-77" /></div><div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Telefone</label><input type="text" defaultValue="(31) 97357-5782" className="input-77" /></div><div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">E-mail</label><input type="email" defaultValue="contato@77carservice.com.br" className="input-77" /></div><div className="sm:col-span-2"><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Endereço Completo</label><input type="text" defaultValue="Rua José Júlio de Araújo, 160 - Belo Horizonte/MG - CEP: 30610-510" className="input-77" /></div></div><div className="flex justify-end"><button className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Salvar Alterações</button></div></>)}
          {activeSection === 'oficina' && (<><h2 className="font-black text-lg uppercase italic">Configurações Técnicas</h2><div className="space-y-4"><div className="glass rounded-xl p-4 flex items-center justify-between"><div><p className="font-bold">Horário de Funcionamento</p><p className="text-sm text-slate-400">Seg-Sex: 08h às 18h</p></div><button className="text-blue-400 text-sm font-bold">Editar</button></div><div className="glass rounded-xl p-4 flex items-center justify-between"><div><p className="font-bold">Tempo Médio por Serviço</p><p className="text-sm text-slate-400">Revisão: 2h | Diagnóstico: 1h | Freios: 1.5h</p></div><button className="text-blue-400 text-sm font-bold">Editar</button></div><div className="glass rounded-xl p-4 flex items-center justify-between"><div><p className="font-bold">Margem de Lucro</p><p className="text-sm text-slate-400">Peças: 30% | Mão de obra: 100%</p></div><button className="text-blue-400 text-sm font-bold">Editar</button></div><div className="glass rounded-xl p-4 flex items-center justify-between"><div><p className="font-bold">Garantia Padrão</p><p className="text-sm text-slate-400">90 dias para serviços gerais</p></div><button className="text-blue-400 text-sm font-bold">Editar</button></div></div></>)}
          {activeSection === 'notificacoes' && (<><h2 className="font-black text-lg uppercase italic">Preferências de Notificação</h2><div className="space-y-3">{[{ label: 'Lembrete de O.S. pendente', desc: 'Notificar quando uma O.S. estiver próxima do prazo' },{ label: 'Alerta de Estoque Baixo', desc: 'Notificar quando peças atingirem o estoque mínimo' },{ label: 'Aniversário de Cliente', desc: 'Lembrete para enviar mensagem de aniversário' },{ label: 'Resumo Diário', desc: 'Receber resumo das O.S. do dia às 18h' },{ label: 'Backup Automático', desc: 'Confirmação de backup semanal realizado' }].map((item, i) => (<div key={i} className="glass rounded-xl p-4 flex items-center justify-between"><div><p className="font-bold">{item.label}</p><p className="text-xs text-slate-500">{item.desc}</p></div><div className="w-11 h-6 bg-blue-600 rounded-full flex items-center px-0.5 cursor-pointer"><div className="w-5 h-5 bg-white rounded-full ml-auto shadow" /></div></div>))}</div></>)}
        </div>
      </div>
    </div>
  )
}
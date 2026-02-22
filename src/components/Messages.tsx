import { useState, useRef, useEffect, type FormEvent } from 'react';
import {
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  ArrowLeft,
  MessageCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { statusLabels, statusColors } from '../types';
import { cn } from '../utils/cn';

interface MessagesProps {
  selectedProjectId?: string;
  onSelectProject: (projectId: string | undefined) => void;
}

export function Messages({ selectedProjectId, onSelectProject }: MessagesProps) {
  const { projects, addMessage, getClient, getProject } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedProject = selectedProjectId ? getProject(selectedProjectId) : null;
  const selectedClient = selectedProject ? getClient(selectedProject.clientId) : null;

  const sortedProjects = [...projects].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const filteredProjects = sortedProjects.filter(project => {
    const client = getClient(project.clientId);
    return project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedProject?.messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProjectId) return;

    addMessage(selectedProjectId, newMessage.trim(), 'me');
    setNewMessage('');
  };

  const simulateClientMessage = () => {
    if (!selectedProjectId) return;

    setIsSimulating(true);

    const simulatedMessages = [
      'Oi! Tudo bem? Gostaria de um update sobre o projeto.',
      'Olha, amei as últimas alterações! 😍',
      'Será que consegue entregar antes do prazo?',
      'Preciso de algumas modificações, pode me ligar?',
      'Aprovado! Pode finalizar.',
      'Consegue adicionar mais uma cor?',
      'O cliente do meu cliente pediu algumas mudanças...',
      'Perfeito! Exatamente o que eu queria!'
    ];

    const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];

    setTimeout(() => {
      addMessage(selectedProjectId, randomMessage, 'client');
      setIsSimulating(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short'
    }).format(d);
  };

  const getLastMessage = (projectId: string) => {
    const project = getProject(projectId);
    if (!project || project.messages.length === 0) return null;
    return project.messages[project.messages.length - 1];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-zinc-950/40 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden h-[calc(100vh-10rem)] backdrop-blur-xl animate-fade-in">

      <div className="flex h-full">
        {/* Contacts List */}
        <div className={cn(
          "w-full md:w-80 border-r border-white/5 flex flex-col bg-black/20",
          selectedProjectId && "hidden md:flex"
        )}>
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-zinc-950/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-white text-sm uppercase tracking-widest">Conversas</h3>
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={cn(
                  "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all border",
                  isConnected ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                )}
              >
                {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                {isConnected ? 'Online' : 'Offline'}
              </button>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Rastrear contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="premium-input w-full pl-12! h-12 text-sm bg-black!"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredProjects.map(project => {
              const client = getClient(project.clientId);
              const lastMessage = getLastMessage(project.id);

              return (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className={cn(
                    "w-full flex items-start gap-4 p-5 hover:bg-white/[0.03] transition-all text-left border-b border-white/5 group",
                    selectedProjectId === project.id && "bg-violet-600/10 hover:bg-violet-600/15"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:scale-110 transition-transform",
                      selectedProjectId === project.id ? "bg-violet-600" : "bg-zinc-900 border border-white/10"
                    )}>
                      {getInitials(client?.name || 'NA')}
                    </div>
                    {isConnected && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black group-hover:animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white truncate tracking-tight text-sm uppercase">{client?.name}</span>
                      {lastMessage && (
                        <span className="text-[10px] text-zinc-600 font-extrabold">{formatTime(lastMessage.timestamp)}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate font-semibold uppercase tracking-tighter mb-1">{project.title}</p>
                    {lastMessage && (
                      <p className="text-xs text-zinc-400 truncate flex items-center gap-1 font-medium">
                        {lastMessage.sender === 'me' && <CheckCheck size={14} className="text-blue-500 shrink-0" />}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="text-center py-16 text-zinc-600">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Vácuo Identificado</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedProject ? (
          <div className="flex-1 flex flex-col bg-black/40">
            {/* Chat Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-zinc-950/60 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onSelectProject(undefined)}
                  className="md:hidden p-2.5 hover:bg-white/5 rounded-xl text-zinc-400"
                >
                  <ArrowLeft size={22} />
                </button>
                <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl">
                  {getInitials(selectedClient?.name || 'NA')}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-white tracking-tight uppercase text-sm">{selectedClient?.name}</h3>
                    <span className={cn(
                      "text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border",
                      statusColors[selectedProject.status]
                    )}>
                      {statusLabels[selectedProject.status]}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{selectedProject.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={simulateClientMessage}
                  disabled={isSimulating}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                    isSimulating
                      ? "bg-zinc-900 text-zinc-600 border-white/5"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                  )}
                >
                  <RefreshCw size={14} className={cn(isSimulating && "animate-spin")} />
                  <span className="hidden sm:inline">Simular Protocolo</span>
                </button>
                <div className="h-8 w-[1px] bg-white/5 mx-1" />
                <button className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors">
                  <Video size={20} />
                </button>
                <button className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.02)_0%,_transparent_100%)]">
              {/* WhatsApp Info Banner */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-center mb-8 backdrop-blur-sm">
                <p className="text-xs text-amber-500 font-bold uppercase tracking-widest leading-relaxed">
                  🛡️ PROTOCOLO DE SIMULAÇÃO ATIVO • INTEGRADO VIA SISTEMA DE GESTÃO
                </p>
              </div>

              {selectedProject.messages.length === 0 ? (
                <div className="text-center py-20 text-zinc-700">
                  <MessageCircle size={64} className="mx-auto mb-4 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Canal Inativo</p>
                  <p className="text-xs font-medium mt-2">Nenhuma transmissão registrada ainda.</p>
                </div>
              ) : (
                selectedProject.messages.map((message, idx) => {
                  const showDate = idx === 0 ||
                    new Date(message.timestamp).toDateString() !==
                    new Date(selectedProject.messages[idx - 1].timestamp).toDateString();

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center my-8">
                          <span className="bg-zinc-950 border border-white/5 px-5 py-1.5 rounded-full text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] shadow-xl">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={cn(
                        "flex group",
                        message.sender === 'me' ? "justify-end" : "justify-start"
                      )}>
                        <div className={cn(
                          "max-w-[75%] rounded-[1.5rem] px-6 py-4 shadow-2xl relative transition-transform hover:scale-[1.01]",
                          message.sender === 'me'
                            ? "bg-gradient-to-br from-violet-600 to-indigo-800 text-white rounded-tr-none"
                            : "bg-zinc-900 text-zinc-200 rounded-tl-none border border-white/5"
                        )}>
                          <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                          <div className={cn(
                            "flex items-center justify-end gap-2 mt-3",
                            message.sender === 'me' ? "text-violet-300/80" : "text-zinc-500"
                          )}>
                            <span className="text-[10px] font-black uppercase">{formatTime(message.timestamp)}</span>
                            {message.sender === 'me' && <CheckCheck size={14} className="text-blue-400" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-zinc-950/60 backdrop-blur-md">
              <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/10 focus-within:border-violet-500/50 transition-all">
                <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors">
                  <Smile size={24} />
                </button>
                <button type="button" className="p-3 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors">
                  <Paperclip size={24} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Transmitir mensagem estratégica..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm font-medium placeholder:text-zinc-700"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={cn(
                    "p-4 rounded-xl transition-all shadow-2xl",
                    newMessage.trim()
                      ? "bg-violet-600 text-white shadow-violet-900/40 hover:scale-105 active:scale-95"
                      : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-black/40 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-violet-600 rounded-full blur-[100px]" />
              <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-indigo-600 rounded-full blur-[100px]" />
            </div>
            <div className="text-center relative z-10 p-12">
              <div className="w-28 h-28 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-900/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <MessageCircle size={48} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Protocolo de Comunicação</h3>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Selecione uma transmissão ativa na rede</p>
              <div className="p-6 bg-zinc-950/80 rounded-3xl border border-white/5 max-w-sm mx-auto backdrop-blur-sm">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                  <Wifi size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Servidor Operacional</span>
                </div>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  🛡️ Esta interface simula a integração com a API Business do WhatsApp. Todas as mensagens são criptografadas via Protocolo de Segurança.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

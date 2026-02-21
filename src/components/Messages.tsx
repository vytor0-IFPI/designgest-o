import { useState, useRef, useEffect } from 'react';
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

  const handleSendMessage = (e: React.FormEvent) => {
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[calc(100vh-12rem)]">
      <div className="flex h-full">
        {/* Contacts List */}
        <div className={cn(
          "w-full md:w-80 border-r border-slate-100 flex flex-col",
          selectedProjectId && "hidden md:flex"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Conversas</h3>
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={cn(
                  "flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition-colors",
                  isConnected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}
              >
                {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                {isConnected ? 'Conectado' : 'Offline'}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar conversa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredProjects.map(project => {
              const client = getClient(project.clientId);
              const lastMessage = getLastMessage(project.id);

              return (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-50",
                    selectedProjectId === project.id && "bg-violet-50 hover:bg-violet-50"
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(client?.name || 'NA')}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800 truncate">{client?.name}</span>
                      {lastMessage && (
                        <span className="text-xs text-slate-400">{formatTime(lastMessage.timestamp)}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">{project.title}</p>
                    {lastMessage && (
                      <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1">
                        {lastMessage.sender === 'me' && <CheckCheck size={12} className="text-blue-500 shrink-0" />}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p>Nenhuma conversa encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedProject ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectProject(undefined)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-lg -ml-2"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(selectedClient?.name || 'NA')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-800">{selectedClient?.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selectedProject.status]}`}>
                      {statusLabels[selectedProject.status]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedProject.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={simulateClientMessage}
                  disabled={isSimulating}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isSimulating 
                      ? "bg-slate-100 text-slate-400" 
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}
                  title="Simular mensagem do cliente"
                >
                  <RefreshCw size={16} className={cn(isSimulating && "animate-spin")} />
                  <span className="hidden sm:inline">Simular Msg</span>
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <Phone size={20} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <Video size={20} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-slate-100 space-y-4">
              {/* WhatsApp Info Banner */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mb-4">
                <p className="text-sm text-yellow-800">
                  🔔 <strong>Modo Simulação:</strong> Clique em "Simular Msg" para simular mensagens do cliente via WhatsApp
                </p>
              </div>

              {selectedProject.messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
                </div>
              ) : (
                selectedProject.messages.map((message, idx) => {
                  const showDate = idx === 0 || 
                    new Date(message.timestamp).toDateString() !== 
                    new Date(selectedProject.messages[idx - 1].timestamp).toDateString();

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center my-4">
                          <span className="bg-white px-4 py-1 rounded-full text-xs text-slate-500 shadow-sm">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={cn(
                        "flex",
                        message.sender === 'me' ? "justify-end" : "justify-start"
                      )}>
                        <div className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                          message.sender === 'me' 
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none" 
                            : "bg-white text-slate-800 rounded-bl-none"
                        )}>
                          <p className="text-sm">{message.content}</p>
                          <div className={cn(
                            "flex items-center justify-end gap-1 mt-1",
                            message.sender === 'me' ? "text-violet-200" : "text-slate-400"
                          )}>
                            <span className="text-xs">{formatTime(message.timestamp)}</span>
                            {message.sender === 'me' && <CheckCheck size={14} />}
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
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <Smile size={22} />
                </button>
                <button type="button" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <Paperclip size={22} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    newMessage.trim() 
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:opacity-90" 
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">DesignFlow Mensagens</h3>
              <p className="text-slate-500">Selecione uma conversa para visualizar</p>
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 max-w-sm mx-auto">
                <p className="text-sm text-green-700">
                  💡 <strong>Dica:</strong> Esta é uma simulação da integração com WhatsApp. 
                  Para conectar de verdade, você precisaria de um servidor com a API do WhatsApp Business.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

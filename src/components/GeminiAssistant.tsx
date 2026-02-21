import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2, Wand2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
}

export function GeminiAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Olá! Sou o assistente Gemini AI integrado ao seu sistema de gestão. Como posso ajudar com seus projetos hoje?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Simular resposta da IA
        setTimeout(() => {
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Entendi sua solicitação sobre "${input}". No momento, estou configurado para auxiliar na organização de seus clientes e prazos. Em que mais posso ser útil?`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMsg]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold">Gemini Assistant</h2>
                        <p className="text-blue-100 text-xs">Inteligência Artificial Ativa</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Experimental</span>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-4 max-w-[80%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                            msg.role === 'assistant'
                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                : "bg-white border border-slate-200 text-slate-600"
                        )}>
                            {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                        </div>

                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed",
                            msg.role === 'assistant'
                                ? "bg-white border border-slate-100 text-slate-800 shadow-sm"
                                : "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        )}>
                            {msg.content}
                            <p className={cn(
                                "text-[10px] mt-2 opacity-50",
                                msg.role === 'user' ? "text-right" : ""
                            )}>
                                {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(msg.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 max-w-[80%]">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
                            <Loader2 size={18} className="animate-spin" />
                        </div>
                        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative flex items-center gap-4"
                >
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunte algo ao Gemini..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400 transition-all"
                        />
                        <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-tighter">
                    O Gemini Assistant pode apresentar informações imprecisas. Verifique informações importantes.
                </p>
            </div>
        </div>
    );
}

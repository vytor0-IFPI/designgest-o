import { useAuth } from '../context/AuthContext';
import { BarChart3, Activity, Clock, ShieldCheck, Download } from 'lucide-react';
import { cn } from '../utils/cn';

export function Reports() {
    const { users } = useAuth();

    // Activities log
    const recentActivities = [
        { id: '1', user: users[1]?.name || 'Usuario', action: 'Criou um novo cliente', target: 'Empresa X', time: '10 min atrás', type: 'create' },
        { id: '2', user: users[0]?.name || 'Admin Master', action: 'Atualizou status do projeto', target: 'Logo Design Flow', time: '1 hora atrás', type: 'update' },
        { id: '3', user: users[1]?.name || 'Usuario', action: 'Adicionou tarefa ao projeto', target: 'Identidade Visual', time: '3 horas atrás', type: 'create' },
        { id: '4', user: 'Sistema Elite', action: 'Backup automático realizado', target: 'Nuvem Segura', time: '5 horas atrás', type: 'system' },
        { id: '5', user: users[1]?.name || 'Usuario', action: 'Excluiu rascunho de projeto', target: 'Projeto Antigo', time: 'ontem', type: 'delete' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header com ações */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Auditoria e Métricas</h2>
                    <p className="text-zinc-500 font-medium">Análise em tempo real do ecossistema administrativo.</p>
                </div>
                <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-300 hover:bg-white/10 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] group">
                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>Gerar Relatório Estratégico</span>
                </button>
            </div>

            {/* Grid de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="premium-card p-8 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Activity size={80} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ações Executadas</p>
                            <p className="text-3xl font-black text-white">128</p>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full w-[65%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                </div>

                <div className="premium-card p-8 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck size={80} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Integridade Global</p>
                            <p className="text-3xl font-black text-white">99.98%</p>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full w-[99.9%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>

                <div className="premium-card p-8 border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Clock size={80} className="text-amber-500" />
                    </div>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Média de Operação</p>
                            <p className="text-3xl font-black text-white">08h 15m</p>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full w-[75%] shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    </div>
                </div>
            </div>

            {/* Tabela de Atividade */}
            <div className="premium-card p-0 border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                            <BarChart3 className="text-violet-500" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Monitoramento de Fluxo</h3>
                            <p className="text-xs text-zinc-500 font-medium">Rastreamento granulado de todas as interações do sistema.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Fluxo Ativo</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Operador</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Ação Sistêmica</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Entidade Alvo</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Cronometria</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentActivities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-white/[0.02] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-all text-[10px] font-black uppercase">
                                                {activity.user.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{activity.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                                activity.type === 'create' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    activity.type === 'update' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                        activity.type === 'delete' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                            "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                            )}>
                                                {activity.type}
                                            </span>
                                            <span className="text-sm font-medium text-zinc-400 leading-none">{activity.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-white uppercase tracking-tighter opacity-80">{activity.target}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-zinc-600 font-bold text-[10px] uppercase tracking-tighter italic">
                                            <Clock size={12} className="opacity-50" />
                                            {activity.time}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-zinc-950 border-t border-white/5 text-center">
                    <button className="text-[10px] font-black text-violet-400 hover:text-violet-300 transition-all uppercase tracking-[0.3em]">
                        Expandir Histórico de Auditoria Digital
                    </button>
                </div>
            </div>
        </div>
    );
}

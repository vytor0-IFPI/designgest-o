import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BarChart3, User, Activity, Clock, ShieldCheck, Download } from 'lucide-react';
import { cn } from '../utils/cn';

export function Reports() {
    const { users } = useAuth();
    const { clients, projects } = useData();

    // Mock de atividades recentes para o relatório
    const recentActivities = [
        { id: '1', user: users[1]?.name || 'Usuario', action: 'Criou um novo cliente', target: 'Empresa X', time: '10 min atrás', type: 'create' },
        { id: '2', user: users[0]?.name || 'Admin', action: 'Atualizou status do projeto', target: 'Logo Design', time: '1 hora atrás', type: 'update' },
        { id: '3', user: users[1]?.name || 'Usuario', action: 'Adicionou tarefa ao projeto', target: 'Identidade Visual', time: '3 horas atrás', type: 'create' },
        { id: '4', user: 'Sistema', action: 'Backup automático realizado', target: 'Banco de Dados', time: '5 horas atrás', type: 'system' },
        { id: '5', user: users[1]?.name || 'Usuario', action: 'Excluiu rascunho de projeto', target: 'Projeto Antigo', time: 'ontem', type: 'delete' },
    ];

    return (
        <div className="space-y-6">
            {/* Header com ações */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Relatórios Administrativos</h2>
                    <p className="text-slate-500 text-sm">Monitore a atividade dos usuários e o desempenho do sistema.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={18} />
                    <span className="font-medium text-sm">Exportar PDF</span>
                </button>
            </div>

            {/* Grid de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Ações Hoje</p>
                            <p className="text-xl font-bold text-slate-800">42</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[65%]" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Uptime Sistema</p>
                            <p className="text-xl font-bold text-slate-800">99.9%</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[99%]" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Tempo Médio Online</p>
                            <p className="text-xl font-bold text-slate-800">4h 20m</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[45%]" />
                    </div>
                </div>
            </div>

            {/* Tabela de Atividade */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="text-indigo-600" size={20} />
                        <h3 className="font-semibold text-slate-800">Log de Atividades dos Usuários</h3>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Tempo Real</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Usuário</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ação Realizada</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Alvo</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Horário</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentActivities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all text-xs font-bold">
                                                {activity.user.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{activity.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <span className={cn(
                                            "px-2 py-1 rounded-lg text-xs font-medium mr-2",
                                            activity.type === 'create' ? "bg-green-50 text-green-600" :
                                                activity.type === 'update' ? "bg-blue-50 text-blue-600" :
                                                    activity.type === 'delete' ? "bg-red-50 text-red-600" :
                                                        "bg-slate-100 text-slate-500"
                                        )}>
                                            {activity.type.toUpperCase()}
                                        </span>
                                        {activity.action}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        {activity.target}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 italic">
                                        {activity.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                        Ver Log Completo de Auditoria
                    </button>
                </div>
            </div>
        </div>
    );
}

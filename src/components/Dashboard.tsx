import {
  Users,
  FolderKanban,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { statusLabels, statusColors, priorityColors, priorityLabels } from '../types';

export function Dashboard() {
  const { clients, projects, getClient } = useData();
  const { users } = useAuth();

  const stats = {
    totalClients: clients.length,
    totalUsers: users.length,
    totalProjects: projects.length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
    review: projects.filter(p => p.status === 'review').length,
    totalRevenue: projects
      .filter(p => p.status === 'completed')
      .reduce((acc, p) => acc + (p.price || 0), 0),
    pendingRevenue: projects
      .filter(p => p.status !== 'completed' && p.status !== 'cancelled')
      .reduce((acc, p) => acc + (p.price || 0), 0)
  };

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const urgentProjects = projects.filter(p =>
    p.priority === 'high' &&
    (p.status === 'pending' || p.status === 'in_progress')
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(date));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
              <Users className="text-violet-400" size={24} />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-zinc-500">Total Geral</p>
              <p className="text-lg font-bold text-white">{stats.totalClients + stats.totalUsers}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xl font-bold text-white">{stats.totalClients}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                {stats.totalClients === 1 ? 'Cliente' : 'Clientes'}
              </p>
            </div>
            <div className="border-l border-white/5 pl-2">
              <p className="text-xl font-bold text-white">{stats.totalUsers}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                {stats.totalUsers === 1 ? 'Usuário' : 'Usuários'}
              </p>
            </div>
          </div>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <FolderKanban className="text-blue-400" size={24} />
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">
              {stats.inProgress} {stats.inProgress === 1 ? 'ativo' : 'ativos'}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
          <p className="text-sm text-zinc-500">Projetos Registrados</p>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="text-emerald-400" size={24} />
            </div>
            <TrendingUp className="text-emerald-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-zinc-500">Faturamento Concluído</p>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <Clock className="text-amber-400" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.pendingRevenue)}</p>
          <p className="text-sm text-zinc-500">Previsão a Receber</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="premium-card">
        <h3 className="text-lg font-semibold text-white mb-6">Status dos Projetos</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Clock className="text-amber-400" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-tighter">Pendentes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stats.inProgress}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-tighter">Em Andamento</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-violet-400" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stats.review}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-tighter">Em Revisão</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-tighter">Concluídos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="premium-card">
          <h3 className="text-lg font-semibold text-white mb-6">Projetos Recentes</h3>
          <div className="space-y-2">
            {recentProjects.length === 0 ? (
              <p className="text-center py-4 text-zinc-600 italic">Nenhum projeto encontrado.</p>
            ) : recentProjects.map(project => {
              const client = getClient(project.clientId);
              return (
                <div key={project.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                    {project.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{project.title}</p>
                    <p className="text-xs text-zinc-500">{client?.name || 'Cliente Particular'}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusColors[project.status]} bg-opacity-20 backdrop-blur-md`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Projects */}
        <div className="premium-card border-red-500/10">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="text-lg font-semibold text-white">Projetos Urgentes</h3>
          </div>
          {urgentProjects.length === 0 ? (
            <div className="text-center py-8 text-zinc-600">
              <CheckCircle2 size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Nenhum projeto crítico no radar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentProjects.map(project => {
                const client = getClient(project.clientId);
                return (
                  <div key={project.id} className="flex items-center gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-red-500" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{project.title}</p>
                      <p className="text-xs text-zinc-500">{client?.name || 'Cliente Particular'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${priorityColors[project.priority]}`}>
                        {priorityLabels[project.priority]}
                      </span>
                      {project.deadline && (
                        <p className="text-[10px] text-zinc-500 mt-2 flex items-center justify-end gap-1 font-medium">
                          <Calendar size={10} />
                          {formatDate(project.deadline)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

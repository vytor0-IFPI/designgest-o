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
import { statusLabels, statusColors, priorityColors, priorityLabels } from '../types';

export function Dashboard() {
  const { clients, projects, getClient } = useData();

  const stats = {
    totalClients: clients.length,
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
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <Users className="text-violet-600" size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.totalClients}</p>
          <p className="text-sm text-slate-500">Clientes</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FolderKanban className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {stats.inProgress} ativos
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.totalProjects}</p>
          <p className="text-sm text-slate-500">Projetos</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-slate-500">Faturado</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.pendingRevenue)}</p>
          <p className="text-sm text-slate-500">A Receber</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Status dos Projetos</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{stats.pending}</p>
              <p className="text-sm text-slate-500">Pendentes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{stats.inProgress}</p>
              <p className="text-sm text-slate-500">Em Andamento</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{stats.review}</p>
              <p className="text-sm text-slate-500">Em Revisão</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{stats.completed}</p>
              <p className="text-sm text-slate-500">Concluídos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Projetos Recentes</h3>
          <div className="space-y-3">
            {recentProjects.map(project => {
              const client = getClient(project.clientId);
              return (
                <div key={project.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {project.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{project.title}</p>
                    <p className="text-sm text-slate-500">{client?.name || 'Cliente'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">Projetos Urgentes</h3>
          </div>
          {urgentProjects.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle2 size={48} className="mx-auto mb-3 opacity-50" />
              <p>Nenhum projeto urgente no momento!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentProjects.map(project => {
                const client = getClient(project.clientId);
                return (
                  <div key={project.id} className="flex items-center gap-4 p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-red-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{project.title}</p>
                      <p className="text-sm text-slate-500">{client?.name || 'Cliente'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[project.priority]}`}>
                        {priorityLabels[project.priority]}
                      </span>
                      {project.deadline && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar size={12} />
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

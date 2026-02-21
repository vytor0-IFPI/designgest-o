import { useState } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Trash2,
  Edit2,
  X,
  Filter,
  Tag,
  DollarSign,
  MessageCircle,
  Eye,
  Mail
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Project, statusLabels, statusColors, priorityLabels, priorityColors, ProjectStatus, ProjectPriority } from '../types';
import { useGmail } from '../hooks/useGmail';

interface ProjectFormData {
  title: string;
  description: string;
  clientId: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline: string;
  price: string;
  tags: string;
}

const emptyForm: ProjectFormData = {
  title: '',
  description: '',
  clientId: '',
  status: 'pending',
  priority: 'medium',
  deadline: '',
  price: '',
  tags: ''
};

interface ProjectsProps {
  onOpenMessages: (projectId: string) => void;
}

export function Projects({ onOpenMessages }: ProjectsProps) {
  const { clients, projects, addProject, updateProject, deleteProject, getClient } = useData();
  const { isConnected, login, sendProjectUpdate } = useGmail();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);
  const [viewProject, setViewProject] = useState<Project | null>(null);

  const handleSendUpdate = async (project: Project) => {
    const client = getClient(project.clientId);
    if (!client?.email) {
      alert('Este cliente não possui e-mail cadastrado.');
      return;
    }

    const success = await sendProjectUpdate(client.email, project.title, statusLabels[project.status]);
    if (success) {
      alert('E-mail de atualização enviado com sucesso!');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      title: formData.title,
      description: formData.description,
      clientId: formData.clientId,
      status: formData.status,
      priority: formData.priority,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editingId) {
      updateProject(editingId, projectData);
    } else {
      addProject(projectData);
    }
    setShowModal(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      clientId: project.clientId,
      status: project.status,
      priority: project.priority,
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
      price: project.price?.toString() || '',
      tags: project.tags.join(', ')
    });
    setEditingId(project.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(id);
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all appearance-none bg-white"
            >
              <option value="all">Todos os status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          {!isConnected && (
            <button
              onClick={() => login()}
              className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors font-medium border border-slate-200 shadow-sm"
            >
              <Mail size={20} className="text-red-500" />
              Conectar Gmail
            </button>
          )}
          <button
            onClick={() => {
              setFormData(emptyForm);
              setEditingId(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg shadow-violet-200"
          >
            <Plus size={20} />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map(project => {
          const client = getClient(project.clientId);
          return (
            <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {project.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-800">{project.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[project.priority]}`}>
                          {priorityLabels[project.priority]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{client?.name || 'Cliente não encontrado'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign size={16} className="text-green-600" />
                    {formatCurrency(project.price)}
                  </div>
                  {project.deadline && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} className="text-blue-600" />
                      {formatDate(project.deadline)}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MessageCircle size={16} />
                    {project.messages.length} msgs
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => setViewProject(project)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleSendUpdate(project)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                    title="Enviar atualização por E-mail"
                  >
                    <Mail size={18} />
                  </button>
                  <button
                    onClick={() => onOpenMessages(project.id)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 p-2 hover:bg-green-50 rounded-lg text-slate-400 hover:text-green-600 transition-colors"
                    title="Mensagens"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">Nenhum projeto encontrado</p>
        </div>
      )}

      {/* View Project Modal */}
      {viewProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-800">{viewProject.title}</h3>
              <button
                onClick={() => setViewProject(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[viewProject.status]}`}>
                  {statusLabels[viewProject.status]}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${priorityColors[viewProject.priority]}`}>
                  Prioridade: {priorityLabels[viewProject.priority]}
                </span>
              </div>

              <div>
                <h4 className="font-medium text-slate-700 mb-1">Cliente</h4>
                <p className="text-slate-600">{getClient(viewProject.clientId)?.name || 'N/A'}</p>
              </div>

              <div>
                <h4 className="font-medium text-slate-700 mb-1">Descrição</h4>
                <p className="text-slate-600">{viewProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Valor</h4>
                  <p className="text-slate-600">{formatCurrency(viewProject.price)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-1">Prazo</h4>
                  <p className="text-slate-600">{formatDate(viewProject.deadline)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {viewProject.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-sm bg-violet-100 text-violet-700 px-3 py-1 rounded-full">
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setViewProject(null);
                    onOpenMessages(viewProject.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium"
                >
                  <MessageCircle size={20} />
                  Ver Mensagens ({viewProject.messages.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingId ? 'Editar Projeto' : 'Novo Projeto'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  placeholder="Nome do projeto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none"
                  placeholder="Descreva o projeto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as ProjectPriority })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prazo</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  placeholder="logo, branding, social (separadas por vírgula)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Salvar' : 'Criar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

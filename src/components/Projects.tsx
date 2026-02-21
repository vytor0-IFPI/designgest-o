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
import { useGmail } from '../context/GmailContext';

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
  const { sendNotification } = useGmail();
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

    const result = await sendNotification(
      client.email,
      `Atualização de Projeto: ${project.title}`,
      `<div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Olá, ${client.name}!</h2>
        <p>Temos uma atualização sobre o seu projeto <strong>${project.title}</strong>.</p>
        <p><strong>Status Atual:</strong> ${statusLabels[project.status]}</p>
        <hr />
        <p>Acesse o portal para conferir todos os detalhes.</p>
       </div>`
    );

    if (result.success) {
      alert('E-mail de atualização enviado com sucesso!');
    } else {
      alert(result.error || 'Falha ao enviar e-mail.');
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="premium-input pl-10!"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="premium-input pl-10 pr-10 appearance-none min-w-[180px]"
            >
              <option value="all">Todos os status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowModal(true);
          }}
          className="premium-button w-full lg:w-auto"
        >
          <Plus size={20} />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid gap-4">
        {filteredProjects.map(project => {
          const client = getClient(project.clientId);
          return (
            <div key={project.id} className="premium-card group border-white/5 hover:border-violet-500/30">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform shrink-0">
                      {project.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-violet-400 transition-colors">{project.title}</h3>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${priorityColors[project.priority]}`}>
                          {priorityLabels[project.priority]}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 font-medium">{client?.name || 'Cliente Particular'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-[10px] bg-white/5 text-zinc-400 px-3 py-1 rounded-full font-bold uppercase border border-white/5">
                        <Tag size={10} className="text-violet-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-6 lg:gap-3 py-4 lg:py-0 border-y lg:border-y-0 border-white/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <DollarSign size={16} className="text-emerald-500" />
                    {formatCurrency(project.price)}
                  </div>
                  {project.deadline && (
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                      <Calendar size={16} className="text-blue-500" />
                      {formatDate(project.deadline)}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 bg-white/5 px-2 py-1 rounded-lg">
                    <MessageCircle size={14} />
                    {project.messages.length} msgs
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => setViewProject(project)}
                    className="flex-1 lg:flex-none p-3 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                    title="Ver detalhes"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleSendUpdate(project)}
                    className="flex-1 lg:flex-none p-3 hover:bg-violet-500/10 rounded-xl text-zinc-500 hover:text-violet-400 transition-all border border-transparent hover:border-violet-500/20"
                    title="Notificar Cliente"
                  >
                    <Mail size={20} />
                  </button>
                  <button
                    onClick={() => onOpenMessages(project.id)}
                    className="flex-1 lg:flex-none p-3 hover:bg-blue-500/10 rounded-xl text-zinc-500 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20"
                    title="Chat"
                  >
                    <MessageCircle size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 lg:flex-none p-3 hover:bg-zinc-100/10 rounded-xl text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                    title="Editar"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 lg:flex-none p-3 hover:bg-red-500/10 rounded-xl text-zinc-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Calendar size={64} className="mx-auto mb-4 text-zinc-800" />
          <p className="text-zinc-500 font-medium">Buscamos em todos os cantos, mas nenhum projeto foi encontrado.</p>
        </div>
      )}

      {/* View Project Modal */}
      {viewProject && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="premium-card w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-0 border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
              <h3 className="text-xl font-bold text-white">{viewProject.title}</h3>
              <button
                onClick={() => setViewProject(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex flex-wrap gap-3">
                <span className={`text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest ${statusColors[viewProject.status]} bg-opacity-20`}>
                  {statusLabels[viewProject.status]}
                </span>
                <span className={`text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest ${priorityColors[viewProject.priority]} bg-opacity-20 flex items-center gap-2`}>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  Prioridade {priorityLabels[viewProject.priority]}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cliente Associado</h4>
                  <p className="text-white font-medium text-lg">{getClient(viewProject.clientId)?.name || 'Particular'}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Valor do Investimento</h4>
                  <p className="text-emerald-400 font-bold text-lg">{formatCurrency(viewProject.price)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Objetivos e Descrição</h4>
                <p className="text-zinc-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{viewProject.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categorias e Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {viewProject.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 text-xs bg-violet-500/10 text-violet-400 px-4 py-1.5 rounded-full border border-violet-500/20 font-bold">
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setViewProject(null);
                  onOpenMessages(viewProject.id);
                }}
                className="premium-button w-full h-14"
              >
                <MessageCircle size={22} />
                <span>Central de Mensagens ({viewProject.messages.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="premium-card w-full max-w-lg shadow-2xl p-0 border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Refinar Projeto' : 'Arquitetar Novo Projeto'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome do Projeto</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="premium-input"
                  placeholder="Ex: Branding Design Flow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Cliente Responsável</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="premium-input"
                >
                  <option value="">Selecione o titular</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Escopo e Detalhes</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="premium-input resize-none"
                  placeholder="Quais os objetivos deste projeto?"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Status Inicial</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                    className="premium-input"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as ProjectPriority })}
                    className="premium-input"
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Prazo de Entrega</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="premium-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Orçamento (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="premium-input font-mono"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tags Estratégicas</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="premium-input"
                  placeholder="Design, Dev, Marketing (separadas por vírgula)"
                />
              </div>

              <div className="flex gap-4 p-6 bg-zinc-950 border-t border-white/5 -mx-8 -mb-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="premium-button flex-1"
                >
                  {editingId ? 'Salvar Alterações' : 'Finalizar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

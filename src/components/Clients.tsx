import { useState } from 'react';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Building2,
  Trash2,
  Edit2,
  X,
  FolderKanban,
  User
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

const emptyForm: ClientFormData = {
  name: '',
  email: '',
  phone: '',
  company: ''
};

export function Clients() {
  const { clients, projects, addClient, updateClient, deleteClient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(emptyForm);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientProjectCount = (clientId: string) => {
    return projects.filter(p => p.clientId === clientId).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateClient(editingId, formData);
    } else {
      addClient(formData);
    }
    setShowModal(false);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (client: any) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company || ''
    });
    setEditingId(client.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza? Isso excluirá todos os projetos deste cliente.')) {
      deleteClient(id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar clientes por nome ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="premium-input pl-10!"
          />
        </div>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowModal(true);
          }}
          className="premium-button w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="premium-card group border-white/5 hover:border-violet-500/30">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl group-hover:scale-110 transition-transform">
                  {getInitials(client.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate text-lg group-hover:text-violet-400 transition-colors">{client.name}</h3>
                  {client.company && (
                    <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <Building2 size={12} className="text-violet-500" />
                      {client.company}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-2 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-2 hover:bg-red-500/10 rounded-xl text-zinc-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-3 text-xs font-semibold text-zinc-400 hover:text-violet-400 transition-colors"
              >
                <Mail size={16} className="text-violet-500" />
                {client.email}
              </a>
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-3 text-xs font-semibold text-zinc-400 hover:text-violet-400 transition-colors"
              >
                <Phone size={16} className="text-violet-500" />
                {client.phone}
              </a>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                <FolderKanban size={14} className="text-blue-500" />
                {getClientProjectCount(client.id)} projetos ativos
              </div>
              <span className="text-[10px] text-zinc-600 font-bold uppercase">
                Desde {formatDate(client.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <User size={64} className="mx-auto mb-4 text-zinc-800" />
          <p className="text-zinc-500 font-medium font-bold uppercase tracking-widest text-xs">Nenhum cliente na base de dados.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="premium-card w-full max-w-md shadow-2xl p-0 border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Refinar Cadastro' : 'Novo Cliente'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="premium-input"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Endereço de Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="premium-input"
                  placeholder="cliente@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Telefone de Contato</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="premium-input"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Empresa / Negócio</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="premium-input"
                  placeholder="Nome da corporação (opcional)"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="premium-button flex-1"
                >
                  {editingId ? 'Salvar Dados' : 'Efetuar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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
    setError('');
    setShowModal(true);
  };

  const [error, setError] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('Atenção: A exclusão de um cliente eliminará permanentemente todos os registros vinculados. Continuar?')) {
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
    <div className="space-y-10 animate-fade-in">
      {/* Header Strategico */}
      <div className="flex flex-col lg:flex-row gap-8 justify-between items-center bg-zinc-950/30 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex-1 w-full max-w-xl relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors" size={24} />
          <input
            type="text"
            placeholder="Rastrear clientes por nome ou entidade corporativa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="premium-input w-full h-16 pl-16! text-base tracking-tight placeholder:text-zinc-700 bg-black!"
          />
        </div>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setError('');
            setShowModal(true);
          }}
          className="premium-button w-full lg:w-auto h-16 px-10 rounded-2xl group"
        >
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus size={22} />
          </div>
          <span className="text-sm font-black tracking-widest uppercase">Expandir Base de Dados</span>
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClients.map(client => (
          <div key={client.id} className="premium-card p-1 relative overflow-hidden group border-white/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:border-violet-500/30 transition-all">
                    {getInitials(client.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-white truncate text-xl tracking-tighter group-hover:text-violet-400 transition-colors mb-1">{client.name}</h3>
                    {client.company && (
                      <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                        <Building2 size={12} className="text-violet-500 opacity-50" />
                        <span className="truncate max-w-[120px]">{client.company}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all border border-white/5"
                    title="Modificar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-3 bg-red-500/5 hover:bg-red-500/20 rounded-xl text-zinc-600 hover:text-red-500 transition-all border border-red-500/10"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8 bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-violet-500" />
                  </div>
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-violet-500" />
                  </div>
                  <span>{client.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  <FolderKanban size={14} />
                  {getClientProjectCount(client.id)} Projetos
                </div>
                <span className="text-[10px] text-zinc-600 font-extrabold uppercase tracking-widest">
                  ID: {client.id.substring(0, 8)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-32 bg-zinc-950/20 rounded-[3rem] border-2 border-dashed border-white/5">
          <User size={80} className="mx-auto mb-6 text-zinc-800 opacity-20" />
          <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-xs">Vácuo Identificado: Nenhum integrante na rede.</p>
        </div>
      )}

      {/* Modal Strategico */}
      {showModal && (
        <div className="fixed inset-0 bg-black/98 flex items-center justify-center z-50 p-4 backdrop-blur-xl">
          <div className="premium-card w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.8)] p-0 border-white/10 overflow-hidden rounded-[2.5rem]">
            <div className="flex items-center justify-between p-8 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Elite Protocol</span>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
                  {editingId ? 'Refinar Cadastro' : 'Novo Integrante'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-white/10 rounded-2xl transition-all text-zinc-400 hover:text-white border border-white/5"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Designação / Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="premium-input h-14 bg-black!"
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail de Contato</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="premium-input h-14 bg-black!"
                    placeholder="ex@elite.com"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Telefone Principal</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="premium-input h-14 bg-black!"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Organização / Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="premium-input h-14 bg-black!"
                  placeholder="Designação corporativa (opcional)"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-14 rounded-2xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="premium-button flex-1 h-14 rounded-2xl"
                >
                  <span className="text-xs">{editingId ? 'Confirmar Mudanças' : 'Solidificar Cadastro'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

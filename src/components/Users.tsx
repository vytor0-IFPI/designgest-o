import { useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  User,
  Shield,
  ShieldCheck,
  Mail,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User as UserType } from '../types';
import { cn } from '../utils/cn';

interface UserFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

const emptyForm: UserFormData = {
  name: '',
  email: '',
  username: '',
  password: '',
  role: 'user'
};

export function Users() {
  const { users, user: currentUser, addUser, updateUser, deleteUser, toggleUserActive } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (editingId) {
      const updates: Partial<UserType> = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        role: formData.role
      };
      if (formData.password) {
        updates.password = formData.password;
      }
      updateUser(editingId, updates);
      setShowModal(false);
      setFormData(emptyForm);
      setEditingId(null);
    } else {
      if (!formData.password) {
        setError('Senha é obrigatória para novos usuários');
        return;
      }
      const result = addUser(formData);
      if (result.success) {
        setShowModal(false);
        setFormData(emptyForm);
      } else {
        setError(result.message);
      }
    }
  };

  const handleEdit = (user: UserType) => {
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: '',
      role: user.role
    });
    setEditingId(user.id);
    setError('');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const result = deleteUser(id);
      if (!result.success) {
        alert(result.message);
      }
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

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96 animate-fade-in">
        <div className="text-center premium-card p-12 max-w-sm">
          <AlertTriangle size={64} className="mx-auto mb-6 text-amber-500 animate-pulse" />
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Acesso Restrito</h2>
          <p className="text-zinc-500 font-medium">Apenas administradores master podem gerenciar o ecossistema de usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, email ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="premium-input pl-10!"
          />
        </div>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setError('');
            setShowModal(true);
          }}
          className="premium-button w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>Novo Integrante</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="premium-card p-0 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Codinome / ID</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hidden md:table-cell">Comunicação</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nível de Acesso</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hidden lg:table-cell">Recrutamento</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform",
                        u.role === 'admin'
                          ? "bg-gradient-to-br from-amber-500 to-orange-700"
                          : "bg-gradient-to-br from-violet-600 to-indigo-800"
                      )}>
                        {getInitials(u.name)}
                      </div>
                      <div>
                        <p className="font-bold text-white flex items-center gap-2">
                          {u.name}
                          {currentUser?.id === u.id && (
                            <span className="text-[9px] bg-violet-500/10 text-violet-400 px-2.5 py-0.5 rounded-full font-black uppercase border border-violet-500/20">Você</span>
                          )}
                        </p>
                        <p className="text-xs text-zinc-600 font-medium">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                      <Mail size={14} className="text-zinc-700" />
                      {u.email}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      u.role === 'admin'
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                    )}>
                      {u.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                      {u.role === 'admin' ? 'Master' : 'Membro'}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-zinc-600 font-bold text-[10px] uppercase tracking-tighter hidden lg:table-cell">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleUserActive(u.id)}
                        disabled={currentUser?.id === u.id}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                          u.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
                          currentUser?.id === u.id && "opacity-20 cursor-not-allowed"
                        )}
                      >
                        {u.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {u.isActive ? 'Ativado' : 'Bloqueado'}
                      </button>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-600 hover:text-white transition-all border border-transparent hover:border-white/10"
                        title="Modificar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={currentUser?.id === u.id}
                        className={cn(
                          "p-2.5 hover:bg-red-500/10 rounded-xl text-zinc-600 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20",
                          currentUser?.id === u.id && "opacity-10 cursor-not-allowed"
                        )}
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <User size={64} className="mx-auto mb-4 text-zinc-800 opacity-20" />
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Nenhum integrante identificado.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="premium-card w-full max-w-md shadow-2xl p-0 border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Refinar Perfil' : 'Novo Integrante'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 animate-shake">
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Codinome / Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="premium-input"
                  placeholder="Nome do membro"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email de Segurança</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="premium-input"
                  placeholder="email@elite.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">ID de Acesso</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  className="premium-input"
                  placeholder="nomedeusuario"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Chave {editingId ? '(opcional para alterar)' : '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="premium-input pr-12!"
                    placeholder={editingId ? '••••••••' : 'Defina a senha'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nível de Autoridade</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                      formData.role === 'user'
                        ? "border-violet-600 bg-violet-600/10 text-white shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                        : "border-white/5 text-zinc-600 hover:border-white/10"
                    )}
                  >
                    <Shield size={20} className={formData.role === 'user' ? "text-violet-400" : "opacity-30"} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Membro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                      formData.role === 'admin'
                        ? "border-amber-600 bg-amber-600/10 text-white shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                        : "border-white/5 text-zinc-600 hover:border-white/10"
                    )}
                  >
                    <ShieldCheck size={20} className={formData.role === 'admin' ? "text-amber-400" : "opacity-30"} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Master</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="premium-button flex-1"
                >
                  {editingId ? 'Salvar Modificações' : 'Ingressar Membro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

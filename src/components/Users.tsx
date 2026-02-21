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
      // Só atualizar senha se foi preenchida
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
      password: '', // Não mostrar senha atual
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

  // Só admin pode acessar esta página
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto mb-4 text-orange-400" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Acesso Restrito</h2>
          <p className="text-slate-500">Apenas administradores podem gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
          />
        </div>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg shadow-violet-200"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left py-4 px-6 font-semibold text-slate-600">Usuário</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 hidden md:table-cell">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600">Perfil</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 hidden lg:table-cell">Cadastro</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-600">Status</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm",
                        u.role === 'admin' 
                          ? "bg-gradient-to-br from-amber-500 to-orange-600" 
                          : "bg-gradient-to-br from-violet-500 to-indigo-600"
                      )}>
                        {getInitials(u.name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 flex items-center gap-2">
                          {u.name}
                          {currentUser?.id === u.id && (
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">Você</span>
                          )}
                        </p>
                        <p className="text-sm text-slate-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={16} className="text-slate-400" />
                      {u.email}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                      u.role === 'admin' 
                        ? "bg-amber-100 text-amber-800" 
                        : "bg-slate-100 text-slate-700"
                    )}>
                      {u.role === 'admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                      {u.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm hidden lg:table-cell">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleUserActive(u.id)}
                        disabled={currentUser?.id === u.id}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors",
                          u.isActive 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "bg-red-100 text-red-800 hover:bg-red-200",
                          currentUser?.id === u.id && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {u.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {u.isActive ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleEdit(u)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={currentUser?.id === u.id}
                        className={cn(
                          "p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors",
                          currentUser?.id === u.id && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
                        )}
                        title="Excluir"
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
          <div className="text-center py-12">
            <User size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingId ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertTriangle className="text-red-500 shrink-0" size={18} />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  placeholder="Nome do usuário"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Usuário (login) *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  placeholder="nomedeusuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Senha {editingId ? '(deixe em branco para manter)' : '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                    placeholder={editingId ? '••••••••' : 'Senha do usuário'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Perfil de Acesso *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
                      formData.role === 'user'
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <Shield size={18} />
                    Usuário
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
                      formData.role === 'admin'
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <ShieldCheck size={18} />
                    Admin
                  </button>
                </div>
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
                  {editingId ? 'Salvar' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

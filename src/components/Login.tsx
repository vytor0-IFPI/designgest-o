import { useState } from 'react';
import { Palette, Eye, EyeOff, LogIn, AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export function Login() {
  const { login, addUser, users } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isRegister) {
      const result = addUser({
        name,
        email,
        username,
        password,
        role: 'user' // Novos usuários sempre criados como 'user'
      });

      if (result.success) {
        setSuccess('Conta criada com sucesso! Agora você pode entrar.');
        setIsRegister(false);
        // Limpar campos de registro
        setName('');
        setEmail('');
      } else {
        setError(result.message);
      }
    } else {
      const result = login(username, password);
      if (!result.success) {
        setError(result.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-4 shadow-2xl border border-white/20">
            <Palette className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Projetos</h1>
          <p className="text-violet-200">Sistema de Gestão Profissional</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isRegister ? 'Criar nova conta' : 'Entrar na sua conta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-green-200 text-sm">{success}</p>
              </div>
            )}

            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-violet-200 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-violet-300/50 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-violet-200 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-violet-300/50 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                    placeholder="seu@email.com"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-violet-200 mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-violet-300/50 outline-none transition-all",
                  "focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20",
                  "disabled:opacity-50"
                )}
                placeholder="Seu usuário"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-200 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-violet-300/50 outline-none transition-all",
                    "focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20",
                    "disabled:opacity-50"
                  )}
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all shadow-lg",
                isRegister
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/25"
                  : "bg-gradient-to-r from-violet-500 to-indigo-500 shadow-violet-500/25",
                "text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isRegister ? 'Criar Conta' : 'Entrar'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="text-violet-200 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
            >
              {isRegister ? (
                <>
                  <ArrowLeft size={16} />
                  Já tem uma conta? Entrar
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Não tem uma conta? Criar agora
                </>
              )}
            </button>
          </div>
        </div>

        {/* Admin List */}
        {!isRegister && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 px-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">Administradores</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {users
                .filter(u => u.role === 'admin' && u.isActive)
                .map(admin => (
                  <div
                    key={admin.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {admin.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{admin.name}</p>
                      <p className="text-[10px] text-violet-300/60">Admin Master</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-violet-300/60 text-sm mt-8">
          © 2026 Gestão de Projetos. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

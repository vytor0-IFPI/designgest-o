import React, { useState } from 'react';
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
        <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="glass-container inline-flex items-center justify-center w-20 h-20 mb-4 shadow-2xl mx-auto" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', marginBottom: '1rem' }}>
            <Palette className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Gestão de Projetos</h1>
          <p className="text-violet-200" style={{ color: '#ddd6fe' }}>Sistema de Gestão Profissional</p>
        </div>

        {/* Auth Card */}
        <div className="glass-container p-8 shadow-2xl animate-fade-in" style={{ padding: '2rem' }}>
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isRegister ? 'Criar nova conta' : 'Entrar na sua conta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl p-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '12px', color: '#fca5a5', marginBottom: '1rem' }}>
                <AlertCircle className="shrink-0" size={20} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isRegister && (
              <>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-violet-200">Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="premium-input"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-violet-200">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="premium-input"
                    placeholder="seu@email.com"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-violet-200">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="premium-input"
                placeholder="Seu usuário"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-violet-200">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="premium-input"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-300 hover:text-white transition-colors"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#c4b5fd' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="premium-button w-full"
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
          <div className="mt-8 pt-6 border-t border-white/10 text-center" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="text-violet-200 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 mx-auto"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }}
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

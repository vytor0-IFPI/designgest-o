import React, { useState } from 'react';
import { Palette, Eye, EyeOff, LogIn, AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login, addUser, users } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay para feel de segurança
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isRegister) {
      const result = addUser({
        name,
        email,
        username,
        password,
        role: 'user'
      });

      if (result.success) {
        setIsRegister(false);
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Elite Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-3xl shadow-[0_0_50px_rgba(124,58,237,0.3)] border border-white/10 group hover:scale-110 transition-transform duration-500">
            <Palette className="text-white group-hover:rotate-12 transition-transform" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">ELITE DESIGN</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Gestão de Próxima Geração</p>
        </div>

        {/* Auth Interface */}
        <div className="premium-card bg-zinc-950/40 backdrop-blur-xl border-white/5 p-8 shadow-2xl rounded-[2.5rem]">
          <h2 className="text-xl font-bold text-white mb-8 text-center tracking-tight">
            {isRegister ? 'Criar Identidade Elite' : 'Acesse seu Ecossistema'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 animate-shake">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">{error}</p>
              </div>
            )}

            {isRegister && (
              <>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Assinatura / Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="premium-input bg-zinc-950/60!"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Profissional</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="premium-input bg-zinc-950/60!"
                    placeholder="ex@elite.com"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Usuário de Acesso</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="premium-input bg-zinc-950/60!"
                placeholder="seu_id_elite"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Chave de Segurança</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="premium-input bg-zinc-950/60! pr-12!"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="premium-button w-full h-14 text-sm font-black uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
                  <span>{isRegister ? 'Confirmar Cadastro' : 'Iniciar Sessão'}</span>
                </div>
              )}
            </button>
          </form>

          {/* Alternative Actions */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 mx-auto group"
            >
              {isRegister ? (
                <>
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Voltar ao Login
                </>
              ) : (
                <>
                  <UserPlus size={16} className="group-hover:scale-125 transition-transform" />
                  Não é membro? Junte-se à Elite
                </>
              )}
            </button>
          </div>
        </div>

        {/* Admin Quick View (Optional aesthetic touch) */}
        {!isRegister && (
          <div className="mt-8 grid grid-cols-2 gap-4 animate-fade-in delay-200">
            {users
              .filter(u => u.role === 'admin' && u.isActive)
              .slice(0, 2)
              .map(admin => (
                <div key={admin.id} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/30 border border-white/5 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-white text-[10px] font-black">
                    {admin.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{admin.name}</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Admin Master</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Copyright Footer */}
        <p className="text-center text-zinc-700 text-[10px] font-bold mt-10 uppercase tracking-[0.4em]">
          © 2026 ELITE MS • Secured Protocol
        </p>
      </div>
    </div>
  );
}

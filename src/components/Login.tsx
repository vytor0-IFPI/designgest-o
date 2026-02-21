import { useState } from 'react';
import { Palette, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = login(username, password);
    
    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">DesignFlow</h1>
          <p className="text-violet-200">Sistema de Gestão para Design Gráfico</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
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
                placeholder="Digite seu usuário"
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
                  placeholder="Digite sua senha"
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
                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all",
                "bg-gradient-to-r from-violet-500 to-indigo-500 text-white",
                "hover:from-violet-600 hover:to-indigo-600",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-lg shadow-violet-500/25"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Info box */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-violet-200 text-sm text-center mb-2">
              <strong>Credenciais de teste:</strong>
            </p>
            <div className="space-y-1 text-center text-sm">
              <p className="text-violet-300">
                Admin: <code className="bg-white/10 px-2 py-0.5 rounded">admin</code> / <code className="bg-white/10 px-2 py-0.5 rounded">admin123</code>
              </p>
              <p className="text-violet-300">
                Usuário: <code className="bg-white/10 px-2 py-0.5 rounded">joao</code> / <code className="bg-white/10 px-2 py-0.5 rounded">123456</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-violet-300/60 text-sm mt-8">
          © 2024 DesignFlow. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

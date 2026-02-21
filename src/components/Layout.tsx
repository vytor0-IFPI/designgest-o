import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Menu,
  X,
  Palette,
  LogOut,
  UserCircle,
  Settings,
  ChevronDown,
  BarChart3,
  ClipboardList,
  Mail,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGmail } from '../context/GmailContext';
import { cn } from '../utils/cn';

type Page = 'dashboard' | 'clients' | 'projects' | 'users' | 'reports' | 'tasks';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: any; adminOnly?: boolean }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { page: 'clients', label: 'Clientes', icon: <Users size={20} /> },
  { page: 'projects', label: 'Projetos', icon: <FolderKanban size={20} /> },
  { page: 'tasks', label: 'Tarefas', icon: <ClipboardList size={20} /> },
  { page: 'reports', label: 'Relatórios', icon: <BarChart3 size={20} />, adminOnly: true },
  { page: 'users', label: 'Usuários', icon: <Settings size={20} />, adminOnly: true },
];

function GmailStatus() {
  const { isConnected, login } = useGmail();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-semibold animate-fade-in shadow-sm">
        <Check size={14} />
        <span className="hidden sm:inline">Gmail Conectado</span>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-full transition-all shadow-md active:scale-95"
    >
      <Mail size={14} />
      <span>Conectar Gmail</span>
    </button>
  );
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(item =>
    !item.adminOnly || user?.role === 'admin'
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-violet-900 to-indigo-900 z-50 transform transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Palette className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Gestão de Projetos</h1>
              <p className="text-violet-300 text-xs text-nowrap">Gestão Eficiente</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {filteredNavItems.map(item => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                  currentPage === item.page
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-violet-200 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.adminOnly && (
                  <span className="ml-auto text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">
                    Adm
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Info Bottom */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                {user ? getInitials(user.name) : '??'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-violet-300/60 uppercase">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-black border-b border-zinc-800 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-zinc-900 rounded-lg text-white"
              >
                <Menu size={24} />
              </button>

              <div>
                <h2 className="text-lg font-semibold text-white capitalize">
                  {filteredNavItems.find(i => i.page === currentPage)?.label}
                </h2>
              </div>
            </div>

            {/* Gmail Connection & User Menu */}
            <div className="flex items-center gap-3">
              <GmailStatus />

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                    user?.role === 'admin'
                      ? "bg-gradient-to-br from-amber-500 to-orange-600"
                      : "bg-gradient-to-br from-violet-500 to-indigo-600"
                  )}>
                    {user ? getInitials(user.name) : <UserCircle size={20} />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-zinc-400">
                      {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-zinc-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 z-50 overflow-hidden">
                      <div className="p-4 border-b border-zinc-800">
                        <p className="font-medium text-white">{user?.name}</p>
                        <p className="text-sm text-zinc-400">@{user?.username}</p>
                        <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">Sair</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "lg:hidden p-2 hover:bg-zinc-900 rounded-lg text-white",
                  !sidebarOpen && "invisible"
                )}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 bg-black min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

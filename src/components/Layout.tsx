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
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[10px] font-black uppercase tracking-widest animate-fade-in shadow-sm">
        <Check size={12} />
        <span className="hidden sm:inline">Conectado</span>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600 border border-violet-500/20 text-violet-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95"
    >
      <Mail size={12} />
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
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-white/5 z-50 transform transition-transform duration-300 lg:translate-x-0 shadow-2xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 h-full flex flex-col relative">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 mb-10 pl-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-900/20">
              <Palette className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-white font-black text-sm tracking-tighter uppercase mb-0.5">Elite Design</h1>
              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">Flow Systems</p>
            </div>
          </div>

          <nav className="space-y-1.5 flex-1">
            {filteredNavItems.map(item => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left group",
                  currentPage === item.page
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_20px_rgba(124,58,237,0.05)]"
                    : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200 border border-transparent"
                )}
              >
                <div className={cn(
                  "transition-transform duration-300 group-hover:scale-110",
                  currentPage === item.page ? "text-violet-500" : "text-zinc-600"
                )}>
                  {item.icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {item.adminOnly && (
                  <span className="ml-auto text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-lg uppercase font-black tracking-widest leading-none">
                    Adm
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Info Bottom */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg",
                user?.role === 'admin' ? "bg-amber-600" : "bg-violet-600"
              )}>
                {user ? getInitials(user.name) : '??'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate uppercase tracking-tighter">{user?.name}</p>
                <p className="text-[9px] text-zinc-600 font-extrabold uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 bg-black min-h-screen">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 lg:px-10 h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 hover:bg-zinc-900 rounded-xl text-zinc-400 transition-colors border border-white/5"
              >
                <Menu size={22} />
              </button>

              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-0.5">Sistemas Elite</span>
                <h2 className="text-xl font-black text-white tracking-tighter uppercase">
                  {filteredNavItems.find(i => i.page === currentPage)?.label}
                </h2>
              </div>
            </div>

            {/* Gmail Connection & User Menu */}
            <div className="flex items-center gap-4">
              <GmailStatus />

              <div className="h-8 w-[1px] bg-white/5 hidden sm:block mx-1" />

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-1.5 hover:bg-white/[0.03] rounded-2xl transition-all group border border-transparent hover:border-white/5"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-xl transition-transform group-hover:scale-105",
                    user?.role === 'admin'
                      ? "bg-gradient-to-br from-amber-500 to-orange-700"
                      : "bg-gradient-to-br from-violet-600 to-indigo-800"
                  )}>
                    {user ? getInitials(user.name) : <UserCircle size={20} />}
                  </div>
                  <div className="hidden sm:block text-left mr-1">
                    <p className="text-sm font-bold text-white tracking-tight">{user?.name}</p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">
                      {user?.role === 'admin' ? 'Acesso Master' : 'Integrante'}
                    </p>
                  </div>
                  <ChevronDown size={14} className={cn("text-zinc-600 transition-transform duration-300", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-3 w-64 bg-zinc-950 rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-fade-in py-2">
                      <div className="px-5 py-4 border-b border-white/5 mb-2">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-black">
                            {user ? getInitials(user.name) : <UserCircle size={20} />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate uppercase tracking-tighter">{user?.name}</p>
                            <p className="text-xs text-zinc-500 font-medium truncate">@{user?.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold bg-white/[0.03] p-2 rounded-lg border border-white/5">
                          <Mail size={12} className="text-violet-500" />
                          {user?.email}
                        </div>
                      </div>

                      <div className="px-2">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-500/10 rounded-xl transition-all group"
                        >
                          <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                            <LogOut size={16} />
                          </div>
                          <span className="font-black text-xs uppercase tracking-widest">Encerrar Sessão</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-12 bg-black min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

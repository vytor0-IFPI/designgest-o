import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';
import { useGmail } from './GmailContext';
import { cloudSync } from '../services/db';

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'isActive'>) => { success: boolean; message: string };
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  deleteUser: (id: string) => { success: boolean; message: string };
  toggleUserActive: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  users: 'designflow_users_v2',
  session: 'designflow_session_v2'
};

const defaultUsers: User[] = [
  {
    id: 'user-vytor',
    name: 'VYTOR',
    email: 'vytor@designflow.com',
    username: 'vytor',
    password: '1234',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  {
    id: 'user-kaian',
    name: 'KAIAN',
    email: 'kaian@designflow.com',
    username: 'kaian',
    password: '1234',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    isActive: true
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { sendNotification, sendAdminReport } = useGmail();
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.users);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.map((u: any) => ({ ...u, createdAt: new Date(u.createdAt) }))
          : defaultUsers;
      }
    } catch (e) {
      console.error("Erro ao carregar usuários localmente:", e);
    }
    return defaultUsers;
  });

  const [user, setUser] = useState<User | null>(null);

  // Sync users from cloud on mount
  useEffect(() => {
    const syncFromCloud = async () => {
      try {
        const cloudUsers = await cloudSync.fetch('users');
        if (cloudUsers) {
          const formatted = cloudUsers.map((u: any) => ({ ...u, createdAt: new Date(u.createdAt) }));
          setUsers(formatted);
        }
      } catch (e) {
        console.error("Erro no Sync cloud (Auth):", e);
      }
    };
    syncFromCloud();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);


  const login = (username: string, password: string): { success: boolean; message: string } => {
    const foundUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: 'Usuário ou senha incorretos' };
    }

    if (!foundUser.isActive) {
      return { success: false, message: 'Usuário desativado. Contate o administrador.' };
    }

    setUser(foundUser);

    // Enviar e-mail de alerta de login
    sendNotification(
      foundUser.email,
      'Novo Login Detectado 🔐',
      `
      <div style="background-color: #09090b; color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #1e1e21;">
        <h2 style="color: #7c3aed; margin-top: 0;">Olá, ${foundUser.name}!</h2>
        <p>Um novo acesso foi detectado em sua conta no <strong>Elite Management System</strong>.</p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #a1a1aa;"><strong>Usuário:</strong> ${foundUser.username}</p>
          <p style="margin: 5px 0 0 0; color: #a1a1aa;"><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        <p style="font-size: 14px; color: #a1a1aa;">Se não foi você, recomendamos alterar sua senha imediatamente para garantir a segurança dos seus dados.</p>
      </div>
      `
    ).then(res => {
      if (!res.success) console.warn('Alerta de login não enviado:', res.error);
    });

    return { success: true, message: 'Login realizado com sucesso!' };
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = (newUser: Omit<User, 'id' | 'createdAt' | 'isActive'>): { success: boolean; message: string } => {
    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      return { success: false, message: 'Este nome de usuário já existe' };
    }

    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      return { success: false, message: 'Este email já está cadastrado' };
    }

    const userToAdd: User = {
      ...newUser,
      id: uuidv4(),
      createdAt: new Date(),
      isActive: true
    };

    setUsers(prev => [...prev, userToAdd]);
    cloudSync.upsert('users', userToAdd);

    sendNotification(
      userToAdd.email,
      'Bem-vindo ao Gestão de Projetos! 🚀',
      `
      <h2 style="color: #7c3aed;">Olá, ${userToAdd.name}!</h2>
      <p>Sua conta foi criada com sucesso no nosso sistema de gestão.</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Seu usuário:</strong> ${userToAdd.username}</p>
        <p style="margin: 5px 0 0 0;"><strong>Seu cargo:</strong> ${userToAdd.role.toUpperCase()}</p>
      </div>
      <p>Agora você pode acessar o painel e começar a gerenciar seus fluxos de trabalho com excelência.</p>
      `
    );

    sendAdminReport('Novo Usuário Criado', `O usuário ${userToAdd.name} (${userToAdd.username}) foi registrado no sistema como ${userToAdd.role}.`);

    return { success: true, message: 'Usuário criado com sucesso!' };
  };

  const updateUser = (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      const userToUpdate = updated.find(u => u.id === id);
      if (userToUpdate) cloudSync.upsert('users', userToUpdate);
      return updated;
    });

    if (user?.id === id) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string): { success: boolean; message: string } => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return { success: false, message: 'Usuário não encontrado' };
    if (user?.id === id) return { success: false, message: 'Você não pode excluir seu próprio usuário' };

    const admins = users.filter(u => u.role === 'admin' && u.id !== id);
    if (userToDelete.role === 'admin' && admins.length === 0) {
      return { success: false, message: 'Não é possível excluir o último administrador' };
    }

    setUsers(prev => prev.filter(u => u.id !== id));
    cloudSync.delete('users', id);
    return { success: true, message: 'Usuário excluído com sucesso!' };
  };

  const toggleUserActive = (id: string) => {
    const userToToggle = users.find(u => u.id === id);
    if (user?.id === id) return;
    if (userToToggle?.role === 'admin' && userToToggle.isActive) {
      const activeAdmins = users.filter(u => u.role === 'admin' && u.isActive && u.id !== id);
      if (activeAdmins.length === 0) return;
    }

    setUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u);
      const userToUpdate = updated.find(u => u.id === id);
      if (userToUpdate) cloudSync.upsert('users', userToUpdate);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      isAuthenticated: !!user,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      toggleUserActive
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

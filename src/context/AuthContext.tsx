import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

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
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.users);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((u: User) => ({ ...u, createdAt: new Date(u.createdAt) }));
    }
    return defaultUsers;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.session);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Verificar se o usuário ainda existe e está ativo
      const savedUsers = localStorage.getItem(STORAGE_KEYS.users);
      if (savedUsers) {
        const allUsers = JSON.parse(savedUsers) as User[];
        const currentUser = allUsers.find(u => u.id === parsed.id && u.isActive);
        if (currentUser) {
          return { ...currentUser, createdAt: new Date(currentUser.createdAt) };
        }
      } else {
        // Usar usuários padrão se não houver no storage
        const currentUser = defaultUsers.find(u => u.id === parsed.id && u.isActive);
        if (currentUser) {
          return currentUser;
        }
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ id: user.id }));
    } else {
      localStorage.removeItem(STORAGE_KEYS.session);
    }
  }, [user]);

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
    return { success: true, message: 'Login realizado com sucesso!' };
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = (newUser: Omit<User, 'id' | 'createdAt' | 'isActive'>): { success: boolean; message: string } => {
    // Verificar se username já existe
    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      return { success: false, message: 'Este nome de usuário já existe' };
    }

    // Verificar se email já existe
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
    return { success: true, message: 'Usuário criado com sucesso!' };
  };

  const updateUser = (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));

    // Atualizar sessão se for o usuário logado
    if (user?.id === id) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string): { success: boolean; message: string } => {
    const userToDelete = users.find(u => u.id === id);

    if (!userToDelete) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    // Não permitir excluir o próprio usuário
    if (user?.id === id) {
      return { success: false, message: 'Você não pode excluir seu próprio usuário' };
    }

    // Não permitir excluir o último admin
    const admins = users.filter(u => u.role === 'admin' && u.id !== id);
    if (userToDelete.role === 'admin' && admins.length === 0) {
      return { success: false, message: 'Não é possível excluir o último administrador' };
    }

    setUsers(prev => prev.filter(u => u.id !== id));
    return { success: true, message: 'Usuário excluído com sucesso!' };
  };

  const toggleUserActive = (id: string) => {
    const userToToggle = users.find(u => u.id === id);

    // Não permitir desativar o próprio usuário
    if (user?.id === id) {
      return;
    }

    // Não permitir desativar o último admin ativo
    if (userToToggle?.role === 'admin' && userToToggle.isActive) {
      const activeAdmins = users.filter(u => u.role === 'admin' && u.isActive && u.id !== id);
      if (activeAdmins.length === 0) {
        return;
      }
    }

    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

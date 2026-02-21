import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Client, Project, Message } from '../types';

interface DataContextType {
  clients: Client[];
  projects: Project[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addMessage: (projectId: string, content: string, sender: 'client' | 'me') => void;
  getClientProjects: (clientId: string) => Project[];
  getClient: (clientId: string) => Client | undefined;
  getProject: (projectId: string) => Project | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  clients: 'designflow_clients',
  projects: 'designflow_projects'
};

// Dados iniciais de exemplo
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@empresa.com',
    phone: '(11) 99999-1234',
    company: 'Tech Solutions',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@startup.com',
    phone: '(11) 98888-5678',
    company: 'StartUp XYZ',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@loja.com',
    phone: '(21) 97777-9012',
    company: 'Loja Virtual',
    createdAt: new Date('2024-03-10')
  }
];

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Logo e Identidade Visual',
    description: 'Criação de logo completa com manual de marca e aplicações',
    clientId: '1',
    status: 'in_progress',
    priority: 'high',
    deadline: new Date('2024-12-30'),
    price: 2500,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    messages: [
      { id: '1', content: 'Oi! Gostaria de ver as primeiras versões do logo', sender: 'client', timestamp: new Date('2024-01-22'), projectId: '1' },
      { id: '2', content: 'Claro! Estou finalizando 3 opções diferentes', sender: 'me', timestamp: new Date('2024-01-22'), projectId: '1' },
      { id: '3', content: 'Perfeito! Fico no aguardo', sender: 'client', timestamp: new Date('2024-01-22'), projectId: '1' }
    ],
    tags: ['logo', 'identidade visual', 'branding']
  },
  {
    id: '2',
    title: 'Artes para Redes Sociais',
    description: 'Pack mensal com 20 posts para Instagram e Facebook',
    clientId: '2',
    status: 'pending',
    priority: 'medium',
    deadline: new Date('2024-12-15'),
    price: 800,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
    messages: [
      { id: '4', content: 'Consegue fazer posts mais coloridos esse mês?', sender: 'client', timestamp: new Date('2024-02-26'), projectId: '2' }
    ],
    tags: ['social media', 'instagram', 'facebook']
  },
  {
    id: '3',
    title: 'Catálogo de Produtos',
    description: 'Design de catálogo digital com 50 páginas',
    clientId: '3',
    status: 'review',
    priority: 'high',
    deadline: new Date('2024-12-10'),
    price: 3500,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-20'),
    messages: [
      { id: '5', content: 'Recebi o catálogo, vou analisar e te dou um retorno', sender: 'client', timestamp: new Date('2024-03-20'), projectId: '3' },
      { id: '6', content: 'Perfeito! Qualquer ajuste é só me avisar', sender: 'me', timestamp: new Date('2024-03-20'), projectId: '3' }
    ],
    tags: ['catálogo', 'editorial', 'produtos']
  },
  {
    id: '4',
    title: 'Cartão de Visita',
    description: 'Design de cartão de visita frente e verso',
    clientId: '1',
    status: 'completed',
    priority: 'low',
    price: 150,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    messages: [],
    tags: ['cartão', 'papelaria']
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.clients);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((c: Client) => ({ ...c, createdAt: new Date(c.createdAt) }));
    }
    return initialClients;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.projects);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((p: Project) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        deadline: p.deadline ? new Date(p.deadline) : undefined,
        messages: p.messages.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }))
      }));
    }
    return initialProjects;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  }, [projects]);

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: uuidv4(),
      createdAt: new Date()
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    setProjects(prev => prev.filter(p => p.clientId !== id));
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addMessage = (projectId: string, content: string, sender: 'client' | 'me') => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date(),
      projectId
    };
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, messages: [...p.messages, newMessage], updatedAt: new Date() } 
        : p
    ));
  };

  const getClientProjects = (clientId: string) => {
    return projects.filter(p => p.clientId === clientId);
  };

  const getClient = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  const getProject = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  return (
    <DataContext.Provider value={{
      clients,
      projects,
      addClient,
      updateClient,
      deleteClient,
      addProject,
      updateProject,
      deleteProject,
      addMessage,
      getClientProjects,
      getClient,
      getProject
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Client, Project, Message, Task, Note } from '../types';

interface DataContextType {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  notes: Note[];
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
  // Tasks & Notes
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  clients: 'designflow_clients',
  projects: 'designflow_projects',
  tasks: 'designflow_tasks',
  notes: 'designflow_notes'
};

const initialClients: Client[] = [
  /* ... existents ... */
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.clients);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((c: Client) => ({ ...c, createdAt: new Date(c.createdAt) }));
    }
    return [];
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
    return [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.tasks);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) }));
    }
    return [];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.notes);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  // Clients & Projects Methods (Simplificados para brevity conforme os originais)
  const addClient = (client: any) => setClients(prev => [...prev, { ...client, id: uuidv4(), createdAt: new Date() }]);
  const updateClient = (id: string, updates: any) => setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  const addProject = (project: any) => setProjects(prev => [...prev, { ...project, id: uuidv4(), createdAt: new Date(), updatedAt: new Date(), messages: [] }]);
  const updateProject = (id: string, updates: any) => setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p));
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));

  const addMessage = (projectId: string, content: string, sender: any) => {
    const newMessage = { id: uuidv4(), content, sender, timestamp: new Date(), projectId };
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, messages: [...p.messages, newMessage], updatedAt: new Date() } : p));
  };

  // Task Methods
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks(prev => [...prev, { ...task, id: uuidv4(), createdAt: new Date() }]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Note Methods
  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    setNotes(prev => [...prev, { ...note, id: uuidv4(), createdAt: new Date() }]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const getClientProjects = (clientId: string) => projects.filter(p => p.clientId === clientId);
  const getClient = (clientId: string) => clients.find(c => c.id === clientId);
  const getProject = (projectId: string) => projects.find(p => p.id === projectId);

  return (
    <DataContext.Provider value={{
      clients, projects, tasks, notes,
      addClient, updateClient, deleteClient,
      addProject, updateProject, deleteProject,
      addMessage, getClientProjects, getClient, getProject,
      addTask, updateTask, deleteTask, moveTask,
      addNote, deleteNote
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}

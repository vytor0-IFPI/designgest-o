import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Client, Project, Message, Task, Note } from '../types';
import { useGmail } from './GmailContext';
import { cloudSync } from '../services/db';

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
  const { sendNotification, sendAdminReport } = useGmail();
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

  // Cloud Sync on Mount
  useEffect(() => {
    const syncAll = async () => {
      const c = await cloudSync.fetch('clients');
      if (c) setClients(c.map((x: any) => ({ ...x, createdAt: new Date(x.createdAt) })));

      const p = await cloudSync.fetch('projects');
      if (p) setProjects(p.map((x: any) => ({
        ...x,
        createdAt: new Date(x.createdAt),
        updatedAt: new Date(x.updatedAt),
        deadline: x.deadline ? new Date(x.deadline) : undefined,
        messages: x.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      })));

      const t = await cloudSync.fetch('tasks');
      if (t) setTasks(t.map((x: any) => ({ ...x, createdAt: new Date(x.createdAt) })));

      const n = await cloudSync.fetch('notes');
      if (n) setNotes(n.map((x: any) => ({ ...x, createdAt: new Date(x.createdAt) })));
    };
    syncAll();
  }, []);

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

  const addClient = (client: any) => {
    const newClient = { ...client, id: uuidv4(), createdAt: new Date() };
    setClients(prev => [...prev, newClient]);
    cloudSync.upsert('clients', newClient);

    // E-mail para o cliente
    sendNotification(
      newClient.email,
      'Seja bem-vindo(a) à nossa base de clientes! ✨',
      `
      <h2 style="color: #7c3aed;">Olá, ${newClient.name}!</h2>
      <p>É um prazer ter você conosco. Seus dados foram cadastrados com sucesso no nosso sistema de gestão.</p>
      <p>A partir de agora, você receberá atualizações sobre seus projetos diretamente no seu e-mail.</p>
      <br/>
      <p>Estamos ansiosos para trabalhar juntos!</p>
      `
    );

    // Relatório para Admin
    sendAdminReport('Novo Cliente Cadastrado', `O cliente ${newClient.name} (${newClient.company}) foi adicionado ao sistema.`);
  };
  const updateClient = (id: string, updates: any) => setClients(prev => {
    const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
    const item = updated.find(x => x.id === id);
    if (item) cloudSync.upsert('clients', item);
    return updated;
  });
  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    cloudSync.delete('clients', id);
  };

  const addProject = (project: any) => {
    const newProject = { ...project, id: uuidv4(), createdAt: new Date(), updatedAt: new Date(), messages: [] };
    setProjects(prev => [...prev, newProject]);
    cloudSync.upsert('projects', newProject);
  };
  const updateProject = (id: string, updates: any) => setProjects(prev => {
    const updated = prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p);
    const item = updated.find(x => x.id === id);
    if (item) cloudSync.upsert('projects', item);
    return updated;
  });
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    cloudSync.delete('projects', id);
  };

  const addMessage = (projectId: string, content: string, sender: any) => {
    const newMessage = { id: uuidv4(), content, sender, timestamp: new Date(), projectId };
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, messages: [...p.messages, newMessage], updatedAt: new Date() } : p));
  };

  // Task Methods
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newItem = { ...task, id: uuidv4(), createdAt: new Date() };
    setTasks(prev => [...prev, newItem]);
    cloudSync.upsert('tasks', newItem);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      const item = updated.find(x => x.id === id);
      if (item) cloudSync.upsert('tasks', item);
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    cloudSync.delete('tasks', id);
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status: newStatus } : t);
      const item = updated.find(x => x.id === id);
      if (item) cloudSync.upsert('tasks', item);
      return updated;
    });
  };

  // Note Methods
  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote = { ...note, id: uuidv4(), createdAt: new Date() };
    setNotes(prev => [...prev, newNote]);
    cloudSync.upsert('notes', newNote);

    // Relatório para Admin (Anotações internas também são monitoradas)
    sendAdminReport('Nova Anotação Criada', `Uma nova anotação intitulada "${newNote.title}" foi criada no sistema.`);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    cloudSync.delete('notes', id);
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

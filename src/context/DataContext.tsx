import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Client, Project, Message, Task, Note } from '../types';
import { useGmail } from './GmailContext';
import { useAuth } from './AuthContext';
import { cloudSync } from '../services/db';

interface DataContextType {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  addClient: (client: Omit<Client, 'id' | 'userId' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addMessage: (projectId: string, content: string, sender: 'client' | 'me') => void;
  getClientProjects: (clientId: string) => Project[];
  getClient: (clientId: string) => Client | undefined;
  getProject: (projectId: string) => Project | undefined;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  clients: 'designflow_clients',
  projects: 'designflow_projects',
  tasks: 'designflow_tasks',
  notes: 'designflow_notes'
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { sendNotification, sendAdminReport } = useGmail();

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.clients);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })) : [];
      }
    } catch (e) { console.error("Error loading clients:", e); }
    return [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.projects);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          deadline: p.deadline ? new Date(p.deadline) : undefined,
          messages: Array.isArray(p.messages) ? p.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : []
        })) : [];
      }
    } catch (e) { console.error("Error loading projects:", e); }
    return [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.tasks);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })) : [];
      }
    } catch (e) { console.error("Error loading tasks:", e); }
    return [];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.notes);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) })) : [];
      }
    } catch (e) { console.error("Error loading notes:", e); }
    return [];
  });

  useEffect(() => {
    if (!user) return;
    const syncAll = async () => {
      try {
        const c = await cloudSync.fetch('clients', user.id);
        if (c) setClients(c.map((x: any) => ({ ...x, createdAt: new Date(x.createdAt) })));

        const p = await cloudSync.fetch('projects', user.id);
        if (p) setProjects(p.map((x: any) => ({
          ...x,
          createdAt: new Date(x.createdAt),
          updatedAt: new Date(x.updatedAt),
          deadline: x.deadline ? new Date(x.deadline) : undefined,
          messages: Array.isArray(x.messages) ? x.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : []
        })));

        const t = await cloudSync.fetch('tasks', user.id);
        if (t) setTasks(t.map((x: any) => ({ ...x, createdAt: new Date(x.createdAt) })));

        const n = await cloudSync.fetch('notes', user.id);
        if (n) setNotes(n.map((x: any) => ({ ...x, createdAt: new Date(x.createdAt) })));
      } catch (e) { console.error("Cloud Sync Error:", e); }
    };
    syncAll();
  }, [user]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes)); }, [notes]);

  const addClient = (client: any) => {
    if (!user) return;
    const newClient = { ...client, id: uuidv4(), userId: user.id, createdAt: new Date() };
    setClients(prev => [...prev, newClient]);
    cloudSync.upsert('clients', newClient);
    sendNotification(newClient.email, 'Bem-vindo! ✨', `<h2>Olá, ${newClient.name}!</h2><p>Cadastro realizado.</p>`);
    sendAdminReport('Novo Cliente', `O cliente ${newClient.name} foi adicionado.`);
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
    if (!user) return;
    const newProject = { ...project, id: uuidv4(), userId: user.id, createdAt: new Date(), updatedAt: new Date(), messages: [] };
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

  const addTask = (task: any) => {
    if (!user) return;
    const newItem = { ...task, id: uuidv4(), userId: user.id, createdAt: new Date() };
    setTasks(prev => [...prev, newItem]);
    cloudSync.upsert('tasks', newItem);
  };

  const updateTask = (id: string, updates: any) => setTasks(prev => {
    const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
    const item = updated.find(x => x.id === id);
    if (item) cloudSync.upsert('tasks', item);
    return updated;
  });

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    cloudSync.delete('tasks', id);
  };

  const moveTask = (id: string, newStatus: any) => updateTask(id, { status: newStatus });

  const addNote = (note: any) => {
    if (!user) return;
    const newNote = { ...note, id: uuidv4(), userId: user.id, createdAt: new Date() };
    setNotes(prev => [...prev, newNote]);
    cloudSync.upsert('notes', newNote);
    sendAdminReport('Nova Anotação', `Anotação "${newNote.title}" criada.`);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    cloudSync.delete('notes', id);
  };

  const userClients = clients.filter(c => c.userId === user?.id);
  const userProjects = projects.filter(p => p.userId === user?.id);
  const userTasks = tasks.filter(t => t.userId === user?.id);
  const userNotes = notes.filter(n => n.userId === user?.id);

  const getClientProjects = (clientId: string) => userProjects.filter(p => p.clientId === clientId);
  const getClient = (clientId: string) => userClients.find(c => c.id === clientId);
  const getProject = (projectId: string) => userProjects.find(p => p.id === projectId);

  return (
    <DataContext.Provider value={{
      clients: userClients, projects: userProjects, tasks: userTasks, notes: userNotes,
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

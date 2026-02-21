export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string; // Em produção, usar hash!
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'client' | 'me';
  timestamp: Date;
  projectId: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  tags: string[];
}

export type ProjectStatus = Project['status'];
export type ProjectPriority = Project['priority'];

export const statusLabels: Record<ProjectStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  review: 'Em Revisão',
  completed: 'Concluído',
  cancelled: 'Cancelado'
};

export const priorityLabels: Record<ProjectPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta'
};

export const statusColors: Record<ProjectStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export const priorityColors: Record<ProjectPriority, string> = {
  low: 'bg-slate-100 text-slate-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
}

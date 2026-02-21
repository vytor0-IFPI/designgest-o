import { useState } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Clock,
    AlertCircle,
    CheckCircle2,
    StickyNote,
    Trash2,
    MoveRight,
    ClipboardList
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Task, Note } from '../types';
import { cn } from '../utils/cn';

export function Tasks() {
    const { tasks, addTask, updateTask, moveTask, deleteTask, notes, addNote, deleteNote } = useData();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    const columns: { id: Task['status']; title: string; icon: any; color: string }[] = [
        { id: 'todo', title: 'A Fazer', icon: <ClipboardList size={18} />, color: 'text-slate-500' },
        { id: 'in_progress', title: 'Em Andamento', icon: <Clock size={18} />, color: 'text-blue-500' },
        { id: 'done', title: 'Concluído', icon: <CheckCircle2 size={18} />, color: 'text-green-500' }
    ];

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask({
            title: newTaskTitle,
            status: 'todo',
            priority: 'medium'
        });
        setNewTaskTitle('');
        setIsAddingTask(false);
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNoteTitle.trim()) return;
        addNote({
            title: newNoteTitle,
            content: newNoteContent,
            color: ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'][Math.floor(Math.random() * 4)]
        });
        setNewNoteTitle('');
        setNewNoteContent('');
        setIsAddingNote(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Tarefas & Anotações</h2>
                    <p className="text-slate-500">Organize sua rotina e mantenha lembretes importantes.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAddingNote(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-medium"
                    >
                        <StickyNote size={18} />
                        Nova Nota
                    </button>
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-medium"
                    >
                        <Plus size={18} />
                        Nova Tarefa
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {columns.map(column => (
                    <div key={column.id} className="bg-slate-100/50 rounded-2xl p-4 min-h-[500px] flex flex-col border border-slate-200/50">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <span className={column.color}>{column.icon}</span>
                                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider">{column.title}</h3>
                                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 border border-slate-200">
                                    {tasks.filter(t => t.status === column.id).length}
                                </span>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <div className="space-y-3 flex-1">
                            {tasks.filter(t => t.status === column.id).map(task => (
                                <div
                                    key={task.id}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:border-indigo-300 transition-all cursor-default"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                            task.priority === 'high' ? "bg-red-50 text-red-600" :
                                                task.priority === 'medium' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600"
                                        )}>
                                            {task.priority}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {column.id !== 'done' && (
                                                <button
                                                    onClick={() => moveTask(task.id, column.id === 'todo' ? 'in_progress' : 'done')}
                                                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                                                >
                                                    <MoveRight size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-800 leading-tight">{task.title}</h4>
                                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Intl.DateTimeFormat('pt-BR').format(task.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isAddingTask && column.id === 'todo' && (
                                <form onSubmit={handleAddTask} className="bg-white p-3 rounded-xl border-2 border-dashed border-indigo-200 animate-in zoom-in-95">
                                    <input
                                        autoFocus
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Título da tarefa..."
                                        className="w-full text-sm outline-none mb-3"
                                    />
                                    <div className="flex justify-end gap-2 text-[10px]">
                                        <button type="button" onClick={() => setIsAddingTask(false)} className="px-2 py-1 text-slate-400">Cancelar</button>
                                        <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded-lg">Adicionar</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <StickyNote className="text-amber-500" size={24} />
                    <h3 className="text-lg font-bold text-slate-800">Anotações Fixadas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {notes.map(note => (
                        <div key={note.id} className={cn("p-6 rounded-3xl shadow-sm relative group", note.color)}>
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="absolute top-4 right-4 p-1 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={14} />
                            </button>
                            <h4 className="font-bold text-slate-800 mb-2">{note.title}</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
                            <p className="mt-4 text-[10px] text-slate-500 font-medium">
                                {new Intl.DateTimeFormat('pt-BR').format(note.createdAt)}
                            </p>
                        </div>
                    ))}

                    {isAddingNote && (
                        <div className="p-6 rounded-3xl bg-white border-2 border-dashed border-amber-200 min-h-[200px] flex flex-col animate-in zoom-in-95">
                            <input
                                autoFocus
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                placeholder="Título da nota..."
                                className="font-bold outline-none mb-2"
                            />
                            <textarea
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                placeholder="Escreva algo..."
                                className="flex-1 text-sm outline-none resize-none"
                            />
                            <div className="mt-4 flex justify-end gap-2 text-xs">
                                <button onClick={() => setIsAddingNote(false)} className="px-3 py-1.5 text-slate-400">Cancelar</button>
                                <button onClick={handleAddNote} className="px-4 py-1.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200">Salvar</button>
                            </div>
                        </div>
                    )}

                    {notes.length === 0 && !isAddingNote && (
                        <div
                            onClick={() => setIsAddingNote(true)}
                            className="p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors min-h-[200px]"
                        >
                            <Plus size={32} className="mb-2 opacity-20" />
                            <p className="text-sm font-medium">Nenhuma nota ainda</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

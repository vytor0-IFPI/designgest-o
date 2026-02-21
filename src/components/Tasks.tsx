import { useState } from 'react';
import {
    Plus,
    Clock,
    CheckCircle2,
    StickyNote,
    Trash2,
    MoveRight,
    ClipboardList,
    MoreVertical
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Task } from '../types';
import { cn } from '../utils/cn';

export function Tasks() {
    const { tasks, addTask, moveTask, deleteTask, notes, addNote, deleteNote } = useData();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');

    const columns: { id: Task['status']; title: string; icon: any; color: string }[] = [
        { id: 'todo', title: 'A Fazer', icon: <ClipboardList size={18} />, color: 'text-zinc-500' },
        { id: 'in_progress', title: 'Em Andamento', icon: <Clock size={18} />, color: 'text-blue-500' },
        { id: 'done', title: 'Concluído', icon: <CheckCircle2 size={18} />, color: 'text-emerald-500' }
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
            color: ['bg-violet-500/10', 'bg-blue-500/10', 'bg-emerald-500/10', 'bg-amber-500/10'][Math.floor(Math.random() * 4)]
        });
        setNewNoteTitle('');
        setNewNoteContent('');
        setIsAddingNote(false);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Fluxo de Trabalho</h2>
                    <p className="text-zinc-500 font-medium">Gerencie suas tarefas e capture insights estratégicos.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddingNote(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]"
                    >
                        <StickyNote size={16} className="text-amber-500" />
                        Nova Nota
                    </button>
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="premium-button px-6"
                    >
                        <Plus size={18} />
                        Nova Tarefa
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {columns.map(column => (
                    <div key={column.id} className="bg-zinc-950/50 rounded-3xl p-5 min-h-[600px] flex flex-col border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-3">
                                <span className={cn("p-2 rounded-lg bg-white/5 border border-white/5", column.color)}>{column.icon}</span>
                                <h3 className="font-bold text-white uppercase text-xs tracking-widest">{column.title}</h3>
                                <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-black text-zinc-400 border border-white/5">
                                    {tasks.filter(t => t.status === column.id).length}
                                </span>
                            </div>
                            <button className="text-zinc-600 hover:text-white transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <div className="space-y-4 flex-1">
                            {tasks.filter(t => t.status === column.id).map(task => (
                                <div
                                    key={task.id}
                                    className="premium-card p-5 group border-white/5 hover:border-violet-500/30 cursor-default"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={cn(
                                            "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border",
                                            task.priority === 'high' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                task.priority === 'medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                    "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                        )}>
                                            {task.priority}
                                        </span>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            {column.id !== 'done' && (
                                                <button
                                                    onClick={() => moveTask(task.id, column.id === 'todo' ? 'in_progress' : 'done')}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg border border-transparent hover:border-blue-500/20"
                                                >
                                                    <MoveRight size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-white leading-relaxed group-hover:text-violet-400 transition-colors">{task.title}</h4>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-zinc-700" />
                                            {new Intl.DateTimeFormat('pt-BR').format(task.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isAddingTask && column.id === 'todo' && (
                                <form onSubmit={handleAddTask} className="premium-card p-4 border-dashed border-violet-500/40 bg-violet-500/5 animate-fade-in">
                                    <input
                                        autoFocus
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Título da tarefa..."
                                        className="premium-input bg-transparent! border-none! p-0! mb-4 text-sm font-bold placeholder:text-zinc-600"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button type="button" onClick={() => setIsAddingTask(false)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Cancelar</button>
                                        <button type="submit" className="px-4 py-1.5 bg-violet-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-violet-900/20">Adicionar</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notes Section */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <StickyNote className="text-amber-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Insights e Notas</h3>
                        <p className="text-xs text-zinc-500 font-medium">Lembretes rápidos para otimizar sua execução.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {notes.map(note => (
                        <div key={note.id} className={cn("p-6 rounded-[2rem] shadow-2xl relative group border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1", note.color)}>
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 size={14} />
                            </button>
                            <h4 className="font-bold text-white mb-3 text-lg leading-tight">{note.title}</h4>
                            <p className="text-sm text-zinc-300 leading-relaxed font-medium">{note.content}</p>
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                    {new Intl.DateTimeFormat('pt-BR').format(note.createdAt)}
                                </span>
                                <div className="w-8 h-1 bg-white/10 rounded-full" />
                            </div>
                        </div>
                    ))}

                    {isAddingNote && (
                        <div className="premium-card p-6 border-dashed border-amber-500/40 bg-amber-500/5 min-h-[200px] flex flex-col animate-fade-in rounded-[2rem]">
                            <input
                                autoFocus
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                placeholder="Título do Insight..."
                                className="premium-input bg-transparent! border-none! p-0! mb-3 text-lg font-bold placeholder:text-zinc-600 shadow-none!"
                            />
                            <textarea
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                placeholder="Descreva sua ideia..."
                                className="premium-input bg-transparent! border-none! p-0! flex-1 text-sm font-medium resize-none placeholder:text-zinc-700 shadow-none!"
                            />
                            <div className="mt-6 flex justify-end gap-4">
                                <button onClick={() => setIsAddingNote(false)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Abortar</button>
                                <button onClick={handleAddNote} className="px-5 py-2 bg-amber-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-amber-900/20">Salvar Insight</button>
                            </div>
                        </div>
                    )}

                    {notes.length === 0 && !isAddingNote && (
                        <button
                            onClick={() => setIsAddingNote(true)}
                            className="p-8 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-all min-h-[220px] group"
                        >
                            <Plus size={40} className="mb-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                            <p className="text-xs font-black uppercase tracking-widest">Nenhum insight fixado</p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

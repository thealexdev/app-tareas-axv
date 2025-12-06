import { useState } from 'react';
import { Todo } from './Todo';
import {
    Database,
    Briefcase,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Clock,
} from 'lucide-react';

export const Todos = ({ todos, deleteTodo, updateTodo }) => {
    const [activeTab, setActiveTab] = useState('datagram');

    const pendientes = todos.filter(todo => !todo.state).length;
    const completados = todos.filter(todo => todo.state).length;

    const todosDatagrama = todos.filter(todo => todo.type === 'datagram');
    const todosFreelance = todos.filter(todo => todo.type === 'freelance');
    const todosDiarias = todos.filter(todo => todo.type === 'diaria');
    const todosUrgentes = todos.filter(todo => todo.type === 'urgente');

    const getTodosActivos = () => {
        switch (activeTab) {
            case 'datagram':
                return todosDatagrama;
            case 'freelance':
                return todosFreelance;
            case 'diaria':
                return todosDiarias;
            case 'urgente':
                return todosUrgentes;
            default:
                return [];
        }
    };

    const todosActivos = getTodosActivos();

    const getEmptyMessage = () => {
        switch (activeTab) {
            case 'datagram':
                return 'No tienes tareas de Datagram';
            case 'freelance':
                return 'No tienes tareas de Freelance';
            case 'diaria':
                return 'No tienes tareas diarias';
            case 'urgente':
                return 'No tienes tareas urgentes';
            default:
                return 'No tienes tareas';
        }
    };

    return (
        <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex gap-1.5 flex-wrap">
                    <button
                        onClick={() => setActiveTab('datagram')}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                            activeTab === 'datagram'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        <Database size={14} />
                        Datagram
                    </button>
                    <button
                        onClick={() => setActiveTab('freelance')}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                            activeTab === 'freelance'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        <Briefcase size={14} />
                        Freelance
                    </button>
                    <button
                        onClick={() => setActiveTab('diaria')}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                            activeTab === 'diaria'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        <Calendar size={14} />
                        Diaria
                    </button>
                    <button
                        onClick={() => setActiveTab('urgente')}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                            activeTab === 'urgente'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                        }`}
                    >
                        <AlertTriangle size={14} />
                        Urgente
                    </button>
                </div>
                <div className="flex gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                        <Clock size={14} className="text-amber-400" />
                        <span className="text-slate-300 font-medium">
                            {pendientes}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span className="text-slate-300 font-medium">
                            {completados}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {todosActivos.map(todo => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        deleteTodo={deleteTodo}
                        updateTodo={updateTodo}
                    />
                ))}
                {todosActivos.length === 0 && (
                    <div className="bg-slate-950/50 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle2
                                size={40}
                                className="text-slate-700"
                            />
                            <p className="text-slate-500 text-sm">
                                {getEmptyMessage()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

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
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex gap-1.5 flex-wrap">
                    <button
                        onClick={() => setActiveTab('datagram')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            activeTab === 'datagram'
                                ? 'bg-[#238636] text-white'
                                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]'
                        }`}
                    >
                        <Database size={12} />
                        Datagram
                    </button>
                    <button
                        onClick={() => setActiveTab('freelance')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            activeTab === 'freelance'
                                ? 'bg-[#238636] text-white'
                                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]'
                        }`}
                    >
                        <Briefcase size={12} />
                        Freelance
                    </button>
                    <button
                        onClick={() => setActiveTab('diaria')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            activeTab === 'diaria'
                                ? 'bg-[#238636] text-white'
                                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]'
                        }`}
                    >
                        <Calendar size={12} />
                        Diaria
                    </button>
                    <button
                        onClick={() => setActiveTab('urgente')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            activeTab === 'urgente'
                                ? 'bg-[#238636] text-white'
                                : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]'
                        }`}
                    >
                        <AlertTriangle size={12} />
                        Urgente
                    </button>
                </div>
                <div className="flex gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] px-2 py-1 rounded">
                        <Clock size={12} className="text-[#58a6ff]" />
                        <span className="text-[#c9d1d9] font-medium">
                            {pendientes}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] px-2 py-1 rounded">
                        <CheckCircle2 size={12} className="text-[#238636]" />
                        <span className="text-[#c9d1d9] font-medium">
                            {completados}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
                <ul className="space-y-1.5">
                    {todosActivos.map(todo => (
                        <Todo
                            key={todo.id}
                            todo={todo}
                            deleteTodo={deleteTodo}
                            updateTodo={updateTodo}
                        />
                    ))}
                    {todosActivos.length === 0 && (
                        <li className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <CheckCircle2
                                    size={32}
                                    className="text-[#30363d]"
                                />
                                <p className="text-[#8b949e] text-sm">
                                    {getEmptyMessage()}
                                </p>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

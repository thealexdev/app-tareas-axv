import { useState } from 'react';
import { Todo } from './Todo';
import { CheckCircle2, Clock } from 'lucide-react';

// Función helper para obtener el icono según el tipo
const getTipoIcon = iconName => {
    // Esta función puede ser expandida con más iconos si lo deseas
    const icons = {
        Database: '💾',
        Briefcase: '💼',
        Calendar: '📅',
        AlertTriangle: '⚠️',
        Clock: '⏰',
        Star: '⭐',
        Target: '🎯',
        Book: '📚',
        Heart: '❤️',
        Home: '🏠',
    };
    return icons[iconName] || '📋';
};

export const Todos = ({ todos, deleteTodo, updateTodo, tiposTareas }) => {
    const [activeTab, setActiveTab] = useState(tiposTareas[0]?.id || 'diaria');

    const pendientes = todos.filter(todo => !todo.state).length;
    const completados = todos.filter(todo => todo.state).length;

    const getTodosByTipo = tipoId => {
        const todosFiltrados = todos.filter(todo => todo.type === tipoId);

        // Si el tipo requiere tiempo, ordenar por hora
        const tipo = tiposTareas.find(t => t.id === tipoId);
        if (tipo?.requiresTime) {
            return [...todosFiltrados].sort((a, b) => {
                // Primero los pendientes
                if (a.state !== b.state) {
                    return a.state ? 1 : -1;
                }
                // Luego por prioridad
                if (a.priority !== b.priority) {
                    return b.priority ? 1 : -1;
                }
                // Finalmente por hora
                if (!a.time) return 1;
                if (!b.time) return -1;
                return a.time.localeCompare(b.time);
            });
        }

        // Para otros tipos, ordenar por estado y prioridad
        return [...todosFiltrados].sort((a, b) => {
            // Primero los pendientes
            if (a.state !== b.state) {
                return a.state ? 1 : -1;
            }
            // Luego por prioridad
            if (a.priority !== b.priority) {
                return b.priority ? 1 : -1;
            }
            // Finalmente por fecha de creación (más recientes primero)
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    };

    const todosActivos = getTodosByTipo(activeTab);
    const tipoActivo = tiposTareas.find(t => t.id === activeTab);

    const getEmptyMessage = () => {
        const tipo = tiposTareas.find(t => t.id === activeTab);
        return tipo ? `No tienes tareas de ${tipo.nombre}` : 'No tienes tareas';
    };

    // Función para obtener las clases de color
    const getColorClasses = color => {
        const colorMap = {
            indigo: {
                bg: 'bg-indigo-600',
                hover: 'hover:bg-indigo-700',
                text: 'text-indigo-400',
            },
            emerald: {
                bg: 'bg-emerald-600',
                hover: 'hover:bg-emerald-700',
                text: 'text-emerald-400',
            },
            amber: {
                bg: 'bg-amber-600',
                hover: 'hover:bg-amber-700',
                text: 'text-amber-400',
            },
            rose: {
                bg: 'bg-rose-600',
                hover: 'hover:bg-rose-700',
                text: 'text-rose-400',
            },
            violet: {
                bg: 'bg-violet-600',
                hover: 'hover:bg-violet-700',
                text: 'text-violet-400',
            },
            cyan: {
                bg: 'bg-cyan-600',
                hover: 'hover:bg-cyan-700',
                text: 'text-cyan-400',
            },
            orange: {
                bg: 'bg-orange-600',
                hover: 'hover:bg-orange-700',
                text: 'text-orange-400',
            },
            pink: {
                bg: 'bg-pink-600',
                hover: 'hover:bg-pink-700',
                text: 'text-pink-400',
            },
            teal: {
                bg: 'bg-teal-600',
                hover: 'hover:bg-teal-700',
                text: 'text-teal-400',
            },
            lime: {
                bg: 'bg-lime-600',
                hover: 'hover:bg-lime-700',
                text: 'text-lime-400',
            },
            fuchsia: {
                bg: 'bg-fuchsia-600',
                hover: 'hover:bg-fuchsia-700',
                text: 'text-fuchsia-400',
            },
            sky: {
                bg: 'bg-sky-600',
                hover: 'hover:bg-sky-700',
                text: 'text-sky-400',
            },
        };
        return colorMap[color] || colorMap.indigo;
    };

    return (
        <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex gap-1.5 flex-wrap">
                    {tiposTareas.map(tipo => {
                        const colors = getColorClasses(tipo.color);
                        const isActive = activeTab === tipo.id;

                        return (
                            <button
                                key={tipo.id}
                                onClick={() => setActiveTab(tipo.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    isActive
                                        ? `${colors.bg} text-white`
                                        : 'bg-slate-800/50 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                                }`}
                            >
                                {tipo.icon && (
                                    <span className="text-sm">
                                        {getTipoIcon(tipo.icon)}
                                    </span>
                                )}
                                {tipo.nombre}
                            </button>
                        );
                    })}
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
                        tiposTareas={tiposTareas}
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

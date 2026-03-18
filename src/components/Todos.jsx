import { useState } from 'react';
import { Todo } from './Todo';
import {
    FiCheckCircle,
    FiClock,
    FiDatabase,
    FiBriefcase,
    FiCalendar,
    FiAlertTriangle,
    FiStar,
    FiTarget,
    FiBook,
    FiHeart,
    FiHome,
    FiList,
} from 'react-icons/fi';

const TIPO_ICONS = {
    Database: FiDatabase,
    Briefcase: FiBriefcase,
    Calendar: FiCalendar,
    AlertTriangle: FiAlertTriangle,
    Clock: FiClock,
    Star: FiStar,
    Target: FiTarget,
    Book: FiBook,
    Heart: FiHeart,
    Home: FiHome,
};

const TipoIcon = ({ name, size = 13, className = '' }) => {
    const Icon = TIPO_ICONS[name] || FiList;
    return <Icon size={size} className={className} />;
};

export const Todos = ({ todos, deleteTodo, updateTodo, tiposTareas }) => {
    const [activeTab, setActiveTab] = useState(tiposTareas[0]?.id || 'diaria');

    const pendientes = todos.filter(todo => !todo.state).length;
    const completados = todos.filter(todo => todo.state).length;

    const getTodosByTipo = tipoId => {
        const todosFiltrados = todos.filter(todo => todo.type === tipoId);
        const tipo = tiposTareas.find(t => t.id === tipoId);

        if (tipo?.requiresTime) {
            return [...todosFiltrados].sort((a, b) => {
                if (a.state !== b.state) return a.state ? 1 : -1;
                if (a.priority !== b.priority) return b.priority ? 1 : -1;
                if (!a.time) return 1;
                if (!b.time) return -1;
                return a.time.localeCompare(b.time);
            });
        }

        return [...todosFiltrados].sort((a, b) => {
            if (a.state !== b.state) return a.state ? 1 : -1;
            if (a.priority !== b.priority) return b.priority ? 1 : -1;
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    };

    const todosActivos = getTodosByTipo(activeTab);

    const getEmptyMessage = () => {
        const tipo = tiposTareas.find(t => t.id === activeTab);
        return tipo ? `No tienes tareas de ${tipo.nombre}` : 'No tienes tareas';
    };

    const getColorClasses = color => {
        const colorMap = {
            indigo: { bg: 'bg-indigo-600', text: 'text-indigo-400' },
            emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400' },
            amber: { bg: 'bg-amber-600', text: 'text-amber-400' },
            rose: { bg: 'bg-rose-600', text: 'text-rose-400' },
            violet: { bg: 'bg-violet-600', text: 'text-violet-400' },
            cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400' },
            orange: { bg: 'bg-orange-600', text: 'text-orange-400' },
            pink: { bg: 'bg-pink-600', text: 'text-pink-400' },
            teal: { bg: 'bg-teal-600', text: 'text-teal-400' },
            lime: { bg: 'bg-lime-600', text: 'text-lime-400' },
            fuchsia: { bg: 'bg-fuchsia-600', text: 'text-fuchsia-400' },
            sky: { bg: 'bg-sky-600', text: 'text-sky-400' },
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
                                    <TipoIcon
                                        name={tipo.icon}
                                        size={13}
                                        className={
                                            isActive
                                                ? 'text-white'
                                                : colors.text
                                        }
                                    />
                                )}
                                {tipo.nombre}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                        <FiClock size={14} className="text-amber-400" />
                        <span className="text-slate-300 font-medium">
                            {pendientes}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                        <FiCheckCircle size={14} className="text-emerald-400" />
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
                            <FiCheckCircle
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

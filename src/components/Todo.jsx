import { Trash2, Check, RotateCcw, Star, Clock } from 'lucide-react';

export const Todo = ({ todo, deleteTodo, updateTodo, tiposTareas }) => {
    const { title, description, state, priority, id, time, type } = todo;

    // Obtener el tipo de tarea
    const tipoTarea = tiposTareas?.find(t => t.id === type);

    // Función para obtener las clases de color del borde
    const getColorClasses = color => {
        const colorMap = {
            indigo: 'border-l-indigo-500',
            emerald: 'border-l-emerald-500',
            amber: 'border-l-amber-500',
            rose: 'border-l-rose-500',
            violet: 'border-l-violet-500',
            cyan: 'border-l-cyan-500',
            orange: 'border-l-orange-500',
            pink: 'border-l-pink-500',
            teal: 'border-l-teal-500',
            lime: 'border-l-lime-500',
            fuchsia: 'border-l-fuchsia-500',
            sky: 'border-l-sky-500',
        };
        return colorMap[color] || 'border-l-slate-500';
    };

    const borderColor = tipoTarea
        ? getColorClasses(tipoTarea.color)
        : 'border-l-slate-500';

    return (
        <div
            className={`bg-slate-950/50 rounded-lg p-3 hover:bg-slate-900/50 border-l-4 transition-all ${borderColor} ${
                state ? 'opacity-60' : ''
            }`}
        >
            <div className="flex items-start gap-2.5">
                <button
                    onClick={() => updateTodo(id)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        state
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'border-slate-700 hover:border-indigo-500'
                    }`}
                >
                    {state && <Check size={14} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h5
                                    className={`text-sm font-medium ${
                                        state
                                            ? 'text-slate-500 line-through'
                                            : 'text-slate-200'
                                    }`}
                                >
                                    {title}
                                </h5>
                                {priority && (
                                    <Star
                                        size={14}
                                        className="flex-shrink-0 text-amber-400 fill-amber-400"
                                    />
                                )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {tipoTarea && (
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full bg-${tipoTarea.color}-600/20 text-${tipoTarea.color}-400 font-medium`}
                                    >
                                        {tipoTarea.nombre}
                                    </span>
                                )}
                                {time && (
                                    <div className="flex items-center gap-1">
                                        <Clock
                                            size={12}
                                            className="text-slate-500"
                                        />
                                        <span className="text-xs text-slate-400">
                                            {time}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {description && (
                        <p
                            className={`text-xs mb-2.5 ${
                                state
                                    ? 'text-slate-600 line-through'
                                    : 'text-slate-400'
                            }`}
                        >
                            {description}
                        </p>
                    )}

                    <div className="flex gap-1.5">
                        <button
                            onClick={() => updateTodo(id)}
                            className={`${
                                state
                                    ? 'bg-slate-800/50 hover:bg-emerald-600/20 text-slate-400 hover:text-emerald-400'
                                    : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400'
                            } text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-medium`}
                        >
                            {state ? (
                                <>
                                    <RotateCcw size={12} />
                                    Reabrir
                                </>
                            ) : (
                                <>
                                    <Check size={12} />
                                    Completar
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => deleteTodo(id)}
                            className="bg-slate-800/50 hover:bg-red-600/20 text-slate-400 hover:text-red-400 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-medium"
                        >
                            <Trash2 size={12} />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

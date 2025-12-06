import { Trash2, Check, RotateCcw, Star } from 'lucide-react';

export const Todo = ({ todo, deleteTodo, updateTodo }) => {
    const { title, description, state, priority, id } = todo;

    return (
        <div className="bg-slate-950/50 rounded-lg p-3 hover:bg-slate-900/50">
            <div className="flex items-start gap-2.5">
                <button
                    onClick={() => updateTodo(id)}
                    className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center ${
                        state
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'border-slate-700 hover:border-indigo-500'
                    }`}
                >
                    {state && <Check size={12} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
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

                    {description && (
                        <p
                            className={`text-xs mb-2 ${
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
                            className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded-md flex items-center gap-1"
                        >
                            {state ? (
                                <RotateCcw size={12} />
                            ) : (
                                <Check size={12} />
                            )}
                            {state ? 'Reabrir' : 'Completar'}
                        </button>
                        <button
                            onClick={() => deleteTodo(id)}
                            className="bg-slate-800/50 hover:bg-red-600 text-slate-300 hover:text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
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

import { Trash2, Check, RotateCcw, Star } from 'lucide-react';

export const Todo = ({ todo, deleteTodo, updateTodo }) => {
    const { title, description, state, priority, id } = todo;

    return (
        <li className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2 hover:border-[#58a6ff] transition-all duration-200">
            <div className="flex items-start gap-2">
                <button
                    onClick={() => updateTodo(id)}
                    className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        state
                            ? 'bg-[#238636] border-[#238636]'
                            : 'border-[#30363d] hover:border-[#58a6ff]'
                    }`}
                >
                    {state && <Check size={10} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h5
                            className={`text-sm font-medium ${
                                state
                                    ? 'text-[#8b949e] line-through'
                                    : 'text-[#c9d1d9]'
                            }`}
                        >
                            {title}
                        </h5>
                        {priority && (
                            <Star
                                size={14}
                                className="flex-shrink-0 text-[#ffa657] fill-[#ffa657]"
                            />
                        )}
                    </div>
                    {description && (
                        <p
                            className={`text-xs mb-1.5 ${
                                state
                                    ? 'text-[#6e7681] line-through'
                                    : 'text-[#8b949e]'
                            }`}
                        >
                            {description}
                        </p>
                    )}

                    <div className="flex gap-1.5">
                        <button
                            onClick={() => updateTodo(id)}
                            className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs px-2 py-0.5 rounded transition-colors duration-200 flex items-center gap-1"
                        >
                            {state ? (
                                <RotateCcw size={10} />
                            ) : (
                                <Check size={10} />
                            )}
                            {state ? 'Reabrir' : 'Completar'}
                        </button>
                        <button
                            onClick={() => deleteTodo(id)}
                            className="bg-[#21262d] hover:bg-[#da3633] text-[#c9d1d9] hover:text-white text-xs px-2 py-0.5 rounded transition-colors duration-200 flex items-center gap-1"
                        >
                            <Trash2 size={10} />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Plus } from 'lucide-react';

export const Formulario = ({ addTodo }) => {
    const [todo, setTodo] = useState({
        title: '',
        description: '',
        priority: false,
        type: 'datagram',
    });

    const { title, description, priority, type } = todo;

    const handleSubmit = e => {
        e.preventDefault();

        if (!title.trim()) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'El título es obligatorio',
                background: '#0f172a',
                color: '#e2e8f0',
                confirmButtonColor: '#6366f1',
            });
        }

        addTodo({
            id: Date.now(),
            ...todo,
            state: false,
        });

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Todo agregado',
            showConfirmButton: false,
            timer: 1000,
            background: '#0f172a',
            color: '#e2e8f0',
        });

        setTodo({
            title: '',
            description: '',
            priority: false,
            type: 'datagram',
        });
    };

    const hanldeChange = e => {
        const { name, type, checked, value } = e.target;

        setTodo({
            ...todo,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    return (
        <div className="bg-slate-900/50 rounded-lg p-3">
            <h2 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Plus size={16} className="text-indigo-400" />
                Nueva Tarea
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <input
                        type="text"
                        placeholder="Título de la tarea"
                        className="w-full bg-slate-950/50 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        name="title"
                        value={title}
                        onChange={hanldeChange}
                    />
                </div>
                <div>
                    <textarea
                        className="w-full bg-slate-950/50 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                        placeholder="Descripción (opcional)"
                        name="description"
                        value={description}
                        onChange={hanldeChange}
                        rows="3"
                    />
                </div>

                <div className="space-y-2">
                    <select
                        className="w-full bg-slate-950/50 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                        name="type"
                        value={type}
                        onChange={hanldeChange}
                    >
                        <option value="datagram">Datagram</option>
                        <option value="freelance">Freelance</option>
                        <option value="diaria">Diaria</option>
                        <option value="urgente">Urgente</option>
                    </select>

                    <div className="flex items-center gap-2 bg-slate-950/50 rounded-md px-3 py-2">
                        <input
                            type="checkbox"
                            name="priority"
                            className="w-4 h-4 rounded bg-slate-900 text-indigo-500 focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                            id="inputCheck"
                            checked={priority}
                            onChange={hanldeChange}
                        />
                        <label
                            htmlFor="inputCheck"
                            className="text-sm text-slate-400 cursor-pointer select-none"
                        >
                            Marcar como prioridad
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-md"
                >
                    Agregar Tarea
                </button>
            </form>
        </div>
    );
};

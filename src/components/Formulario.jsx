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
                background: '#0d1117',
                color: '#c9d1d9',
                confirmButtonColor: '#238636',
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
            background: '#0d1117',
            color: '#c9d1d9',
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
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 h-full">
            <h2 className="text-base font-semibold text-[#c9d1d9] mb-3 flex items-center gap-2">
                <Plus size={16} />
                Nueva Tarea
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                    <input
                        type="text"
                        placeholder="Título"
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1.5 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors"
                        name="title"
                        value={title}
                        onChange={hanldeChange}
                    />
                </div>
                <div>
                    <textarea
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1.5 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors resize-none"
                        placeholder="Descripción (opcional)"
                        name="description"
                        value={description}
                        onChange={hanldeChange}
                        rows="3"
                    />
                </div>

                <div className="space-y-2">
                    <select
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1.5 text-sm text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors cursor-pointer"
                        name="type"
                        value={type}
                        onChange={hanldeChange}
                    >
                        <option value="datagram">Datagram</option>
                        <option value="freelance">Freelance</option>
                        <option value="diaria">Diaria</option>
                        <option value="urgente">Urgente</option>
                    </select>

                    <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-md px-2 py-1.5">
                        <input
                            type="checkbox"
                            name="priority"
                            className="w-4 h-4 rounded border-[#30363d] bg-[#0d1117] text-[#58a6ff] focus:ring-[#58a6ff] focus:ring-offset-0 cursor-pointer"
                            id="inputCheck"
                            checked={priority}
                            onChange={hanldeChange}
                        />
                        <label
                            htmlFor="inputCheck"
                            className="text-sm text-[#c9d1d9] cursor-pointer select-none"
                        >
                            Prioridad
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors duration-200"
                >
                    Agregar
                </button>
            </form>
        </div>
    );
};

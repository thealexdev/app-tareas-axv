import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Plus, Settings } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const Formulario = ({
    addTodo,
    useFirebase,
    userId,
    tiposTareas,
    onOpenTiposModal,
}) => {
    const [todo, setTodo] = useState({
        title: '',
        description: '',
        priority: false,
        type: tiposTareas[0]?.id || 'diaria',
        time: '',
    });

    const { title, description, priority, type, time } = todo;

    const handleSubmit = async e => {
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

        // Verificar si el tipo seleccionado requiere hora
        const tipoSeleccionado = tiposTareas.find(t => t.id === type);
        if (tipoSeleccionado?.requiresTime && !time) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: `La hora es obligatoria para tareas de tipo "${tipoSeleccionado.nombre}"`,
                background: '#0f172a',
                color: '#e2e8f0',
                confirmButtonColor: '#6366f1',
            });
        }

        const newTodo = {
            title,
            description,
            priority,
            type,
            time: tipoSeleccionado?.requiresTime ? time : null,
            state: false,
            userId: userId,
            createdAt: new Date().toISOString(),
        };

        try {
            if (useFirebase) {
                const docRef = await addDoc(collection(db, 'todos'), newTodo);
                addTodo({
                    id: docRef.id,
                    ...newTodo,
                });
            } else {
                addTodo({
                    id: Date.now().toString(),
                    ...newTodo,
                });
            }

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tarea agregada',
                showConfirmButton: false,
                timer: 1000,
                background: '#0f172a',
                color: '#e2e8f0',
            });

            setTodo({
                title: '',
                description: '',
                priority: false,
                type: tiposTareas[0]?.id || 'diaria',
                time: '',
            });
        } catch (error) {
            console.error('Error al agregar tarea:', error);

            addTodo({
                id: Date.now().toString(),
                ...newTodo,
            });

            Swal.fire({
                icon: 'warning',
                title: 'Tarea guardada localmente',
                text: 'No se pudo conectar con Firebase. La tarea se guardó en tu navegador.',
                background: '#0f172a',
                color: '#e2e8f0',
                confirmButtonColor: '#6366f1',
            });

            setTodo({
                title: '',
                description: '',
                priority: false,
                type: tiposTareas[0]?.id || 'diaria',
                time: '',
            });
        }
    };

    const handleChange = e => {
        const { name, type, checked, value } = e.target;

        setTodo({
            ...todo,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const tipoSeleccionado = tiposTareas.find(t => t.id === type);

    return (
        <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Plus size={16} className="text-indigo-400" />
                    Nueva Tarea
                </h2>
                <button
                    onClick={onOpenTiposModal}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-md transition-colors"
                    title="Gestionar tipos de tareas"
                >
                    <Settings size={14} />
                    Agregar tipo
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <input
                        type="text"
                        placeholder="Título de la tarea"
                        className="w-full bg-slate-950/50 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        name="title"
                        value={title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <textarea
                        className="w-full bg-slate-950/50 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                        placeholder="Descripción (opcional)"
                        name="description"
                        value={description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>

                <div className="space-y-2">
                    <select
                        className="w-full bg-slate-950/50 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                        name="type"
                        value={type}
                        onChange={handleChange}
                    >
                        {tiposTareas.map(tipo => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </option>
                        ))}
                    </select>

                    {tipoSeleccionado?.requiresTime && (
                        <input
                            type="time"
                            name="time"
                            value={time}
                            onChange={handleChange}
                            className="w-full bg-slate-950/50 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                            placeholder="Hora"
                        />
                    )}

                    <div className="flex items-center gap-2 bg-slate-950/50 rounded-md px-3 py-2">
                        <input
                            type="checkbox"
                            name="priority"
                            className="w-4 h-4 rounded bg-slate-900 text-indigo-500 focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                            id="inputCheck"
                            checked={priority}
                            onChange={handleChange}
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

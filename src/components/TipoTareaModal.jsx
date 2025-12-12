import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import Swal from 'sweetalert2';

const COLORES_DISPONIBLES = [
    { value: 'indigo', label: 'Índigo', class: 'bg-indigo-600' },
    { value: 'emerald', label: 'Esmeralda', class: 'bg-emerald-600' },
    { value: 'amber', label: 'Ámbar', class: 'bg-amber-600' },
    { value: 'rose', label: 'Rosa', class: 'bg-rose-600' },
    { value: 'violet', label: 'Violeta', class: 'bg-violet-600' },
    { value: 'cyan', label: 'Cian', class: 'bg-cyan-600' },
    { value: 'orange', label: 'Naranja', class: 'bg-orange-600' },
    { value: 'pink', label: 'Rosa fuerte', class: 'bg-pink-600' },
    { value: 'teal', label: 'Verde azulado', class: 'bg-teal-600' },
    { value: 'lime', label: 'Lima', class: 'bg-lime-600' },
    { value: 'fuchsia', label: 'Fucsia', class: 'bg-fuchsia-600' },
    { value: 'sky', label: 'Cielo', class: 'bg-sky-600' },
];

export const TipoTareaModal = ({
    isOpen,
    onClose,
    tiposTareas,
    onAddTipo,
    onDeleteTipo,
    onEditTipo,
}) => {
    const [nuevoTipo, setNuevoTipo] = useState({
        nombre: '',
        color: 'indigo',
    });
    const [editingTipo, setEditingTipo] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = e => {
        e.preventDefault();

        if (!nuevoTipo.nombre.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'El nombre del tipo es obligatorio',
                background: '#0f172a',
                color: '#e2e8f0',
                confirmButtonColor: '#6366f1',
            });
            return;
        }

        if (editingTipo) {
            // Modo edición
            const tipoExiste = tiposTareas.some(
                tipo =>
                    tipo.nombre.toLowerCase() ===
                        nuevoTipo.nombre.toLowerCase() &&
                    tipo.id !== editingTipo.id
            );

            if (tipoExiste) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: 'Ya existe un tipo con ese nombre',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    confirmButtonColor: '#6366f1',
                });
                return;
            }

            onEditTipo(editingTipo.id, nuevoTipo);
            setEditingTipo(null);
            setNuevoTipo({ nombre: '', color: 'indigo' });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tipo actualizado',
                showConfirmButton: false,
                timer: 1000,
                background: '#0f172a',
                color: '#e2e8f0',
            });
        } else {
            // Modo agregar
            const tipoExiste = tiposTareas.some(
                tipo =>
                    tipo.nombre.toLowerCase() === nuevoTipo.nombre.toLowerCase()
            );

            if (tipoExiste) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: 'Ya existe un tipo con ese nombre',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    confirmButtonColor: '#6366f1',
                });
                return;
            }

            onAddTipo(nuevoTipo);
            setNuevoTipo({ nombre: '', color: 'indigo' });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tipo agregado',
                showConfirmButton: false,
                timer: 1000,
                background: '#0f172a',
                color: '#e2e8f0',
            });
        }
    };

    const handleDelete = tipoId => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Las tareas de este tipo seguirán existiendo pero sin categoría',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#0f172a',
            color: '#e2e8f0',
        }).then(result => {
            if (result.isConfirmed) {
                onDeleteTipo(tipoId);
            }
        });
    };

    const handleEdit = tipo => {
        setEditingTipo(tipo);
        setNuevoTipo({
            nombre: tipo.nombre,
            color: tipo.color,
        });
    };

    const handleCancelEdit = () => {
        setEditingTipo(null);
        setNuevoTipo({ nombre: '', color: 'indigo' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-200">
                        Gestionar Tipos de Tareas
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Formulario para agregar tipo */}
                    <div className="bg-slate-950/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                            {editingTipo ? (
                                <>
                                    <Edit2
                                        size={16}
                                        className="text-amber-400"
                                    />
                                    Editar Tipo
                                </>
                            ) : (
                                <>
                                    <Plus
                                        size={16}
                                        className="text-indigo-400"
                                    />
                                    Agregar Nuevo Tipo
                                </>
                            )}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">
                                    Nombre del tipo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Personal, Trabajo, Estudio..."
                                    className="w-full bg-slate-900 rounded-md px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                    value={nuevoTipo.nombre}
                                    onChange={e =>
                                        setNuevoTipo({
                                            ...nuevoTipo,
                                            nombre: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-2">
                                    Color
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    {COLORES_DISPONIBLES.map(color => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() =>
                                                setNuevoTipo({
                                                    ...nuevoTipo,
                                                    color: color.value,
                                                })
                                            }
                                            className={`h-10 rounded-md ${
                                                color.class
                                            } ${
                                                nuevoTipo.color === color.value
                                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950'
                                                    : 'opacity-60 hover:opacity-100'
                                            } transition-all`}
                                            title={color.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-md flex items-center justify-center gap-2"
                                >
                                    {editingTipo ? (
                                        <>
                                            <Edit2 size={16} />
                                            Actualizar Tipo
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            Agregar Tipo
                                        </>
                                    )}
                                </button>
                                {editingTipo && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium py-2 px-3 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Lista de tipos existentes */}
                    <div className="bg-slate-950/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-slate-300 mb-3">
                            Tipos Actuales
                        </h3>
                        <div className="space-y-2">
                            {tiposTareas.map(tipo => (
                                <div
                                    key={tipo.id}
                                    className="flex items-center justify-between bg-slate-900 rounded-md p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-md bg-${tipo.color}-600 flex-shrink-0`}
                                        />
                                        <span className="text-sm text-slate-200 font-medium">
                                            {tipo.nombre}
                                        </span>
                                        {tipo.default && (
                                            <span className="text-xs bg-slate-800/50 text-slate-400 px-2 py-0.5 rounded">
                                                Predeterminado
                                            </span>
                                        )}
                                    </div>
                                    {!tipo.default && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(tipo)}
                                                className="text-slate-400 hover:text-indigo-400 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(tipo.id)
                                                }
                                                className="text-slate-400 hover:text-red-400 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

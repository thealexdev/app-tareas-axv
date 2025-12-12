import { useState, useEffect } from 'react';

const TIPOS_DEFAULT = [
    {
        id: 'diaria',
        nombre: 'Diaria',
        color: 'indigo',
        icon: 'Calendar',
        requiresTime: true,
        default: true,
    },
    {
        id: 'urgente',
        nombre: 'Urgente',
        color: 'rose',
        icon: 'AlertTriangle',
        requiresTime: false,
        default: true,
    },
    {
        id: 'importante',
        nombre: 'Importante',
        color: 'amber',
        icon: 'Star',
        requiresTime: false,
        default: true,
    },
    {
        id: 'recordatorio',
        nombre: 'Recordatorio',
        color: 'emerald',
        icon: 'Clock',
        requiresTime: false,
        default: true,
    },
];

export const useTiposTareas = () => {
    const [tiposTareas, setTiposTareas] = useState(() => {
        const stored = localStorage.getItem('tiposTareas');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error al cargar tipos de tareas:', error);
                return TIPOS_DEFAULT;
            }
        }
        return TIPOS_DEFAULT;
    });

    useEffect(() => {
        localStorage.setItem('tiposTareas', JSON.stringify(tiposTareas));
    }, [tiposTareas]);

    const addTipoTarea = nuevoTipo => {
        const id = nuevoTipo.nombre.toLowerCase().replace(/\s+/g, '-');
        const tipoCompleto = {
            id,
            nombre: nuevoTipo.nombre,
            color: nuevoTipo.color,
            icon: null,
            requiresTime: false,
            default: false,
        };
        setTiposTareas(prev => [...prev, tipoCompleto]);
    };

    const editTipoTarea = (tipoId, nuevosDatos) => {
        setTiposTareas(prev =>
            prev.map(tipo =>
                tipo.id === tipoId
                    ? {
                          ...tipo,
                          nombre: nuevosDatos.nombre,
                          color: nuevosDatos.color,
                      }
                    : tipo
            )
        );
    };

    const deleteTipoTarea = tipoId => {
        setTiposTareas(prev => prev.filter(tipo => tipo.id !== tipoId));
    };

    const resetTiposTareas = () => {
        setTiposTareas(TIPOS_DEFAULT);
    };

    return {
        tiposTareas,
        addTipoTarea,
        editTipoTarea,
        deleteTipoTarea,
        resetTiposTareas,
    };
};

import React, { useEffect, useState } from 'react';
import { Formulario } from './components/Formulario';
import { Todos } from './components/Todos';
import { Pomodoro } from './components/Pomodoro';
import { TipoTareaModal } from './components/TipoTareaModal';
import { useTiposTareas } from './hooks/useTipoTareas';
import useConfirmDialog from './hooks/useConfirmDialog';
import ConfirmModal from './components/ConfirmModal';
import { FiLogOut, FiUser, FiAlertTriangle } from 'react-icons/fi';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { db, auth } from './firebase/firebase';
import { signOut } from 'firebase/auth';

export const App = ({ user, onLogout }) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useFirebase, setUseFirebase] = useState(true);
    const [isTiposModalOpen, setIsTiposModalOpen] = useState(false);

    const { dialog, confirm, close, handleConfirm } = useConfirmDialog();
    const { tiposTareas, addTipoTarea, editTipoTarea, deleteTipoTarea } =
        useTiposTareas();

    useEffect(() => {
        let unsubscribe = null;

        const initializeApp = async () => {
            try {
                const todosQuery = query(
                    collection(db, 'todos'),
                    where('userId', '==', user.uid)
                );

                unsubscribe = onSnapshot(
                    todosQuery,
                    snapshot => {
                        const todosData = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setTodos(todosData);
                        setLoading(false);
                        setUseFirebase(true);
                    },
                    error => {
                        const localTodos = JSON.parse(
                            localStorage.getItem(`todos_${user.uid}`) || '[]'
                        );
                        setTodos(localTodos);
                        setUseFirebase(false);
                        setLoading(false);
                    }
                );
            } catch (error) {
                const localTodos = JSON.parse(
                    localStorage.getItem(`todos_${user.uid}`) || '[]'
                );
                setTodos(localTodos);
                setUseFirebase(false);
                setLoading(false);
            }
        };

        initializeApp();
        resetDailyTasks();
        const interval = setInterval(() => resetDailyTasks(), 60000);

        return () => {
            unsubscribe?.();
            clearInterval(interval);
        };
    }, [user.uid]);

    useEffect(() => {
        if (!useFirebase) {
            localStorage.setItem(`todos_${user.uid}`, JSON.stringify(todos));
        }
    }, [todos, useFirebase, user.uid]);

    const resetDailyTasks = async () => {
        const lastReset = localStorage.getItem('lastDailyReset');
        const now = new Date();
        const today1AM = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            1,
            0,
            0
        );

        if (!lastReset || new Date(lastReset) < today1AM) {
            if (useFirebase) {
                try {
                    const querySnapshot = await getDocs(
                        query(
                            collection(db, 'todos'),
                            where('userId', '==', user.uid)
                        )
                    );
                    const resetPromises = [];
                    querySnapshot.forEach(document => {
                        const todo = document.data();
                        if (todo.type === 'diaria' && todo.state === true) {
                            resetPromises.push(
                                updateDoc(doc(db, 'todos', document.id), {
                                    state: false,
                                })
                            );
                        }
                    });
                    await Promise.all(resetPromises);
                    localStorage.setItem('lastDailyReset', now.toISOString());
                } catch (error) {}
            } else {
                setTodos(prev =>
                    prev.map(todo =>
                        todo.type === 'diaria' && todo.state
                            ? { ...todo, state: false }
                            : todo
                    )
                );
                localStorage.setItem('lastDailyReset', now.toISOString());
            }
        }
    };

    const addTodo = todo => setTodos(prev => [...prev, todo]);

    const deleteTodo = id => {
        confirm({
            variant: 'danger',
            title: '¿Eliminar tarea?',
            description: 'Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            onConfirm: async () => {
                if (useFirebase) {
                    try {
                        await deleteDoc(doc(db, 'todos', id));
                    } catch (error) {}
                }
                setTodos(prev => prev.filter(todo => todo.id !== id));
            },
        });
    };

    const updateTodo = async id => {
        if (useFirebase) {
            try {
                const todoToUpdate = todos.find(todo => todo.id === id);
                await updateDoc(doc(db, 'todos', id), {
                    state: !todoToUpdate.state,
                });
            } catch (error) {}
        }
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, state: !todo.state } : todo
            )
        );
    };

    const handleLogout = () => {
        confirm({
            variant: 'warning',
            title: '¿Cerrar sesión?',
            description: 'Se guardará tu progreso antes de salir.',
            confirmText: 'Cerrar sesión',
            onConfirm: async () => {
                try {
                    await signOut(auth);
                    onLogout();
                } catch (error) {}
            },
        });
    };

    const orderTodo = arrayTodos =>
        [...arrayTodos].sort((a, b) => b.priority - a.priority);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
                    <div className="text-slate-400">Cargando...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 flex items-center justify-end gap-3">
                    <div className="bg-slate-900/50 rounded-lg px-4 py-2 flex items-center gap-2">
                        <FiUser size={16} className="text-indigo-400" />
                        <span className="text-sm text-slate-300">
                            {user.displayName || user.email}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-slate-900/50 hover:bg-red-600/20 text-slate-300 hover:text-red-400 rounded-lg px-4 py-2 flex items-center gap-2 text-sm"
                    >
                        <FiLogOut size={16} />
                        Cerrar sesión
                    </button>
                </div>

                {!useFirebase && (
                    <div className="mb-3 bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
                        <p className="text-amber-400 text-xs text-center flex items-center justify-center gap-2">
                            <FiAlertTriangle size={13} />
                            Modo offline - Los datos se guardan en tu navegador
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
                    <div className="lg:col-span-1">
                        <Formulario
                            addTodo={addTodo}
                            useFirebase={useFirebase}
                            userId={user.uid}
                            tiposTareas={tiposTareas}
                            onOpenTiposModal={() => setIsTiposModalOpen(true)}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <Todos
                            todos={orderTodo(todos)}
                            deleteTodo={deleteTodo}
                            updateTodo={updateTodo}
                            tiposTareas={tiposTareas}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-1">
                        <Pomodoro />
                    </div>
                </div>
            </div>

            <TipoTareaModal
                isOpen={isTiposModalOpen}
                onClose={() => setIsTiposModalOpen(false)}
                tiposTareas={tiposTareas}
                onAddTipo={addTipoTarea}
                onEditTipo={editTipoTarea}
                onDeleteTipo={deleteTipoTarea}
            />

            <ConfirmModal
                open={dialog.open}
                onClose={close}
                onConfirm={handleConfirm}
                title={dialog.title}
                description={dialog.description}
                variant={dialog.variant}
                confirmText={dialog.confirmText}
            />
        </div>
    );
};

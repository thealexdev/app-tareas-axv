import React, { useEffect, useState } from 'react';
import { Formulario } from './components/Formulario';
import { Todos } from './components/Todos';
import { Pomodoro } from './components/Pomodoro';
import { TipoTareaModal } from './components/TipoTareaModal';
import { useTiposTareas } from './hooks/useTiposTareas';
import { LogOut, User } from 'lucide-react';
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
import Swal from 'sweetalert2';

export const App = ({ user, onLogout }) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useFirebase, setUseFirebase] = useState(true);
    const [isTiposModalOpen, setIsTiposModalOpen] = useState(false);

    // Hook para gestionar tipos de tareas
    const { tiposTareas, addTipoTarea, editTipoTarea, deleteTipoTarea } =
        useTiposTareas();

    useEffect(() => {
        let unsubscribe = null;

        const initializeApp = async () => {
            try {
                // Filtrar todos del usuario actual
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
                        console.log('✅ Conectado a Firebase');
                    },
                    error => {
                        console.error('❌ Error de Firebase:', error);
                        const localTodos = JSON.parse(
                            localStorage.getItem(`todos_${user.uid}`) || '[]'
                        );
                        setTodos(localTodos);
                        setUseFirebase(false);
                        setLoading(false);
                        console.log('ℹ️ Usando localStorage como fallback');
                    }
                );
            } catch (error) {
                console.error('❌ Error al inicializar Firebase:', error);
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
        const interval = setInterval(() => {
            resetDailyTasks();
        }, 60000);

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
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
                } catch (error) {
                    console.error('Error al resetear tareas diarias:', error);
                }
            } else {
                const updatedTodos = todos.map(todo => {
                    if (todo.type === 'diaria' && todo.state === true) {
                        return { ...todo, state: false };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                localStorage.setItem('lastDailyReset', now.toISOString());
            }
        }
    };

    const addTodo = todo => {
        setTodos([...todos, todo]);
    };

    const deleteTodo = async id => {
        if (useFirebase) {
            try {
                await deleteDoc(doc(db, 'todos', id));
            } catch (error) {
                console.error('Error al eliminar tarea:', error);
            }
        }
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const updateTodo = async id => {
        if (useFirebase) {
            try {
                const todoToUpdate = todos.find(todo => todo.id === id);
                await updateDoc(doc(db, 'todos', id), {
                    state: !todoToUpdate.state,
                });
            } catch (error) {
                console.error('Error al actualizar tarea:', error);
            }
        }

        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, state: !todo.state } : todo
            )
        );
    };

    const orderTodo = arrayTodos => {
        return [...arrayTodos].sort((a, b) => b.priority - a.priority);
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: 'Se guardará tu progreso',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            background: '#0f172a',
            color: '#e2e8f0',
        });

        if (result.isConfirmed) {
            try {
                await signOut(auth);
                onLogout();
                Swal.fire({
                    icon: 'success',
                    title: '¡Hasta pronto!',
                    text: 'Sesión cerrada correctamente',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    confirmButtonColor: '#6366f1',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cerrar sesión',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    confirmButtonColor: '#6366f1',
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    <div className="text-slate-400">Cargando...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header con info del usuario */}
                <div className="mb-4 flex items-center justify-end gap-3">
                    <div className="bg-slate-900/50 rounded-lg px-4 py-2 flex items-center gap-2">
                        <User size={16} className="text-indigo-400" />
                        <span className="text-sm text-slate-300">
                            {user.displayName || user.email}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-slate-900/50 hover:bg-red-600/20 text-slate-300 hover:text-red-400 rounded-lg px-4 py-2 flex items-center gap-2 text-sm"
                    >
                        <LogOut size={16} />
                        Cerrar sesión
                    </button>
                </div>

                {!useFirebase && (
                    <div className="mb-3 bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
                        <p className="text-amber-400 text-xs text-center">
                            ⚠️ Modo offline - Los datos se guardan en tu
                            navegador
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

            {/* Modal de gestión de tipos */}
            <TipoTareaModal
                isOpen={isTiposModalOpen}
                onClose={() => setIsTiposModalOpen(false)}
                tiposTareas={tiposTareas}
                onAddTipo={addTipoTarea}
                onEditTipo={editTipoTarea}
                onDeleteTipo={deleteTipoTarea}
            />
        </div>
    );
};

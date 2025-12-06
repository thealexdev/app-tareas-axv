import React, { useEffect, useState } from 'react';
import { Formulario } from './components/Formulario';
import { Todos } from './components/Todos';
import { Pomodoro } from './components/Pomodoro';
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase/firebase';

export const App = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [useFirebase, setUseFirebase] = useState(true);

    useEffect(() => {
        let unsubscribe = null;

        const initializeApp = async () => {
            try {
                // Intentar conectar con Firebase
                unsubscribe = onSnapshot(
                    collection(db, 'todos'),
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
                        // Fallback a localStorage
                        const localTodos = JSON.parse(
                            localStorage.getItem('todos') || '[]'
                        );
                        setTodos(localTodos);
                        setUseFirebase(false);
                        setLoading(false);
                        console.log('ℹ️ Usando localStorage como fallback');
                    }
                );
            } catch (error) {
                console.error('❌ Error al inicializar Firebase:', error);
                // Fallback a localStorage
                const localTodos = JSON.parse(
                    localStorage.getItem('todos') || '[]'
                );
                setTodos(localTodos);
                setUseFirebase(false);
                setLoading(false);
            }
        };

        initializeApp();

        // Resetear tareas diarias
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
    }, []);

    // Guardar en localStorage cuando cambien los todos (fallback)
    useEffect(() => {
        if (!useFirebase) {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }, [todos, useFirebase]);

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
                        collection(db, 'todos')
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
                // Reset con localStorage
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
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <Todos
                            todos={orderTodo(todos)}
                            deleteTodo={deleteTodo}
                            updateTodo={updateTodo}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-1">
                        <Pomodoro />
                    </div>
                </div>
            </div>
        </div>
    );
};

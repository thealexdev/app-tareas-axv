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

    useEffect(() => {
        // Suscripción en tiempo real a los cambios en Firebase
        const unsubscribe = onSnapshot(
            collection(db, 'todos'),
            snapshot => {
                const todosData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTodos(todosData);
                setLoading(false);
            },
            error => {
                console.error('Error al escuchar cambios:', error);
                setLoading(false);
            }
        );

        // Resetear tareas diarias
        resetDailyTasks();
        const interval = setInterval(() => {
            resetDailyTasks();
        }, 60000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

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
            try {
                const querySnapshot = await getDocs(collection(db, 'todos'));
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
        }
    };

    const addTodo = todo => {
        setTodos([...todos, todo]);
    };

    const deleteTodo = async id => {
        try {
            await deleteDoc(doc(db, 'todos', id));
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    };

    const updateTodo = async id => {
        try {
            const todoToUpdate = todos.find(todo => todo.id === id);
            await updateDoc(doc(db, 'todos', id), {
                state: !todoToUpdate.state,
            });

            setTodos(
                todos.map(todo =>
                    todo.id === id ? { ...todo, state: !todo.state } : todo
                )
            );
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
    };

    const orderTodo = arrayTodos => {
        return [...arrayTodos].sort((a, b) => b.priority - a.priority);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-slate-400">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
                    <div className="lg:col-span-1">
                        <Formulario addTodo={addTodo} />
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

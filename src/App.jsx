import React, { useEffect, useState } from 'react';
import { Formulario } from './components/Formulario';
import { Todos } from './components/Todos';
import { ListTodo } from 'lucide-react';

const initialStateTodos = JSON.parse(localStorage.getItem('todos')) || [];

export const App = () => {
    const [todos, setTodos] = useState(initialStateTodos);

    const resetDailyTasks = () => {
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
            const updatedTodos = todos.map(todo => {
                if (todo.type === 'diaria' && todo.state === true) {
                    return { ...todo, state: false };
                }
                return todo;
            });

            setTodos(updatedTodos);
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            localStorage.setItem('lastDailyReset', now.toISOString());
        }
    };

    useEffect(() => {
        resetDailyTasks();
        const interval = setInterval(() => {
            resetDailyTasks();
        }, 60000);
        return () => clearInterval(interval);
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = todo => {
        setTodos([...todos, todo]);
    };

    const deleteTodo = id => {
        const newArray = todos.filter(todo => todo.id !== id);
        setTodos(newArray);
        localStorage.setItem('todos', JSON.stringify(newArray));
    };

    const updateTodo = id => {
        const newArray = todos.map(todo => {
            if (todo.id === id) {
                todo.state = !todo.state;
            }
            return todo;
        });
        setTodos(newArray);
    };

    const orderTodo = arrayTodos =>
        arrayTodos.sort((a, b) => b.priority - a.priority);

    return (
        <div className="min-h-screen bg-slate-950 p-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-4">
                    <h1 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                        <ListTodo size={20} className="text-indigo-400" />
                        Gestor de Tareas
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
            </div>
        </div>
    );
};

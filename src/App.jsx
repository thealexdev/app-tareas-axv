import React, { useEffect, useState } from 'react';
import { Formulario } from './components/Formulario';
import { Todos } from './components/Todos';
import { ListTodo } from 'lucide-react';

const initialStateTodos = JSON.parse(localStorage.getItem('todos')) || [];

export const App = () => {
    const [todos, setTodos] = useState(initialStateTodos);

    // Función para resetear tareas diarias
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

        // Si es después de la 1 AM y no se ha reseteado hoy
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
        // Resetear tareas diarias al cargar la app
        resetDailyTasks();

        // Verificar cada minuto si es necesario resetear
        const interval = setInterval(() => {
            resetDailyTasks();
        }, 60000); // Cada 60 segundos

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
        <div className="h-screen bg-[#010409] p-4 overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                <header className="mb-3 flex-shrink-0">
                    <h1 className="text-xl font-bold text-[#c9d1d9] flex items-center gap-2">
                        <ListTodo size={24} />
                        Gestor de Tareas
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 overflow-hidden">
                    <div className="lg:col-span-1 h-full overflow-hidden">
                        <Formulario addTodo={addTodo} />
                    </div>
                    <div className="lg:col-span-2 h-full overflow-hidden">
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

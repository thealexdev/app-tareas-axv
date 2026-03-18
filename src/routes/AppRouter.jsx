import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase/firebase';
import { Login } from '../auth/Login';
import { App } from '../App';
import { Page } from '../page/Page';

export const AppRouter = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = currentUser => {
        setUser(currentUser);
    };

    const handleLogout = () => {
        setUser(null);
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
        <Routes>
            {/* Landing */}
            <Route path="/" element={<Page />} />

            {/* Login */}
            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate to="/app" />
                    ) : (
                        <Login onLogin={handleLogin} />
                    )
                }
            />

            {/* App privada */}
            <Route
                path="/app"
                element={
                    user ? (
                        <App user={user} onLogout={handleLogout} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

import React, { useState } from 'react';
import { LogIn, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import Swal from 'sweetalert2';

export const Login = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const { name, email, password } = formData;

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                // Registro
                if (!name.trim()) {
                    throw new Error('El nombre es obligatorio');
                }
                if (password.length < 6) {
                    throw new Error(
                        'La contraseña debe tener al menos 6 caracteres'
                    );
                }

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                // Actualizar el perfil con el nombre
                await updateProfile(userCredential.user, {
                    displayName: name,
                });

                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: `Bienvenido ${name}`,
                    background: '#0f172a',
                    color: '#e2e8f0',
                    confirmButtonColor: '#6366f1',
                    timer: 2000,
                });

                onLogin(userCredential.user);
            } else {
                // Login
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Hola ${
                        userCredential.user.displayName || 'Usuario'
                    }`,
                    background: '#0f172a',
                    color: '#e2e8f0',
                    confirmButtonColor: '#6366f1',
                    timer: 1500,
                    showConfirmButton: false,
                });

                onLogin(userCredential.user);
            }
        } catch (error) {
            let errorMessage = 'Ocurrió un error';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este correo ya está registrado';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Correo electrónico inválido';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Usuario no encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Credenciales inválidas';
                    break;
                default:
                    errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                background: '#0f172a',
                color: '#e2e8f0',
                confirmButtonColor: '#6366f1',
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-900/50 rounded-lg p-8 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                            <LogIn size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 mb-2">
                            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {isRegister
                                ? 'Regístrate para gestionar tus tareas'
                                : 'Accede a tu gestor de tareas'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Nombre
                                </label>
                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 rounded-md pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                        placeholder="Tu nombre"
                                        required={isRegister}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 rounded-md pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 rounded-md pl-10 pr-12 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {isRegister && (
                                <p className="text-xs text-slate-500 mt-1">
                                    Mínimo 6 caracteres
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>
                                        {isRegister
                                            ? 'Crear cuenta'
                                            : 'Iniciar sesión'}
                                    </span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={toggleMode}
                            className="text-sm text-slate-400 hover:text-indigo-400"
                        >
                            {isRegister ? (
                                <>
                                    ¿Ya tienes cuenta?{' '}
                                    <span className="text-indigo-400 font-medium">
                                        Inicia sesión
                                    </span>
                                </>
                            ) : (
                                <>
                                    ¿No tienes cuenta?{' '}
                                    <span className="text-indigo-400 font-medium">
                                        Regístrate
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-600">
                        Tus datos están protegidos con Firebase Authentication
                    </p>
                </div>
            </div>
        </div>
    );
};

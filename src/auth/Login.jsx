import { useState, useEffect } from 'react';
import {
    FiZap,
    FiMail,
    FiLock,
    FiUser,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiLogIn,
} from 'react-icons/fi';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import Swal from 'sweetalert2';

const swalBase = {
    background: '#07090f',
    color: '#e2e8f0',
    confirmButtonColor: '#6366f1',
};

const Field = ({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    icon: Icon,
    right,
}) => (
    <div className="flex flex-col gap-1.5">
        <label
            style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: '.72rem',
                fontWeight: 600,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.35)',
            }}
        >
            {label}
        </label>
        <div className="relative">
            <Icon
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                style={{
                    fontFamily: "'Manrope',sans-serif",
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px',
                    color: 'rgba(255,255,255,.85)',
                    fontSize: '.875rem',
                    outline: 'none',
                    transition: 'border-color .2s, box-shadow .2s',
                    width: '100%',
                    padding: right
                        ? '.6rem 2.8rem .6rem 2.4rem'
                        : '.6rem 1rem .6rem 2.4rem',
                }}
                onFocus={e => {
                    e.target.style.borderColor = 'rgba(99,102,241,.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,.1)';
                }}
                onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.target.style.boxShadow = 'none';
                }}
            />
            {right && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {right}
                </div>
            )}
        </div>
    </div>
);

export const Login = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Manrope:wght@400;500;600&display=swap';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isRegister) {
                if (!name.trim()) throw new Error('El nombre es obligatorio');
                if (password.length < 6)
                    throw new Error(
                        'La contraseña debe tener al menos 6 caracteres'
                    );
                const cred = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                await updateProfile(cred.user, { displayName: name });
                Swal.fire({
                    ...swalBase,
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: `Bienvenido ${name}`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                onLogin(cred.user);
            } else {
                const cred = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                Swal.fire({
                    ...swalBase,
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Hola ${cred.user.displayName || 'Usuario'}`,
                    timer: 1500,
                    showConfirmButton: false,
                });
                onLogin(cred.user);
            }
        } catch (error) {
            const map = {
                'auth/email-already-in-use': 'Este correo ya está registrado',
                'auth/invalid-email': 'Correo electrónico inválido',
                'auth/user-not-found': 'Usuario no encontrado',
                'auth/wrong-password': 'Contraseña incorrecta',
                'auth/weak-password': 'La contraseña es muy débil',
                'auth/invalid-credential': 'Credenciales inválidas',
            };
            Swal.fire({
                ...swalBase,
                icon: 'error',
                title: 'Error',
                text: map[error.code] || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(v => !v);
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div
            style={{
                fontFamily: "'Manrope',sans-serif",
                background: '#050810',
            }}
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        >
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                .login-card { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both; }
                .dot-grid {
                    background-image: radial-gradient(rgba(255,255,255,0.033) 1px, transparent 1px);
                    background-size: 28px 28px;
                }
                .btn-submit {
                    background: linear-gradient(135deg,#6366f1,#7c3aed);
                    box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 4px 20px rgba(99,102,241,.3);
                    transition: opacity .2s, transform .2s, box-shadow .2s;
                    border: none; cursor: pointer;
                    width: 100%;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    color: white;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 600; font-size: .875rem;
                    padding: .7rem 1rem;
                    border-radius: 10px;
                    position: relative; overflow: hidden;
                }
                .btn-submit::after {
                    content:''; position:absolute; inset:0;
                    background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);
                    pointer-events:none;
                }
                .btn-submit:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); box-shadow:0 8px 32px rgba(99,102,241,.4); }
                .btn-submit:disabled { opacity:.5; cursor:not-allowed; }
                input::placeholder { color:rgba(255,255,255,.18) }
            `}</style>

            <div className="fixed inset-0 dot-grid pointer-events-none" />
            <div
                className="fixed pointer-events-none"
                style={{
                    top: '-10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)',
                }}
            />

            <div className="login-card w-full max-w-sm relative z-10">
                <div className="text-center mb-8">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 mb-6 opacity-80 hover:opacity-100 transition-opacity"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{
                                background:
                                    'linear-gradient(135deg,#6366f1,#7c3aed)',
                                boxShadow: '0 0 16px rgba(99,102,241,.5)',
                            }}
                        >
                            <FiZap size={13} className="text-white" />
                        </div>
                        <span
                            style={{
                                fontFamily: "'Outfit',sans-serif",
                                fontWeight: 700,
                                fontSize: '15px',
                                letterSpacing: '-.01em',
                                color: 'rgba(255,255,255,.7)',
                            }}
                        >
                            Flowdo
                        </span>
                    </a>

                    <h1
                        style={{
                            fontFamily: "'Outfit',sans-serif",
                            fontWeight: 800,
                            fontSize: 'clamp(1.5rem,4vw,1.9rem)',
                            letterSpacing: '-.03em',
                            textTransform: 'uppercase',
                            color: 'white',
                            lineHeight: 1,
                        }}
                        className="mb-2"
                    >
                        {isRegister ? 'Crear cuenta' : 'Bienvenido'}
                    </h1>
                    <p
                        style={{
                            color: 'rgba(255,255,255,.3)',
                            fontSize: '.8rem',
                        }}
                    >
                        {isRegister
                            ? 'Regístrate para empezar a fluir'
                            : 'Ingresa a tu espacio de trabajo'}
                    </p>
                </div>

                <div
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '18px',
                        padding: '1.75rem',
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        {isRegister && (
                            <Field
                                label="Nombre"
                                name="name"
                                type="text"
                                value={name}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                icon={FiUser}
                            />
                        )}

                        <Field
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            icon={FiMail}
                        />

                        <Field
                            label="Contraseña"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            icon={FiLock}
                            right={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    style={{
                                        color: 'rgba(255,255,255,.3)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    className="hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <FiEyeOff size={14} />
                                    ) : (
                                        <FiEye size={14} />
                                    )}
                                </button>
                            }
                        />

                        {isRegister && (
                            <p
                                style={{
                                    color: 'rgba(255,255,255,.2)',
                                    fontSize: '.7rem',
                                    marginTop: '-.5rem',
                                }}
                            >
                                Mínimo 6 caracteres
                            </p>
                        )}

                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-submit"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <FiLogIn size={15} />
                                        {isRegister
                                            ? 'Crear cuenta'
                                            : 'Ingresar'}
                                        <FiArrowRight
                                            size={13}
                                            style={{
                                                marginLeft: 'auto',
                                                opacity: 0.6,
                                            }}
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-5 text-center">
                    <button
                        onClick={toggleMode}
                        style={{
                            color: 'rgba(255,255,255,.28)',
                            fontSize: '.8rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        className="hover:text-white transition-colors"
                    >
                        {isRegister ? (
                            <>
                                {' '}
                                ¿Ya tienes cuenta?{' '}
                                <span
                                    style={{
                                        color: 'rgba(99,102,241,.9)',
                                        fontWeight: 600,
                                    }}
                                >
                                    Inicia sesión
                                </span>{' '}
                            </>
                        ) : (
                            <>
                                {' '}
                                ¿No tienes cuenta?{' '}
                                <span
                                    style={{
                                        color: 'rgba(99,102,241,.9)',
                                        fontWeight: 600,
                                    }}
                                >
                                    Regístrate
                                </span>{' '}
                            </>
                        )}
                    </button>
                </div>

                <p
                    className="text-center mt-4"
                    style={{
                        color: 'rgba(255,255,255,.1)',
                        fontSize: '.65rem',
                    }}
                >
                    Datos protegidos con Firebase Authentication
                </p>
            </div>
        </div>
    );
};

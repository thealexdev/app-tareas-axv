import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
    FiCheckSquare,
    FiClock,
    FiRefreshCw,
    FiCloud,
    FiArrowRight,
    FiZap,
    FiTarget,
    FiBarChart2,
    FiStar,
    FiPlay,
    FiCheck,
    FiLayers,
    FiTrendingUp,
    FiShield,
    FiMenu,
    FiX,
} from 'react-icons/fi';

const Btn = ({
    children,
    variant = 'primary',
    onClick,
    className = '',
    icon,
}) => {
    const base =
        'inline-flex items-center gap-2 font-semibold text-sm rounded-xl px-4 py-2 transition-all duration-200 cursor-pointer select-none';
    const variants = {
        primary: 'text-white',
        ghost: 'text-slate-300 hover:text-white',
    };
    const styles = {
        primary: {
            background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
            boxShadow:
                '0 1px 0 rgba(255,255,255,.08) inset, 0 4px 16px rgba(99,102,241,.25)',
        },
        ghost: {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
        },
    };
    return (
        <button
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
            style={styles[variant]}
        >
            {children}
            {icon && <span className="opacity-70">{icon}</span>}
        </button>
    );
};

const features = [
    {
        icon: FiCheckSquare,
        title: 'Tareas con prioridad',
        desc: 'Clasifica cada tarea por nivel de impacto. Lo más importante siempre al frente.',
        grad: 'from-indigo-500/20 to-indigo-500/5',
        border: 'border-indigo-500/20',
        ic: 'text-indigo-400',
    },
    {
        icon: FiClock,
        title: 'Pomodoro integrado',
        desc: 'Bloques de 25 minutos de foco total. Tu cerebro lo agradecerá.',
        grad: 'from-violet-500/20 to-violet-500/5',
        border: 'border-violet-500/20',
        ic: 'text-violet-400',
    },
    {
        icon: FiRefreshCw,
        title: 'Rutinas diarias',
        desc: 'Tus hábitos se reinician solos cada día al 1:00 AM. Sin fricciones.',
        grad: 'from-sky-500/20 to-sky-500/5',
        border: 'border-sky-500/20',
        ic: 'text-sky-400',
    },
    {
        icon: FiCloud,
        title: 'Sincronización en tiempo real',
        desc: 'Firebase sincroniza todo al instante. Modo offline automático incluido.',
        grad: 'from-emerald-500/20 to-emerald-500/5',
        border: 'border-emerald-500/20',
        ic: 'text-emerald-400',
    },
    {
        icon: FiTarget,
        title: 'Tipos de tarea personalizados',
        desc: 'Crea categorías propias: trabajo, estudio, hogar. Organizado como tú pienses.',
        grad: 'from-orange-500/20 to-orange-500/5',
        border: 'border-orange-500/20',
        ic: 'text-orange-400',
    },
    {
        icon: FiShield,
        title: 'Tus datos, seguros',
        desc: 'Autenticación con Firebase Auth. Solo tú ves tus tareas.',
        grad: 'from-rose-500/20 to-rose-500/5',
        border: 'border-rose-500/20',
        ic: 'text-rose-400',
    },
];

const steps = [
    {
        num: '01',
        icon: FiPlay,
        title: 'Crea tu cuenta',
        desc: 'Regístrate en segundos con tu correo. Sin formularios eternos.',
    },
    {
        num: '02',
        icon: FiLayers,
        title: 'Organiza tus tareas',
        desc: 'Agrega tareas, asígnales prioridad y clasifícalas por tipo.',
    },
    {
        num: '03',
        icon: FiClock,
        title: 'Activa el Pomodoro',
        desc: 'Elige una tarea, inicia el temporizador y enfócate 25 minutos.',
    },
    {
        num: '04',
        icon: FiTrendingUp,
        title: 'Mide tu progreso',
        desc: 'Ve cómo tus tareas diarias y permanentes avanzan cada día.',
    },
];

const useCases = [
    {
        role: 'Estudiante',
        icon: FiStar,
        tag: 'Educación',
        tagColor: 'bg-sky-500/15 text-sky-400',
        items: [
            'Tareas del día con fecha límite',
            'Pomodoro para sesiones de estudio',
            'Rutinas de repaso diario',
            'Clasificar por materia',
        ],
    },
    {
        role: 'Desarrollador',
        icon: FiBarChart2,
        tag: 'Tech',
        tagColor: 'bg-indigo-500/15 text-indigo-400',
        items: [
            'Backlog personal priorizado',
            'Sprints diarios de código',
            'Seguimiento de bugs pendientes',
            'Separar trabajo y side-projects',
        ],
    },
    {
        role: 'Emprendedor',
        icon: FiZap,
        tag: 'Negocios',
        tagColor: 'bg-orange-500/15 text-orange-400',
        items: [
            'Priorizar por impacto de negocio',
            'Rutinas operativas diarias',
            'Tareas de marketing y ventas',
            'Sincronización en todos los dispositivos',
        ],
    },
];

const stats = [
    { value: '100%', label: 'Gratis para siempre', icon: FiShield },
    { value: '25 min', label: 'Bloques de enfoque', icon: FiClock },
    { value: '24/7', label: 'Sincronización en la nube', icon: FiCloud },
    { value: '∞', label: 'Tareas y categorías', icon: FiLayers },
];

export const Page = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const featuresRef = useRef(null);
    const howRef = useRef(null);
    const whoRef = useRef(null);
    const [activeCase, setActiveCase] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);

    const NAV_LINKS = [
        { label: 'Funciones', ref: featuresRef },
        { label: 'Cómo funciona', ref: howRef },
        { label: 'Para quién', ref: whoRef },
    ];

    const scrollTo = ref => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileOpen(false);
    };

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600&display=swap';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        const orbs = [
            {
                x: w * 0.2,
                y: h * 0.3,
                r: 320,
                dx: 0.15,
                dy: 0.1,
                color: 'rgba(99,102,241,0.07)',
            },
            {
                x: w * 0.8,
                y: h * 0.2,
                r: 280,
                dx: -0.12,
                dy: 0.14,
                color: 'rgba(139,92,246,0.06)',
            },
            {
                x: w * 0.5,
                y: h * 0.7,
                r: 240,
                dx: 0.1,
                dy: -0.12,
                color: 'rgba(56,189,248,0.05)',
            },
        ];
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            orbs.forEach(o => {
                const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
                g.addColorStop(0, o.color);
                g.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
                o.x += o.dx;
                o.y += o.dy;
                if (o.x < -o.r || o.x > w + o.r) o.dx *= -1;
                if (o.y < -o.r || o.y > h + o.r) o.dy *= -1;
            });
            animId = requestAnimationFrame(draw);
        };
        draw();
        const onResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div
            style={{ fontFamily: "'Manrope',sans-serif" }}
            className="min-h-screen bg-[#050810] text-white overflow-x-hidden"
        >
            <style>{`
                @keyframes fadeUp  { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
                @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
                @keyframes scanline{ 0% { transform:translateY(-100%) } 100% { transform:translateY(100vh) } }

                .fu { animation: fadeUp .75s cubic-bezier(.16,1,.3,1) both }
                .fi { animation: fadeIn .5s ease both }
                .d1 { animation-delay:.10s } .d2 { animation-delay:.20s } .d3 { animation-delay:.30s }
                .d4 { animation-delay:.42s } .d5 { animation-delay:.54s } .d6 { animation-delay:.68s }

                .display { font-family:'Outfit',sans-serif }

                .glass {
                    background: rgba(255,255,255,0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.07);
                }
                .glass-card {
                    background: rgba(255,255,255,0.025);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.06);
                    transition: background .3s, border-color .3s, transform .3s;
                }
                .glass-card:hover { background:rgba(99,102,241,0.07); border-color:rgba(99,102,241,0.22); transform:translateY(-4px); }
                .glass-active     { background:rgba(99,102,241,0.09) !important; border-color:rgba(99,102,241,0.32) !important; }

                .dot-grid {
                    background-image: radial-gradient(rgba(255,255,255,0.033) 1px, transparent 1px);
                    background-size: 28px 28px;
                }

                .hero-title {
                    font-family:'Outfit',sans-serif;
                    font-weight:900;
                    font-size: clamp(2.2rem, 8vw, 5.5rem);
                    line-height: .95;
                    letter-spacing: -.03em;
                    text-transform: uppercase;
                }
                .hero-sub {
                    font-family:'Outfit',sans-serif;
                    font-weight:300;
                    font-size: clamp(.8rem, 2.5vw, 1.3rem);
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,.22);
                }
                .section-label {
                    display: inline-block;
                    font-family:'Outfit',sans-serif;
                    font-size: .6rem; font-weight: 700;
                    letter-spacing: .2em; text-transform: uppercase;
                    color: rgba(99,102,241,.85);
                }
                .section-title {
                    font-family:'Outfit',sans-serif;
                    font-weight: 800;
                    font-size: clamp(1.6rem, 4vw, 3.2rem);
                    letter-spacing: -.03em;
                    text-transform: uppercase;
                    line-height: 1;
                }
                .gradient-text {
                    background: linear-gradient(135deg, #fff 0%, rgba(165,180,252,1) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .scanline {
                    position:absolute; left:0; width:100%; height:2px;
                    background: linear-gradient(90deg, transparent, rgba(99,102,241,.13), transparent);
                    animation: scanline 7s linear infinite;
                    pointer-events: none;
                }
                .tag {
                    font-family:'Outfit',sans-serif;
                    font-size: .6rem; font-weight: 700;
                    letter-spacing: .14em; text-transform: uppercase;
                    padding: 4px 12px; border-radius: 999px;
                }
                .mockup-bar      { height:6px; border-radius:3px; background:rgba(255,255,255,0.07); }
                .mockup-bar-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,#6366f1,#7c3aed); }

                .nav-link {
                    position: relative;
                    font-size: .85rem; font-weight: 500;
                    color: rgba(255,255,255,.45);
                    transition: color .2s;
                    padding-bottom: 2px;
                    background: none; border: none; cursor: pointer;
                }
                .nav-link::after {
                    content:'';
                    position:absolute; bottom:0; left:0;
                    width:0; height:1px;
                    background: rgba(99,102,241,.7);
                    transition: width .25s ease;
                }
                .nav-link:hover { color:rgba(255,255,255,.9); }
                .nav-link:hover::after { width:100%; }

                .logo-glow { box-shadow: 0 0 16px rgba(99,102,241,.5); }

                .scroll-top-btn {
                    position:fixed; bottom:1.5rem; right:1.5rem; z-index:50;
                    width:2.5rem; height:2.5rem; border-radius:.75rem;
                    display:flex; align-items:center; justify-content:center;
                    border:none; cursor:pointer;
                    background: linear-gradient(135deg,#6366f1,#7c3aed);
                    box-shadow: 0 4px 20px rgba(99,102,241,.45);
                    transition: opacity .3s, transform .3s;
                }

                /* ── Mockup responsive ── */
                .mockup-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
                @media(min-width:640px) { .mockup-grid { grid-template-columns:1fr 1fr 1fr; } }

                .mockup-progress { display:none; }
                @media(min-width:640px) { .mockup-progress { display:block; } }

                /* ── Use cases panel ── */
                .cases-layout { display:flex; flex-direction:column; gap:1rem; }
                @media(min-width:1024px) { .cases-layout { flex-direction:row; } }

                .cases-tabs { display:flex; flex-direction:row; gap:.75rem; overflow-x:auto; padding-bottom:.25rem; }
                @media(min-width:1024px) { .cases-tabs { flex-direction:column; width:12rem; flex-shrink:0; overflow-x:visible; } }

                .cases-tab { flex-shrink:0; }
                @media(min-width:1024px) { .cases-tab { flex-shrink:1; } }

                /* ── Steps ── */
                .steps-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
                @media(min-width:640px)  { .steps-grid { grid-template-columns:1fr 1fr; } }
                @media(min-width:1024px) { .steps-grid { grid-template-columns:repeat(4,1fr); } }

                /* ── Features ── */
                .features-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
                @media(min-width:640px)  { .features-grid { grid-template-columns:1fr 1fr; } }
                @media(min-width:1024px) { .features-grid { grid-template-columns:repeat(3,1fr); } }

                /* ── Stats ── */
                .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
                @media(min-width:1024px) { .stats-grid { grid-template-columns:repeat(4,1fr); } }
            `}</style>

            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 0 }}
            />
            <div
                className="fixed inset-0 dot-grid pointer-events-none"
                style={{ zIndex: 0 }}
            />

            <div className="relative z-10 pt-14">
                {/* ── HEADER ── */}
                <header
                    className="fi fixed top-0 left-0 right-0 z-50"
                    style={{
                        background: 'rgba(5,8,16,0.8)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center logo-glow flex-shrink-0"
                                style={{
                                    background:
                                        'linear-gradient(135deg,#6366f1,#7c3aed)',
                                }}
                            >
                                <FiZap size={13} className="text-white" />
                            </div>
                            <span className="display font-bold text-[15px] tracking-tight text-white">
                                Flowdo
                            </span>
                        </div>

                        <nav className="hidden md:flex items-center gap-7">
                            {NAV_LINKS.map(n => (
                                <button
                                    key={n.label}
                                    onClick={() => scrollTo(n.ref)}
                                    className="nav-link"
                                >
                                    {n.label}
                                </button>
                            ))}
                        </nav>

                        <div className="hidden md:flex items-center">
                            <Btn
                                variant="primary"
                                onClick={() => navigate('/login')}
                                icon={<FiArrowRight size={13} />}
                            >
                                Ingresar
                            </Btn>
                        </div>

                        <button
                            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                            onClick={() => setMobileOpen(v => !v)}
                        >
                            {mobileOpen ? (
                                <FiX size={18} />
                            ) : (
                                <FiMenu size={18} />
                            )}
                        </button>
                    </div>

                    {mobileOpen && (
                        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-[rgba(255,255,255,0.05)] pt-4">
                            {NAV_LINKS.map(n => (
                                <button
                                    key={n.label}
                                    onClick={() => scrollTo(n.ref)}
                                    className="text-slate-400 hover:text-white text-sm transition-colors text-left"
                                >
                                    {n.label}
                                </button>
                            ))}
                            <div className="pt-1">
                                <Btn
                                    variant="primary"
                                    onClick={() => navigate('/login')}
                                    icon={<FiArrowRight size={13} />}
                                >
                                    Ingresar
                                </Btn>
                            </div>
                        </div>
                    )}
                </header>

                {/* ── HERO ── */}
                <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden py-20">
                    <div className="scanline" />

                    <div className="fu d1 mb-5">
                        <span className="tag glass text-indigo-300">
                            Productividad sin ruido
                        </span>
                    </div>

                    <h1 className="fu d2 hero-title gradient-text mb-4">
                        Organiza.
                        <br />
                        Enfócate.
                        <br />
                        Avanza.
                    </h1>

                    <p className="fu d3 hero-sub mb-6">
                        Tu flujo de trabajo, simplificado.
                    </p>

                    <p className="fu d4 text-slate-400 text-sm max-w-sm sm:max-w-md leading-relaxed mb-8 px-2">
                        Gestiona tareas con prioridades, trabaja en bloques
                        Pomodoro y sincroniza todo en la nube desde una sola
                        app.
                    </p>

                    <div className="fu d5 mb-12">
                        <Btn
                            variant="primary"
                            onClick={() => navigate('/login')}
                            icon={<FiArrowRight size={13} />}
                        >
                            Ingresar gratis
                        </Btn>
                    </div>

                    {/* Mockup */}
                    <div className="fu d6 w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl px-2">
                        <div
                            className="glass rounded-2xl sm:rounded-3xl p-1"
                            style={{
                                boxShadow: '0 0 80px rgba(99,102,241,.12)',
                            }}
                        >
                            <div className="rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#0c0f1d] p-4 sm:p-6">
                                <div className="flex items-center gap-1.5 mb-4">
                                    {[0, 1, 2].map(i => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-700"
                                        />
                                    ))}
                                    <div className="flex-1 mx-3 h-5 rounded-md bg-slate-800/60 flex items-center px-3">
                                        <span className="text-slate-600 text-[10px]">
                                            app.flowdo.io
                                        </span>
                                    </div>
                                </div>

                                <div className="mockup-grid">
                                    {/* Tasks col */}
                                    <div className="space-y-2">
                                        {[
                                            {
                                                label: 'Diseñar UI',
                                                status: 'Completada',
                                                done: true,
                                                color: 'bg-indigo-500/30',
                                                ic: 'text-indigo-400',
                                            },
                                            {
                                                label: 'Revisar PR',
                                                status: 'En progreso',
                                                done: false,
                                                color: 'bg-violet-500/20',
                                                ic: 'text-violet-400',
                                            },
                                            {
                                                label: 'Daily sync',
                                                status: 'Pendiente',
                                                done: false,
                                                color: 'bg-slate-800',
                                                ic: 'text-slate-600',
                                            },
                                        ].map((t, i) => (
                                            <div
                                                key={i}
                                                className="glass rounded-xl p-2.5 sm:p-3 flex items-start gap-2"
                                            >
                                                <div
                                                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${t.color}`}
                                                >
                                                    {t.done && (
                                                        <FiCheck
                                                            size={9}
                                                            className={t.ic}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-[11px] sm:text-xs font-medium text-slate-300 leading-tight">
                                                        {t.label}
                                                    </div>
                                                    <div className="text-[10px] text-slate-600 mt-0.5">
                                                        {t.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pomodoro */}
                                    <div className="glass rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-1.5">
                                        <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest">
                                            Pomodoro
                                        </div>
                                        <div className="display font-black text-2xl sm:text-3xl text-white">
                                            24:13
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-indigo-400 uppercase tracking-wider">
                                            Enfocado
                                        </div>
                                        <div className="w-full mt-1.5 mockup-bar">
                                            <div
                                                className="mockup-bar-fill"
                                                style={{ width: '38%' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Progress — solo visible en sm+ */}
                                    <div className="mockup-progress glass rounded-xl p-3">
                                        <div className="text-[10px] text-slate-500 mb-2.5 uppercase tracking-wider">
                                            Progreso
                                        </div>
                                        {[
                                            ['Trabajo', '75%'],
                                            ['Estudio', '50%'],
                                            ['Hogar', '30%'],
                                        ].map(([l, v]) => (
                                            <div key={l} className="mb-2">
                                                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                                    <span>{l}</span>
                                                    <span>{v}</span>
                                                </div>
                                                <div className="mockup-bar">
                                                    <div
                                                        className="mockup-bar-fill"
                                                        style={{ width: v }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── STATS ── */}
                <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
                    <div className="stats-grid">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className="glass-card rounded-2xl p-4 sm:p-5 text-center"
                            >
                                <s.icon
                                    size={16}
                                    className="text-indigo-400 mx-auto mb-2.5"
                                />
                                <div className="display font-black text-xl sm:text-2xl text-white mb-1">
                                    {s.value}
                                </div>
                                <div className="text-slate-500 text-xs leading-snug">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FEATURES ── */}
                <section
                    ref={featuresRef}
                    className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto"
                >
                    <div className="text-center mb-10 sm:mb-14">
                        <p className="section-label mb-3">Funciones</p>
                        <h2 className="section-title text-white mb-4">
                            Todo lo que
                            <br />
                            <span className="gradient-text">necesitas.</span>
                        </h2>
                        <p className="text-slate-500 max-w-xs sm:max-w-sm mx-auto text-sm leading-relaxed">
                            Sin apps extras. Sin integraciones. Todo en un solo
                            lugar.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="glass-card rounded-2xl p-5 sm:p-6"
                            >
                                <div
                                    className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${f.grad} border ${f.border} items-center justify-center mb-4`}
                                >
                                    <f.icon size={17} className={f.ic} />
                                </div>
                                <h3 className="display font-bold text-white text-sm mb-1.5">
                                    {f.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section
                    ref={howRef}
                    className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto"
                >
                    <div className="text-center mb-10 sm:mb-14">
                        <p className="section-label mb-3">Cómo funciona</p>
                        <h2 className="section-title text-white mb-4">
                            En 4 pasos,
                            <br />
                            <span className="gradient-text">en flujo.</span>
                        </h2>
                    </div>
                    <div className="steps-grid">
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                className="relative glass-card rounded-2xl p-5 sm:p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                                        <s.icon
                                            size={15}
                                            className="text-indigo-400"
                                        />
                                    </div>
                                    <span className="display font-black text-3xl text-slate-800 leading-none select-none">
                                        {s.num}
                                    </span>
                                </div>
                                <h3 className="display font-bold text-white text-sm mb-1.5">
                                    {s.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {s.desc}
                                </p>
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-7 -right-2.5 z-10">
                                        <FiArrowRight
                                            size={13}
                                            className="text-indigo-500/30"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── USE CASES ── */}
                <section
                    ref={whoRef}
                    className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto"
                >
                    <div className="text-center mb-10 sm:mb-14">
                        <p className="section-label mb-3">Para quién</p>
                        <h2 className="section-title text-white mb-4">
                            Hecho para
                            <br />
                            <span className="gradient-text">
                                personas reales.
                            </span>
                        </h2>
                        <p className="text-slate-500 max-w-xs sm:max-w-sm mx-auto text-sm leading-relaxed">
                            No importa lo que hagas. Si tienes tareas, Flowdo
                            trabaja para ti.
                        </p>
                    </div>

                    <div className="cases-layout">
                        {/* Tabs */}
                        <div className="cases-tabs">
                            {useCases.map((u, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveCase(i)}
                                    className={`cases-tab glass-card rounded-2xl p-3 sm:p-4 text-left ${activeCase === i ? 'glass-active' : ''}`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${activeCase === i ? 'bg-indigo-500/20' : 'bg-slate-800/60'}`}
                                        >
                                            <u.icon
                                                size={13}
                                                className={
                                                    activeCase === i
                                                        ? 'text-indigo-400'
                                                        : 'text-slate-500'
                                                }
                                            />
                                        </div>
                                        <span
                                            className={`display font-bold text-sm whitespace-nowrap ${activeCase === i ? 'text-white' : 'text-slate-500'}`}
                                        >
                                            {u.role}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Panel */}
                        <div className="flex-1 glass-card rounded-2xl p-5 sm:p-7">
                            <div className="flex items-center gap-3 mb-5 flex-wrap">
                                <span
                                    className={`tag ${useCases[activeCase].tagColor}`}
                                >
                                    {useCases[activeCase].tag}
                                </span>
                                <h3 className="display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                                    {useCases[activeCase].role}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                                {useCases[activeCase].items.map((item, j) => (
                                    <div
                                        key={j}
                                        className="glass rounded-xl px-3 sm:px-4 py-2.5 flex items-center gap-3"
                                    >
                                        <div className="w-4 h-4 rounded-md bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                            <FiCheck
                                                size={10}
                                                className="text-indigo-400"
                                            />
                                        </div>
                                        <span className="text-slate-300 text-sm">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="glass rounded-2xl p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-slate-500 text-xs uppercase tracking-widest">
                                        Ejemplo de día
                                    </span>
                                    <span className="text-indigo-400 text-xs">
                                        3 / 4 completadas
                                    </span>
                                </div>
                                {useCases[activeCase].items.map((item, j) => (
                                    <div
                                        key={j}
                                        className={`flex items-center gap-3 py-2 ${j < 3 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''}`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${j < 3 ? 'bg-indigo-500/30' : 'bg-slate-800'}`}
                                        >
                                            {j < 3 && (
                                                <FiCheck
                                                    size={9}
                                                    className="text-indigo-400"
                                                />
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm flex-1 min-w-0 truncate ${j < 3 ? 'text-slate-600 line-through decoration-slate-700' : 'text-slate-200'}`}
                                        >
                                            {item}
                                        </span>
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${j === 0 ? 'bg-rose-500/15 text-rose-400' : j === 1 ? 'bg-amber-500/15 text-amber-400' : j === 2 ? 'bg-sky-500/15 text-sky-400' : 'bg-slate-800/80 text-slate-500'}`}
                                        >
                                            {
                                                [
                                                    'Alta',
                                                    'Media',
                                                    'Baja',
                                                    'Normal',
                                                ][j]
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
                    <div
                        className="glass relative rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
                        style={{ boxShadow: '0 0 80px rgba(99,102,241,.1)' }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(ellipse at 50% 0%,rgba(99,102,241,.18) 0%,transparent 60%)',
                            }}
                        />
                        <div className="scanline" />
                        <p className="section-label mb-4 sm:mb-5 relative">
                            Empieza ahora
                        </p>
                        <h2 className="section-title relative text-white mb-4">
                            Tu flujo empieza
                            <br />
                            <span className="gradient-text">hoy.</span>
                        </h2>
                        <p className="relative text-slate-400 text-sm leading-relaxed max-w-xs sm:max-w-md mx-auto mb-7 sm:mb-8">
                            Crea tu cuenta en segundos. Gratis para siempre. Sin
                            tarjeta de crédito.
                        </p>
                        <div className="relative flex justify-center">
                            <Btn
                                variant="primary"
                                onClick={() => navigate('/login')}
                                icon={<FiArrowRight size={13} />}
                            >
                                Ingresar gratis
                            </Btn>
                        </div>
                        <p className="relative mt-5 text-slate-700 text-xs">
                            Sin tarjeta · Datos seguros · Offline listo
                        </p>
                    </div>
                </section>

                {/* ── SCROLL TO TOP ── */}
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className="scroll-top-btn"
                    style={{
                        opacity: showTop ? 1 : 0,
                        transform: showTop
                            ? 'translateY(0) scale(1)'
                            : 'translateY(12px) scale(0.85)',
                        pointerEvents: showTop ? 'auto' : 'none',
                    }}
                >
                    <FiArrowRight size={15} className="text-white -rotate-90" />
                </button>

                {/* ── FOOTER ── */}
                <footer className="border-t border-[rgba(255,255,255,0.06)] py-6 sm:py-7 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-5 h-5 rounded-md flex items-center justify-center"
                                style={{
                                    background:
                                        'linear-gradient(135deg,#6366f1,#7c3aed)',
                                }}
                            >
                                <FiZap size={10} className="text-white" />
                            </div>
                            <span className="display font-bold text-sm text-slate-500">
                                Flowdo
                            </span>
                        </div>
                        <p className="text-slate-700 text-xs order-last sm:order-none">
                            {new Date().getFullYear()} — Hecho con intención.
                        </p>
                        <div className="flex items-center gap-5 sm:gap-6">
                            {['Privacidad', 'Términos', 'Soporte'].map(l => (
                                <a
                                    key={l}
                                    href="#"
                                    className="text-slate-700 hover:text-slate-400 text-xs transition-colors"
                                >
                                    {l}
                                </a>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

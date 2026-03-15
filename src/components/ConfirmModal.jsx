import { useEffect } from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle, X } from 'lucide-react';

const VARIANTS = {
    danger: {
        icon: Trash2,
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-400',
        confirmBtn: 'bg-red-500 hover:bg-red-600 focus:ring-red-500/40',
        border: 'border-red-500/20',
        confirmText: 'Eliminar',
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-400',
        confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/40',
        border: 'border-amber-500/20',
        confirmText: 'Continuar',
    },
    info: {
        icon: Info,
        iconBg: 'bg-indigo-500/10',
        iconColor: 'text-indigo-400',
        confirmBtn:
            'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500/40',
        border: 'border-indigo-500/20',
        confirmText: 'Confirmar',
    },
    success: {
        icon: CheckCircle,
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
        confirmBtn:
            'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500/40',
        border: 'border-emerald-500/20',
        confirmText: 'Aceptar',
    },
};

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    variant = 'danger',
    confirmText,
    cancelText = 'Cancelar',
    loading = false,
}) => {
    const v = VARIANTS[variant] ?? VARIANTS.danger;
    const Icon = v.icon;

    useEffect(() => {
        if (!open) return;
        const handler = e => {
            if (e.key === 'Escape' && !loading) onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, loading, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            />

            {/* Panel */}
            <div
                className={`
                    relative w-full max-w-sm
                    bg-slate-900 border ${v.border}
                    shadow-2xl shadow-black/60
                    animate-modal-in
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* X */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-40"
                >
                    <X size={18} />
                </button>

                {/* Cuerpo */}
                <div className="p-6">
                    <div
                        className={`w-11 h-11 ${v.iconBg} flex items-center justify-center mb-4`}
                    >
                        <Icon size={20} className={v.iconColor} />
                    </div>
                    <h2 className="text-slate-100 font-semibold text-base pr-6 mb-1">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2 px-6 pb-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="
                            flex-1 px-4 py-2.5 text-sm font-medium
                            bg-slate-800 hover:bg-slate-700
                            text-slate-300 hover:text-slate-100
                            border border-slate-700/50
                            transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/40
                            disabled:opacity-40 disabled:cursor-not-allowed
                        "
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            flex-1 px-4 py-2.5 text-sm font-medium text-white
                            transition-all focus:outline-none focus:ring-2
                            disabled:opacity-40 disabled:cursor-not-allowed
                            ${v.confirmBtn}
                        `}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Procesando...
                            </span>
                        ) : (
                            (confirmText ?? v.confirmText)
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

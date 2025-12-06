import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Target } from 'lucide-react';

export const Pomodoro = () => {
    const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);

    const audioRef = useRef(null);

    const modes = {
        work: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    useEffect(() => {
        let interval = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => {
                    if (time <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsRunning(false);

        // Reproducir sonido
        if (audioRef.current) {
            audioRef.current.play();
        }

        if (mode === 'work') {
            const newCompleted = completedPomodoros + 1;
            setCompletedPomodoros(newCompleted);

            // Después de 4 pomodoros, tomar descanso largo
            if (newCompleted % 4 === 0) {
                setMode('longBreak');
                setTimeLeft(modes.longBreak);
            } else {
                setMode('shortBreak');
                setTimeLeft(modes.shortBreak);
            }
        } else {
            setMode('work');
            setTimeLeft(modes.work);
        }
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(modes[mode]);
    };

    const switchMode = newMode => {
        setMode(newMode);
        setTimeLeft(modes[newMode]);
        setIsRunning(false);
    };

    const formatTime = seconds => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    };

    const getProgress = () => {
        return ((modes[mode] - timeLeft) / modes[mode]) * 100;
    };

    return (
        <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-indigo-400" />
                    Pomodoro Timer
                </h3>

                <div className="flex gap-1.5 mb-4">
                    <button
                        onClick={() => switchMode('work')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium ${
                            mode === 'work'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        <Target size={12} />
                        Trabajo
                    </button>
                    <button
                        onClick={() => switchMode('shortBreak')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium ${
                            mode === 'shortBreak'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        <Coffee size={12} />
                        Descanso
                    </button>
                    <button
                        onClick={() => switchMode('longBreak')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium ${
                            mode === 'longBreak'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        <Coffee size={12} />
                        Largo
                    </button>
                </div>

                <div className="relative mb-4">
                    <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${
                                mode === 'work'
                                    ? 'bg-indigo-600'
                                    : mode === 'shortBreak'
                                    ? 'bg-emerald-600'
                                    : 'bg-amber-600'
                            }`}
                            style={{ width: `${getProgress()}%` }}
                        />
                    </div>
                </div>

                <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-slate-100 mb-2 font-mono">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-xs text-slate-500">
                        {mode === 'work'
                            ? 'Tiempo de trabajo'
                            : 'Tiempo de descanso'}
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={toggleTimer}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-md flex items-center justify-center gap-2"
                    >
                        {isRunning ? (
                            <>
                                <Pause size={16} />
                                Pausar
                            </>
                        ) : (
                            <>
                                <Play size={16} />
                                Iniciar
                            </>
                        )}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium py-2 px-3 rounded-md flex items-center justify-center"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>

                <div className="bg-slate-950/50 rounded-md p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">
                        Pomodoros completados hoy
                    </div>
                    <div className="text-2xl font-bold text-indigo-400">
                        {completedPomodoros}
                    </div>
                </div>
            </div>

            {/* Audio para la notificación */}
            <audio ref={audioRef}>
                <source
                    src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDBmyeO+cCQJLHbA79mROwkTWqXj6a1VEwpBoevw3Y0+CS1wxs/fpSY="
                    type="audio/wav"
                />
            </audio>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon, Cloud, CloudSun, CloudRain, Sun, Thermometer } from 'lucide-react';

export default function Home() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState({ temp: 24, condition: 'Soleado', city: 'Celaya, Gto' });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Helper for formatting time
    const formatTime = (date) => {
        return date.toLocaleTimeString('es-MX', { hour12: false });
    };

    // Helper for formatting date
    const formatDate = (date) => {
        return date.toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Mini Calendar Days
    const getCalendarDays = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const days = [];

        // Padding for first day of month
        for (let i = 0; i < start.getDay(); i++) days.push(null);

        for (let i = 1; i <= end.getDate(); i++) days.push(i);
        return days;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Top Stat/Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Digital Clock Widget */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                        <Clock size={32} />
                    </div>
                    <div className="text-5xl font-black text-slate-800 tracking-tighter mb-2">
                        {formatTime(currentTime)}
                    </div>
                    <div className="text-indigo-600 font-bold uppercase tracking-widest text-xs">
                        Hora Actual
                    </div>
                </div>

                {/* Mini Calendar Widget */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 capitalize">{currentTime.toLocaleDateString('es-MX', { month: 'long' })}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{currentTime.getFullYear()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-slate-400 mb-2">
                        <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium">
                        {getCalendarDays().map((day, idx) => (
                            <div
                                key={idx}
                                className={`h-7 flex items-center justify-center rounded-lg transition-colors
                                    ${day === currentTime.getDate() ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-200' : 'text-slate-600'}
                                    ${day ? 'hover:bg-slate-100' : ''}
                                `}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weather Widget */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <CloudSun size={32} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-slate-800 tracking-tighter">{weather.temp}</span>
                        <span className="text-2xl font-bold text-slate-400">°C</span>
                    </div>
                    <div className="mt-2 text-slate-800 font-bold">{weather.condition}</div>
                    <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-1">
                        {weather.city}
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-800 p-12 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/20">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-black mb-4 leading-tight">
                        Sistema Médico de Colposcopía Especializada
                    </h2>
                    <p className="text-indigo-100 text-lg opacity-90 leading-relaxed">
                        Bienvenido de nuevo, Dr. Arteaga. Todas sus herramientas de diagnóstico están listas para su próxima consulta.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <div className="flex items-center gap-2 bg-indigo-700/50 px-4 py-2 rounded-full border border-indigo-500/30 text-sm font-medium">
                            <Thermometer size={16} /> Hospital San José de Celaya
                        </div>
                    </div>
                </div>
                {/* Abstract Circles for decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 mr-10 mb-10 w-40 h-40 bg-indigo-400 opacity-10 rounded-full blur-2xl"></div>
            </div>
        </div>
    );
}

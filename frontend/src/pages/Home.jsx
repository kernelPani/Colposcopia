import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar as CalendarIcon, Cloud, CloudSun, CloudRain, Sun, Thermometer, User, Bell } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function Home() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState({ temp: 24, condition: 'Soleado', city: 'Celaya, Gto' });
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [viewMode, setViewMode] = useState('today'); // 'today' or 'upcoming'

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchAppointments();
        fetchWeather();
        return () => clearInterval(timer);
    }, []);

    const fetchWeather = async () => {
        try {
            // Coordenadas de Celaya, Gto: 20.5223, -100.8123
            const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=20.5223&longitude=-100.8123&current_weather=true');
            const data = response.data.current_weather;

            // Mapear códigos de clima a condiciones en español
            const weatherCodes = {
                0: 'Despejado',
                1: 'Principalmente Despejado',
                2: 'Parcialmente Nublado',
                3: 'Nublado',
                45: 'Niebla', 48: 'Niebla',
                51: 'Llovizna Ligera', 53: 'Llovizna Moderada', 55: 'Llovizna Intensa',
                61: 'Lluvia Ligera', 63: 'Lluvia Moderada', 65: 'Lluvia Intensa',
                71: 'Nieve Ligera', 73: 'Nieve Moderada', 75: 'Nieve Intensa',
                80: 'Chubascos Ligeros', 81: 'Chubascos Moderados', 82: 'Chubascos Violentos',
                95: 'Tormenta Eléctrica',
            };

            setWeather({
                temp: Math.round(data.temperature),
                condition: weatherCodes[data.weathercode] || 'Variado',
                city: 'Celaya, Gto',
                code: data.weathercode
            });
        } catch (err) {
            console.error('Error fetching weather:', err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/appointments/`);
            const now = new Date();
            const todayStr = now.toLocaleDateString('en-CA');
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            // Current day, but only from NOW onwards
            const today = response.data.filter(appt => {
                const apptDate = new Date(appt.date_time);
                return apptDate.toLocaleDateString('en-CA') === todayStr && apptDate > now;
            });

            // From tomorrow onwards
            const upcoming = response.data.filter(appt =>
                new Date(appt.date_time) > endOfDay
            );

            setTodayAppointments(today);
            setUpcomingAppointments(upcoming);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };

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
                        {(() => {
                            const code = weather.code;
                            if (code === 0) return <Sun size={32} />;
                            if (code >= 1 && code <= 2) return <CloudSun size={32} />;
                            if (code === 3 || code === 45 || code === 48) return <Cloud size={32} />;
                            if (code >= 51 && code <= 99) return <CloudRain size={32} />;
                            return <CloudSun size={32} />;
                        })()}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Agenda de Hoy Section */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 space-y-4 bg-slate-50/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Citas</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Control de Agenda</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Vivo</span>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-fit">
                            <button
                                onClick={() => setViewMode('today')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'today' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Hoy ({todayAppointments.length})
                            </button>
                            <button
                                onClick={() => setViewMode('upcoming')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'upcoming' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Próximas ({upcomingAppointments.length})
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 space-y-4 max-h-[400px] overflow-auto">
                        {(viewMode === 'today' ? todayAppointments : upcomingAppointments).length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-40 py-12">
                                <CalendarIcon size={48} className="mb-4 text-slate-300" />
                                <p className="font-bold text-slate-400">No hay citas {viewMode === 'today' ? 'para hoy' : 'programadas'}</p>
                            </div>
                        ) : (
                            (viewMode === 'today' ? todayAppointments : upcomingAppointments).map((appt) => (
                                <div key={appt.id} className="p-5 rounded-3xl bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm font-black text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                                {viewMode === 'today' ? (
                                                    <span>{new Date(appt.date_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[9px] uppercase leading-none mb-1">{new Date(appt.date_time).toLocaleDateString('es-MX', { month: 'short' })}</span>
                                                        <span className="text-base leading-none">{new Date(appt.date_time).getDate()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg leading-tight">{appt.patient?.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <Clock size={10} /> {new Date(appt.date_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                    </p>
                                                    <span className="text-slate-300">•</span>
                                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                                                        {appt.reason || 'Consulta General'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Welcome Banner (Smaller Version) */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-800 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/20 flex flex-col justify-center">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4 leading-tight">
                            Colposcopía Especializada
                        </h2>
                        <p className="text-indigo-100 text-base opacity-90 leading-relaxed mb-8">
                            Bienvenido de nuevo, Dr. Arteaga. Todas sus herramientas de diagnóstico están listas.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-indigo-700/50 px-4 py-2 rounded-full border border-indigo-500/30 text-xs font-medium">
                                <Thermometer size={14} /> Hospital San José de Celaya
                            </div>
                            <div className="flex items-center gap-2 bg-indigo-700/50 px-4 py-2 rounded-full border border-indigo-500/30 text-xs font-medium">
                                <CalendarIcon size={14} /> {formatDate(currentTime)}
                            </div>
                        </div>
                    </div>
                    {/* Abstract Circles for decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 mr-8 mb-8 w-32 h-32 bg-indigo-400 opacity-10 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
}

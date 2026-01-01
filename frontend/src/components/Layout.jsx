import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, Users, FileText, Settings, Calendar } from 'lucide-react';

export default function Layout() {
    return (
        <div className="flex h-screen bg-slate-100 print:bg-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0f172a] shadow-2xl flex flex-col print:hidden border-r border-slate-800 z-10">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Colposcopia</h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Sistema Médico</p>
                </div>

                {/* Doctor Avatar & Welcome (Static) */}
                <div className="px-6 py-8 flex flex-col items-center border-b border-slate-800 bg-slate-900/40">
                    <div className="relative mb-5 group">
                        <div className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-2xl overflow-hidden ring-2 ring-indigo-500/30 bg-white">
                            <img
                                src="/images/meta_avatar.png"
                                alt="Dr. José Luis Arteaga Domínguez"
                                className="w-full h-full object-cover scale-125 object-top pt-2"
                            />
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-[#0f172a] rounded-full shadow-lg"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 opacity-80">Bienvenido</p>
                        <h3 className="font-bold text-white text-sm leading-snug">
                            Dr. José Luis Arteaga Domínguez
                        </h3>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 mt-2">
                    <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300">
                        <Home size={20} />
                        <span className="font-semibold text-sm">Inicio</span>
                    </Link>
                    <Link to="/patients" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300">
                        <Users size={20} />
                        <span className="font-semibold text-sm">Pacientes</span>
                    </Link>
                    <Link to="/appointments" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300">
                        <Calendar size={20} />
                        <span className="font-semibold text-sm">Citas</span>
                    </Link>
                    <div className="pt-6 pb-2 px-4">
                        <span className="text-[10px] uppercase text-slate-500 font-black tracking-[0.15em]">Reportes</span>
                    </div>
                </nav>

                <div className="p-6 border-t border-slate-800 bg-slate-900/20">
                    <div className="flex items-center space-x-3 text-slate-400 hover:text-white cursor-pointer transition-colors group">
                        <div className="p-2 rounded-lg group-hover:bg-slate-800 transition-colors">
                            <Settings size={20} />
                        </div>
                        <span className="text-sm font-medium">Configuración</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible">
                <Outlet />
            </main>
        </div>
    );
}

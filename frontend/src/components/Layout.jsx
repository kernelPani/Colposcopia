import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, Users, FileText, Settings } from 'lucide-react';

export default function Layout() {
    return (
        <div className="flex h-screen bg-slate-100 print:bg-white">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col print:hidden">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-slate-800">Colposcopia</h1>
                    <p className="text-sm text-slate-500">Sistema Médico</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                        <Home size={20} />
                        <span className="font-medium">Inicio</span>
                    </Link>
                    <Link to="/patients" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors">
                        <Users size={20} />
                        <span className="font-medium">Pacientes</span>
                    </Link>
                    <div className="pt-4 pb-2 px-4">
                        <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Reportes</span>
                    </div>
                    {/* Add more links later */}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center space-x-3 text-slate-500">
                        <Settings size={20} />
                        <span className="text-sm">Configuración</span>
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

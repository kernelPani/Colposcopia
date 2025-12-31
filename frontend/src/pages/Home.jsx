import React from 'react';

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Bienvenido al Sistema de Colposcopia</h2>
                <p className="text-slate-600">
                    Seleccione una opción del menú lateral para comenzar. Puede gestionar pacientes o crear nuevos exámenes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Stats or Actions */}
                <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
                    <h3 className="text-xl font-bold mb-2">Pacientes Registrados</h3>
                    <p className="text-4xl font-extrabold">--</p>
                    <p className="text-indigo-200 text-sm mt-2">Total en base de datos</p>
                </div>
            </div>
        </div>
    );
}

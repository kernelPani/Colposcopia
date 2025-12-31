import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import api from '../api';
import PatientForm from '../components/PatientForm';
import { Link } from 'react-router-dom';

export default function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Pacientes</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Paciente
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar paciente..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Edad</th>
                            <th className="px-6 py-4">Sexo</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Cargando...</td></tr>
                        ) : patients.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No hay pacientes registrados.</td></tr>
                        ) : (
                            patients.map(patient => (
                                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500">#{patient.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{patient.name}</td>
                                    <td className="px-6 py-4">{patient.age} años</td>
                                    <td className="px-6 py-4">{patient.sex}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/patients/${patient.id}`}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
                                        >
                                            <FileText size={16} /> Ver Expediente
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <PatientForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchPatients();
                    }}
                />
            )}
        </div>
    );
}

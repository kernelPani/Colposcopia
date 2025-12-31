import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import api from '../api';
import PatientForm from '../components/PatientForm';

export default function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);

    const fetchPatient = async () => {
        try {
            const response = await api.get(`/patients/${id}`);
            setPatient(response.data);
        } catch (error) {
            console.error("Error fetching patient", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatient();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("¿Está seguro de eliminar este paciente? Se eliminarán todos sus estudios.")) {
            try {
                await api.delete(`/patients/${id}`);
                navigate('/patients');
            } catch (error) {
                console.error("Error deleting patient", error);
                alert("Error al eliminar paciente");
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando expediente...</div>;
    if (!patient) return <div className="p-8 text-center text-red-500">Paciente no encontrado.</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/patients" className="text-slate-400 hover:text-slate-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-800">Expediente Médico</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowEditForm(true)}
                        className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Edit2 size={18} />
                        Editar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-white border border-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-50 transition-colors shadow-sm"
                    >
                        <Trash2 size={18} />
                        Eliminar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-l-4 border-indigo-500">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Paciente</label>
                        <p className="text-lg font-medium text-slate-900">{patient.name}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Edad / Sexo</label>
                        <p className="text-lg text-slate-700">{patient.age} años / {patient.sex}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Teléfono</label>
                        <p className="text-lg text-slate-700">{patient.phone || '-'}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Correo</label>
                        <p className="text-lg text-slate-700 truncate">{patient.email || '-'}</p>
                    </div>
                    <div className="flex justify-end items-center">
                        <Link
                            to={`/patients/${id}/new-exam`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-indigo-200"
                        >
                            <Plus size={20} />
                            Nueva Colposcopia
                        </Link>
                    </div>
                </div>
            </div>

            {showEditForm && (
                <PatientForm
                    patient={patient}
                    onClose={() => setShowEditForm(false)}
                    onSuccess={() => {
                        setShowEditForm(false);
                        fetchPatient();
                    }}
                />
            )}


            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="text-indigo-500" />
                Historial de Estudios
            </h3>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">ID Estudio</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Diagnóstico</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {patient.exams && patient.exams.length > 0 ? (
                            patient.exams.map(exam => (
                                <tr key={exam.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">#{exam.id}</td>
                                    <td className="px-6 py-4">{exam.study_date}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{exam.diagnosis || "Sin diagnóstico"}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/exams/${exam.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Ver Detalles</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No hay estudios registrados.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

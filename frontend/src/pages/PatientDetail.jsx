import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, ArrowLeft, Edit2, Trash2, Printer, History, Eye } from 'lucide-react';
import api from '../api';
import PatientForm from '../components/PatientForm';

export default function PatientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [viewingHistory, setViewingHistory] = useState(null);

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

    const handleDeletePatient = async () => {
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

    const handleDeleteExam = async (examId) => {
        if (window.confirm("¿Está seguro de eliminar este estudio específico? Esta acción no se puede deshacer.")) {
            try {
                await api.delete(`/exams/${examId}`);
                fetchPatient(); // Refresh list
            } catch (error) {
                console.error("Error deleting exam", error);
                alert("Error al eliminar el estudio");
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando expediente...</div>;
    if (!patient) return <div className="p-8 text-center text-red-500">Paciente no encontrado.</div>;

    // Modal Component for History Consultation
    const HistoryModal = ({ exam, onClose }) => {
        if (!exam) return null;
        return (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <History className="text-indigo-600" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Consulta de Historial Clínico</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estudio #{exam.id} - {exam.study_date}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Antecedentes Personales Patológicos */}
                        <div>
                            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                Antecedentes Personales Patológicos
                            </h4>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Enfermedades</label>
                                    <p className="text-sm text-slate-700 font-medium uppercase">{exam.h_enfermedades || 'NINGUNA'}</p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Medicamentos</label>
                                    <p className="text-sm text-slate-700 font-medium uppercase">{exam.h_medicamentos || 'NINGUNO'}</p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Adicciones</label>
                                    <p className="text-sm text-slate-700 font-medium uppercase">{exam.h_adicciones || 'NINGUNA'}</p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Alérgicos</label>
                                    <p className="text-sm text-slate-700 font-medium uppercase">{exam.h_alergicos || 'NINGUNO'}</p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Transfusionales</label>
                                    <p className="text-sm text-slate-700 font-medium uppercase">{exam.h_transfusionales || 'NINGUNO'}</p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Quirúrgicos</label>
                                    <p className="text-sm text-slate-700 font-medium uppercase">{exam.h_quirurgicos || 'NINGUNO'}</p>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Grupo Sanguíneo</label>
                                    <p className="text-sm text-slate-700 font-medium uppercase">{exam.h_grupo_sanguineo || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Antecedentes No Patológicos */}
                        {exam.h_no_patologicos && (
                            <div>
                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                    Antecedentes No Patológicos
                                </h4>
                                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase leading-relaxed">
                                    {exam.h_no_patologicos}
                                </p>
                            </div>
                        )}

                        {/* Antecedentes Familiares Oncológicos */}
                        <div>
                            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                Antecedentes Familiares Oncológicos
                            </h4>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic text-sm text-slate-600 uppercase leading-relaxed">
                                {exam.h_familiares_oncologicos || 'NINGUNO'}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
                        >
                            Cerrar Consulta
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Navigation & Patient Title */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/patients" className="text-slate-400 hover:text-slate-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">{patient.name}</h2>
                        <p className="text-slate-500 font-medium">Expediente Médico #{patient.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        to={`/patients/${id}/new-exam`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-indigo-200"
                    >
                        <Plus size={20} />
                        Nueva Colposcopia
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                {/* Patient Summary Card */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Datos Generales</span>
                        <div className="flex gap-4">
                            <button onClick={() => setShowEditForm(true)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1">
                                <Edit2 size={14} /> EDITAR PACIENTE
                            </button>
                            <button onClick={handleDeletePatient} className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1">
                                <Trash2 size={14} /> ELIMINAR PACIENTE
                            </button>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Edad / Sexo</label>
                            <p className="text-slate-700 font-medium">{patient.age} años / {patient.sex}</p>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Teléfono</label>
                            <p className="text-slate-700 font-medium">{patient.phone || '-'}</p>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Correo</label>
                            <p className="text-slate-700 font-medium truncate">{patient.email || '-'}</p>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Referido por</label>
                            <p className="text-slate-700 font-medium">{patient.referrer || 'Ninguno'}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Info / Stats */}
                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col justify-center items-center text-center">
                    <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                        <FileText className="text-indigo-600" size={24} />
                    </div>
                    <span className="text-indigo-900 font-bold text-2xl">{patient.exams?.length || 0}</span>
                    <span className="text-indigo-600 text-xs font-bold uppercase tracking-tighter">Estudios Realizados</span>
                </div>
            </div>

            {/* Studies Table Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-indigo-500" />
                        Historial de Estudios
                    </h3>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Diagnóstico Colposcópico</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Estudio Realizado</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Historial y Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {patient.exams && patient.exams.length > 0 ? (
                                [...patient.exams].reverse().map(exam => (
                                    <tr key={exam.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-400">#{exam.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-700">{exam.study_date}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{exam.diagnosis || "Sin diagnóstico"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`/exams/${exam.id}`}
                                                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                                                >
                                                    <Eye size={14} /> Ver Detalles / Imprimir
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => setViewingHistory(exam)}
                                                        className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase transition-colors"
                                                    >
                                                        <Eye size={14} /> Ver Historial
                                                    </button>
                                                    <Link
                                                        to={`/exams/${exam.id}/edit`}
                                                        className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase transition-colors"
                                                    >
                                                        <History size={14} /> Editar
                                                    </Link>
                                                </div>
                                                <div className="flex justify-center pt-1">
                                                    <button
                                                        onClick={() => handleDeleteExam(exam.id)}
                                                        className="flex items-center gap-1.5 text-red-400 hover:text-red-600 text-[10px] font-bold uppercase transition-colors opacity-60 hover:opacity-100"
                                                    >
                                                        <Trash2 size={12} /> Eliminar Estudio
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                <FileText className="text-slate-300" size={32} />
                                            </div>
                                            <p className="text-slate-400 font-medium">No hay estudios registrados aún.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Consultation Modal */}
            <HistoryModal exam={viewingHistory} onClose={() => setViewingHistory(null)} />

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
        </div>
    );
}

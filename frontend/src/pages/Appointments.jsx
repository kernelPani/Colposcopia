import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Plus, Trash2, Search, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [formData, setFormData] = useState({
        date_time: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/appointments/`);
            setAppointments(response.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/patients/`);
            setPatients(response.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        if (!selectedPatient) {
            setError('Por favor seleccione un paciente');
            return;
        }
        if (!formData.date_time) {
            setError('Por favor seleccione fecha y hora');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/appointments/`, {
                patient_id: selectedPatient.id,
                date_time: formData.date_time,
                reason: formData.reason
            });
            setFormData({ date_time: '', reason: '' });
            setSelectedPatient(null);
            setSearchTerm('');
            fetchAppointments();
        } catch (err) {
            setError('Error al crear la cita. Verifique los datos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta cita?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/appointments/${id}`);
            fetchAppointments();
        } catch (err) {
            console.error('Error deleting appointment:', err);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Gestión de Citas</h2>
                    <p className="text-slate-500 font-medium">Agenda y seguimiento de pacientes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Plus className="text-indigo-600" size={20} /> Nueva Cita
                        </h3>

                        <form onSubmit={handleCreateAppointment} className="space-y-4">
                            {/* Patient Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <User size={16} className="text-slate-400" /> Paciente
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre..."
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            if (selectedPatient) setSelectedPatient(null);
                                        }}
                                    />
                                    <Search className="absolute right-3 top-3.5 text-slate-300" size={18} />

                                    {searchTerm && !selectedPatient && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden">
                                            {filteredPatients.map(p => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedPatient(p);
                                                        setSearchTerm(p.name);
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b last:border-none border-slate-50 flex flex-col"
                                                >
                                                    <span className="font-bold text-slate-800">{p.name}</span>
                                                    <span className="text-xs text-slate-400">Edad: {p.age} años</span>
                                                </button>
                                            ))}
                                            {filteredPatients.length === 0 && (
                                                <div className="px-4 py-3 text-xs text-slate-400 italic">No se encontraron pacientes</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Date Time Picker */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-400" /> Fecha y Hora
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800"
                                    value={formData.date_time}
                                    onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                                />
                            </div>

                            {/* Reason */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-slate-400" /> Motivo / Observaciones
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 min-h-[100px]"
                                    placeholder="Ej: Seguimiento, Dolor pélvico..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Programar Cita'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">Próximas Citas</h3>
                            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                {appointments.length} Total
                            </span>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {appointments.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar size={32} />
                                    </div>
                                    <p className="text-slate-400 font-medium">No hay citas programadas</p>
                                </div>
                            ) : (
                                appointments.map((appt) => (
                                    <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex flex-col items-center justify-center font-bold">
                                                <span className="text-[10px] leading-none opacity-60">
                                                    {new Date(appt.date_time).toLocaleDateString('es-MX', { month: 'short' }).toUpperCase()}
                                                </span>
                                                <span className="text-lg leading-none">
                                                    {new Date(appt.date_time).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{appt.patient?.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                        <Clock size={12} /> {new Date(appt.date_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {appt.reason && (
                                                        <span className="text-xs text-indigo-400 font-medium">• {appt.reason}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteAppointment(appt.id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

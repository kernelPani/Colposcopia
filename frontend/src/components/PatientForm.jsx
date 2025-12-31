import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api';

export default function PatientForm({ onClose, onSuccess, patient = null }) {
    const [formData, setFormData] = useState({
        name: patient?.name || '',
        birth_date: patient?.birth_date || '',
        age: patient?.age || '',
        sex: patient?.sex || 'Femenino',
        referrer: patient?.referrer || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Auto-calculate age if dob changes
        if (name === 'birth_date') {
            const birthDate = new Date(value);
            const diff = Date.now() - birthDate.getTime();
            const ageDate = new Date(diff);
            const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            setFormData(prev => ({ ...prev, [name]: value, age: calculatedAge }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (patient) {
                await api.put(`/patients/${patient.id}`, formData);
            } else {
                await api.post('/patients/', formData);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save patient", error);
            alert("Error al guardar paciente");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">
                        {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ej. Maria Lopez"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
                            <input
                                required
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                            <input
                                readOnly
                                type="number"
                                name="age"
                                value={formData.age}
                                className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option>Femenino</option>
                                <option>Masculino</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Referido Por</label>
                            <input
                                name="referrer"
                                value={formData.referrer}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

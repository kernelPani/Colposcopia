import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Save, Printer, ArrowLeft, Plus } from 'lucide-react';

export default function NewExam() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        study_date: new Date().toISOString().split('T')[0],
        vulva_vagina_desc: '',
        colposcopy_quality: 'Adecuada',
        cervix_status: 'Normal',
        zone_transform: 'Normal',
        borders: 'Definidos',
        surface: 'Lisa',
        schiller_test: 'Negativo',
        acetowhite_epithelium: 'Ausente',
        observations: '',
        others: '',
        diagnosis: '',
        plan: '',

        // Gyneco-Obstetric
        menarche_age: '',
        menstrual_rhythm: '',
        contraceptive_method: '',
        ivsa_age: '',
        gestas: '',
        partos: '',
        abortos: '',
        cesareas: '',
        fum: '',
        last_pap_smear: '',
        referred_by: 'GENERICO',

        image_paths: ['', '', '', ''] // 4 slots
    });

    React.useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await api.get(`/patients/${id}`);
                if (response.data.referrer) {
                    setFormData(prev => ({ ...prev, referred_by: response.data.referrer }));
                }
            } catch (error) {
                console.error("Error fetching patient for default referrer", error);
            }
        };
        fetchPatient();
    }, [id]);

    const handleImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const response = await api.post('/upload/', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${response.data.url}` : `http://localhost:8000${response.data.url}`;

            setFormData(prev => {
                const newPaths = [...prev.image_paths];
                newPaths[index] = imageUrl;
                return { ...prev, image_paths: newPaths };
            });
        } catch (error) {
            console.error("Error uploading image", error);
            alert("Error al subir imagen");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Sanitize data: convert empty strings to null for numeric/date fields
        const cleanedData = { ...formData, patient_id: parseInt(id) };
        const numericFields = ['menarche_age', 'ivsa_age', 'gestas', 'partos', 'abortos', 'cesareas'];
        numericFields.forEach(field => {
            if (cleanedData[field] === '') cleanedData[field] = null;
            else cleanedData[field] = parseInt(cleanedData[field]);
        });

        if (cleanedData.fum === '') cleanedData.fum = null;

        try {
            await api.post('/exams/', cleanedData);
            navigate(`/patients/${id}`);
        } catch (error) {
            console.error("Error saving exam", error);
            alert("Error al guardar estudio");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
                        <ArrowLeft />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">Nuevo Estudio Colposcópico</h2>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Estudio'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-1 space-y-4">
                    {/* General Study Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <label className="block text-xs font-bold text-indigo-600 uppercase mb-3">Información del Estudio</label>
                        <div>
                            <label className="block text-xs font-medium text-slate-500">Envío (Referido por)</label>
                            <input
                                type="text"
                                name="referred_by"
                                value={formData.referred_by}
                                onChange={handleChange}
                                className="w-full border rounded p-1.5 text-sm"
                                placeholder="Ej. Dr. García / GENERICO"
                            />
                        </div>
                    </div>

                    {/* Gyneco-Obstetric Data */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <label className="block text-xs font-bold text-indigo-600 uppercase mb-3">Datos Gineco-Obstétricos</label>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Menarca (Años)</label>
                                <input type="number" name="menarche_age" value={formData.menarche_age} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">IVSA (Años)</label>
                                <input type="number" name="ivsa_age" value={formData.ivsa_age} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Ritmo</label>
                                <input type="text" name="menstrual_rhythm" value={formData.menstrual_rhythm} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" placeholder="28x5" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">F.U.M.</label>
                                <input type="date" name="fum" value={formData.fum} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-slate-500">MPF (Anticonceptivo)</label>
                            <input type="text" name="contraceptive_method" value={formData.contraceptive_method} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" />
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center mb-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500">G</label>
                                <input type="number" name="gestas" value={formData.gestas} onChange={handleChange} className="w-full border rounded p-1.5 text-sm text-center" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">P</label>
                                <input type="number" name="partos" value={formData.partos} onChange={handleChange} className="w-full border rounded p-1.5 text-sm text-center" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">A</label>
                                <input type="number" name="abortos" value={formData.abortos} onChange={handleChange} className="w-full border rounded p-1.5 text-sm text-center" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">C</label>
                                <input type="number" name="cesareas" value={formData.cesareas} onChange={handleChange} className="w-full border rounded p-1.5 text-sm text-center" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500">Último PAP</label>
                            <input type="text" name="last_pap_smear" value={formData.last_pap_smear} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" placeholder="Fecha o Resultado" />
                        </div>
                    </div>

                    {/* Vulva & Vagina */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <label className="block text-xs font-bold text-indigo-600 uppercase mb-2">Vulva y Vagina</label>
                        <textarea
                            name="vulva_vagina_desc"
                            value={formData.vulva_vagina_desc}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[80px]"
                            placeholder="Descripción..."
                        />
                    </div>

                    {/* Dropdowns Section */}
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Colposcopia</label>
                                <select name="colposcopy_quality" value={formData.colposcopy_quality} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                    <option>Adecuada</option>
                                    <option>No Adecuada</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Cervix</label>
                                <select name="cervix_status" value={formData.cervix_status} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                    <option>Normal</option>
                                    <option>Atrófico</option>
                                    <option>Hipotrófico</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Zona de Transformación</label>
                                <select name="zone_transform" value={formData.zone_transform} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                    <option>Normal</option>
                                    <option>Anormal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Bordes</label>
                                <select name="borders" value={formData.borders} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                    <option>Definidos</option>
                                    <option>No definidos</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Superficie</label>
                                <select name="surface" value={formData.surface} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                    <option>Lisa</option>
                                    <option>Irregular</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Prueba de Schiller</label>
                                <select name="schiller_test" value={formData.schiller_test} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                    <option>Negativo</option>
                                    <option>Positivo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Epitelio Acetoblanco</label>
                                <select name="acetowhite_epithelium" value={formData.acetowhite_epithelium} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                    <option>Ausente</option>
                                    <option>Presente</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Observations, Others, Diagnosis & Plan */}
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">Observaciones</label>
                            <textarea
                                name="observations"
                                value={formData.observations}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20"
                                placeholder="Notas adicionales del estudio..."
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">Diagnóstico Colposcópico</label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">Otras</label>
                                <textarea
                                    name="others"
                                    value={formData.others}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20"
                                    placeholder="Otros hallazgos o datos..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">Plan / Tratamiento</label>
                            <textarea
                                name="plan"
                                value={formData.plan}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Images (4 Quadrants) */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-4 rounded-xl shadow-sm h-full">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 text-center">Imágenes Colposcópicas</h3>

                        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[500px]">
                            {formData.image_paths.map((path, index) => (
                                <div key={index} className="border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative group overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={(e) => handleImageUpload(index, e)}
                                    />
                                    {path ? (
                                        <img src={path} alt={`Exam ${index + 1}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <Plus className="mx-auto text-slate-400 mb-1 group-hover:text-indigo-500" />
                                            <span className="text-xs text-slate-400 group-hover:text-indigo-500">Cargar Imagen {index + 1}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

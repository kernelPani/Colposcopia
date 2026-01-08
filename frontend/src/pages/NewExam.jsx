import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Save, Printer, ArrowLeft, Plus } from 'lucide-react';

export default function NewExam() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('study'); // 'study' or 'history'

    const [formData, setFormData] = useState({
        study_date: new Date().toISOString().split('T')[0],
        vulva_vagina_desc: '',
        colposcopy_quality: 'Adecuada',
        cervix_status: 'EUTRÓFICO',
        zone_transform: 'Normal',
        borders: 'Definidos',
        surface: 'LISA',
        schiller_test: 'Negativo',
        acetowhite_epithelium: 'Ausente',
        observations: '',
        others: '',
        diagnosis: 'SIN ALTERACIONES',
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

        image_paths: ['', '', '', ''], // 4 slots

        // Patient History (Historial Clínico)
        h_enfermedades: 'NINGUNA',
        h_medicamentos: 'NINGUNO',
        h_adicciones: 'NINGUNA',
        h_alergicos: 'NINGUNO',
        h_transfusionales: 'NINGUNO',
        h_quirurgicos: 'NINGUNO',
        h_grupo_sanguineo: '',
        h_no_patologicos: '',
        h_familiares_oncologicos: '',

        // New fields
        h_parejas: '',
        h_fpp: '',
        h_ectopicos: 'NO',
        h_tratamiento_hormonal: 'NO',
        h_ant_cancer_familiar: 'NO',
        h_dismenorrea: 'NO',
        h_dispareunia: 'NO',
        h_registro_embarazos: []
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

    const handleAddPregnancy = () => {
        setFormData(prev => ({
            ...prev,
            h_registro_embarazos: [
                ...prev.h_registro_embarazos,
                { year: '', term: '', resolution: '', sex: '', weight: '', evolution: '', nutrition: '', comments: '' }
            ]
        }));
    };

    const handleRemovePregnancy = (index) => {
        setFormData(prev => ({
            ...prev,
            h_registro_embarazos: prev.h_registro_embarazos.filter((_, i) => i !== index)
        }));
    };

    const handlePregnancyChange = (index, field, value) => {
        setFormData(prev => {
            const newList = [...prev.h_registro_embarazos];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, h_registro_embarazos: newList };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Sanitize data: convert empty strings to null for numeric/date fields
        const cleanedData = { ...formData, patient_id: parseInt(id) };
        const numericFields = ['menarche_age', 'ivsa_age', 'gestas', 'partos', 'abortos', 'cesareas', 'h_parejas'];
        numericFields.forEach(field => {
            if (cleanedData[field] === '') cleanedData[field] = null;
            else cleanedData[field] = parseInt(cleanedData[field]);
        });

        if (cleanedData.fum === '') cleanedData.fum = null;
        if (cleanedData.h_fpp === '') cleanedData.h_fpp = null;

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
                    {/* Tabs Navigation */}
                    <div className="flex bg-white p-1 rounded-xl shadow-sm mb-4">
                        <button
                            onClick={() => setActiveTab('study')}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'study' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Datos del Estudio
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Historial Clínico
                        </button>
                    </div>

                    {activeTab === 'study' ? (
                        <>
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
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">Parejas</label>
                                        <input type="number" name="h_parejas" value={formData.h_parejas} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">F.P.P.</label>
                                        <input type="date" name="h_fpp" value={formData.h_fpp} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">Ectópicos</label>
                                        <select name="h_ectopicos" value={formData.h_ectopicos} onChange={handleChange} className="w-full border rounded p-1.5 text-sm">
                                            <option>NO</option>
                                            <option>SI</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">Trat. Hormonal</label>
                                        <select name="h_tratamiento_hormonal" value={formData.h_tratamiento_hormonal} onChange={handleChange} className="w-full border rounded p-1.5 text-sm">
                                            <option>NO</option>
                                            <option>SI</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">Ant. Cáncer Fam.</label>
                                        <select name="h_ant_cancer_familiar" value={formData.h_ant_cancer_familiar} onChange={handleChange} className="w-full border rounded p-1.5 text-sm">
                                            <option>NO</option>
                                            <option>SI</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">Dismenorrea</label>
                                        <select name="h_dismenorrea" value={formData.h_dismenorrea} onChange={handleChange} className="w-full border rounded p-1.5 text-sm">
                                            <option>NO</option>
                                            <option>LEVE</option>
                                            <option>MODERADA</option>
                                            <option>SEVERA</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">Dispareunia</label>
                                        <select name="h_dispareunia" value={formData.h_dispareunia} onChange={handleChange} className="w-full border rounded p-1.5 text-sm">
                                            <option>NO</option>
                                            <option>LEVE</option>
                                            <option>MODERADA</option>
                                            <option>SEVERA</option>
                                        </select>
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
                                            <option>EUTRÓFICO</option>
                                            <option>ATRÓFICO</option>
                                            <option>HIPERTRÓFICO</option>
                                            <option>HIPOTRÓFICO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500">Zona de Transformación</label>
                                        <select name="zone_transform" value={formData.zone_transform} onChange={handleChange} className="w-full border rounded-md p-1.5 text-sm">
                                            <option>Normal</option>
                                            <option>ANORMAL</option>
                                            <option>TIPO 1</option>
                                            <option>TIPO 2</option>
                                            <option>TIPO 3</option>
                                            <option>PEQUEÑA</option>
                                            <option>INTERMEDIA</option>
                                            <option>AMPLIA</option>
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
                                            <option>LISA</option>
                                            <option>MICROPAPILAR</option>
                                            <option>PUNTILLERO FINO</option>
                                            <option>PUNTILLERO GRUESO</option>
                                            <option>MOSAICO FINO</option>
                                            <option>MOSAICO GRUESO</option>
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
                                        <select
                                            name="diagnosis"
                                            value={formData.diagnosis}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        >
                                            <option>SIN ALTERACIONES</option>
                                            <option>ALTERACIONES INFLAMATORIAS</option>
                                            <option>IVPH</option>
                                            <option>NIC</option>
                                            <option>NEOPLASIA INVASORA</option>
                                            <option>LESIONES SUGESTIVAS DE INVASIÓN</option>
                                            <option>LESION INTRAEPITELIAL DE BAJO GRADO (LIBG)</option>
                                            <option>LESION INTRAEPITELIAL DE ALTO GRADO (LIAG)</option>
                                        </select>
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
                        </>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            {/* Antecedentes Personales Patológicos */}
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-3 px-2 border-l-4 border-indigo-600">Antecedentes Personales Patológicos</label>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Enfermedades</label>
                                        <select name="h_enfermedades" value={formData.h_enfermedades} onChange={handleChange} className="w-full border rounded p-1.5 text-sm uppercase">
                                            <option>NINGUNA</option>
                                            <option>ANEMIA</option>
                                            <option>CARDIOPATIAS</option>
                                            <option>ENF. HEPATICA O RENAL</option>
                                            <option>DIABETES</option>
                                            <option>ENFERMEDAD PULMUNAR</option>
                                            <option>EMBOLIAS</option>
                                            <option>ENDOCRINOPATIAS</option>
                                            <option>EPILEPSIA</option>
                                            <option>F. REUMATICA</option>
                                            <option>HEMOGLOBINOPATIAS</option>
                                            <option>HIPERTENSION</option>
                                            <option>INFERTILIDAD</option>
                                            <option>MALFORMACION CONGENITAS</option>
                                            <option>NEPLASIA INTRAEPITELIAL CERVICAL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Medicamentos</label>
                                        <select name="h_medicamentos" value={formData.h_medicamentos} onChange={handleChange} className="w-full border rounded p-1.5 text-sm uppercase">
                                            <option>NINGUNO</option>
                                            <option>ANTIDEPRESIVOS</option>
                                            <option>BARBITURICOS</option>
                                            <option>SEDANTES</option>
                                            <option>ANOREXIGENOS</option>
                                            <option>ANTICONCEPTIVOS</option>
                                            <option>ANTICOAGULANTES</option>
                                            <option>CORTICOESTEROIDES</option>
                                            <option>DIGITALICOS</option>
                                            <option>ANTIHIPERTENSIVOS</option>
                                            <option>DIURETICOS</option>
                                            <option>ANTICONVULSIVANTES</option>
                                            <option>HIPOGLUCEMIANTES</option>
                                            <option>INSULINA</option>
                                            <option>OTROS</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Adicciones</label>
                                            <select name="h_adicciones" value={formData.h_adicciones} onChange={handleChange} className="w-full border rounded p-1.5 text-sm uppercase">
                                                <option>NINGUNA</option>
                                                <option>ALCOHOLISMO</option>
                                                <option>TABAQUISMO</option>
                                                <option>DROGADICCION</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alérgicos</label>
                                            <input type="text" name="h_alergicos" value={formData.h_alergicos} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" placeholder="NINGUNO" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Transfusionales</label>
                                        <input type="text" name="h_transfusionales" value={formData.h_transfusionales} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" placeholder="NINGUNO" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Quirúrgicos</label>
                                        <input type="text" name="h_quirurgicos" value={formData.h_quirurgicos} onChange={handleChange} className="w-full border rounded p-1.5 text-sm" placeholder="NINGUNO" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Grupo Sanguíneo</label>
                                        <select name="h_grupo_sanguineo" value={formData.h_grupo_sanguineo} onChange={handleChange} className="w-full border rounded p-1.5 text-sm">
                                            <option value="">Seleccionar...</option>
                                            <option>A+</option><option>A-</option>
                                            <option>B+</option><option>B-</option>
                                            <option>AB+</option><option>AB-</option>
                                            <option>O+</option><option>O-</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Antecedentes Personales No Patológicos */}
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-3 px-2 border-l-4 border-indigo-600">Antecedentes No Patológicos</label>
                                <textarea
                                    name="h_no_patologicos"
                                    value={formData.h_no_patologicos}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                    placeholder="Habitación, Higiene, Dieta, etc..."
                                />
                            </div>

                            {/* Antecedentes Familiares Oncológicos */}
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-3 px-2 border-l-4 border-indigo-600">Antecedentes Familiares Oncológicos</label>
                                <textarea
                                    name="h_familiares_oncologicos"
                                    value={formData.h_familiares_oncologicos}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                    placeholder="Detallar antecedentes de cáncer en la familia..."
                                />
                            </div>

                            {/* Detailed Pregnancy Registry */}
                            <div className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-xs font-bold text-indigo-600 uppercase px-2 border-l-4 border-indigo-600">Registro de Embarazos Anteriores</label>
                                    <button
                                        type="button"
                                        onClick={handleAddPregnancy}
                                        className="bg-indigo-100 text-indigo-600 p-1 rounded-md hover:bg-indigo-200"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <table className="w-full text-[10px] border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 uppercase">
                                            <th className="p-1 border text-left">Año</th>
                                            <th className="p-1 border text-left">Término/Pre</th>
                                            <th className="p-1 border text-left">Resolución</th>
                                            <th className="p-1 border text-left">Sexo</th>
                                            <th className="p-1 border text-left">Peso</th>
                                            <th className="p-1 border text-left">Evolución</th>
                                            <th className="p-1 border text-left">Alimentación</th>
                                            <th className="p-1 border text-left">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.h_registro_embarazos.map((reg, idx) => (
                                            <tr key={idx}>
                                                <td className="p-0.5 border"><input className="w-full p-1" value={reg.year} onChange={(e) => handlePregnancyChange(idx, 'year', e.target.value)} /></td>
                                                <td className="p-0.5 border"><input className="w-full p-1" value={reg.term} onChange={(e) => handlePregnancyChange(idx, 'term', e.target.value)} /></td>
                                                <td className="p-0.5 border"><input className="w-full p-1" value={reg.resolution} onChange={(e) => handlePregnancyChange(idx, 'resolution', e.target.value)} /></td>
                                                <td className="p-0.5 border"><input className="w-full p-1" value={reg.sex} onChange={(e) => handlePregnancyChange(idx, 'sex', e.target.value)} /></td>
                                                <td className="p-0.5 border"><input className="w-full p-1" value={reg.weight} onChange={(e) => handlePregnancyChange(idx, 'weight', e.target.value)} /></td>
                                                <td className="p-0.5 border"><input className="w-full p-1" value={reg.evolution} onChange={(e) => handlePregnancyChange(idx, 'evolution', e.target.value)} /></td>
                                                <td className="p-0.5 border"><input className="w-full p-1" value={reg.nutrition} onChange={(e) => handlePregnancyChange(idx, 'nutrition', e.target.value)} /></td>
                                                <td className="p-0.5 border text-center">
                                                    <button type="button" onClick={() => handleRemovePregnancy(idx)} className="text-red-400 hover:text-red-600">
                                                        <Plus className="rotate-45" size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
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

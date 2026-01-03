import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Printer } from 'lucide-react';

export default function ExamDetail() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await api.get(`/exams/${examId}`);
                setExam(response.data);
            } catch (error) {
                console.error("Error fetching exam", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [examId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando estudio...</div>;
    if (!exam) return <div className="p-8 text-center text-red-500">Estudio no encontrado.</div>;

    // Helper for table cells
    const Cell = ({ label, value, className = "" }) => (
        <div className={`border-r border-slate-300 px-2 py-1 last:border-r-0 ${className}`}>
            <span className="font-bold text-xs block text-slate-700">{label}</span>
            <span className="text-sm text-slate-900">{value || '-'}</span>
        </div>
    );

    const Field = ({ label, value, className = "" }) => (
        <div className={`flex gap-2 text-sm ${className}`}>
            <span className="font-bold text-slate-800 uppercase">{label}:</span>
            <span className="text-slate-900 border-b border-slate-300 grow px-1">{value || ''}</span>
        </div>
    );

    const RowInfo = ({ label, value }) => (
        <div className="grid grid-cols-2 border-b border-slate-300 text-sm">
            <div className="font-bold bg-slate-50 px-2 py-1 text-slate-700 uppercase">{label}</div>
            <div className="px-2 py-1 uppercase">{value || 'EUTRÓFICO'}</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10 print:max-w-none print:pb-0">
            {/* Toolbar - Hidden in Print */}
            <div className="flex justify-between items-center mb-6 print:hidden">
                <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 flex items-center gap-2">
                    <ArrowLeft size={20} /> Volver
                </button>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Printer size={18} /> Imprimir
                </button>
            </div>

            {/* REPORT CONTAINER (Simulates A4) */}
            <div className="bg-white shadow-lg p-8 min-h-[1120px] border border-slate-200 print:shadow-none print:border-0 print:p-4 flex flex-col">

                {/* HEADER */}
                <div className="flex items-start justify-between mb-6 border-b-2 border-blue-900 pb-4">
                    <div className="w-24 shrink-0">
                        <img src="/images/logo_caduceus.png" alt="Logo" className="w-full opacity-90" />
                    </div>
                    <div className="text-center flex-1 text-blue-900 px-2">
                        <h1 className="text-2xl font-bold uppercase tracking-tighter">Hospital San Jose de Celaya</h1>
                        <h2 className="text-2xl font-serif italic font-bold mt-1 text-blue-800">Dr. Jose Luis Arteaga Dominguez</h2>
                        <p className="text-sm font-bold uppercase mt-1">Especialista Certificado en Ginecología y Obstetricia</p>
                        <p className="text-xs uppercase font-medium text-slate-600 mt-1">Ginecoobstetra Colposcopista | Histeroscopia DX. Y QX.</p>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 max-w-2xl mx-auto text-[9px] text-slate-600 font-bold uppercase">
                            <div className="text-left">R.F.C. AEDL590829KG3</div>
                            <div className="text-left">C.U.R.P. AEDL590829HDFRMS01</div>
                            <div className="text-left">CED. PROF. 974987</div>
                            <div className="text-left">CED. ESPEC. 3225937</div>
                            <div className="text-left">REG. S.S.A. GTO. 2561 Y 635</div>
                            <div className="text-left">CERTIFICACION DEL CONSEJO DE G/O No. 5695</div>
                            <div className="text-left">CONSULTORIO: 461-61-49-393</div>
                            <div className="text-left">CELULAR: 461-61-927-54</div>
                            <div className="text-left col-span-2 mt-1 border-t border-slate-200 pt-1 text-[10px]">
                                EJE. NOR-PONIENTE No. 200 PRIMER PISO CONSULTORIO 111
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-blue-800 mb-6">
                    <div className="bg-blue-50 border-b border-blue-800 px-2 py-1 font-bold text-blue-900 uppercase">
                        Estudio de Colposcopia.
                    </div>

                    {/* Patient / Study Logic */}
                    <div className="grid grid-cols-3 text-sm border-b border-blue-800">
                        <div className="col-span-2 border-r border-blue-800 p-2">
                            <Field label="Paciente" value={exam.patient?.name} />
                        </div>
                        <div className="p-2 space-y-1">
                            <div className="flex justify-between">
                                <span className="font-bold">FECHA ESTUDIO:</span>
                                <span>{exam.study_date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">EDAD:</span>
                                <span>{exam.patient?.age} Años</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">ENVIO:</span>
                                <span>{exam.referred_by || 'GENERICO'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Gineco-Obstetric Data */}
                    <div className="bg-slate-100 px-2 py-1 text-xs font-bold uppercase border-b border-slate-300 flex items-center gap-2">
                        <span className="text-slate-500">📂</span> Datos Gineco-Obstetricos:
                    </div>
                    <div className="grid grid-cols-9 border-b border-blue-800 text-center divide-x divide-slate-300 text-xs">
                        <div className="p-1">
                            <div className="font-bold text-[10px] text-slate-500">MENARCA</div>
                            <div>{exam.menarche_age} Años</div>
                        </div>
                        <div className="p-1">
                            <div className="font-bold text-[10px] text-slate-500">RITMO</div>
                            <div>{exam.menstrual_rhythm}</div>
                        </div>
                        <div className="p-1 col-span-1">
                            <div className="font-bold text-[10px] text-slate-500">MPF</div>
                            <div>{exam.contraceptive_method}</div>
                        </div>
                        <div className="p-1 col-span-1">
                            <div className="font-bold text-[10px] text-slate-500">IVSA</div>
                            <div>{exam.ivsa_age} Años</div>
                        </div>
                        <div className="p-1">
                            <div className="font-bold text-[10px] text-slate-500">G</div>
                            <div>{exam.gestas}</div>
                        </div>
                        <div className="p-1">
                            <div className="font-bold text-[10px] text-slate-500">P</div>
                            <div>{exam.partos}</div>
                        </div>
                        <div className="p-1">
                            <div className="font-bold text-[10px] text-slate-500">A</div>
                            <div>{exam.abortos}</div>
                        </div>
                        <div className="p-1">
                            <div className="font-bold text-[10px] text-slate-500">C</div>
                            <div>{exam.cesareas}</div>
                        </div>
                        <div className="p-1">
                            <div className="font-bold text-[10px] text-slate-500">ULTIMO PAP</div>
                            <div>{exam.last_pap_smear || '-'}</div>
                        </div>
                    </div>

                    {/* Patient History (Antecedentes) - HIDDEN IN PRINT */}
                    <div className="bg-slate-100 px-2 py-1 text-xs font-bold uppercase border-b border-slate-300 flex items-center gap-2 print:hidden">
                        <span className="text-slate-500">📂</span> Antecedentes Clinicos:
                    </div>
                    <div className="grid grid-cols-2 text-xs border-b border-blue-800 print:hidden">
                        <div className="border-r border-slate-300 divide-y divide-slate-100">
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">ENFERMEDADES:</span>
                                <span className="uppercase">{exam.h_enfermedades || 'NINGUNA'}</span>
                            </div>
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">MEDICAMENTOS:</span>
                                <span className="uppercase">{exam.h_medicamentos || 'NINGUNO'}</span>
                            </div>
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">ADICCIONES:</span>
                                <span className="uppercase">{exam.h_adicciones || 'NINGUNA'}</span>
                            </div>
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">ALÉRGICOS:</span>
                                <span className="uppercase">{exam.h_alergicos || 'NINGUNO'}</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">TRANSFUSIONALES:</span>
                                <span className="uppercase">{exam.h_transfusionales || 'NINGUNO'}</span>
                            </div>
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">QUIRÚRGICOS:</span>
                                <span className="uppercase">{exam.h_quirurgicos || 'NINGUNO'}</span>
                            </div>
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">GRUPO SANGUÍNEO:</span>
                                <span className="uppercase">{exam.h_grupo_sanguineo || '-'}</span>
                            </div>
                            <div className="p-1 px-2 flex justify-between">
                                <span className="text-slate-500 font-bold text-[9px]">FAM. ONCOLÓGICOS:</span>
                                <span className="uppercase truncate max-w-[150px]">{exam.h_familiares_oncologicos || 'NINGUNO'}</span>
                            </div>
                        </div>
                    </div>
                    {exam.h_no_patologicos && (
                        <div className="border-b border-blue-800 p-2 text-xs print:hidden">
                            <span className="text-slate-500 font-bold text-[9px] uppercase block mb-1">Antecedentes No Patológicos:</span>
                            <p className="uppercase">{exam.h_no_patologicos}</p>
                        </div>
                    )}

                    {/* Colposcopic Data */}
                    <div className="bg-slate-100 px-2 py-1 text-xs font-bold uppercase border-b border-slate-300 flex items-center gap-2">
                        <span className="text-slate-500">📂</span> Datos Colposcopicos:
                    </div>

                    <div className="border-b border-blue-800 p-2">
                        <div className="text-xs font-bold uppercase mb-1">Vulva y Vagina:</div>
                        <p className="text-sm uppercase">{exam.vulva_vagina_desc || 'SE OBSERVAN DE MANERA NORMAL'}</p>
                    </div>

                    <div className="grid grid-cols-2 text-xs">
                        <div className="border-r border-slate-300">
                            <RowInfo label="Colposcopia" value={exam.colposcopy_quality} />
                            <RowInfo label="Superficie" value={exam.surface} />
                            <RowInfo label="Prueba de Schiller" value={exam.schiller_test} />
                        </div>
                        <div>
                            <RowInfo label="Cervix" value={exam.cervix_status} />
                            <RowInfo label="Bordes" value={exam.borders} />
                            <div className="grid grid-cols-2 border-b border-slate-300 text-sm">
                                <div className="font-bold bg-slate-50 px-2 py-1 text-slate-700 uppercase text-[10px]">Zona Transformación</div>
                                <div className="px-2 py-1 uppercase">{exam.zone_transform}</div>
                            </div>
                            <div className="grid grid-cols-2 border-b border-slate-300 text-sm">
                                <div className="font-bold bg-slate-50 px-2 py-1 text-slate-700 uppercase text-[10px]">Epitelio Acetoblanco</div>
                                <div className="px-2 py-1 uppercase">{exam.acetowhite_epithelium || 'AUSENTE'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Observations */}
                    <div className="border-b border-blue-800 p-2 min-h-[60px]">
                        <div className="text-xs font-bold uppercase mb-1 underline">Observaciones:</div>
                        <p className="text-sm uppercase text-slate-800">{exam.observations}</p>
                    </div>

                    {/* Diagnosis */}
                    <div className="border-b border-blue-800 p-2 min-h-[60px]">
                        <div className="text-xs font-bold uppercase mb-1 underline text-blue-900">Diagnostico Colposcopico:</div>
                        <p className="text-sm uppercase font-bold text-slate-700">{exam.diagnosis || 'SIN ALTERACIONES'}</p>
                    </div>

                    {/* Others */}
                    <div className="border-b border-blue-800 p-2">
                        <div className="text-xs font-bold uppercase mb-1 text-blue-900">Otras</div>
                        <p className="text-sm uppercase text-slate-700">{exam.others || 'Ninguna'}</p>
                    </div>

                    {/* Plan */}
                    <div className="p-2 border-b border-blue-800">
                        <div className="text-xs font-bold uppercase mb-1 text-blue-900">Plan de Tratamiento:</div>
                        <p className="text-sm uppercase text-slate-700">{exam.plan}</p>
                    </div>
                </div>

                {/* Images Section */}
                <div className="flex gap-4 mt-6 w-full">
                    {/* Left Side: Diagram Box with Signature Integrated */}
                    <div className="w-1/2 border border-slate-300 p-2 flex flex-col bg-white">
                        <div className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100 pb-1 mb-2 px-1">
                            Colposcopio - Esquema
                        </div>

                        {/* Image Section */}
                        <div className="flex-1 flex items-center justify-center min-h-[180px] p-2">
                            <img
                                src="/images/image1.jpg"
                                alt="Esquema Cervix"
                                className="max-h-[200px] w-auto object-contain"
                            />
                        </div>

                        {/* Signature Integrated here */}
                        <div className="mt-auto pt-4 border-t border-slate-200 text-center">
                            <div className="text-[10px] font-bold uppercase mb-6 text-slate-400">Atentamente:</div>
                            <div className="border-t border-black mx-auto pt-1 inline-block px-4">
                                <div className="font-bold text-[11px] text-slate-800">DR. JOSE LUIS ARTEAGA DOMINGUEZ</div>
                                <div className="text-[10px] text-slate-600">Ced. Prof.: 974987 / Ced. Esp.: 3225937</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: 4 Images Grid */}
                    <div className="w-1/2">
                        <div className="grid grid-cols-2 gap-2">
                            {exam.image_paths && exam.image_paths.slice(0, 4).map((path, idx) => path && (
                                <div key={idx} className="relative aspect-square border border-slate-300 overflow-hidden bg-slate-50">
                                    <img
                                        src={path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${path}`}
                                        className="w-full h-full object-cover"
                                        alt="Colpo"
                                    />
                                    <div className="absolute bottom-0 left-0 bg-black/60 text-white text-[10px] w-full px-1 py-1 uppercase tracking-tighter text-center">
                                        {idx === 0 ? 'VISTA NORMAL' :
                                            idx === 1 ? 'VISTA ACIDO ACETICO' :
                                                idx === 2 ? 'VISTA LUGOL' : 'OTRA VISTA'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto"></div>


            </div>
        </div>
    );
}

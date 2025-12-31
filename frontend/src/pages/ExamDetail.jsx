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
            <div className="px-2 py-1 uppercase">{value || 'NORMAL'}</div>
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
            <div className="bg-white shadow-lg p-8 min-h-[1120px] border border-slate-200 print:shadow-none print:border-0 print:p-0 flex flex-col">

                {/* HEADER */}
                <div className="text-center mb-4 text-blue-900">
                    <h1 className="text-xl font-bold uppercase tracking-wide">Hospital San Jose de Celaya</h1>
                    <h2 className="text-lg font-serif italic font-bold mt-1">Dr. Jose Luis Arteaga Dominguez</h2>
                    <p className="text-xs uppercase font-medium text-slate-600">Ginecoobstetra Colposcopista</p>
                    <p className="text-[10px] text-slate-500">HISTEROSCOPIA DX. Y QX.</p>
                    <p className="text-[10px] text-slate-500">CERTIFICADO POR EL CONSEJO DE G/O No. 5695</p>
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
                                <span>{exam.patient?.referrer || 'GENERICO'}</span>
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
                        <p className="text-sm uppercase text-slate-700">Ninguna</p>
                    </div>

                    {/* Plan */}
                    <div className="p-2 border-b border-blue-800">
                        <div className="text-xs font-bold uppercase mb-1 text-blue-900">Plan de Tratamiento:</div>
                        <p className="text-sm uppercase text-slate-700">{exam.plan}</p>
                    </div>
                </div>

                {/* Images Section */}
                <div className="grid grid-cols-2 gap-4 mt-4 h-80">
                    {/* Diagram Box with Signature Integrated */}
                    <div className="border border-slate-200 p-2 flex flex-col bg-white relative">
                        <span className="absolute top-2 left-1 text-[9px] bg-white/90 px-1 rounded z-10 border border-slate-100 text-slate-500">Colposcopio - Esquema</span>

                        {/* Image Section */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
                            <img
                                src="/images/image1.jpg"
                                alt="Esquema Cervix"
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        {/* Signature Integrated here */}
                        <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                            <div className="text-[9px] font-bold uppercase mb-4 text-slate-400">Atentamente:</div>
                            <div className="border-t border-black mx-auto pt-1 inline-block px-2">
                                <div className="font-bold text-[10px] text-slate-800">DR. JOSE LUIS ARTEAGA DOMINGUEZ</div>
                                <div className="text-[9px] text-slate-600">Ced. Prof.: 974987 / Ced. Esp.: 3225937</div>
                            </div>
                        </div>
                    </div>

                    {/* Images Loop (Up to 4) */}
                    <div className="grid grid-cols-2 gap-2">
                        {exam.image_paths && exam.image_paths.slice(0, 4).map((path, idx) => path && (
                            <div key={idx} className="relative aspect-square border border-slate-200 overflow-hidden">
                                <img
                                    src={path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${path}`}
                                    className="w-full h-full object-cover"
                                    alt="Colpo"
                                />
                                <div className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] w-full px-1 uppercase tracking-tighter">
                                    {idx === 0 ? 'VISTA NORMAL' :
                                        idx === 1 ? 'VISTA ACIDO ACETICO' :
                                            idx === 2 ? 'VISTA LUGOL' : 'OTRA VISTA'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto"></div>


            </div>
        </div>
    );
}

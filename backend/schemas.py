from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import date, datetime

# Exam Schemas
class ColposcopyExamBase(BaseModel):
    study_date: date
    vulva_vagina_desc: Optional[str] = None
    observations: Optional[str] = None
    diagnosis: Optional[str] = None
    others: Optional[str] = None
    referred_by: Optional[str] = 'GENERICO'
    plan: Optional[str] = None
    colposcopy_quality: Optional[str] = None
    cervix_status: Optional[str] = None
    zone_transform: Optional[str] = None
    borders: Optional[str] = None
    surface: Optional[str] = None
    schiller_test: Optional[str] = None
    acetowhite_epithelium: Optional[str] = None
    menarche_age: Optional[int] = None
    menstrual_rhythm: Optional[str] = None
    contraceptive_method: Optional[str] = None
    ivsa_age: Optional[int] = None
    gestas: Optional[int] = None
    partos: Optional[int] = None
    abortos: Optional[int] = None
    cesareas: Optional[int] = None
    fum: Optional[date] = None
    last_pap_smear: Optional[str] = None
    image_paths: Optional[List[str]] = None

    # Patient History (Historial Clínico)
    h_enfermedades: Optional[str] = None
    h_medicamentos: Optional[str] = None
    h_adicciones: Optional[str] = None
    h_alergicos: Optional[str] = None
    h_transfusionales: Optional[str] = None
    h_quirurgicos: Optional[str] = None
    h_grupo_sanguineo: Optional[str] = None
    h_no_patologicos: Optional[str] = None
    h_familiares_oncologicos: Optional[str] = None

    # New fields
    h_parejas: Optional[int] = None
    h_fpp: Optional[date] = None
    h_ectopicos: Optional[str] = None
    h_tratamiento_hormonal: Optional[str] = None
    h_ant_cancer_familiar: Optional[str] = None
    h_dismenorrea: Optional[str] = None
    h_dispareunia: Optional[str] = None
    h_registro_embarazos: Optional[List[Any]] = None

class ColposcopyExamCreate(ColposcopyExamBase):
    patient_id: int

class PatientBase(BaseModel):
    name: str
    birth_date: date
    age: int
    sex: str = "Femenino"
    phone: Optional[str] = None
    email: Optional[str] = None
    referrer: Optional[str] = None
    additional_data: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    exams: List["ColposcopyExam"] = []

    class Config:
        orm_mode = True

# Simple exam schema for listing inside Patient
class ColposcopyExam(ColposcopyExamBase):
    id: int
    patient_id: int

    class Config:
        orm_mode = True

# Extended exam schema with Patient details (for single exam view)
class ColposcopyExamWithPatient(ColposcopyExam):
    patient: Optional[Patient] = None

# Appointment Schemas
class AppointmentBase(BaseModel):
    date_time: datetime
    reason: Optional[str] = None
    status: Optional[str] = "Pendiente"

class AppointmentCreate(AppointmentBase):
    patient_id: int

class Appointment(AppointmentBase):
    id: int
    patient_id: int

    class Config:
        orm_mode = True

class AppointmentWithPatient(Appointment):
    patient: Optional[Patient] = None

# Update forward refs
Patient.update_forward_refs()


from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import date

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

# Update forward refs
Patient.update_forward_refs()


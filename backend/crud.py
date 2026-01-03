from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
import models, schemas

# Patient CRUD
def get_patient(db: Session, patient_id: int):
    return db.query(models.Patient).options(joinedload(models.Patient.exams)).filter(models.Patient.id == patient_id).first()

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).offset(skip).limit(limit).all()

def create_patient(db: Session, patient: schemas.PatientCreate):
    db_patient = models.Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, patient_id: int, patient_update: schemas.PatientBase):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        return None
    
    update_data = patient_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, patient_id: int):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        return False
    
    # Exams will be deleted if ondelete="CASCADE" is set in models, 
    # but manually deleting for safety if not explicitly confirmed.
    db.delete(db_patient)
    db.commit()
    return True


# Exam CRUD
def create_patient_exam(db: Session, exam: schemas.ColposcopyExamCreate):
    # Ensure image_paths is stored as JSON (SQLAlchemy handles this with JSON type but good to be safe)
    db_exam = models.ColposcopyExam(**exam.dict())
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

def get_patient_exam(db: Session, exam_id: int):
    return db.query(models.ColposcopyExam).options(joinedload(models.ColposcopyExam.patient)).filter(models.ColposcopyExam.id == exam_id).first()

def update_colposcopy_exam(db: Session, exam_id: int, exam_update: schemas.ColposcopyExamBase):
    db_exam = db.query(models.ColposcopyExam).filter(models.ColposcopyExam.id == exam_id).first()
    if not db_exam:
        return None
    
    update_data = exam_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_exam, key, value)
    
    db.commit()
    db.refresh(db_exam)
    return db_exam

def delete_colposcopy_exam(db: Session, exam_id: int):
    db_exam = db.query(models.ColposcopyExam).filter(models.ColposcopyExam.id == exam_id).first()
    if not db_exam:
        return False
    
    db.delete(db_exam)
    db.commit()
    return True

# Appointment CRUD
def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    db_appointment = models.Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Appointment).options(joinedload(models.Appointment.patient)).order_by(models.Appointment.date_time.asc()).offset(skip).limit(limit).all()

def delete_appointment(db: Session, appointment_id: int):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if db_appointment:
        db.delete(db_appointment)
        db.commit()
        return True
    return False

from sqlalchemy import Column, Integer, String, Date, Text, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    birth_date = Column(Date)
    age = Column(Integer)
    sex = Column(String(50), default="Femenino")
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    referrer = Column(String(255), nullable=True)
    additional_data = Column(Text, nullable=True)

    exams = relationship("ColposcopyExam", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")

class ColposcopyExam(Base):
    __tablename__ = "colposcopy_exams"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    study_date = Column(Date)
    
    # Text fields from the UI
    vulva_vagina_desc = Column(Text, nullable=True)
    observations = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    others = Column(Text, nullable=True)
    referred_by = Column(String(255), nullable=True, default='GENERICO')
    plan = Column(Text, nullable=True)

    # Dropdown/Selection fields
    colposcopy_quality = Column(String(50), nullable=True) # Adecuada/No Adecuada
    cervix_status = Column(String(50), nullable=True) # Atrofico/Normal/Hipotrofico
    zone_transform = Column(String(50), nullable=True) # Normal/Anormal
    borders = Column(String(50), nullable=True) # Definidos/No definidos
    surface = Column(String(50), nullable=True) # Lisa/Irregular
    schiller_test = Column(String(50), nullable=True) # Positivo/Negativo
    acetowhite_epithelium = Column(String(50), nullable=True) # Ausente/Presente

    # Gineco-Obstetric Data (Snapshot for this exam)
    menarche_age = Column(Integer, nullable=True)
    menstrual_rhythm = Column(String(50), nullable=True)
    contraceptive_method = Column(String(100), nullable=True) # MPF
    ivsa_age = Column(Integer, nullable=True)
    gestas = Column(Integer, nullable=True)
    partos = Column(Integer, nullable=True)
    abortos = Column(Integer, nullable=True)
    cesareas = Column(Integer, nullable=True)
    fum = Column(Date, nullable=True) # Last period date
    last_pap_smear = Column(String(100), nullable=True) # Ultimo PAP (Date or result?)

    # Images (Store paths as JSON list or specific columns)
    image_paths = Column(JSON, nullable=True)

    patient = relationship("Patient", back_populates="exams")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    date_time = Column(DateTime)
    reason = Column(String(255), nullable=True)
    status = Column(String(50), default="Pendiente")

    patient = relationship("Patient", back_populates="appointments")

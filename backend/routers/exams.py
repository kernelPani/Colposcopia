from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, schemas, crud

router = APIRouter(
    prefix="/exams",
    tags=["exams"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.ColposcopyExam)
def create_exam(exam: schemas.ColposcopyExamCreate, db: Session = Depends(database.get_db)):
    return crud.create_patient_exam(db=db, exam=exam)

@router.get("/{exam_id}", response_model=schemas.ColposcopyExamWithPatient)
def read_exam(exam_id: int, db: Session = Depends(database.get_db)):
    db_exam = crud.get_patient_exam(db, exam_id=exam_id)
    if db_exam is None:
        raise HTTPException(status_code=404, detail="Exam not found")
    return db_exam

@router.put("/{exam_id}", response_model=schemas.ColposcopyExam)
def update_exam(exam_id: int, exam: schemas.ColposcopyExamBase, db: Session = Depends(database.get_db)):
    db_exam = crud.update_colposcopy_exam(db, exam_id=exam_id, exam_update=exam)
    if db_exam is None:
        raise HTTPException(status_code=404, detail="Exam not found")
    return db_exam

@router.delete("/{exam_id}", response_model=bool)
def delete_exam(exam_id: int, db: Session = Depends(database.get_db)):
    success = crud.delete_colposcopy_exam(db, exam_id=exam_id)
    if not success:
        raise HTTPException(status_code=404, detail="Exam not found")
    return success

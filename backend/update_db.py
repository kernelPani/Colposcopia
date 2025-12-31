
from sqlalchemy import create_engine, text
import os

# Database connection settings (matching docker-compose usually, or default)
# Note: When running locally outside docker, this might fail if DB is not exposed or different creds.
# Assuming user runs this via "docker-compose exec backend python update_db.py" or similar, 
# but I will try to detect environment.
# For now, I'll use the connection string from docker-compose.yml: mysql+mysqlconnector://${DB_USER}:${DB_PASSWORD}@db:3306/${DB_NAME}

# If running from host logic:
# I must assume the user might have port 3306 mapped.
DB_USER = "user"
DB_PASSWORD = "userpassword"
DB_NAME = "colposcopia_db"
DB_HOST = "localhost" # If running from host
# DB_HOST = "db" # If running from container

# Try to get from environment first (Docker), else fallback to localhost (Host)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DB_HOST = "localhost"
    DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}"

def upgrade():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        # List of columns to add
        columns = [
            ("acetowhite_epithelium", "VARCHAR(50)"),
            ("menarche_age", "INT"),
            ("menstrual_rhythm", "VARCHAR(50)"),
            ("contraceptive_method", "VARCHAR(100)"),
            ("ivsa_age", "INT"),
            ("gestas", "INT"),
            ("partos", "INT"),
            ("abortos", "INT"),
            ("cesareas", "INT"),
            ("fum", "DATE"),
            ("last_pap_smear", "VARCHAR(100)")
        ]

        for col_name, col_type in columns:
            try:
                sql = f"ALTER TABLE colposcopy_exams ADD COLUMN {col_name} {col_type} NULL"
                conn.execute(text(sql))
                print(f"Added column {col_name}")
            except Exception as e:
                print(f"Column {col_name} might already exist or error: {e}")

if __name__ == "__main__":
    print("Starting database schema update...")
    try:
        upgrade()
        print("Update complete.")
    except Exception as e:
        print(f"Update failed: {e}")
        print("Note: If running from host, ensure localhost:3306 is accessible.")

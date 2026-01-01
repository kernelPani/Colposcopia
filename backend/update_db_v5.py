import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection configuration
db_url = os.getenv("DATABASE_URL")

if db_url:
    url = db_url.replace("mysql+mysqlconnector://", "")
    auth, rest = url.split("@")
    user, password = auth.split(":")
    host_port, db_name = rest.split("/")
    host = host_port.split(":")[0]
else:
    host = "localhost"
    user = os.getenv("DB_USER", "user")
    password = os.getenv("DB_PASSWORD", "userpassword")
    db_name = os.getenv("DB_NAME", "colposcopia_db")

print(f"Connecting to {host}/{db_name}...")

try:
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=db_name
    )
    cursor = conn.cursor()

    # Create appointments table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        date_time DATETIME NOT NULL,
        reason VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pendiente',
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
    """
    
    print("Creating 'appointments' table...")
    cursor.execute(create_table_query)

    conn.commit()
    print("Database updated successfully!")

except mysql.connector.Error as err:
    print(f"Connection Error: {err}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()

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

    # Add new column to colposcopy_exams table
    query = "ALTER TABLE colposcopy_exams ADD COLUMN others TEXT NULL AFTER diagnosis;"
    
    try:
        print(f"Executing: {query}")
        cursor.execute(query)
    except mysql.connector.Error as err:
        if err.errno == 1060: # Column already exists
            print(f"Column already exists, skipping.")
        else:
            print(f"Error: {err}")

    conn.commit()
    print("Database updated successfully!")

except mysql.connector.Error as err:
    print(f"Connection Error: {err}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()

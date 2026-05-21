import os
from datetime import date, datetime

# Try loading dotenv
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Try importing PyMySQL
try:
    import pymysql
    import pymysql.cursors
    HAS_PYMYSQL = True
except ImportError:
    HAS_PYMYSQL = False

def get_db_connection():
    if not HAS_PYMYSQL:
        return None
    
    host = os.getenv('DB_HOST', '127.0.0.1')
    try:
        port = int(os.getenv('DB_PORT', '3306'))
    except (ValueError, TypeError):
        port = 3306
    user = os.getenv('DB_USER', 'root')
    password = os.getenv('DB_PASSWORD', '')
    db_name = os.getenv('DB_NAME', 'country_immigration_db')

    try:
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=db_name,
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=3
        )
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def check_db_active():
    conn = get_db_connection()
    if conn:
        conn.close()
        return True
    return False

def serialize_db_row(row):
    if not row:
        return row
    serialized = {}
    for key, value in row.items():
        if isinstance(value, (datetime, date)):
            serialized[key] = value.isoformat()
        elif isinstance(value, bytes):
            serialized[key] = value.decode('utf-8')
        else:
            serialized[key] = value
    return serialized

def get_db_records(resource):
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        with conn.cursor() as cursor:
            # Whitelist resource names to prevent SQL injection in table name
            whitelist = {'countries', 'travelers', 'visas', 'ports', 'border_crossings', 'blacklist'}
            if resource not in whitelist:
                return None
            
            sql = f"SELECT * FROM `{resource}`"
            cursor.execute(sql)
            rows = cursor.fetchall()
            return [serialize_db_row(row) for row in rows]
    except Exception as e:
        print(f"Error querying database for {resource}: {e}")
        return None
    finally:
        conn.close()

def insert_db_record(resource, data):
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        whitelist = {'countries', 'travelers', 'visas', 'ports', 'border_crossings', 'blacklist'}
        if resource not in whitelist:
            return None
        
        # Auto-generate ID field name
        if resource == 'countries':
            id_field = 'country_id'
        elif resource == 'border_crossings':
            id_field = 'crossing_id'
        elif resource == 'blacklist':
            id_field = 'blacklist_id'
        else:
            id_field = f"{resource.rstrip('s')}_id"
        
        # Remove primary key from data if it's there and empty/None, letting DB auto-increment it
        insert_data = data.copy()
        if id_field in insert_data:
            del insert_data[id_field]
        
        # Build query
        columns = list(insert_data.keys())
        if not columns:
            return None
            
        placeholders = ", ".join(["%s"] * len(columns))
        column_names = ", ".join([f"`{col}`" for col in columns])
        sql = f"INSERT INTO `{resource}` ({column_names}) VALUES ({placeholders})"
        
        # Map values (serialize dict/list to string if needed, or None)
        values = []
        for col in columns:
            val = insert_data[col]
            # Convert empty string to None/NULL if it's a numeric/date/relation field
            if val == '' and col in {
                'country_id', 'traveler_id', 'visa_id', 'port_id', 'crossing_id', 'blacklist_id',
                'nationality_id', 'population', 'start_date', 'end_date', 'date_of_birth',
                'ban_start', 'ban_end', 'reinstated'
            }:
                val = None
            values.append(val)
        
        with conn.cursor() as cursor:
            cursor.execute(sql, values)
            conn.commit()
            new_id = cursor.lastrowid
            
        # Fetch the newly inserted record to return it
        with conn.cursor() as cursor:
            sql_fetch = f"SELECT * FROM `{resource}` WHERE `{id_field}` = %s"
            cursor.execute(sql_fetch, (new_id,))
            row = cursor.fetchone()
            return serialize_db_row(row)
            
    except Exception as e:
        print(f"Error inserting into database for {resource}: {e}")
        try:
            conn.rollback()
        except:
            pass
        return None
    finally:
        conn.close()

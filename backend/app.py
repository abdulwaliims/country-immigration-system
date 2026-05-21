from pathlib import Path
import csv
import os

from flask import Flask, jsonify, abort, send_from_directory, request
from flask_cors import CORS

# Load dotenv if possible
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Import DB helper functions
from db import get_db_records, insert_db_record, check_db_active

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / 'data'
STATIC_DIR = ROOT

app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path='')
CORS(app)

API_RESOURCES = {
    'countries': 'countries',
    'travelers': 'travelers',
    'visas': 'visas',
    'ports': 'ports',
    'border_crossings': 'border_crossings',
    'blacklist': 'blacklist',
}

NUMERIC_FIELDS = {
    'country_id', 'traveler_id', 'visa_id', 'port_id',
    'crossing_id', 'blacklist_id', 'population',
}


def load_csv(name):
    path = DATA_DIR / f'{name}.csv'
    if not path.exists():
        raise FileNotFoundError(f'CSV file not found: {path}')

    with path.open(newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        fieldnames = next(reader, None)
        if fieldnames is None:
            return []

        expected_fields = len(fieldnames)
        rows = []
        for row in reader:
            if len(row) > expected_fields:
                row = row[:expected_fields - 1] + [','.join(row[expected_fields - 1:])]
            elif len(row) < expected_fields:
                row += [''] * (expected_fields - len(row))

            parsed = {}
            for key, value in zip(fieldnames, row):
                if value is None:
                    parsed[key] = None
                    continue
                if isinstance(value, list):
                    value = ','.join(str(item) for item in value)
                if isinstance(value, str):
                    value = value.strip()
                if key in NUMERIC_FIELDS and value != '':
                    parsed[key] = int(value)
                else:
                    parsed[key] = value
            rows.append(parsed)
        return rows


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def serve_static(path: str):
    return send_from_directory(str(STATIC_DIR), path)


@app.route('/api/<resource>', methods=['GET', 'POST'])
def api_resource(resource: str):
    if resource not in API_RESOURCES:
        abort(404)
    
    csv_name = API_RESOURCES[resource]
    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({'error': 'Invalid JSON'}), 400
        
        # Try database first
        db_result = insert_db_record(resource, data)
        if db_result is not None:
            return jsonify(db_result), 201
            
        # Fallback to CSV
        print(f"Warning: Database insert failed or unavailable. Falling back to CSV for resource: {resource}")
        path = DATA_DIR / f'{csv_name}.csv'
        if not path.exists():
            return jsonify({'error': 'CSV file not found'}), 404
        
        # Read headers
        with path.open(newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            fieldnames = next(reader, None)
        
        if not fieldnames:
            return jsonify({'error': 'Empty CSV file'}), 500
        
        # Auto-generate next ID
        if resource == 'countries':
            id_field = 'country_id'
        elif resource == 'border_crossings':
            id_field = 'crossing_id'
        elif resource == 'blacklist':
            id_field = 'blacklist_id'
        else:
            id_field = f"{resource.rstrip('s')}_id"
        
        existing_rows = load_csv(csv_name)
        new_id = 1
        if existing_rows:
            try:
                new_id = max(int(row[id_field]) for row in existing_rows if row.get(id_field) is not None) + 1
            except (ValueError, KeyError):
                pass
        
        data[id_field] = new_id
        
        # Format the row columns matching fieldnames
        row_to_append = []
        for field in fieldnames:
            val = data.get(field, '')
            row_to_append.append(str(val))
        
        # Append row to CSV
        with path.open(mode='a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(row_to_append)
        
        return jsonify(data), 201

    # Try database first for GET
    db_rows = get_db_records(resource)
    if db_rows is not None:
        return jsonify(db_rows)
        
    # Fallback to CSV for GET
    print(f"Warning: Database query failed or unavailable. Falling back to CSV for resource: {resource}")
    return jsonify(load_csv(csv_name))



@app.route('/api/health')
def health_check():
    db_connected = check_db_active()
    return jsonify({
        'status': 'ok',
        'database': 'connected' if db_connected else 'fallback_csv'
    })


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

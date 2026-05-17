import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

DATA_DIR = Path('data')

def read_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        reader = list(csv.reader(f))
    headers = reader[0]
    rows = reader[1:]
    return headers, rows

def write_csv(path, headers, rows):
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

def gen_passport(n):
    return f'G{n:08d}'

def rand_dob():
    start = datetime(1950,1,1)
    end = datetime(2005,12,31)
    delta = end - start
    d = start + timedelta(days=random.randint(0, delta.days))
    return d.date().isoformat()

def rand_datetime(start_year=2023, end_year=2026):
    start = datetime(start_year,1,1)
    end = datetime(end_year,12,31,23,59,59)
    delta = end - start
    dt = start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def expand_countries(target=50):
    path = DATA_DIR / 'countries.csv'
    headers, rows = read_csv(path)
    if len(rows) >= target:
        return len(rows)
    start_id = int(rows[-1][0]) if rows else 0
    for i in range(start_id+1, target+1):
        rows.append([str(i), f'Country_{i}', str(random.randint(50000,200000000)), 'Visa policy varies'])
    write_csv(path, headers, rows)
    return len(rows)

def expand_travelers(target=100):
    path = DATA_DIR / 'travelers.csv'
    headers, rows = read_csv(path)
    start_id = int(rows[-1][0]) if rows else 0
    # determine number of countries for nationality range
    _, crows = read_csv(DATA_DIR / 'countries.csv')
    max_country = max(int(r[0]) for r in crows)
    for i in range(start_id+1, target+1):
        name = f'Generated Person {i}'
        passport = gen_passport(i)
        nationality = random.randint(1, max_country)
        dob = rand_dob()
        rows.append([str(i), name, passport, str(nationality), dob])
    write_csv(path, headers, rows)
    return len(rows)

def expand_visas(target=100):
    path = DATA_DIR / 'visas.csv'
    headers, rows = read_csv(path)
    start_id = int(rows[-1][0]) if rows else 0
    _, trows = read_csv(DATA_DIR / 'travelers.csv')
    _, crows = read_csv(DATA_DIR / 'countries.csv')
    max_traveler = max(int(r[0]) for r in trows)
    max_country = max(int(r[0]) for r in crows)
    types = ['Tourist','Work','Student','Transit','Diplomatic']
    statuses = ['Approved','Pending','Rejected','Expired']
    for i in range(start_id+1, target+1):
        traveler = random.randint(1, max_traveler)
        country = random.randint(1, max_country)
        vtype = random.choice(types)
        status = random.choice(statuses)
        start = datetime(2025,1,1) + timedelta(days=random.randint(0,400))
        end = start + timedelta(days=90 + random.randint(0,540))
        reason = ''
        if status == 'Rejected':
            reason = random.choice(['Insufficient funds','Missing documents','Previous overstay','No job offer'])
        rows.append([str(i), str(traveler), str(country), vtype, status, start.date().isoformat(), end.date().isoformat(), reason])
    write_csv(path, headers, rows)
    return len(rows)

def expand_ports(target=60):
    path = DATA_DIR / 'ports.csv'
    headers, rows = read_csv(path)
    start_id = int(rows[-1][0]) if rows else 0
    _, crows = read_csv(DATA_DIR / 'countries.csv')
    max_country = max(int(r[0]) for r in crows)
    for i in range(start_id+1, target+1):
        name = f'Port {i} International'
        ptype = random.choice(['Airport','Seaport'])
        country = random.randint(1, max_country)
        rows.append([str(i), name, ptype, str(country)])
    write_csv(path, headers, rows)
    return len(rows)

def expand_border_crossings(target=150):
    path = DATA_DIR / 'border_crossings.csv'
    headers, rows = read_csv(path)
    start_id = int(rows[-1][0]) if rows else 0
    _, trows = read_csv(DATA_DIR / 'travelers.csv')
    _, prows = read_csv(DATA_DIR / 'ports.csv')
    max_traveler = max(int(r[0]) for r in trows)
    max_port = max(int(r[0]) for r in prows)
    directions = ['IN','OUT']
    for i in range(start_id+1, target+1):
        traveler = random.randint(1, max_traveler)
        port = random.randint(1, max_port)
        direction = random.choice(directions)
        ctime = rand_datetime()
        rows.append([str(i), str(traveler), str(port), direction, ctime])
    write_csv(path, headers, rows)
    return len(rows)

def expand_blacklist(target=25):
    path = DATA_DIR / 'blacklist.csv'
    headers, rows = read_csv(path)
    start_id = int(rows[-1][0]) if rows else 0
    _, trows = read_csv(DATA_DIR / 'travelers.csv')
    max_traveler = max(int(r[0]) for r in trows)
    for i in range(start_id+1, target+1):
        traveler = random.randint(1, max_traveler)
        reason = random.choice(['Visa overstay','Falsified documents','Criminal record','Working on tourist visa'])
        start = datetime.now().date()
        end = start.replace(year=start.year + random.randint(1,5))
        reinstated = '0'
        rows.append([str(i), str(traveler), reason, start.isoformat(), end.isoformat(), reinstated])
    write_csv(path, headers, rows)
    return len(rows)

def main():
    targets = {
        'countries':50,
        'travelers':100,
        'visas':100,
        'ports':60,
        'border_crossings':150,
        'blacklist':25,
    }
    results = {}
    results['countries'] = expand_countries(targets['countries'])
    results['ports'] = expand_ports(targets['ports'])
    results['travelers'] = expand_travelers(targets['travelers'])
    results['visas'] = expand_visas(targets['visas'])
    results['border_crossings'] = expand_border_crossings(targets['border_crossings'])
    results['blacklist'] = expand_blacklist(targets['blacklist'])
    for k,v in results.items():
        print(f'{k}: {v} rows')

if __name__ == '__main__':
    main()

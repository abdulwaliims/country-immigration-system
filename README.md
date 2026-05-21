# project
Country Entry &amp; Immigration Management System – A database-based system using MySQL and Flask to manage travellers, visas, border crossings, and immigration records efficiently.

## Running locally

A lightweight Flask backend is available under `backend/app.py`. It serves the frontend and exposes API endpoints at `/api/*`.

1. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Start the backend server:
   ```bash
   python backend/app.py
   ```
3. Open `http://127.0.0.1:5000/` in your browser.

The frontend will fetch data from the backend automatically and fall back to local mock data if the API is unavailable.

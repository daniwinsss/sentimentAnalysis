# Sentilytics

Full-stack sentiment analysis platform.

## Structure
- `frontend/` React + Vite + Tailwind UI
- `backend/` Express API
- `ml-service/` FastAPI ML service

## Quick Start
1. Frontend
   - `cd frontend`
   - `npm install`
   - `npm run dev`

2. Backend
   - `cd backend`
   - `npm install`
   - `npm run dev`

3. ML Service
   - `cd ml-service`
   - `pip install -r requirements.txt`
   - `python app/train_sample.py`
   - `uvicorn app.main:app --reload`

## Environment
Copy each `.env.example` file to `.env` and update values as needed.

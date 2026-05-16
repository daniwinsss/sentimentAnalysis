# Sentilytics ML Service

FastAPI service that performs NLP preprocessing and sentiment prediction.

## Setup
1. Create a virtual environment.
2. Install dependencies: `pip install -r requirements.txt`
3. Train traditional models:
   - `python -m app.training.train_traditional --data path/to/imdb.csv`
4. Start server: `uvicorn app.main:app --reload`

## Scripts
- `python -m app.training.train_traditional --data path/to/imdb.csv`
- `python -m app.training.evaluate --data path/to/imdb.csv --model logistic_regression`
- `python -m app.training.compare_models`
- `python -m app.training.train_bert`
- `python -m app.scripts.predict_cli --text "Amazing experience"`
- `uvicorn app.main:app --reload` - local development
- `uvicorn app.main:app --host 0.0.0.0 --port 8000` - production start

from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from typing import List
from .pipeline import predict_text, predict_batch

app = FastAPI(title="Sentilytics ML Service")


class PredictRequest(BaseModel):
    text: str


class BatchRequest(BaseModel):
    items: List[str]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(request: PredictRequest, model: str = Query(default=None)):
    try:
        return predict_text(request.text, model_name=model or None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/batch")
def predict_batch_route(request: BatchRequest, model: str = Query(default=None)):
    try:
        return predict_batch(request.items, model_name=model or None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

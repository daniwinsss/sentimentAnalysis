import os
os.environ["USE_TORCH"] = "ON"
os.environ["USE_TF"] = "OFF"
import joblib
import numpy as np
from typing import List
from .config import MODEL_DIR, DEFAULT_MODEL
from .preprocessing import normalize_batch


MODEL_MAPPING = {
  "logistic": "logistic_regression",
  "transformer": "logistic_regression",  # Fallback until transformer is implemented
  "svm": "linear_svm",
  "nb": "naive_bayes"
}

def _load_model(name: str):
    if not name:
        name = DEFAULT_MODEL
    
    # Map name if it exists in mapping, else use the name as is
    actual_name = MODEL_MAPPING.get(name.lower(), name)
    model_path = MODEL_DIR / f"{actual_name}.joblib"
    vectorizer_path = MODEL_DIR / "tfidf_vectorizer.joblib"
    
    logger.info(f"Loading model: {actual_name} from {model_path}")
    
    if not model_path.exists():
        logger.warning(f"Model path {model_path} does not exist, falling back to {DEFAULT_MODEL}")
        actual_name = DEFAULT_MODEL
        model_path = MODEL_DIR / f"{actual_name}.joblib"

    if not model_path.exists():
        logger.error(f"CRITICAL: Model file not found at {model_path}")
        raise FileNotFoundError(f"Model not found: {model_path}")
    if not vectorizer_path.exists():
        logger.error(f"CRITICAL: Vectorizer file not found at {vectorizer_path}")
        raise FileNotFoundError(f"Vectorizer not found: {vectorizer_path}")
    
    try:
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        logger.info(f"Successfully loaded model {actual_name}")
        return model, vectorizer
    except Exception as e:
        logger.error(f"Failed to load joblib files: {e}")
        raise e


import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def _get_label_name(label):
  if isinstance(label, (int, float)):
    return "Positive" if label == 1 else "Negative"
  return str(label).capitalize()

def _predict_one(model, vectorizer, text: str):
    try:
        cleaned_batch = normalize_batch([text])
        if not cleaned_batch or not cleaned_batch[0]:
            return {
                "sentiment": "Neutral",
                "confidence": 0.0,
                "tokens": []
            }
            
        vector = vectorizer.transform(cleaned_batch)
        
        # Handle models without predict_proba (like LinearSVC)
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(vector)[0]
            labels = model.classes_.tolist()
            max_index = probs.argmax()
            sentiment_label = _get_label_name(labels[max_index])
            confidence = float(probs[max_index])
        else:
            # Fallback for LinearSVC using decision_function
            scores = model.decision_function(vector)
            # Ensure scores is at least 1D
            if np.isscalar(scores):
                scores = np.array([scores])
            
            if len(scores.shape) == 1 or (len(scores.shape) == 2 and scores.shape[1] == 1):
                score = scores[0] if len(scores.shape) == 1 else scores[0][0]
                # Sigmoid for probability approximation
                prob_positive = 1 / (1 + np.exp(-score))
                if prob_positive > 0.5:
                    sentiment_label = "Positive"
                    confidence = float(prob_positive)
                else:
                    sentiment_label = "Negative"
                    confidence = float(1 - prob_positive)
            else:
                # Multi-class
                max_index = scores[0].argmax()
                sentiment_label = _get_label_name(model.classes_[max_index])
                exp_scores = np.exp(scores[0] - np.max(scores[0])) # Stability
                confidence = float(exp_scores[max_index] / exp_scores.sum())
        
        # Simple token-level sentiment for UI
        tokens = []
        words = text.split()
        for word in words[:10]:
            tokens.append({
                "token": word,
                "sentiment": sentiment_label
            })

        result = {
            "sentiment": sentiment_label,
            "confidence": confidence,
            "tokens": tokens
        }
        logger.info(f"Returning result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error in _predict_one: {e}")
        raise e


from transformers import pipeline
import torch

# Global variable to cache the transformer pipeline
_transformer_pipeline = None

def _get_transformer():
    global _transformer_pipeline
    if _transformer_pipeline is None:
        try:
            logger.info("Starting transformer model load...")
            # Using a lightweight DistilBERT model for speed and efficiency
            # Explicitly force PyTorch (framework="pt") to avoid Keras 3 compatibility issues
            _transformer_pipeline = pipeline(
                "sentiment-analysis", 
                model="distilbert-base-uncased-finetuned-sst-2-english",
                device=-1, # Force CPU for free tier stability
                framework="pt"
            )
            logger.info("Transformer model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load transformer model: {e}")
            _transformer_pipeline = False
    return _transformer_pipeline

def _predict_transformer(text: str):
    nlp = _get_transformer()
    if not nlp:
        raise RuntimeError("Transformer model unavailable")
    result = nlp(text)[0]
    sentiment_label = "Positive" if result['label'] == 'POSITIVE' else "Negative"
    
    # Generate mock tokens for UI consistency
    tokens = []
    words = text.split()[:10]
    for word in words:
        tokens.append({"token": word, "sentiment": sentiment_label})

    return {
        "sentiment": sentiment_label,
        "confidence": float(result['score']),
        "tokens": tokens
    }

def predict_text(text: str, model_name: str | None = DEFAULT_MODEL):
    try:
        model_name = model_name or DEFAULT_MODEL
        if model_name.lower() in ["transformer", "bert"]:
            try:
                result = _predict_transformer(text)
                return {"model": "bert", **result}
            except Exception as e:
                logger.warning(f"Transformer fallback to classic model: {e}")
        
        model, vectorizer = _load_model(model_name)
        result = _predict_one(model, vectorizer, text)
        return {"model": model_name, **result}
    except Exception as e:
        import traceback
        logger.error(f"Prediction failed: {str(e)}")
        logger.error(traceback.format_exc())
        raise e

def predict_batch(items: List[str], model_name: str | None = DEFAULT_MODEL):
    model_name = model_name or DEFAULT_MODEL
    if model_name.lower() in ["transformer", "bert"]:
        try:
            nlp = _get_transformer()
            if not nlp:
                raise RuntimeError("Transformer model unavailable")
            results = []
            batch_results = nlp(items)
            for res in batch_results:
                results.append({
                    "sentiment": "Positive" if res['label'] == 'POSITIVE' else "Negative",
                    "confidence": float(res['score'])
                })
            return {"model": "bert", "items": results}
        except Exception as e:
            logger.warning(f"Transformer batch fallback to classic model: {e}")

    model, vectorizer = _load_model(model_name)
    cleaned_items = normalize_batch(items)
    vectors = vectorizer.transform(cleaned_items)
    
    results = []
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(vectors)
        labels = model.classes_.tolist()
        for row in probs:
            max_index = row.argmax()
            results.append({
                "sentiment": _get_label_name(labels[max_index]),
                "confidence": float(row[row.argmax()])
            })
    else:
        scores = model.decision_function(vectors)
        for score in scores:
            if isinstance(score, (int, float, np.float64, np.float32)):
                prob_positive = 1 / (1 + np.exp(-score))
                if prob_positive > 0.5:
                    results.append({"sentiment": "Positive", "confidence": float(prob_positive)})
                else:
                    results.append({"sentiment": "Negative", "confidence": float(1 - prob_positive)})
            else:
                max_index = score.argmax()
                exp_scores = np.exp(score)
                results.append({
                    "sentiment": _get_label_name(model.classes_[max_index]),
                    "confidence": float(exp_scores[max_index] / exp_scores.sum())
                })
    return {"model": model_name, "items": results}

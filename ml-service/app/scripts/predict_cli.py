import argparse
import joblib

from app.config import MODEL_DIR, DEFAULT_MODEL
from app.preprocessing import normalize_batch


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--text", required=True)
  parser.add_argument("--model", default=DEFAULT_MODEL)
  args = parser.parse_args()

  model = joblib.load(MODEL_DIR / f"{args.model}.joblib")
  vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.joblib")
  X = vectorizer.transform(normalize_batch([args.text]))
  probs = model.predict_proba(X)[0]
  labels = model.classes_.tolist()
  max_index = probs.argmax()
  print({
    "sentiment": labels[max_index],
    "confidence": float(probs[max_index]),
    "model": args.model
  })


if __name__ == "__main__":
  main()

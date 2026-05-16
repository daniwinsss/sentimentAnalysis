import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix, precision_recall_fscore_support)

from app.config import MODEL_DIR, REPORTS_DIR, PLOTS_DIR
from app.preprocessing import normalize_batch
from app.training.utils import plot_confusion, save_report


def load_data(path: Path):
  df = pd.read_csv(path)
  text_col = "review" if "review" in df.columns else "text"
  label_col = "sentiment" if "sentiment" in df.columns else "label"
  df = df[[text_col, label_col]].rename(columns={text_col: "text", label_col: "label"})
  df["label"] = df["label"].str.lower()
  return df


def evaluate(model_name: str, data_path: Path):
  vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.joblib")
  model = joblib.load(MODEL_DIR / f"{model_name}.joblib")
  df = load_data(data_path)
  texts = normalize_batch(df["text"].tolist())
  y_true = df["label"].tolist()
  X = vectorizer.transform(texts)
  preds = model.predict(X)
  accuracy = accuracy_score(y_true, preds)
  precision, recall, f1, _ = precision_recall_fscore_support(
    y_true, preds, average="weighted", zero_division=0
  )
  report = classification_report(y_true, preds, output_dict=True)
  matrix = confusion_matrix(y_true, preds)

  plot_confusion(matrix, sorted(list(set(y_true))), PLOTS_DIR / f"{model_name}_confusion.png")

  payload = {
    "model": model_name,
    "accuracy": accuracy,
    "precision": precision,
    "recall": recall,
    "f1": f1,
    "report": report
  }
  save_report(payload, REPORTS_DIR / f"{model_name}_evaluation.json")
  print(json.dumps(payload, indent=2))


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--data", required=True)
  parser.add_argument("--model", required=True)
  args = parser.parse_args()
  evaluate(args.model, Path(args.data))


if __name__ == "__main__":
  main()

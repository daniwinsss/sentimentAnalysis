import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix, precision_recall_fscore_support)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC

from app.config import MODEL_DIR, REPORTS_DIR, PLOTS_DIR
from app.preprocessing import normalize_batch
from app.training.utils import plot_confusion, save_report


def load_imdb_csv(path: Path) -> pd.DataFrame:
  df = pd.read_csv(path)
  if "review" in df.columns:
    text_col = "review"
  elif "text" in df.columns:
    text_col = "text"
  else:
    raise ValueError("Dataset must contain 'review' or 'text' column")

  if "sentiment" in df.columns:
    label_col = "sentiment"
  elif "label" in df.columns:
    label_col = "label"
  else:
    raise ValueError("Dataset must contain 'sentiment' or 'label' column")

  df = df[[text_col, label_col]].rename(
    columns={text_col: "text", label_col: "label"}
  )
  df["label"] = df["label"].str.lower()
  return df


def evaluate_model(model, X_test, y_test, label=""):
  preds = model.predict(X_test)
  accuracy = accuracy_score(y_test, preds)
  precision, recall, f1, _ = precision_recall_fscore_support(
    y_test, preds, average="weighted", zero_division=0
  )
  report = classification_report(y_test, preds, output_dict=True)
  matrix = confusion_matrix(y_test, preds)
  metrics = {
    "model": label,
    "accuracy": accuracy,
    "precision": precision,
    "recall": recall,
    "f1": f1
  }
  return metrics, report, matrix


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--data", required=True, help="Path to IMDB CSV")
  parser.add_argument("--test-size", type=float, default=0.2)
  parser.add_argument("--val-size", type=float, default=0.1)
  parser.add_argument("--random-state", type=int, default=42)
  args = parser.parse_args()

  df = load_imdb_csv(Path(args.data))
  texts = normalize_batch(df["text"].tolist())
  labels = df["label"].tolist()

  X_train, X_temp, y_train, y_temp = train_test_split(
    texts, labels, test_size=args.test_size + args.val_size, random_state=args.random_state, stratify=labels
  )
  relative_val_size = args.val_size / (args.test_size + args.val_size)
  X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=1 - relative_val_size, random_state=args.random_state, stratify=y_temp
  )

  vectorizer = TfidfVectorizer(max_features=50000, ngram_range=(1, 2))
  X_train_vec = vectorizer.fit_transform(X_train)
  X_val_vec = vectorizer.transform(X_val)
  X_test_vec = vectorizer.transform(X_test)

  models = {
    "logistic_regression": LogisticRegression(max_iter=200, n_jobs=-1),
    "naive_bayes": MultinomialNB(),
    "linear_svm": LinearSVC()
  }

  comparison = []
  detailed = {}

  for name, model in models.items():
    model.fit(X_train_vec, y_train)
    joblib.dump(model, MODEL_DIR / f"{name}.joblib")

    metrics, report, matrix = evaluate_model(model, X_test_vec, y_test, name)
    comparison.append(metrics)
    detailed[name] = report

    plot_confusion(matrix, sorted(list(set(y_test))), PLOTS_DIR / f"{name}_confusion.png")

  joblib.dump(vectorizer, MODEL_DIR / "tfidf_vectorizer.joblib")

  report_payload = {
    "summary": comparison,
    "details": detailed,
    "split": {
      "train": len(X_train),
      "validation": len(X_val),
      "test": len(X_test)
    }
  }
  save_report(report_payload, REPORTS_DIR / "traditional_report.json")

  with open(REPORTS_DIR / "model_comparison.json", "w", encoding="utf-8") as file:
    json.dump(comparison, file, indent=2)

  print("Training complete. Models and reports saved.")


if __name__ == "__main__":
  main()

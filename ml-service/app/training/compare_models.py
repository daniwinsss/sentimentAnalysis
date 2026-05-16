import json
from pathlib import Path

import pandas as pd

from app.config import REPORTS_DIR


def main():
  report_path = REPORTS_DIR / "model_comparison.json"
  if not report_path.exists():
    raise FileNotFoundError("Run train_traditional.py first")
  data = json.loads(report_path.read_text(encoding="utf-8"))
  df = pd.DataFrame(data)
  output_csv = REPORTS_DIR / "model_comparison.csv"
  df.to_csv(output_csv, index=False)
  print(df.to_string(index=False))
  print(f"Saved comparison table to {output_csv}")


if __name__ == "__main__":
  main()

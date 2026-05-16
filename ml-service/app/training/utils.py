import json
from pathlib import Path

import matplotlib.pyplot as plt
import seaborn as sns


def plot_confusion(matrix, labels, output_path: Path):
  plt.figure(figsize=(6, 5))
  sns.heatmap(matrix, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels)
  plt.xlabel("Predicted")
  plt.ylabel("Actual")
  plt.tight_layout()
  plt.savefig(output_path)
  plt.close()


def save_report(payload, output_path: Path):
  output_path.parent.mkdir(parents=True, exist_ok=True)
  with open(output_path, "w", encoding="utf-8") as file:
    json.dump(payload, file, indent=2)

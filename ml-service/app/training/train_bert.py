import argparse
from pathlib import Path

from datasets import load_dataset
from transformers import (AutoModelForSequenceClassification, AutoTokenizer,
                          TrainingArguments, Trainer)

from app.config import MODEL_DIR, REPORTS_DIR


def tokenize_function(examples, tokenizer):
  return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=256)


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--output", default="bert", help="Output model directory name")
  args = parser.parse_args()

  dataset = load_dataset("imdb")
  tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

  tokenized = dataset.map(lambda x: tokenize_function(x, tokenizer), batched=True)
  tokenized = tokenized.rename_column("label", "labels")
  tokenized.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

  model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

  training_args = TrainingArguments(
    output_dir=str(REPORTS_DIR / "bert"),
    evaluation_strategy="epoch",
    save_strategy="epoch",
    logging_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=2,
    weight_decay=0.01,
    load_best_model_at_end=True,
  )

  trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
  )

  trainer.train()

  output_dir = MODEL_DIR / args.output
  output_dir.mkdir(parents=True, exist_ok=True)
  model.save_pretrained(output_dir)
  tokenizer.save_pretrained(output_dir)
  print(f"BERT model saved to {output_dir}")


if __name__ == "__main__":
  main()

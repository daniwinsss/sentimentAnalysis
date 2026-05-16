import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB

SAMPLES = [
  ("I love this product", "positive"),
  ("Fantastic experience", "positive"),
  ("Terrible customer service", "negative"),
  ("I will never buy again", "negative"),
  ("It is okay, nothing special", "neutral"),
  ("Average quality", "neutral"),
]


def train_model(model, name: str):
  texts = [item[0].lower() for item in SAMPLES]
  labels = [item[1] for item in SAMPLES]
  vectorizer = TfidfVectorizer()
  X = vectorizer.fit_transform(texts)
  model.fit(X, labels)
  bundle = {"model": model, "vectorizer": vectorizer}
  joblib.dump(bundle, f"models/{name}.joblib")


if __name__ == "__main__":
  train_model(LogisticRegression(max_iter=200), "logistic")
  train_model(MultinomialNB(), "naive_bayes")

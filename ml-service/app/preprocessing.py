import re
from typing import Iterable, List
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def _load_nltk_resources():
  try:
    nltk.download("stopwords", quiet=True)
    nltk.download("wordnet", quiet=True)
    nltk.download("omw-1.4", quiet=True)
    return set(stopwords.words("english")), WordNetLemmatizer()
  except Exception:
    return set(), None

_STOPWORDS, _LEMMATIZER = _load_nltk_resources()


def clean_text(text: str) -> str:
  text = text.lower()
  text = re.sub(r"[^a-z0-9\s]", " ", text)
  text = re.sub(r"\s+", " ", text).strip()
  return text


def normalize_text(text: str) -> str:
  cleaned = clean_text(text)
  tokens = [
    token
    for token in cleaned.split()
    if token not in _STOPWORDS and len(token) > 2
  ]
  if _LEMMATIZER:
    tokens = [_LEMMATIZER.lemmatize(token) for token in tokens]
  return " ".join(tokens)


def normalize_batch(texts: Iterable[str]) -> List[str]:
  return [normalize_text(text) for text in texts]

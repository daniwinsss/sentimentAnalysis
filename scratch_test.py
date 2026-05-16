import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path("c:/Users/daniyal khan/Desktop/sentimentAnalysis/ml-service").resolve()))

from app.pipeline import predict_text

try:
    print(predict_text("This movie was amazing", "logistic"))
except Exception as e:
    import traceback
    traceback.print_exc()

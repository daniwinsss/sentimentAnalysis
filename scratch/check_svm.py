import joblib
from pathlib import Path

model_path = Path(r"c:\Users\daniyal khan\Desktop\sentimentAnalysis\ml-service\models\linear_svm.joblib")
model = joblib.load(model_path)
print(f"Model Type: {type(model)}")
print(f"Has predict_proba: {hasattr(model, 'predict_proba')}")
print(f"Has decision_function: {hasattr(model, 'decision_function')}")

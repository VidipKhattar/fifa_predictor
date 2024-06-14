from django.apps import AppConfig
import joblib
import os
from django.conf import settings


class PredictionsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "predictions"

    # Define the paths to the model and scaler files using BASE_DIR
    model_path = os.path.join(
        settings.BASE_DIR, "ml_models", "random_forest_model.joblib"
    )
    scaler_path = os.path.join(settings.BASE_DIR, "ml_models", "scaler.joblib")

    # Load the model and scaler
    model = None
    scaler = None

    try:
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        print("Model and scaler loaded successfully.")
    except FileNotFoundError as e:
        print(f"File not found: {e}")
        print(model_path)
        print(scaler_path)
    except Exception as e:
        print(f"An error occurred: {e}")
        print(model_path)
        print(scaler_path)

import os
import numpy as np
import pandas as pd
import librosa
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.conf import settings
from django.core.files.storage import default_storage
from .models import songGuess
from .serializers import SongGuessSerializer
from .apps import PredictionsConfig
import soundfile as sf

from pydub import AudioSegment


from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
)

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler


def preprocess_audio(file, target_sr=22050):

    audio = AudioSegment.from_file(file, format="mp3")
    # Export the audio segment to a BytesIO object in WAV format
    wav_io = io.BytesIO()
    audio.export(wav_io, format="mp3")
    wav_io.seek(0)
    # Read the WAV file using librosa
    y, sr = librosa.load(wav_io, sr=22050)
    print("hello")
    print(y)
    return y, sr


def extract_features(file_path):

    y, sr = preprocess_audio(file_path)

    min_length = 2048  # Minimum length to avoid n_fft errors
    if len(y) < min_length:
        y = np.pad(y, (0, min_length - len(y)), "constant")
    print("fsdjgndkjsfgnklsdnv ")
    features = {
        "mfcc_mean": np.mean(librosa.feature.mfcc(y=y, sr=sr), axis=1),
        "chroma_mean": np.mean(librosa.feature.chroma_stft(y=y, sr=sr), axis=1),
        "spectral_contrast_mean": np.mean(
            librosa.feature.spectral_contrast(y=y, sr=sr), axis=1
        ),
        "mfcc": librosa.feature.mfcc(y=y, sr=sr),
        "chroma": librosa.feature.chroma_stft(y=y, sr=sr),
        "spectral_contrast": librosa.feature.spectral_contrast(y=y, sr=sr),
        "tempo": librosa.beat.tempo(y=y, sr=sr)[0],
    }
    print("jwehfbwekjfbwjebfjiwekbewfjkewfb ")
    return features


class PredictSong(APIView):
    def post(self, request, *args, **kwargs):
        print("STARTSTARTSTARTSTARTSTARTSTARTSTARTSTART")
        file = request.FILES["file"]
        file_data = io.BytesIO(file.read())
        try:
            # Extract features from the uploaded file
            features = extract_features(file_data)
            print(features)
            df = pd.DataFrame([features])
            columns_to_convert = ["mfcc_mean", "chroma_mean", "spectral_contrast_mean"]

            print("ekjfnewk")

            columns_to_drop = ["mfcc", "chroma", "spectral_contrast"]
            df = df.drop(columns=columns_to_drop)

            print(df)
            print(df.dtypes)

            print("hello1")

            flattened_dfs = [df[col].apply(pd.Series) for col in columns_to_convert]

            print(1)

            for i, col in enumerate(columns_to_convert):
                flattened_dfs[i].columns = [
                    f"{col}_{j}" for j in range(flattened_dfs[i].shape[1])
                ]

            print(2)

            flattened_df = pd.concat(
                [df.drop(columns_to_convert, axis=1)] + flattened_dfs, axis=1
            )

            print(3)
            print(4)

            scaler = PredictionsConfig.scaler
            print(scaler)
            X_scaled = scaler.transform(flattened_df)

            print(4)

            model = PredictionsConfig.model
            predicted_probabilities = model.predict_proba(X_scaled)
            probability = predicted_probabilities[
                0, 1
            ]  # Probability of being a FIFA song

            print(5)

            # Clean up the uploaded file
            # os.remove(file_path)

            return Response({"probability": probability}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(elf, request, format=None):
        queryset = songGuess.objects.all()
        serializer_class = SongGuessSerializer(queryset, many=True)
        return Response(serializer_class.data)

import numpy as np
import pandas as pd
import librosa
import io
import subprocess
import requests
import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import songGuess
from .serializers import SongGuessSerializer
from .apps import PredictionsConfig
from django.core.files.storage import default_storage
from pydub import AudioSegment
from ytmusicapi import YTMusic
from pytube import YouTube
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# json_file_path = os.path.join(os.path.dirname(__file__), "../ml_models/oauth.json")


def get_percentile(probability):
    queryset = songGuess.objects.all()
    serializer_class = SongGuessSerializer(queryset, many=True)
    data = serializer_class.data
    song_probs = [item["song_prob"] for item in data]
    sorted_data = sorted(song_probs)
    count = sum(1 for x in sorted_data if x < probability)
    percentile = (count / len(sorted_data)) * 100
    return percentile


def preprocess_audio(file, target_sr=22050):

    # Prepare ffmpeg command
    ffmpeg_command = [
        "ffmpeg",
        "-i",
        "pipe:0",  # Input from stdin
        "-f",
        "wav",  # Output format
        "pipe:1",  # Output to stdout
    ]

    # Run ffmpeg process
    process = subprocess.Popen(
        ffmpeg_command,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    wav_data, err = process.communicate(input=file.getvalue())

    if process.returncode != 0:
        print("FFmpeg error:", err.decode())
        raise Exception("FFmpeg failed to convert MP3 to WAV")

    # Read the WAV file using librosa
    y, sr = librosa.load(io.BytesIO(wav_data), sr=22050)

    return y, sr


def extract_features(file_path):

    y, sr = preprocess_audio(file_path)

    min_length = 2048  # Minimum length to avoid n_fft errors
    if len(y) < min_length:
        y = np.pad(y, (0, min_length - len(y)), "constant")

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
    return features


class PredictSong(APIView):
    def post(self, request, *args, **kwargs):
        songDict = {
            "song_name": "",
            "song_link": "",
            "song_artist": "",
            "song_album": "",
            "song_cover": "",
            "song_prob": "",
            "song_is_fifa": "",
        }
        try:
            if "file" in request.FILES:
                file = request.FILES["file"]
                file_data = io.BytesIO(file.read())
                features = extract_features(file_data)
                songDict["song_name"] = file.name
            elif request.data.get("songData"):
                songData = request.data.get("songData")
                video_id = songData["previewUrl"]
                youtube_url = "https://www.youtube.com/watch?v=" + video_id
                queryset = songGuess.objects.filter(song_link=youtube_url)
                serializer = SongGuessSerializer(queryset, many=True)
                if queryset.count() >= 1:
                    serializer = SongGuessSerializer(queryset.first())
                    song_guess = get_object_or_404(
                        songGuess, pk=serializer.data.get("id")
                    )
                    percentile = get_percentile(serializer.data["song_prob"])
                    return Response(
                        {"songDict": serializer.data, "percentile": percentile},
                        status=status.HTTP_200_OK,
                    )

                songDict["song_name"] = songData["name"]
                songDict["song_link"] = youtube_url
                songDict["song_artist"] = songData["artist"]
                songDict["song_album"] = songData["album"]
                songDict["song_cover"] = songData["artwork"]

                yt = YouTube(youtube_url)
                video = yt.streams.filter(only_audio=True).first()

                audio_buffer = io.BytesIO()
                mp3_buffer = io.BytesIO()

                channel_layer = get_channel_layer()

                start = time.time()
                session = requests.Session()
                r = session.get(video.url, stream=True)
                r.raise_for_status()
                total_length = r.headers.get("content-length")

                if total_length is None:
                    audio_buffer.write(r.content)
                else:
                    dl = 0
                    total_length = int(total_length)
                    for chunk in r.iter_content(chunk_size=1024):
                        dl += len(chunk)
                        audio_buffer.write(chunk)
                        done = int(50 * dl / total_length)
                        async_to_sync(channel_layer.group_send)(
                            "progress_group",
                            {"type": "progress_message", "message": done},
                        )

                audio_buffer.seek(0)
                audio_segment = AudioSegment.from_file(audio_buffer)

                audio_segment.export(mp3_buffer, format="mp3")
                mp3_buffer.seek(0)

                features = extract_features(mp3_buffer)

                end = time.time()
                print(end - start)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Extract features from the uploaded file

            df = pd.DataFrame([features])

            columns_to_convert = ["mfcc_mean", "chroma_mean", "spectral_contrast_mean"]

            columns_to_drop = ["mfcc", "chroma", "spectral_contrast"]
            df = df.drop(columns=columns_to_drop)

            flattened_dfs = [df[col].apply(pd.Series) for col in columns_to_convert]

            for i, col in enumerate(columns_to_convert):
                flattened_dfs[i].columns = [
                    f"{col}_{j}" for j in range(flattened_dfs[i].shape[1])
                ]

            flattened_df = pd.concat(
                [df.drop(columns_to_convert, axis=1)] + flattened_dfs, axis=1
            )

            scaler = PredictionsConfig.scaler
            X_scaled = scaler.transform(flattened_df)

            model = PredictionsConfig.model
            predicted_probabilities = model.predict_proba(X_scaled)
            probability = predicted_probabilities[
                0, 1
            ]  # Probability of being a FIFA song

            songDict["song_prob"] = probability
            songDict["song_is_fifa"] = probability >= 0.5

            # Clean up the uploaded file
            # os.remove(file_path)

            if request.data.get("songData"):
                serializer_class = SongGuessSerializer(data=songDict)
                if serializer_class.is_valid():
                    serializer_class.save()

            percentile = get_percentile(probability)

            return Response(
                {"songDict": songDict, "percentile": percentile},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        queryset = songGuess.objects.all()
        serializer_class = SongGuessSerializer(queryset, many=True)
        return Response(serializer_class.data)


class getSearchResults(APIView):

    def get(self, request):
        ytmusic = YTMusic()
        search = request.GET.get("title")
        search_results = ytmusic.search(search)
        filtered_data = [
            item for item in search_results if item.get("resultType") == "song"
        ]
        return Response({"search_value": filtered_data}, status=status.HTTP_200_OK)

from rest_framework import serializers
from .models import songGuess


class SongGuessSerializer(serializers.ModelSerializer):
    class Meta:
        model = songGuess
        fields = [
            "id",
            "song_name",
            "song_link",
            "song_prob",
            "song_is_fifa",
        ]

from django.db import models

# Create your models here.


class songGuess(models.Model):
    id = models.AutoField(primary_key=True)
    song_name = models.CharField(max_length=900)
    song_artist = models.CharField(max_length=900, blank=True)
    song_album = models.CharField(max_length=900, blank=True)
    song_cover = models.URLField(blank=True)
    song_link = models.URLField(blank=True)
    song_prob = models.FloatField()
    song_is_fifa = models.BooleanField()

    def __str__(self):
        return self.song_name

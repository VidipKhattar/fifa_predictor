from django.db import models

# Create your models here.


class songGuess(models.Model):
    id = models.AutoField(primary_key=True)
    song_name = models.CharField(max_length=900)
    song_link = models.URLField()
    song_prop = models.FloatField()
    song_is_fifa = models.BooleanField()

    def __str__(self):
        return self.name

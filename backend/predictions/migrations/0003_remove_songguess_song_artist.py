# Generated by Django 4.2 on 2024-07-02 13:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("predictions", "0002_songguess_song_album_songguess_song_artist_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="songguess",
            name="song_artist",
        ),
    ]

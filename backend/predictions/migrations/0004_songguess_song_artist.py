# Generated by Django 4.2 on 2024-07-02 13:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("predictions", "0003_remove_songguess_song_artist"),
    ]

    operations = [
        migrations.AddField(
            model_name="songguess",
            name="song_artist",
            field=models.CharField(blank=True, max_length=900),
        ),
    ]

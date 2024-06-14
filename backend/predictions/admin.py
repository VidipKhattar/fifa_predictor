from django.contrib import admin
from .models import songGuess


class SongGuessAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "song_name",
        "song_link",
        "song_prob",
        "song_is_fifa",
    )
    list_filter = ("song_name",)
    search_fields = ("song_name",)


admin.site.register(songGuess, SongGuessAdmin)

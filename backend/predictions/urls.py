from django.urls import path
from django.contrib import admin
from . import views


urlpatterns = [
    path("admin/", admin.site.urls),
    path("predict/", views.PredictSong.as_view(), name="predict-song"),
    path("search/", views.getSearchResults.as_view(), name="search-request"),
    path("length/", views.getVideoLength.as_view(), name="search-length"),
]

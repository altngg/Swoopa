from django.urls import path

from .views import get_publications, create_publication

urlpatterns = [
    path('publications/', get_publications, name='get_publications'),
    path('publications/create/', create_publication, name='create_publication')
]
from django.urls import path

from .views import get_publication_by_slug, get_publications, create_publication, edit_publication

urlpatterns = [
    path('publications/', get_publications, name='get_publications'),
    path('publications/create/', create_publication, name='create_publication'),
    path('publications/<slug:slug>', get_publication_by_slug, name='get_publication_by_slug'),
    path('publications/<slug:slug>/edit/', edit_publication, name='edit_publication'),
]
from django.urls import path

from .views import get_publication_by_slug, change_publication_status, get_my_publications, get_user_publications, get_all_publications, create_publication, edit_publication, add_favorite, get_my_favorites, remove_favorite

urlpatterns = [
    path('publications/', get_all_publications, name='get_all_publications'),
    path('publications/<int:user_id>/', get_user_publications, name='get_my_publication'),
    path('publications/my/', get_my_publications, name='get_my_publication'),
    path('publications/create/', create_publication, name='create_publication'),
    path('publications/<slug:slug>/', get_publication_by_slug, name='get_publication_by_slug'),
    path('publications/<slug:publication_slug>/change-status/', change_publication_status, name='get_publication_by_slug'),
    path('publications/<slug:slug>/edit/', edit_publication, name='edit_publication'),
    path('favorites/add/', add_favorite, name='edit_publication'),
    path('favorites/remove/<slug:favorite_slug>/', remove_favorite, name='edit_publication'),
    path('favorites/my/', get_my_favorites, name='edit_publication'),
]
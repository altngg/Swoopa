from django.urls import path

from .views import get_publication_by_slug, get_my_publication, get_all_publications, create_publication, edit_publication, add_favorite, get_user_favorites, remove_favorite

urlpatterns = [
    path('publications/', get_all_publications, name='get_all_publications'),
    path('publications/<int:user_id>', get_my_publication, name='get_my_publication'),
    path('publication/create/', create_publication, name='create_publication'),
    path('publication/<slug:slug>', get_publication_by_slug, name='get_publication_by_slug'),
    path('publication/<slug:slug>/edit/', edit_publication, name='edit_publication'),
    path('favorites/add/', add_favorite, name='edit_publication'),
    path('favorites/remove/<int:favorite_id>/', remove_favorite, name='edit_publication'),
    path('favorites/user/<int:user_id>/', get_user_favorites, name='edit_publication'),
]
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import get_all_locations, get_user_by_id, register_user, update_user, logout_user, login_user, get_current_user, get_all_users, update_profile_picture, get_user_location

urlpatterns = [
    path('locations/', get_all_locations, name='get_all_locations'),
    path('locations/my', get_user_location, name='get_user_location'),

    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    
    path('me/', get_current_user, name='current-user'),
    path('<int:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('me/update/', update_user, name='user-profile-update'),

    # form data
    path('me/update-picture/', update_profile_picture, name='user-profile-update'),
    
    # admin
    path('all/', get_all_users, name='user-list'),
]
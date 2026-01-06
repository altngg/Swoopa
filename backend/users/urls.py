from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('locations/', views.get_all_locations, name='get_all_locations'),

    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    path('me/', views.UserProfileView.as_view(), name='current-user'),
    path('<int:user_id>/', views.get_user_by_id, name='get_user_by_id'),
    path('me/update/', views.UserProfileUpdateView.as_view(), name='user-profile-update'),
    
    # admin
    path('all/', views.UserListView.as_view(), name='user-list'),
]
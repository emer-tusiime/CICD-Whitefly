from django.urls import path
from . import api_views

app_name = 'api'

urlpatterns = [
    # CSRF Token
    path('csrf/', api_views.get_csrf_token, name='csrf'),
    
    # Authentication
    path('auth/signup/', api_views.signup_view, name='signup'),
    path('auth/login/', api_views.login_view, name='login'),
    path('auth/logout/', api_views.logout_view, name='logout'),
    path('auth/user/', api_views.current_user_view, name='current_user'),
    
    # Image Upload & Processing
    path('upload/', api_views.upload_images_view, name='upload'),
    
    # Results
    path('images/', api_views.get_user_images_view, name='user_images'),
    path('results/', api_views.get_user_results_view, name='user_results'),
    path('results/<int:result_id>/', api_views.get_result_detail_view, name='result_detail'),
]

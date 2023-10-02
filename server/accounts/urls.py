from django.urls import path
from .views import RegistrationView, MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

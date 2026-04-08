from django.urls import path
from .views import CustomTokenObtainPairView, register_view

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view()),
    path("register/", register_view),
]
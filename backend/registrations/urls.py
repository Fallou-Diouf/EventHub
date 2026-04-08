from django.urls import path
from .views import RegistrationListCreateView, RegistrationRetrieveDestroyView

urlpatterns = [
    path('', RegistrationListCreateView.as_view()),
    path('<int:pk>/', RegistrationRetrieveDestroyView.as_view()),
]

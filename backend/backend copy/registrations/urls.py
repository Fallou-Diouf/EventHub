from django.urls import path
from .views import RegistrationListreCreateView, RegistrationRetrieveUpdateDestroyView

urlpatterns = [
    path('', RegistrationListreCreateView.as_view()),
    path('<uuid:id>/', RegistrationRetrieveUpdateDestroyView.as_view())
]

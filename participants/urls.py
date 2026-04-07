from django.urls import path
from .views import ParticipantListeCreateView, ParticipantRetrieveUpdateDestroyView

urlpatterns = [
    path('', ParticipantListeCreateView.as_view()),
    path('<uuid:pk>/', ParticipantRetrieveUpdateDestroyView.as_view())
]

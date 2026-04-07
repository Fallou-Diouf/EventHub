from django.urls import path
from .views import EventListCreateView, EventRetrieveUpdateDestroyView

urlpatterns = [
    path('', EventListCreateView.as_view()),
    path('<uuid:pk>/', EventRetrieveUpdateDestroyView.as_view()),
]

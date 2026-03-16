from django.urls import path
from .views import EventListCreateView, EventRetrieveUpdateDestroyView

urlpatterns = [
    path('', EventListCreateView.as_view()),
    path('<uuid:id>/', EventRetrieveUpdateDestroyView.as_view()),
]

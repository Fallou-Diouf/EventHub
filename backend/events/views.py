from django.shortcuts import render
from rest_framework import generics
from .models import Event
from .serializers import EventSerializer


# CREATE + READ
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


# READ ONE + UPDATE + DELETE 
class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filterset_fields = ["date", "status"] # filter by date and/or status
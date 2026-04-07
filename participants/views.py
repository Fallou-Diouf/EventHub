from django.shortcuts import render
from .models import Participant
from .serializers import ParticipantSerializer
from rest_framework import generics

# CREATE + READ
class ParticipantListeCreateView(generics.ListCreateAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    
    
# READ ONE + UPDATE + DELETE
class ParticipantRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
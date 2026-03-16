from django.shortcuts import render
from .models import Registration
from rest_framework import generics
from .serializers import RegistrationSerializer

# CREATE + READ
class RegistrationListreCreateView(generics.ListCreateAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    
# READ + UPDATE + DELETE
class RegistrationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
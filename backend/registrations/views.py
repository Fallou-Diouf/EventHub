from rest_framework import generics
from .models import Registration
from .serializers import RegistrationSerializer

# CREATE + READ
class RegistrationListCreateView(generics.ListCreateAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer


# READ + DELETE (PAS UPDATE)
class RegistrationRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
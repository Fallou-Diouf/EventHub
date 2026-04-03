from rest_framework import generics
from .models import Event
from .serializers import EventSerializer
from .permissions import IsAdminOrReadOnly

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Event.objects.all()

        date = self.request.query_params.get("date")
        status = self.request.query_params.get("status")

        if date:
            queryset = queryset.filter(date=date)

        if status:
            queryset = queryset.filter(status=status)

        return queryset

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]
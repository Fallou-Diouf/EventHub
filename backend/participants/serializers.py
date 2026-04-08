from rest_framework import serializers
from .models import Participant

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ["id", "name", "email", "phone"]
        read_only_fields = ["id"]
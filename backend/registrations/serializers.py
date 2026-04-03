from rest_framework import serializers
from .models import Registration
from participants.serializers import ParticipantSerializer
from events.serializers import EventSerializer

class RegistrationSerializer(serializers.ModelSerializer):
    # Lecture : objets complets
    participant = ParticipantSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    # Écriture : UUID
    participant_id = serializers.UUIDField(write_only=True)
    event_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Registration
        fields = ["id", "participant", "event", "participant_id", "event_id"]

    def validate(self, data):
        participant = data.get("participant_id")
        event = data.get("event_id")

        if Registration.objects.filter(participant_id=participant, event_id=event).exists():
            raise serializers.ValidationError("Participant déjà inscrit à cet événement")

        return data

    def create(self, validated_data):
        return Registration.objects.create(
            participant_id=validated_data["participant_id"],
            event_id=validated_data["event_id"]
        )

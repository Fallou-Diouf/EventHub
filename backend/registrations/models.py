from django.db import models
from events.models import Event
from participants.models import Participant

class Registration(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="registrations"
    )
    registration_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('participant', 'event')
        ordering = ['-registration_date']

    def __str__(self):
        return f"{self.participant.name} → {self.event.title}"

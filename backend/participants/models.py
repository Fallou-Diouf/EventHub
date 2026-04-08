from django.db import models
import uuid
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Participant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.name
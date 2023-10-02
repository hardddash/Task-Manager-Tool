from django.db import models
from django.contrib.auth.models import User
from .__init__ import Status, Priority


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=[(
        status.name, status.value) for status in Status])
    priority = models.CharField(max_length=20, choices=[(priority.name, priority.value) for priority in Priority],
                                null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

from django.db import models
from django.utils import timezone
# Create your models here.
class Ticket(models.Model):
 
    tid = models.IntegerField("Ticket Id", primary_key=True)
    title = models.CharField(max_length=100, default="New Ticket")
    description = models.CharField(max_length=500, default="No deescription")
    assigned = models.IntegerField(default=-1)
    story_points = models.IntegerField(default=0)
    creator = models.IntegerField()
    priority = models.IntegerField(default=0)
    date_created = models.DateTimeField(default=timezone.now)
    completed = models.BooleanField(default=False)
    date_completed = models.DateTimeField(null=True)
    date_assigned = models.DateTimeField(null=True)
    project = models.IntegerField()

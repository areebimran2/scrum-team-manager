from django.db import models

# Create your models here.
class Ticket(models.Model):
 
    tid = models.IntegerField("Ticket Id", primary_key=True)
    title = models.CharField(max_length=100, default="")
    description = models.CharField(max_length=500, default="")
    assigned = models.IntegerField(default=-1)
    story_points = models.IntegerField(default=0)
    creator = models.IntegerField()
    priority = models.IntegerField(default=0)
    date_created = models.CharField(max_length=100)
    completed = models.BooleanField(default=False)
    date_completed = models.CharField(max_length=100, default="")
    date_assigned = models.CharField(max_length=100, default="")
    project = models.IntegerField()
    assigned = models.BooleanField(default=False)




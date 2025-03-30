from django.db import models

class TicketFullModel(models.Model):
    tid = models.IntegerField("Ticket Id", primary_key=True)
    project = models.IntegerField("Project")
    story_points = models.IntegerField("Project")
    creator = models.IntegerField("Creator")
    priority = models.IntegerField("Priority")
    assigned = models.IntegerField("Completed")

    title = models.CharField("Title", max_length=100)
    description = models.CharField("Description", max_length=500)

    completed = models.BooleanField("Completed")
    # assigned_to = models.IntegerField("Assigned_to")
    
    date_created = models.DateTimeField("Date Created")
    date_completed = models.DateTimeField("Date Completed")
    date_assigned = models.DateTimeField("Date Assigned")
 
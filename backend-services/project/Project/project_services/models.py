from django.db import models

# Create your models here.
class Project(models.Model):
    pid = models.IntegerField("Project Id", primary_key=True)
    name = models.CharField(max_length=100, default="")
    description = models.CharField(max_length=500, default="")
    tickets = models.JSONField(default=list)
    creator = models.IntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    scrum_users = models.JSONField(default=list)
    # changed this to a list
    admin = models.JSONField(default=list)
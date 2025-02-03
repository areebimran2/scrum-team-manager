from django.db import models

# Create your models here.

class ScrumUser(models.Model):
    uid = models.IntegerField("User Id", primary_key=True)
    assigned_tickets =  models.JSONField(default=list)
    project = models.IntegerField()
    num_tickets = models.IntegerField()
    email = models.EmailField()
    password = models.CharField(max_length=100)
    display_name = models.CharField(max_length=200)
    skills = models.JSONField(default=list)
    profile_picture = models.ImageField()

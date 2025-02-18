from django.contrib.auth.models import AbstractUser
from django.db import models

class UserLoginModel(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=100)

class UserFullModel(AbstractUser):
    uid = models.IntegerField("User Id", primary_key=True)
    assigned_tickets =  models.JSONField(default=list)
    project = models.IntegerField(default=-1)
    num_tickets = models.IntegerField(default=0)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    display_name = models.CharField(max_length=200, blank=True)
    skills = models.JSONField(default=list)
    profile_picture = models.ImageField(blank=True)
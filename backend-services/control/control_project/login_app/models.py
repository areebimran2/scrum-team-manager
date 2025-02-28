from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models

class UserLoginModel(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=100)

class UserFullModel(AbstractBaseUser):
    uid = models.IntegerField("User Id", primary_key=True)
    assigned_tickets =  models.JSONField(default=dict)
    project = models.IntegerField(default=-1)

    email = models.EmailField(unique=True)


    password = models.CharField(max_length=100)
    display_name = models.CharField(max_length=200, blank=True)
    skills = models.JSONField(default=list)
    profile_picture = models.ImageField(blank=True)

    USERNAME_FIELD = 'email'
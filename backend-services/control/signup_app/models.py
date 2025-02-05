from django.db import models

# Create your models here.

class UserModel(models.Model):
    #TODO Max Length to be confirmed
    email = models.CharField(max_length = 100)
    password = models.CharField(max_length = 50)
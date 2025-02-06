from django.db import models

# Create your models here.

class UserSignUpModel(models.Model):
    #TODO Max Length to be confirmed
    email = models.EmailFieldField()
    password = models.CharField(max_length=100)

from django.db import models

# Create your models here.

class UserSignInModel(models.Model):
    #TODO Max Length to be confirmed
    email = models.EmailFieldField()
    password = models.CharField()

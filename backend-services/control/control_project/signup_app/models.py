from django.db import models

# Create your models here.

class UserSignUpModel(models.Model):
    email = models.EmailField()
    password = models.CharField(max_length=100)
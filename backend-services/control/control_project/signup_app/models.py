from django.db import models

# Create your models here.

class UserSignUpModel(models.Model):
    #TODO Max Length to be confirmed
<<<<<<< HEAD
    email = models.EmailField()
=======
    email = models.EmailFieldField()
>>>>>>> origin/feature/SCRUM-5-user-login
    password = models.CharField(max_length=100)

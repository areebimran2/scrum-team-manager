from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.crypto import get_random_string
from invitations.models import Invitation
from django.db import models
from django.utils import timezone


# Create your models here.
class ProjectShell(models.Model):
    pid = models.IntegerField("Project Id", primary_key=True)
    name = models.CharField(max_length=100, default="")
    description = models.CharField(max_length=500, default="")
    tickets = models.JSONField(default=list)
    creator = models.IntegerField()
    date_created = models.CharField(max_length=100)
    scrum_users = models.JSONField(default=list)
    # changed this to a list
    admin = models.JSONField(default=list)


class ProjectTicketAssignmentModel(models.Model):
    tid = models.IntegerField("Ticket Id", primary_key=True)
    title = models.CharField(max_length=100, default="")
    description = models.CharField(max_length=500, default="")
    assigned = models.IntegerField(default=-1)
    story_points = models.IntegerField(default=0)
    creator = models.IntegerField()
    priority = models.IntegerField(default=0)
    date_created = models.DateTimeField(default=timezone.now)
    completed = models.BooleanField(default=False)
    date_completed = models.DateTimeField(null=True)
    date_assigned = models.DateTimeField(null=True)
    project = models.IntegerField()


class UserFullModel(AbstractBaseUser):
    uid = models.IntegerField("User Id", primary_key=True)
    assigned_tickets = models.JSONField(default=dict)
    project = models.IntegerField(default=-1)

    email = models.EmailField(unique=True)

    password = models.CharField(max_length=100)
    display_name = models.CharField(max_length=200, blank=True)
    skills = models.JSONField(default=list)
    profile_picture = models.ImageField(blank=True)

    USERNAME_FIELD = 'email'


class CustomUserInvite(Invitation):
    pid = models.IntegerField(blank=True, null=True)

    @classmethod
    def create(cls, email, pid, inviter=None, **kwargs):
        key = get_random_string(64).lower()
        instance = cls._default_manager.create(
            email=email, pid=pid, key=key, inviter=inviter, **kwargs
        )
        return instance

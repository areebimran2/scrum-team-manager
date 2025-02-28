from rest_framework import serializers
from .models import *

class ProjectShellSerializer(serializers.ModelSerializer):
    pid = serializers.IntegerField("Project Id", primary_key=True)
    name = serializers.CharField(max_length=100, default="")
    description = serializers.CharField(max_length=500, default="")
    tickets = serializers.JSONField(default=list)
    creator = serializers.IntegerField()
    date_created = serializers.CharField(max_length=100)
    scrum_users = serializers.JSONField(default=list)
    # changed this to a list
    admin = serializers.JSONField(default=list)
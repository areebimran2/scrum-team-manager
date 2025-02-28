from rest_framework import serializers
from .models import *

class ProjectAddShellSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, allow_null=False, default=None)
    description = serializers.CharField(required=True, allow_null=False, default=None)
    tickets = serializers.JSONField(required=False, allow_null=True, default=None)
    creator = serializers.IntegerField(required=True, allow_null=False, default=None)
    date_created = serializers.DateTimeField(required=False, allow_null=True, default=None)
    scrum_users = serializers.JSONField(required=False, allow_null=True, default=None)
    admin = serializers.JSONField(required=False, allow_null=True, default=None)


class ProjectUpdateShellSerializer(serializers.Serializer):
    pid = serializers.IntegerField(required=True, allow_null=False, default=None)
    name = serializers.CharField(required=False, allow_null=True, default=None)
    description = serializers.CharField(required=False, allow_null=True, default=None)
    tickets = serializers.JSONField(required=False, allow_null=True, default=None)
    creator = serializers.IntegerField(required=False, allow_null=True, default=None)
    scrum_users = serializers.JSONField(required=False, allow_null=True, default=None)
    admin = serializers.JSONField(required=False, allow_null=True, default=None)


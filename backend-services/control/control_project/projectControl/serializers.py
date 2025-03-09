from rest_framework import serializers
from .models import *

class ProjectAddShellSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, allow_null=False)
    description = serializers.CharField(required=True, allow_null=False)
    creator = serializers.IntegerField(required=True, allow_null=False)

class ProjectUpdateShellSerializer(serializers.Serializer):
    pid = serializers.IntegerField(required=True, allow_null=False)
    name = serializers.CharField(required=False, allow_null=True, default=None)
    description = serializers.CharField(required=False, allow_null=True, default=None)

class EditStatusSerializer(serializers.Serializer):
    pid = serializers.IntegerField()
    uid = serializers.IntegerField()


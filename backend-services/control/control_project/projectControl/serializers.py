from rest_framework import serializers
from .models import *

class ProjectAddShellSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, allow_null=False, default=None)
    description = serializers.CharField(required=True, allow_null=False, default=None)
    creator = serializers.IntegerField(required=True, allow_null=False, default=None)



class ProjectUpdateShellSerializer(serializers.Serializer):
    pid = serializers.IntegerField(required=True, allow_null=False, default=None)
    name = serializers.CharField(required=False, allow_null=True, default=None)
    description = serializers.CharField(required=False, allow_null=True, default=None)



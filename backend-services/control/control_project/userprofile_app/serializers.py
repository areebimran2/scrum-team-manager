from rest_framework import serializers
from .models import *

class UserFullSerializer(serializers.Serializer):
    uid = serializers.IntegerField(required=True)
    assigned_tickets = serializers.JSONField(required=False, allow_null=True, default=None)
    project = serializers.IntegerField(required=False, allow_null=True, default=None)
    num_tickets = serializers.IntegerField(required=False, allow_null=True, default=None)
    email = serializers.EmailField(required=False, allow_null=True, default=None)
    password = serializers.CharField(required=False, allow_null=True, default=None)
    display_name = serializers.CharField(required=False, allow_null=True, default=None)
    skills = serializers.JSONField(required=False, allow_null=True, default=None)
    profile_picture = serializers.ImageField(required=False, allow_null=True, default=None)
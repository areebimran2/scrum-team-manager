from rest_framework import serializers
from .models import *

class TicketFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = TicketFullModel
        fields = '__all__'

class TicketOptionalFullSerializer(serializers.Serializer):
    tid = serializers.IntegerField(required=True)
    project = serializers.IntegerField(required=False, allow_null=True, default=None)
    story_points = serializers.IntegerField(required=False, allow_null=True, default=None)
    creator = serializers.IntegerField(required=False, allow_null=True, default=None)
    priority = serializers.IntegerField(required=False, allow_null=True, default=None)
    assigned_to = serializers.IntegerField(required=False, allow_null=True, default=None)

    title = serializers.CharField(max_length=100, required=False, allow_null=True, default=None)
    description = serializers.CharField(max_length=500, required=False, allow_null=True, default=None)

    completed = serializers.BooleanField(required=False, allow_null=True, default=None)
    assigned = serializers.BooleanField(required=False, allow_null=True, default=None)

    date_created = serializers.DateTimeField(required=False, allow_null=True, default=None)
    date_completed = serializers.DateTimeField(required=False, allow_null=True, default=None)
    date_assigned = serializers.DateTimeField(required=False, allow_null=True, default=None)
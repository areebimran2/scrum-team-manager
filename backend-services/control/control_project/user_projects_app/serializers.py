from rest_framework import serializers
from .models import *


class ProjectTicketAssignmentSerializer(serializers.ModelSerializer):
    tid = serializers.IntegerField(required=True)
    assigned = serializers.IntegerField(required=True)

    class Meta:
        model = ProjectTicketAssignmentModel
        fields = ['tid', 'assigned']
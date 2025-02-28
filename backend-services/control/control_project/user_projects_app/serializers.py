from rest_framework import serializers
from .models import *


class ProjectTicketAssignmentSerializer(serializers.ModelSerializer):
    tid = serializers.IntegerField(required=True)
    assigned = serializers.IntegerField(required=True)

    class Meta:
        model = ProjectTicketAssignmentModel
        fields = ['tid', 'assigned']

class ProjectUserInviteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = UserFullModel
        fields = ['email']
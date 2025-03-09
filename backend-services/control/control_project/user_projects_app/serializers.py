from rest_framework import serializers
from .models import *

class ProjectTicketAssignmentSerializer(serializers.ModelSerializer):
    tid = serializers.IntegerField(required=True)
    assigned = serializers.IntegerField(required=True)

    class Meta:
        model = ProjectTicketAssignmentModel
        fields = ['tid', 'assigned']

class ProjectUserInviteSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = CustomUserInvite
        fields = ['email']
    
class ManualAddProjectMemberSerializer(serializers.Serializer):
    pid = serializers.IntegerField(required=True)
    uid = serializers.IntegerField(required=True)

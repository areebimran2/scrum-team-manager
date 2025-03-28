from rest_framework import serializers
from .models import *


class ProjectAddShellSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, allow_null=False)
    description = serializers.CharField(required=True, allow_null=False)
    creator = serializers.IntegerField(required=True, allow_null=False)


class ProjectUpdateShellSerializer(serializers.Serializer):
    pid = serializers.IntegerField(required=True, allow_null=False)
    name = serializers.CharField(required=False, allow_null=True, default=None)
    description = serializers.CharField(required=False, allow_null=True,
                                        default=None)


class EditStatusSerializer(serializers.Serializer):
    pid = serializers.IntegerField()
    uid = serializers.IntegerField()


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

class ContactAdminSerializer(serializers.Serializer):
    admin_email = serializers.EmailField(required=True)
    tid = serializers.IntegerField(required=True)
    message = serializers.CharField(required=False, allow_null=False)

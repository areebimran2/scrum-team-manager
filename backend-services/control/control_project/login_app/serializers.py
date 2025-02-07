from rest_framework import serializers
from .models import UserModel

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel 
        fields = ('email', 'password')

class UserLoginRecoverySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = UserModel
        fields = ['email']


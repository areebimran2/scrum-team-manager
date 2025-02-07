from rest_framework import serializers
from .models import *

class UserLoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserLoginModel 
        fields = ('email', 'password')
        
class UserLoginRecoverySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = UserLoginModel
        fields = ['email']
        
class UserFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFullModel
        fields = '__all__'
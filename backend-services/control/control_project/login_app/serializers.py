from rest_framework import serializers
from .models import *

class UserLoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserLoginModel 
        fields = ('email', 'password')

class UserFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFullModel
        fields = '__all__'
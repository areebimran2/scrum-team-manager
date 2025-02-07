from rest_framework import serializers
from .models import *

class UserSignUpSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSignUpModel 
        fields = ('email', 'password')
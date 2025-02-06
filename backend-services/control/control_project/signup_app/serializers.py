from rest_framework import serializers
from .models import *

class UserSignInSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSignInModel 
        fields = ('email', 'password')

from rest_framework import serializers
from .models import *

class UserFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFullModel
        fields = '__all__'
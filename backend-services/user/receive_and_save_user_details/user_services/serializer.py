from rest_framework import serializers
from .models import ScrumUser



class ScrumUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrumUser
        fields = '__all__'


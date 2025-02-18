from rest_framework import serializers
from .models import *

class TicketFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = TicketFullModel
        fields = '__all__'

from django.shortcuts import render
import requests

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView

from .models import *
from .serializers import *

@api_view(['GET'])
def ticket_get_handler(request, tid_str):
    if request.method == 'GET':

        try:
            tid = int(tid_str)
        except:
            return Response({"error": f"{tid_str} is not a number"}, status=status.HTTP_400_BAD_REQUEST)

        url = "http://127.0.0.1:8001"

        response = requests.get(url + f'/ticket/query/{tid}')

        if response.status_code == 404: # Ticket does not exist
            print("actually 404")
            # Send 404 back to frontend
            return Response(status=status.HTTP_404_NOT_FOUND)
                
        elif response.status_code == 200: # Ticket exists
            return Response(response.json(), status=status.HTTP_200_OK)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def ticket_update_handler(request):
    if request.method == 'POST':
        serializer = TicketOptionalFullSerializer(data=request.data)
        if serializer.is_valid():
            url = "http://127.0.0.1:8001"

            exists_response = requests.get(url + f'/ticket/query/TID/{serializer.validated_data['tid']}')

            if exists_response.status_code == 404: # Ticket does not exist
                # Send 404 back to frontend
                return Response(status=status.HTTP_404_NOT_FOUND)
                    
            elif exists_response.status_code == 200: # Ticekt exists
                update_response = requests.post(url + '/ticket/update/', json=serializer.validated_data)
                if update_response.status_code == 200:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(update_response, status=update_response.status_code)

        else:
            # Data formatted wrong
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    

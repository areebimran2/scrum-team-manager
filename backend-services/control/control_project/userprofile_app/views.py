from django.shortcuts import render
import requests
import time

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import *
from .serializers import *

# Create your views here.
@api_view(['POST', 'GET'])
def userprofile_handler(request):
    if request.method == 'POST':
        serializer = UserFullSerializer(data=request.data)
        if serializer.is_valid():
            #TODO set ISCS url
            url = ""

            #TODO configure endpoint URI
            exists_response = requests.get(url + f'/user/{serializer.validated_data['uid']}')

            if exists_response.status_code == 404: # Account does not exist
                # Send 404 back to frontend
                return Response(status=status.HTTP_404_NOT_FOUND)
                    
            elif exists_response.status_code == 200: # Account exists
                update_response = requests.post(url + 'user/update', serializer.validated_data)

        else:
            # Data formatted wrong
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        uid = request.query_params.get('uid')

        #TODO set ISCS url
        url = ""

        #TODO configure endpoint URI
        response = requests.get(url + f'/user/{uid}')

        if response.status_code == 404: # Account does not exist
            # Send 404 back to frontend
            return Response(status=status.HTTP_404_NOT_FOUND)
                
        elif response.status_code == 200: # Account exists
            return Response(response.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
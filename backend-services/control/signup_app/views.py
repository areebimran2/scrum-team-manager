from django.shortcuts import render
import requests
import time

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import User
from .serializers import *


# Create your views here.
@api_view(['POST'])
def signup_handler(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            
            # Check if user exists

            attempts = 0 # attempts to reach ISCS
            while attempts <= 5:
                #TODO configure URL for ISCS
                url = ""
                payload = request.data #TODO This is probably wrong
                response = requests.post(url, data=payload)

                #TODO is this using 404 correctly?
                if response.status_code == 404: # Account does not exist
                    # Send Data to UserService

                    #TODO make post request to ISCS for UserService

                    # Send 201 back
                    return Response(status=status.HTTP_201_CREATED)
                
                elif response.status_code == 200: # Account exists
                    # Send error back
                    
                    #TODO send back to fronted that account already exists
                    pass

                else: # Error in accesing ISCS or UserService
                    attempts += 1
                    time.sleep(5)
            # After 5 attempts send back response from UserService
            return Response({"error": "Request failed"}, status=response.status_code)
        # Data formatted wrong
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # wrong request method
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)

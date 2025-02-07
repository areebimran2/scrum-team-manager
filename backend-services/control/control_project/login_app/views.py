from django.shortcuts import render
import requests
import time

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import *
from .serializers import *

# Create your views here.

@api_view(['POST'])
def login_handler(request):
    if request.method == 'POST':
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            
            # Check if user exists

            attempts = 0 # attempts to reach ISCS
            while attempts <= 5:

                url = "http://127.0.0.1:8000"

                response = requests.get(url + f"/user/query/EMAIL/{serializer.validated_data["email"]}")

                if response.status_code == 404: # Account does not exist
                    # Send 404 back to frontend
                    return Response(status=status.HTTP_404_NOT_FOUND)

                
                elif response.status_code == 200: # Account exists
                    #TODO Check request data matches with response from get request
                    
                    response_data = response.json()[0]
                    
                    given_password = serializer.validated_data['password']
                    saved_password = response_data['password']

                    # If request data matches response data
                    if given_password == saved_password:
                        return Response(status=status.HTTP_200_OK)
                    else:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)

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
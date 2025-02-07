from django.shortcuts import render
import requests
import time

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import *


# Create your views here.
@api_view(['POST'])
def signup_handler(request):
    if request.method == 'POST':
        serializer = UserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            
            # Check if user exists

            attempts = 0 # attempts to reach ISCS
            while attempts <= 5:
                #TODO configure URL for ISCS
                url = "http://127.0.0.1:8001"

                response = requests.get(url + "/user/query/{0}".format(serializer.validated_data["email"]))

                if response.status_code == 404: # Account does not exist
                    # Send Data to UserService through ISCS

                    user_create_data = {
                        'email' : serializer.validated_data["email"],
                        'password' : serializer.validated_data["password"],
                        'display_name': None,  # Empty display_name
                        'profile_picture': None  # Empty profile_picture
                    }

                    response = requests.post(url + f"/user/add", user_create_data)

                    # Send 201 back
                    return Response(status=status.HTTP_201_CREATED)
                
                elif response.status_code == 200: # Account exists
                    # Send 409 error back to frontend
                    
                    return Response(status=status.HTTP_409_CONFLICT)

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

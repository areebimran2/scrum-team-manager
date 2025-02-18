from datetime import timedelta, datetime
from smtplib import SMTPException

from django.core.mail import send_mail

from django.shortcuts import render
import requests
import time

from django.utils.crypto import get_random_string
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView

from control_project import settings
from rest_framework_simplejwt.tokens import RefreshToken

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

                url = "http://127.0.0.1:8001"

                response = requests.get(url + "/user/query/EMAIL/{0}".format(serializer.validated_data["email"]))

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
                        token = RefreshToken()
                        token["id"] = response_data["uid"]
                        token["email"] = response_data["email"]

                        return Response({"refresh": str(token),
                                              "access": str(token.access_token)}, status=status.HTTP_200_OK)
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

class UserLoginRecoveryView(APIView):
    def post(self, request, *args, **kwargs):
        # Use serializer to check if request contains expected information
        serializer = UserLoginRecoverySerializer(data=request.data)
        if serializer.is_valid():
            # Get validated email from serializer and query user database to
            # see if there exists a user with the email
            validated_data = serializer.validated_data
            url = "http://127.0.0.1:8001"
            response = requests.get(url + "/user/query/EMAIL/{0}".format(validated_data["email"]))

            # There is no user with such email
            if response.status_code == 404:
                return Response({"error": "There is no user with the provided email"},
                                status=status.HTTP_404_NOT_FOUND)

            # Assume that only one user can exist per email (if this is not the
            # case, login recovery requires more information to disambiguate
            # accounts)
            user = response.json()[0]

            # Generate a new temporary password that is 10 characters long
            temp_password = get_random_string(10)

            try:
                subject = "JirAI Login Recovery"
                message = ("Hello, your temporary password is {0}.\r\n\r\nPlease login at http://127.0.0.1:10001/login " 
                           "and change your password as soon as possible.").format(temp_password)
                from_email = settings.EMAIL_HOST_USER
                to_email = user["email"]
                send_mail(subject, message, from_email, [to_email], fail_silently=False)
            except SMTPException as e:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            response = requests.post(url + "/user/update/", data={"uid": user["uid"], "password": temp_password})

            return Response({"response": "Recovery instructions email sent to {0}".format(user["email"])},
                            status=status.HTTP_200_OK)


        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
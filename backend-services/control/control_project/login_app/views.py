from datetime import timedelta, datetime
from smtplib import SMTPException

from django.core.mail import send_mail

from django.shortcuts import render
import requests
import time

from django.utils.crypto import get_random_string
from django.contrib.auth import logout

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView

from control_project import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from argon2 import PasswordHasher
from argon2.exceptions import *

from .models import *
from .serializers import *

# Create your views here.
JWTAuthentication
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
                    password_hasher = PasswordHasher()
                    try:
                        is_match = password_hasher.verify(saved_password, given_password)
                    except VerifyMismatchError: #Password don't match
                        return Response(status=status.HTTP_401_UNAUTHORIZED)
                    except: #Verification Error
                        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

                    if is_match:
                        # Create token
                        token = RefreshToken()
                        token["id"] = response_data["uid"]
                        token["email"] = response_data["email"]

                        # Break apart token
                        header, payload, signature = str(token.access_token).split(".")

                        # Return JWT in two pieces stored in two different cookies
                        response = Response({"message": "Cookies set"}, status=status.HTTP_200_OK)

                        response.set_cookie(
                            key='cookie_1',
                            value=f'{header}.{payload}',
                            max_age=settings.COOKIE_AGE.total_seconds(),
                            secure=True,
                            samesite='None'
                        )

                        response.set_cookie(
                            key='cookie_2',
                            value=signature,
                            secure=True,
                            httponly=True,
                            samesite='None'
                        )

                        return response
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

@api_view(['POST'])
def logout_handler(request):
    # Log out the user and clear session data
    logout(request)

    # Create an HTTP response
    response = Response(status=status.HTTP_200_OK)

    # Delete specific HttpOnly cookies
    response.delete_cookie('cookie_1', samesite='None')  # Example for Django's default session cookie
    response.delete_cookie('cookie_2', samesite='None')  # Replace with your custom cookie name
    return response

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

            password_hasher = PasswordHasher()

            # Generate a new temporary password that is 10 characters long
            temp_password = get_random_string(10)
            hashed_pass = password_hasher.hash(temp_password)

            try:
                subject = "JirAI Login Recovery"
                message = ("Hello, your temporary password is {0}.\r\n\r\nPlease login at http://127.0.0.1:10001/login " 
                           "and change your password as soon as possible.").format(temp_password)
                from_email = settings.EMAIL_HOST_USER
                to_email = user["email"]
                send_mail(subject, message, from_email, [to_email], fail_silently=False)
            except SMTPException as e:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            response = requests.post(url + "/user/update/", json={"uid": user["uid"], "password": hashed_pass})

            return Response({"response": "Recovery instructions email sent to {0}".format(user["email"])},
                            status=status.HTTP_200_OK)


        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
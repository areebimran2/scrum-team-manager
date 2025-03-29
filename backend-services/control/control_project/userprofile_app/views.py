from django.shortcuts import render
import requests
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import *
from .serializers import *

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def userprofile_post_handler(request):
    if request.method == 'POST':
        serializer = UserFullSerializer(data=request.data)
        if serializer.is_valid():

            #TODO set ISCS url
            url = "http://127.0.0.1:8001"

            if serializer.validated_data['uid'] != request.user.uid:
                return Response({"error": "User does not have access to this profile"}, status=status.HTTP_401_UNAUTHORIZED)

            #TODO configure endpoint URI
            exists_response = requests.get(url + '/user/query/UID/{0}'.format(serializer.validated_data['uid']))

            if exists_response.status_code == 404: # Account does not exist
                # Send 404 back to frontend
                return Response(status=status.HTTP_404_NOT_FOUND)
                    
            elif exists_response.status_code == 200: # Account exists
                update_response = requests.post(url + '/user/update/', json=serializer.validated_data)
                if update_response.status_code == 200:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(update_response, status=update_response.status_code)

        else:
            # Data formatted wrong
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userprofile_get_handler(request, uid_str):
    if request.method == 'GET':
        print("is GET request")

        try:
            uid = int(uid_str)
            if uid != request.user.uid:
                return Response({"error": "User does not have access to this profile"}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"error": f"{uid_str} is not a number"}, status=status.HTTP_400_BAD_REQUEST)

        url = "http://127.0.0.1:8001"

        response = requests.get(url + '/user/query/UID/{0}'.format(uid))

        if response.status_code == 404: # Account does not exist
            print("actually 404")
            # Send 404 back to frontend
            return Response(status=status.HTTP_404_NOT_FOUND)
                
        elif response.status_code == 200: # Account exists
            return Response(response.json(), status=status.HTTP_200_OK)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def skill_list(request):
    if request.method == "GET":

        skill_list = [
            "SQL", "MongoDB", "MySQL", "PostgreSQL",
            "Django", "React", "REST API",
            "Back-end", "Front-end", "Full Stack",
            "Networking", "Debugging", "Testing", "System Architecture", "Cyber Security",
            "Python", "Java", "C", "C++", "C#", "Rust", "Javascript",
            "Pandas", "Numpy",
            "Html & CSS", "Bootstrap", "Tailwind",
            "Optimization",
        ]

        return_data = {"skills" : skill_list}
        return Response(return_data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
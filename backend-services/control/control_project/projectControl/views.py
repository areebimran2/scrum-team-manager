from django.shortcuts import render
import requests
import time

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.utils import timezone

from .serializers import *

# Create your views here.
@api_view(['POST'])
def createProject(request):
    if request.method == 'POST':
        serializer = ProjectAddShellSerializer(data=request.data)
        if serializer.is_valid():
            
            # Check if project exists

            attempts = 0 # attempts to reach ISCS
            while attempts <= 5:
                #TODO configure URL for ISCS
                url = "http://127.0.0.1:8001"

      
                # Send Data to ProjectService through ISCS

                project_create_data = {
                        'name' : serializer.validated_data.get("name"),
                        'description' : serializer.validated_data.get("description"),
                        'tickets' : [],
                        'creator' : serializer.validated_data.get("creator"),
                        'date_created': timezone.now,
                        'scrum_users' : [ serializer.validated_data.get("creator")],
                        'admin' :  [ serializer.validated_data.get("creator")],
                    }
                

                response = requests.post(url + f"/project/add/", json=project_create_data)

                # Send 201 back
                if response.status_code == 200:
                    return Response(status=status.HTTP_201_CREATED)
                elif response.status_code <500:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                
                attempts += 1
                time.sleep(5)

            # After 5 attempts send back response from UserService
            return Response({"error": "Request failed"}, status=response.status_code)
        # Data formatted wrong
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # wrong request method
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getProject(request, pid_str):
    if request.method == 'GET':
        print("is GET request")

        try:
            pid = int(pid_str)
        except:
            return Response({"error": f"{pid_str} is not a number"}, status=status.HTTP_400_BAD_REQUEST)

        url = "http://127.0.0.1:8001"

        response = requests.get(url + f'/project/query/{pid}')

        if response.status_code == 404: # Account does not exist
            print("actually 404")
            # Send 404 back to frontend
            return Response(status=status.HTTP_404_NOT_FOUND)
                
        elif response.status_code == 200: # Account exists
            return Response(response.json(), status=status.HTTP_200_OK)

    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def updateProject(request):
    if request.method == 'POST':
        serializer = ProjectUpdateShellSerializer(data=request.data)
        if serializer.is_valid():
            if (serializer.validated_data.get("creator") or serializer.validated_data.get("date_created")):
                return Response({"error": "Cannot change fields based on creation of project"}, status=status.HTTP_400_BAD_REQUEST)

            if (not serializer.validated_data.get("pid")):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Check if project exists

            attempts = 0 # attempts to reach ISCS
            while attempts <= 5:
                url = "http://127.0.0.1:8001"

      
                # Send Data to ProjectService through ISCS

                project_create_data = {
                        'pid' : serializer.validated_data.get("pid"),
                        'name' : serializer.validated_data.get("name"),
                        'description' : serializer.validated_data.get("description"),
                        'tickets' : serializer.validated_data.get("tickets"),
                        'scrum_users' : serializer.validated_data.get("scrum_users"),
                        'admin' : serializer.validated_data.get("admin"),
                    }
                

                response = requests.post(url + f"/project/add/", json=project_create_data)

                # Send 201 back
                if response.status_code == 404:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                elif response.status_code == 200:
                    return Response(status=status.HTTP_201_CREATED)
                elif response.status_code <500:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                
                attempts += 1
                time.sleep(5)

            # After 5 attempts send back response from UserService
            return Response({"error": "Request failed"}, status=response.status_code)
        # Data formatted wrong
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # wrong request method
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)

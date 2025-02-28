from django.shortcuts import render
import requests
import time

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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

            if (not serializer.validated_data.get("pid")):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Check if project exists

            attempts = 0 # attempts to reach ISCS
            while attempts <= 5:
                url = "http://127.0.0.1:8001"

      
                # Send Data to ProjectService through ISCS
                

                response = requests.post(url + f"/project/add/", json=serializer.validated_data)

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
    
@api_view(['GET'])
def adminView(request, pid_str):
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
            #Get all project members
            project_data = response.json()[0]
            scrum_users = []
            for uid in project_data["scrum_users"]:
                response = requests.get(f"http://127.0.0.1:8001/user/query/UID/{uid}")
                if response.status_code != 200:
                    return Response({"error": f'error retreiving user {uid} : {response}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                scrum_users.append(response.json()[0])

            #Get all tickets
            tickets = []
            for tid in project_data["tickets"]:
                response = requests.get(f"http://127.0.0.1:8001/ticket/query/{tid}")
                if response.status_code != 200:
                    return Response({"error": f'error retreiving ticket {tid} : {response}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                tickets.append(response.json()[0])

            #Return data
            return_data = {
                "users" : scrum_users,
                "tickets" : tickets
            }
            return Response(return_data, status=status.HTTP_200_OK)

    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def editStatus(request):
    if request.method == 'POST':
        serializer = EditStatusSerializer(data=request.data)
        if serializer.is_valid():
            #Get project details
            pid = serializer.validated_data[pid]
            response = requests.get(f"http://127.0.0.1:8001/project/query/{pid}")
            if response.status_code != 200:
                return Response({"error": f'error retreiving project {pid} : {response}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            project_data = response.json()[0]

            action = serializer.validated_data[action]
            uid = serializer.validated_data[uid]

            if action == "promote":
                #Check if already admin
                admin_list = project_data["admin"]
                if uid in admin_list:
                    return Response({"error": f'User {uid} is already an admin'}, status=status.HTTP_409_CONFLICT)
                
                #update project
                project_data["admin"].append(uid)
                
                update_response = requests.post(f"http://127.0.0.1:8001/project/update/", json=project_data)
                if update_response.status_code == 200:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response({'error': update_response}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            elif action == "demote":
                #Check if admin
                admin_list = project_data["admin"]
                if uid not in admin_list:
                    return Response({"error": f'User {uid} is not an admin'}, status=status.HTTP_409_CONFLICT)
                
                #update project
                project_data["admin"].remove(uid)
                
                update_response = requests.post(f"http://127.0.0.1:8001/project/update/", json=project_data)
                if update_response.status_code == 200:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response({'error': update_response}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            elif action == "remove":
                pass
            else:
                return Response({'error': f'{action} is not a valid action'}, status=status.HTTP_400_BAD_REQUEST)
            
                
        # Data formatted wrong
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # wrong request method
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    

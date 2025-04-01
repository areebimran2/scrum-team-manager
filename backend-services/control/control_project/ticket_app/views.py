from django.shortcuts import render
from django.utils import timezone
import requests

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from itertools import chain

from .models import *
from .serializers import *

@api_view(['GET', 'DELETE'])
def ticket_get_delete_handler(request, tid_str):
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
            return Response(response.json()[0], status=status.HTTP_200_OK)
        
    elif request.method == 'DELETE':
        try:
            tid = int(tid_str)
        except:
            return Response({"error": f"{tid_str} is not a number"}, status=status.HTTP_400_BAD_REQUEST)

        url = "http://127.0.0.1:8001"

        response = requests.get(url + f'/ticket/query/{tid}')

        if response.status_code == 404: # Ticket does not exist
            # Send 404 back to frontend
            return Response(status=status.HTTP_404_NOT_FOUND)
                
        elif response.status_code == 200: # Ticket exists
            
            response_data = response.json()[0]
            pid = response_data["project"]

            if response_data["assigned"] != -1: #Ticket is assigned to a user

                #Remove ticket from user
                uid = response_data["assigned"]
                user_response = requests.get(url + f'/user/query/UID/{uid}')
                user_data = user_response.json()[0]
                user_data["assigned_tickets"][f"{pid}"].remove(tid)
                #Send updated user back
                update_response = requests.post(url + '/user/update/', json=user_data)
                if update_response.status_code != 200:
                    return Response(f"Error updating user {uid} when removing ticket {tid}: {update_response}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                

            #Remove ticket from project
            project_response = requests.get(url + f'/project/query/{pid}')
            project_data = project_response.json()[0]
            project_data["tickets"].remove(tid)
            #Send updated project back
            update_response = requests.post(url + "/project/update/", json=project_data)
            if update_response.status_code == 200:
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(f"Error updating project {pid} when removing ticket {tid}: {update_response.text}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def ticket_update_handler(request):
    if request.method == 'POST':
        serializer = TicketOptionalFullSerializer(data=request.data)
        if serializer.is_valid():
            url = "http://127.0.0.1:8001"

            exists_response = requests.get(url + f'/ticket/query/{serializer.validated_data["tid"]}')

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
    
@api_view(['POST'])
def ticket_create_handler(request):
    if request.method == 'POST':
        serializer = TicketCreateSerializer(data=request.data)
        if serializer.is_valid():
            url = "http://127.0.0.1:8001"
            #create ticket
            create_response = requests.post(url + "/ticket/add/", json=serializer.validated_data)
            if create_response.status_code != 200:
                return Response(create_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            full_ticket_data = create_response.json()
            tid = full_ticket_data["tid"]

            #get to project
            pid = serializer.validated_data["project"]
            get_response = requests.get(url+f"/project/query/{pid}")
            if create_response.status_code != 200:
                return Response(get_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            #update ticket list
            project_data = get_response.json()[0]
            project_data["tickets"].append(tid)
            update_response = requests.post(url + "/project/update/", json=project_data)
            if update_response.status_code == 200:
                return Response(status=status.HTTP_201_CREATED, data=full_ticket_data)
            else:
                return Response(update_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            # Data formatted wrong
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserAllTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        url = "http://127.0.0.1:8001"
        all_tickets = []
        for tid in list(chain(*request.user.assigned_tickets.values())):
            response = requests.get(url + "/ticket/query/{0}".format(tid))
            if response.status_code == 200:
                all_tickets.extend(response.json())
        return Response({"tickets": all_tickets}, status=status.HTTP_200_OK)
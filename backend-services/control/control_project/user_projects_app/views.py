from django.shortcuts import render
from control_project import settings

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from invitations.utils import get_invitation_model

from .serializers import *

import requests

class UserAllProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        url = "http://127.0.0.1:8002"
        all_projects = []
        for pid in request.user.assigned_tickets.keys():
            response = requests.get(url + "/project/query/{0}".format(pid))
            if response.status_code == 200:
                all_projects.append(response.json())
        return Response({"projects": all_projects}, status=status.HTTP_200_OK)

class ProjectTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        url = "http://127.0.0.1:8003"

        # Signed in user is not apart of project and is therefore not authorized to access project info
        project_id = self.kwargs['pid']
        if request.user.assigned_tickets.get(project_id) is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        all_tickets = []

        for ticket_id in request.user.assigned_tickets[project_id]:
            response = requests.get(url + "/ticket/query/{0}".format(ticket_id))
            if response.status_code == 200:
                all_tickets.append(response.json())
        return Response({"pid": project_id, "tickets": all_tickets}, status=status.HTTP_200_OK)

class ProjectMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        user_url = "http://127.0.0.1:8000"
        project_url = "http://127.0.0.1:8002"

        # Signed in user is not apart of project and is therefore not authorized to access project info
        project_id = self.kwargs['pid']
        if request.user.assigned_tickets.get(project_id) is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        project_response = requests.get(project_url + "/project/query/{0}".format(project_id))

        all_members = []

        for user_id in project_response.json()["scrum_users"]:
            user_response = requests.get(user_url + "/user/query/UID/{0}".format(user_id))
            if user_response.status_code == 200:
                all_members.append(user_response.json())
        return Response({"members": all_members}, status=status.HTTP_200_OK)

class ProjectTicketAssignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, **kwargs):
        serializer = ProjectTicketAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            user_url = "http://127.0.0.1:8000"
            project_url = "http://127.0.0.1:8002"

            validated_data = serializer.validated_data
            project_id = self.kwargs['pid']

            user_response = requests.get(user_url + "/user/query/UID/{0}".format(validated_data["assigned"]))
            user_code = user_response.status_code
            if user_response.status_code != 200:
                return Response(status=user_code)

            project_response = requests.get(project_url + "/project/query/{0}".format(project_id))
            project_code = project_response.status_code
            if project_code != 200:
                return Response(status=project_code)

            if request.user.uid not in project_response.json()["admin"]:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            if validated_data["tid"] not in project_response.json()["tickets"]:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Reassign the ticket value to the User with uid <assigned>
            response = reassign_ticket(validated_data, project_id, validated_data["assigned"])
            if response.status_code != 200:
                return response

            # Add to Users tickets
            user = user_response.json()
            user["assigned_tickets"][project_id].append(validated_data["tid"])

            response = requests.post(user_url + "/user/update/", data={"uid": validated_data["assigned"],
                                                                       "assigned_tickets": user["assigned_tickets"]})
            if response.status_code != 200:
                return response
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProjectTicketUnassignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, **kwargs):
        serializer = ProjectTicketAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            project_url = "http://127.0.0.1:8002"

            validated_data = serializer.validated_data
            project_id = self.kwargs['pid']

            project_response = requests.get(project_url + "/project/query/{0}".format(project_id))
            project_code = project_response.status_code
            if project_code != 200:
                return Response(status=project_code)

            if request.user.uid not in project_response.json()["admin"]:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            if validated_data["tid"] not in project_response.json()["tickets"]:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Reassign ticket to -1, which is the unassigned value
            return reassign_ticket(validated_data, project_id, -1)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def reassign_ticket(validated_data, pid, new_assigned):
    user_url = "http://127.0.0.1:8000"
    ticket_url = "http://127.0.0.1:8003"

    ticket_response = requests.get(ticket_url + "/ticket/query/{0}".format(validated_data["tid"]))
    ticket_code = ticket_response.status_code
    if ticket_response.status_code != 200:
        return Response(status=ticket_code)

    currently_assigned = ticket_response.json()["assigned"]

    if currently_assigned != -1:
        user_response = requests.get(user_url + "/user/query/UID/{0}".format(currently_assigned))
        user_code = user_response.status_code
        if user_response.status_code != 200:
            return Response(status=user_code)

        user = user_response.json()
        user["assigned_tickets"][pid].remove(validated_data["tid"])

        response = requests.post(user_url + "/user/update/", data={"uid": user["uid"],
                                                                   "assigned_tickets": user["assigned_tickets"]})

        if response.status_code != 200:
            return Response(status=response.status_code)

        response = requests.post(ticket_url + "/ticket/update/", data={"tid": validated_data["tid"],
                                                                       "assigned": new_assigned})
        if response.status_code != 200:
            return response
    return Response(status=status.HTTP_200_OK)

class ProjectInviteView(APIView):
    def post(self, request, *args, **kwargs):
        # Use serializer to check if request contains expected information
        serializer = ProjectUserInviteSerializer(data=request.data)
        if serializer.is_valid():
            url = "http://127.0.0.1:8001"

            validated_data = serializer.validated_data
            response = requests.get(url + "/user/query/EMAIL/{0}".format(validated_data["email"]))

            # There is no user with such email
            if response.status_code == 404:
                return Response({"error": "There is no user with the provided email"},
                                status=status.HTTP_404_NOT_FOUND)

            # Assume that only one user can exist per email
            user = response.json()[0]

            # Create and send invitation
            Invitation = get_invitation_model()
            invitation = Invitation.create(email=user["email"])
            invitation.send_invitation()

            return Response({"message": "Email sent"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
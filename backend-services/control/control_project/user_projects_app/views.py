from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

from control.control_project.user_projects_app.serializers import ProjectTicketAssignmentSerializer


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
            ticket_url = "http://127.0.0.1:8003"

            validated_data = serializer.validated_data
            ticket_response = requests.get(ticket_url + "/ticket/query/{0}".format(validated_data["tid"]))






class ProjectTicketUnassignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, **kwargs):
        project_id = self.kwargs['pid']
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import requests


class UserAllProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        url = "http://127.0.0.1:8001"
        all_projects = []
        for pid in request.user.assigned_tickets.keys():
            response = requests.get(url + "/project/query/{0}".format(pid))
            if response.status_code == 200:
                all_projects.append(response.json())
        return Response({"projects": all_projects}, status=status.HTTP_200_OK)

class UserProjectTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        url = "http://127.0.0.1:8003"

        # Signed in user is not apart of project and is therefore not authorized to view the project
        # home page
        project_id = self.kwargs['pid']
        if request.user.assigned_tickets.get(project_id) is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        all_tickets = []

        for ticket_id in request.user.assigned_tickets[project_id]:
            response = requests.get(url + "/ticket/query/{0}".format(ticket_id))
            if response.status_code == 200:
                all_tickets.append(response.json())
        return Response({"pid": project_id, "tickets": all_tickets}, status=status.HTTP_200_OK)

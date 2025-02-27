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
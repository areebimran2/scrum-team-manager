from django.shortcuts import render, get_object_or_404
from control_project import settings
from django.utils.timezone import now

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from invitations.utils import get_invitation_model
from rest_framework.decorators import api_view

from .serializers import *

import requests

class UserAllProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        url = "http://127.0.0.1:8001"
        all_projects = []
        for pid in request.user.assigned_tickets.keys():
            response = requests.get(url + "/project/query/{0}".format(pid))
            if response.status_code == 200:
                all_projects.extend(response.json())
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
                all_tickets.extend(response.json())
        return Response({"pid": project_id, "tickets": all_tickets}, status=status.HTTP_200_OK)

class ProjectMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        url = "http://127.0.0.1:8001"

        # Signed in user is not apart of project and is therefore not authorized to access project info
        project_id = self.kwargs['pid']
        if request.user.assigned_tickets.get(project_id) is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        project_response = requests.get(url + "/project/query/{0}".format(project_id))

        all_members = []

        for user_id in project_response.json()[0]["scrum_users"]:
            user_response = requests.get(url + "/user/query/UID/{0}".format(user_id))
            if user_response.status_code == 200:
                all_members.extend(user_response.json())
        return Response({"members": all_members}, status=status.HTTP_200_OK)

class ProjectTicketAssignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, **kwargs):
        serializer = ProjectTicketAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            url = "http://127.0.0.1:8001"

            validated_data = serializer.validated_data
            project_id = self.kwargs['pid']

            user_response = requests.get(url + "/user/query/UID/{0}".format(validated_data["assigned"]))
            user_code = user_response.status_code
            if user_response.status_code != 200:
                return Response(status=user_code)

            project_response = requests.get(url + "/project/query/{0}".format(project_id))
            project_code = project_response.status_code
            if project_code != 200:
                return Response(status=project_code)
            
            project_data = project_response.json()[0]
            print(f"project data: {project_data}")

            if request.user.uid not in project_data["admin"]:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            
            print("checked is admin")

            if validated_data["tid"] not in project_data["tickets"]:
                err = {"error" : f"ticket {validated_data["tid"]} not project {project_data["pid"]}"}
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            print("ticket in list")

            # Reassign the ticket value to the User with uid <assigned>
            response = reassign_ticket(validated_data, project_id, validated_data["assigned"])
            if response.status_code != 200:
                err = {"error" : f"error code {response.status_code}"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print("ticket reassigned")

            # Add to Users tickets
            user = user_response.json()[0]
            user["assigned_tickets"][f"{project_id}"].append(validated_data["tid"])

            response = requests.post(url + "/user/update/", json={"uid": validated_data["assigned"],
                                                                  "assigned_tickets": user["assigned_tickets"]})
            if response.status_code != 200:
                err = {"error":f"code: {response.status_code}, response: {response.text}"}
                return Response(err, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProjectTicketUnassignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, **kwargs):
        serializer = ProjectTicketAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            url = "http://127.0.0.1:8001"

            validated_data = serializer.validated_data
            project_id = self.kwargs['pid']

            project_response = requests.get(url + "/project/query/{0}".format(project_id))
            project_code = project_response.status_code
            if project_code != 200:
                return Response(status=project_code)
            project_data = project_response.json()[0]

            if request.user.uid not in project_data["admin"]:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            if validated_data["tid"] not in project_data["tickets"]:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Reassign ticket to -1, which is the unassigned value
            return reassign_ticket(validated_data, project_id, -1)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def reassign_ticket(validated_data, pid, new_assigned):
    url = "http://127.0.0.1:8001"

    #get ticket object
    ticket_response = requests.get(url + "/ticket/query/{0}".format(validated_data["tid"]))
    ticket_code = ticket_response.status_code
    if ticket_response.status_code != 200:
        return Response(status=ticket_code)
    ticket_data = ticket_response.json()[0]

    currently_assigned = ticket_data["assigned"]

    #check if assigned
    if currently_assigned != -1: # assigned to another user
        # get assigned user
        user_response = requests.get(url + "/user/query/UID/{0}".format(currently_assigned))
        if user_response.status_code != 200:
            return user_response
        user = user_response.json()[0]

        # remove ticket from previously assigned user
        user["assigned_tickets"][f"{pid}"].remove(validated_data["tid"])

        # update user
        response = requests.post(url + "/user/update/", json={"uid": user["uid"],
                                                              "assigned_tickets": user["assigned_tickets"]})
        if response.status_code != 200:
            return response

        # unassign ticket
        response = requests.post(url + "/ticket/update/", json={"tid": validated_data["tid"],
                                                            "assigned": -1})
        if response.status_code != 200:
            return response
    
    #check if being assigned
    if new_assigned != -1: #being assigned
        #update ticket
        response = requests.post(url + "/ticket/update/", json={"tid": validated_data["tid"],
                                                            "assigned": new_assigned})
        if response.status_code != 200:
            return response

    return Response(status=status.HTTP_200_OK)

class ProjectUserInviteView(APIView):
    def post(self, request, *args, **kwargs):
        # Use serializer to check if request contains expected information
        serializer = ProjectUserInviteSerializer(data=request.data)
        if serializer.is_valid():
            url = "http://127.0.0.1:8001"



            validated_data = serializer.validated_data
            response = requests.get(url + "/project/query/{0}".format(self.kwargs["pid"]))
            if response.status_code == 404:
                return Response({"error": "The specified project does not exist."}, status=status.HTTP_404_NOT_FOUND)

            response = requests.get(url + "/user/query/EMAIL/{0}".format(validated_data["email"]))

            # There is no user with such email
            if response.status_code == 404:
                return Response({"error": "There is no user with the provided email"},
                                status=status.HTTP_404_NOT_FOUND)

            Invitation = get_invitation_model()
            invitation = Invitation.objects.filter(email__iexact=validated_data["email"]).last()

            print(Invitation.objects.filter())
            if invitation is None:
                invitation = Invitation.create(email=validated_data["email"], pid=self.kwargs['pid'])

            invitation.send_invitation(request)

            return Response({"message": "Invite sent successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectUserInviteAcceptView(APIView):
    def get(self, request, *args, **kwargs):
        # Retrieve the invitation using the key
        invitation = get_object_or_404(CustomUserInvite, key=self.kwargs["key"])

        # Check if the invitation is valid and not expired
        if invitation.key_expired():
            return Response({"error":"This invitation has expired."}, status=410)

        # Check if thee invitation has been accepted
        if invitation.accepted:
            return Response({"error":"This invitation has already been accepted."}, status=400)

        # Mark the invitation as accepted
        invitation.accepted = True
        invitation.save()

        url = "http://127.0.0.1:8001"
        email = invitation.email
        pid = invitation.pid

        user_response = requests.get(url + "/user/query/EMAIL/{0}".format(email))
        project_response = requests.get(url + "/project/query/{0}".format(pid))

        project = project_response.json()
        project['scrum_users'].append(user_response.json()["uid"])

        response = requests.post(url + "/project/update/", json={"pid": pid,
                                                                 "scrum_users": project['scrum_users']})

        return Response({"message": "Invitation accepted"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def manual_add_project_member(request):
    if request.method == 'POST':
        serializer = ManualAddProjectMemberSerializer(data=request.data)
        if serializer.is_valid():

            pid = serializer.validated_data["pid"]
            uid = serializer.validated_data["uid"]
            url = "http://127.0.0.1:8001"

            # Update Project with new user
            project_response = requests.get(url + "/project/query/{0}".format(pid))
            project = project_response.json()[0]

            if uid in project["scrum_users"]:
                return Response({"error": f"User {uid} already in project"}, status=status.HTTP_409_CONFLICT)

            project['scrum_users'].append(uid)
            data = {"pid": pid, "scrum_users": project['scrum_users']}
            response = requests.post(url + "/project/update/", json=data)
            if response.status_code != 200:
                return Response({"error": "Failed to update project"}, status=response.status_code)

            # Update User with new project
            user_response = requests.get(url + "/user/query/UID/{0}".format(uid))
            user = user_response.json()[0]
            # print(f"User: {user}, type: {type(user)}")
            user["assigned_tickets"][pid] = []
            data = {"uid": uid, "assigned_tickets": user["assigned_tickets"]}
            response = requests.post(url + "/user/update/", json=data)
            if response.status_code != 200:
                return Response({"error": "Failed to update user"}, status=response.status_code)
            
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
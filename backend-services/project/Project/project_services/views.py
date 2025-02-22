from .models import Project
from .serializer import ProjectSerializer
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response

"""
Take in a project id, return project associated with id.
"""
@api_view(['GET'])
def query(request, key):
    if not key:
      return Response({"error": "Missing required parameters"}, status=400)

    ticket = Project.objects.filter(pid__exact=key)
    if len(list(ticket)) == 0:
       return Response({"error": "No ticket found"}, status=404)
    
    serialized = ProjectSerializer(ticket, many=True)

    return Response(serialized.data)

"""
add a new project to the database
"""
@api_view(['POST'])
def add_project(request):
    try:
        data = json.loads(request.body)
    except json.decoder.JSONDecodeError:
        return Response({"error":"Body required for this request"}, status=400)

    creator = data.get("creator")
    admin = data.get("admin")
    date_created = data.get("date_created")

    if (not creator or not date_created or not admin):
        return Response({"error": "Missing required parameters"}, status=400)
    
    new_project = Project(creator=creator, admin=admin, date_created=date_created)

    new_project.name = data.get("name") if data.get("name") else new_project.name
    new_project.description = data.get("description") if data.get("description") else new_project.description
    new_project.tickets = data.get("tickets") if data.get("tickets") else new_project.tickets
    new_project.scrum_users = data.get("scrum_users") if data.get("name") else new_project.scrum_users

    new_project.save()

    serialized = ProjectSerializer(new_project)

    return Response(serialized.data)

"""
update a project given its pid
"""
@api_view(['POST'])
def update_project(request):
    try:
        data = json.loads(request.body)
    except json.decoder.JSONDecodeError:
        return Response({"error":"Body required for this request"}, status=400)
    try:
        pid = data.get("pid")

        if (not pid):
            return Response({"error": "Missing required parameters"}, status=400)

        new_project = Project.objects.get(pid=pid)
        new_project.name = data.get("name") if data.get("name") else new_project.name
        new_project.description = data.get("description") if data.get("description") else new_project.description
        new_project.tickets = data.get("tickets") if data.get("tickets") else new_project.tickets
        new_project.scrum_users = data.get("scrum_users") if data.get("name") else new_project.scrum_users

        new_project.save()
        
        serialized = ProjectSerializer(new_project)

        return Response(serialized.data)
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=404)

"""
delete a project with its associated pid
"""
@api_view(['POST'])
def delete_project(request):
    try:
        data = json.loads(request.body)
    except json.decoder.JSONDecodeError:
        return Response({"error":"Body required for this request"}, status=400)
    
    
    pid = pid = data.get("pid")

    if not pid:
        return Response({"error":"Pid required"}, status=400)
    
    to_delete = Project.objects.filter(pid=pid)

    if not len(list(to_delete)):
        return Response({"error":"Project not found"}, status=404)
    
    to_delete.delete()
    return Response(status=200)

from .models import Ticket
from serializer import TicketSerializer
from django.db.models import Q
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.

"""
Take in a ticket id, return ticket associated with id.
"""
@api_view(['GET'])
def query(request, key):
    if not key:
      return Response({"error": "Missing required parameters"}, status=400)

    ticket = Ticket.objects.filter(tid__exact=key)
    if len(list(ticket)) == 0:
       return Response({"error": "No ticket found"}, status=404)
    
    serialized = TicketSerializer(ticket, many=True)

    return Response(serialized.data)

"""
add a new ticket to the database
"""
@api_view(['POST'])
def add_ticket(request):
    try:
        data = json.loads(request.body)
    except json.decoder.JSONDecodeError:
        return Response({"error":"Body required for this request"}, status=400)
   
    creator = data.get("creator")
    date_created =data.get("date_created")
    project = data.get("project")
    if (not creator or not date_created or not project):
        return Response({"error": "Missing required parameters"}, status=400)
    
    new_ticket = Ticket(creator=creator, date_created=date_created, project=project)

    new_ticket.title = data.get("title") if data.get("title") else new_ticket.title
    new_ticket.description = data.get("description") if data.get("description") else new_ticket.description
    new_ticket.assigned = data.get("assigned") if data.get("assigned") else new_ticket.assigned
    new_ticket.story_points = data.get("story_points") if data.get("story_points") else new_ticket.story_points
    new_ticket.priority= data.get("priority") if data.get("priority") else new_ticket.priority
    new_ticket.date_assigned = data.get("date_assigned") if data.get("date_assigned") else new_ticket.date_assigned
 

    
    new_ticket.save()
    serialized = TicketSerializer(new_ticket)
    return Response(serialized.data)

"""
searches for ticket based on tid, and updates all fields given
"""
@api_view(['POST'])
def update_ticket(request):
    try:
        data = json.loads(request.body)
    except json.decoder.JSONDecodeError:
        return Response({"error":"Body required for this request"}, status=400)
    
    if not data.get("tid"):
        return Response({"error":"Ticket ID required to update"}, status=400)
    
    try:
        new_ticket = Ticket.objects.get(tid=data.get("tid"))
        
        new_ticket.title = data.get("title") if data.get("title") else new_ticket.title
        new_ticket.description = data.get("description") if data.get("description") else new_ticket.description
        new_ticket.assigned = data.get("assigned") if data.get("assigned") else new_ticket.assigned
        new_ticket.story_points = data.get("story_points") if data.get("story_points") else new_ticket.story_points
        new_ticket.priority= data.get("priority") if data.get("priority") else new_ticket.priority
        new_ticket.date_assigned = data.get("date_assigned") if data.get("date_assigned") else new_ticket.date_assigned


        new_ticket.save()

        serialized = TicketSerializer(new_ticket)
        return Response(serialized.data)
    except Ticket.DoesNotExist:
        return Response({"error": "Ticket not found"}, status=404)
    



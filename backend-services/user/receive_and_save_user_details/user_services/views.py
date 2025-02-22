from .models import ScrumUser
import json
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import ScrumUserSerializer

"""
Query database based on email. Returns list of users that matches

"""
@api_view(['GET'])
def query(request, case, input):

   if not case or not input:
      return Response({"error": "Missing required parameters"}, status=400)

   if case == "EMAIL":
      users = ScrumUser.objects.filter(email__exact=input)
   elif case == "UID":
      users = ScrumUser.objects.filter(uid__exact=input)
   else:
      return Response({"error": "Invalid Case"}, status=400)
   
   if len(list(users)) == 0:
      return Response({"error": "User not Found"}, status=404)
   
   serialized = ScrumUserSerializer(users, many=True)

   return Response(serialized.data)


"""
add a new user to the database
"""
@api_view(['POST'])
def add_user(request):
   try:
      data = json.loads(request.body)
   except json.decoder.JSONDecodeError:
      return Response({"error":"Body required for this request"}, status=400)
  
   email = data.get("email")
   
   password = data.get("password")

   if (not password or not email):
      return Response({"error": "missing username or email"}, status=400)

   display_name = data.get("display_name")
   profile_picture = data.get("profile_picture")

   if (display_name and profile_picture):
      new_user = ScrumUser(email=email, password=password, display_name = display_name, profile_picture = profile_picture)
   elif (display_name):
      new_user = ScrumUser(email=email, password=password, display_name = display_name, profile_picture = profile_picture)
   elif profile_picture:
      new_user = ScrumUser(email=email, password=password, profile_picture = profile_picture)
   else:
      new_user = ScrumUser(email=email, password=password, num_tickets=0)
   
   new_user.save()
   serialized =ScrumUserSerializer(new_user)
   return Response(serialized.data)


"""
update a user based on its uid
"""
@api_view(['POST'])
def update_user(request):
   try:
      data = json.loads(request.body)
   except json.decoder.JSONDecodeError:
      return Response({"error":"Body required for this request"}, status=400)
   uid = data.get("uid")
   if (not uid):
      return Response({"error": "no identification give"}, status=400)
 

   try:
      user = ScrumUser.objects.get(uid=uid)

      assigned_tickets = data.get("assigned_tickets")
      if assigned_tickets:
         user.assigned_tickets = assigned_tickets


      project = data.get("project")
      if project:
         user.project = project
      
      
      num_tickets = data.get("num_tickets")
      if num_tickets:
         user.num_tickets = num_tickets


      email = data.get("email")
      if email:
         user.email = email

      password = data.get("password")
      if password:
         user.password = password


      display_name = data.get("display_name")
      if display_name:
         user.display_name= display_name

      skills = data.get("skills")
      if skills:
         user.skills = skills

      user.save()
      serialized =ScrumUserSerializer(user)
      return Response(serialized.data, status=200)

   except ScrumUser.DoesNotExist:
      return Response({"error":"User not Found"}, status=404)

   


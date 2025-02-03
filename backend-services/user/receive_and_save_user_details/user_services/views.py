from django.http import JsonResponse
from .models import ScrumUser
import json
from django.db.models import Q
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt




"""
Query users based on paramaters (AND-case). 
For skills, will query based containing ALL skills given (may contain more)
Expects json payload

Returns list of users
"""
@csrf_exempt
def query_AND(request):
   data = json.loads(request.body)
   query = Q()

   username = data.get("username")
   if username:
      query &= Q(username__exact=username)

   email = data.get("email")
   if email:
      query &= Q(email__exact=email)

   password = data.get("password")
   if password:
      query &= Q(password__exact=password)

   desc = data.get("description")
   if desc:
      query &= Q(description__exact=desc)
   nickname = data.get("nickname")
   if nickname:
      query &= Q(nickname__exact=nickname)
   skills = data.get("skills")
   if skills:
      skills = skills.split(",")
      query &= Q(skills__contains=skills)


   users = ScrumUser.objects.filter(query)
   serialized = serializers.serialize('json', users)

   return JsonResponse(serialized, safe=False, status=200)


"""
Query users based on parameters (OR-case).
For skills, will query basedon containing AT LEAST ONE skill given
Expects json payload

Returns list of users
"""
@csrf_exempt
def query_OR(request):
   data = json.loads(request.body)
   query = Q()

   username = data.get("username")
   if username:
      query |= Q(username__exact=username)

   email = data.get("email")
   if email:
      query |= Q(email__exact=email)

   password = data.get("password")
   if password:
      query |= Q(password__exact=password)

   desc = data.get("description")
   if desc:
      query |= Q(description__exact=desc)
   nickname = data.get("nickname")
   if nickname:
      query |= Q(nickname__exact=nickname)
   skills = data.get("skills")
   if skills:
      skills = skills.split(",")
      query |= Q(skills__overlap=skills)


   users = list(ScrumUser.objects.filter(query))
   serialized = serializers.serialize('json', users)
   return JsonResponse(serialized, safe=False, status=200)



"""
Add user to database
Description, Nickname, and skills are optional, but username, email, and password must be given
Expects json payload
"""
@csrf_exempt
def add_user(request):
   data = json.loads(request.body)
   username =  data.get("username")
  
   email = data.get("email")
   
   password = data.get("password")

   desc = data.get("description")
   if not desc:
      desc = ""

   nickname = data.get("nickname")
   if not nickname:
      nickname = ""

   skills = data.get("skills")
   if not skills:
      skills = "[]"
   else:
      skills = skills

   if (not username or not email or not password):
      return JsonResponse({"error": "Invalid Creation Request: Missing Parameters"}, status=400)
   
   new_user = ScrumUser(username=username, email=email, password=password, description=desc, nickname=nickname,skills=skills)
   new_user.save()
   return JsonResponse({"message": "User created successfully"}, status=200)


"""
Update User with the same email address. 
Email addresses are unique, meaning it should always be given
Any additional parameters given will be used to update the user
Expects json payload
"""
@csrf_exempt
def update_user(request):
   data = json.loads(request.body)
   email = data.get("email")
   try:
      user = ScrumUser.objects.get(email__exact=email)
   except ScrumUser.DoesNotExist:
      return JsonResponse({"error":"User not Found"}, status=404)

   username =  data.get("username")
   if username:
     user.username = username

   email = data.get("email")

   password = data.get("password")
   if password:
      user.password = password

   desc = data.get("description")
   
   if desc:
      user.description = desc


   nickname = data.get("nickname")
   if nickname:
      user.nickname = nickname


   skills = data.get("skills")
   if skills:
      user.skills = skills

   user.save()

   return JsonResponse(status=200)




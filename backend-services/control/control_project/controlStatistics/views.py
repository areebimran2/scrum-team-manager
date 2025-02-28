from django.shortcuts import render
import requests

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
import json

@api_view(['GET'])
def getBar(request, pid_str):
    if request.method == 'GET':
        print("is GET request")

        try:
            pid = int(pid_str)
        except:
            return Response({"error": f"{pid_str} is not a number"}, status=status.HTTP_400_BAD_REQUEST)

        url = "http://127.0.0.1:8001"

        response = requests.get(url + f'/project/query/{pid}')
        
        if response.status_code == 404: # Project does not exist
            print("actually 404")
            # Send 404 back to frontend
            return Response(status=status.HTTP_404_NOT_FOUND)
                
        elif response.status_code == 200: # Project exists
            uid_dict = dict()
            
            project_dict = response.json()

            for ticketID in project_dict.get("tickets"):
                try:
                    ticketResponse = requests.get(url + f'/ticket/query/{ticketID}').json()
                    if (not uid_dict.get(ticketResponse["assigned"])):
                        if (ticketResponse["completed"]):
                            uid_dict[ticketResponse["assigned"]] = {"completed": [ticketID], "uncompleted": []}
                        else:
                            uid_dict[ticketResponse["assigned"]] = {"completed": [], "uncompleted": [ticketID]}
                    else:
                        if (ticketResponse["completed"]):
                            uid_dict[ticketResponse["assigned"]]["completed"].append(ticketID)
                        else:
                            uid_dict[ticketResponse["assigned"]]["uncompleted"].append(ticketID)
                            
                except:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            final_json = []
            for uid in uid_dict.keys():
                try:
                    userResponse = requests.get(url + f'/user/query/{uid}').json()
                    one_bar_dict = dict()
                    one_bar_dict["completed"] = uid_dict[uid]["completed"]
                    one_bar_dict["uncompleted"] = uid_dict[uid]["uncompleted"]
                    one_bar_dict["UID"] = uid
                    one_bar_dict["name"] = userResponse["display_name"]
                    final_json.append(one_bar_dict)

                except:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response(json.dumps(final_json), status=status.HTTP_200_OK)
            
        else:
            return Response(status=response.status_code)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
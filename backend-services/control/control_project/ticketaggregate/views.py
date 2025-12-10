from django.shortcuts import render
import requests

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
import json

# Create your views here.
@api_view(['GET'])
def getTickets(request, pid_str):

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
            print(project_dict)
            print(project_dict[0].get("scrum_users"))

            for uid in project_dict[0].get("scrum_users"):
                uid_dict[uid] = [0,0]
                userResponse = requests.get('http://127.0.0.1:8000' +  f'/user/query/UID/{uid}').json()[0]
                print("USER, ",userResponse)
                if (not userResponse.get("assigned_tickets").get(pid_str)):
                    continue
                for ticket in userResponse.get("assigned_tickets").get(pid_str):
                    ticketResponse = requests.get(url +  f'/ticket/query/{ticket}').json()[0]
                    if ticketResponse["completed"]:
                        uid_dict[uid][0] += ticketResponse["story_points"]
                    else:
                        uid_dict[uid][1] += ticketResponse["story_points"]

            final_json = []
            for uid in uid_dict.keys():
                try:
                    userResponse = requests.get('http://127.0.0.1:8000' + f'/user/query/UID/{uid}').json()[0]
                    one_user_dict = dict()
                    one_user_dict["stats"] = uid_dict[uid]
                    # one_user_dict["UID"] = uid
                    one_user_dict["name"] = uid
                    one_user_dict["skills"] = userResponse["skills"]
                    final_json.append(one_user_dict)
                except Exception as e:
                    print(e)
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response(json.dumps(final_json), status=status.HTTP_200_OK)
            
        else:
            return Response(status=response.status_code)
    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    

        





    

#                 # for ticketID in project_dict[0].get("tickets"):
#             #     try:
#             #         print(ticketID)
#             #         ticketResponse = requests.get(url +  f'/ticket/query/{ticketID}')
                    
#             #         ticketResponse = ticketResponse.json()[0]
#             #         print(ticketResponse)
#             #         if (not uid_dict.get(ticketResponse["assigned_to"])):
#             #             if (ticketResponse["completed"]):
#             #                 uid_dict[ticketResponse["assigned_to"]] = [ticketResponse["story_points"], 0]
#             #             else:
#             #                 uid_dict[ticketResponse["assigned_to"]] = [0, ticketResponse["story_points"] ]

#             #         else:
#             #             if (ticketResponse["completed"]):
#             #                 uid_dict[ticketResponse["assigned_to"]][0] += ticketResponse["story_points"]
#             #             else:
#             #                 uid_dict[ticketResponse["assigned_to"]][1] += ticketResponse["story_points"]
                            
#             #     except Exception as err:
#             #         print(err)
#             #         print("ID", ticketID)
#             #         return Response(status=status.HTTP_200_OK)
#             # print(uid_dict)


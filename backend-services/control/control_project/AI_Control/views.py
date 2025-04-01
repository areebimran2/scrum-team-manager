from django.shortcuts import render
import requests

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
import json


import requests
import ast



API_KEY = "AIzaSyDfYC4oRSQtEW8x7pw4_n5KhHP1OSgqzaM"

API_LINK = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"




def get_skills(description: str) -> list[str]:
    PROMPT = f"""Given the following ticket description, extract the necessary skills required to complete the task:
            '{description}'.

            Use only at most 4 words for each skill, and make them somewhat general, not requiring
            specific technologies, but general  and output them in a list.

            Example:
            Ticket Description: develop the frontend of the AFS app

            THE EXACT FORMATTED OUTPUT IS ["x","y","z",etc]
        
            Do not include "Ai Response:" in your output, and include at least 7 skills

            """
    

    data = {
    "contents": [
        {
            "parts": [{"text": PROMPT}]
        }
    ]
    }

    headers = {
    "Content-Type": "application/json"
    }

    response = requests.post(API_LINK, headers=headers, json=data)

    response_text = response.json().get('candidates')[0].get("content").get("parts")[0].get('text')
    
    actual_list =  ast.literal_eval(response_text)

    return actual_list


def _formatUsers(users: list[dict]) -> str:

    formatted_users = []
    
    for user in users:

        user_name = user.get("name")
        
        user_skills = ", ".join(user.get("skills", []))
        
        formatted_users.append(f"{user_name}: {user_skills}")
    
    
    return "\n".join(formatted_users)

def sort_user_skills(skills: list[str], users: list[dict[str, list[dict]]]) -> list[str]:

    
    PROMPT = f"""You have a list of user ID's and skills. Your job is to compare each user and their respective skills,
    to the required skills. You will then output a sorted list of users from most to least qualified for the task.

    REQUIRED: {skills}

    USERS: \n{_formatUsers(users)}

    OUTPUT EXACTLY LIKE THIS: ["1", "2","3",...]

    DO NOT WRITE CODE, OUTPUT THE LIST AND INCLUDE ALL NAMES
    DO NOT WRITE "NO ONE"
    YOU MUST INCLUDE EVERYONE.
    
    """
    
    data = {
    "contents": [
        {
            "parts": [{"text": PROMPT}]
        }
    ]
    }
    headers = {
    "Content-Type": "application/json"
    }



    response = requests.post(API_LINK, headers=headers, json=data)
   


    response_text = response.json().get('candidates')[0].get("content").get("parts")[0].get('text')
    

    actual_list =  ast.literal_eval(response_text)
    
    return actual_list


def _format_user_stats(users):
    formatted_users = []
    
    for user in users:
        user_name = user.get("name")
        stats = user.get("stats", [0, 0])
        uncompleted, completed = stats[0], stats[1]
        
        formatted_users.append(f"{user_name}: {uncompleted} UNCOMPLETED vs {completed} COMPLETED")
    
    return "\n".join(formatted_users)

def select_best_user_stats(chosen_users: list[str], users: list[dict] ) -> str:
    PROMPT = f"""You have a list of sorted user IDs, and their stats. The list is sorted from most qualified to least qualified
    The stats represent the total story points of uncompleted tickets, vs the total story
    points of completed tickets. Your job is to decide who should be given this ticket.
    Consider the workload that each user currently has, as well as how qualified each user is.
    YOU MUST CHOOSE 1 USER. IF THE NAMES ARE NUMBERS, USE THE EXACT NUMBERS, NOT USER [NUMBER]. JUST THE NUMBER

    SORTED: {chosen_users}

    STATS:
    {_format_user_stats(users)}

    OUTPUT EXACTLY LIKE THIS: "1, description on why you chose 1"

    DO NOT WRITE CODE OR OUTPUT ANYTHING BUT THE NAME AND DESCRIPTION JUST LIKE THE EXAMPLE FORMAT. DESCRIPTION SHOULD BE
    AT LEAST 2 SENTENCES
    
    """
    data = {
    "contents": [
        {
            "parts": [{"text": PROMPT}]
        }
    ]
    }
    headers = {
    "Content-Type": "application/json"
    }

    response = requests.post(API_LINK, headers=headers, json=data)
   


    response_text = response.json().get('candidates')[0].get("content").get("parts")[0].get('text')

    return response_text


@api_view(['POST'])
def getBestUser(request):
    """
    example users: [{name: "user1", skills: ["skill1, skill2, etc], stats: [123, 321]}, ...]

    """

    description = request.data.get('description')
    users = request.data.get("users")

    # Validate description
    if not isinstance(description, str):
        return Response({"error": "Description must be a string."}, status=400)

    # Validate users (tickets)
    # if not isinstance(users, list):
    #     return Response({"error": "Users must be a list"}, status=400)
    

    try:
        usersData = json.loads(users)
        print(users)
        skills = get_skills(description)
        print(skills)
        sorted_users = sort_user_skills(skills, usersData)
        print("SORTED: ", sorted_users)
        best_user = select_best_user_stats(sorted_users, usersData)
        print("BEST USER: ", best_user)
        return Response({"best_user_and_desc": best_user}, status=200)
    except:
        return Response({"error": "an error occured within the server"}, status=500)




# tickets = [
#     {"name": "user1", "skills": "Numpy, sklearn", "stats": [100, 21]},
#     {"name": "user2", "skills": "Pandas, TensorFlow", "stats": [85, 30]},
#     {"name": "user3", "skills": "Matplotlib, seaborn, PyTorch", "stats": [120, 25]},
#     {"name": "user4", "skills": "Scipy, OpenCV", "stats": [95, 18]},
#     {"name": "user5", "skills": "SQL, PowerBI, Tableau", "stats": [110, 35]},
#     {"name": "user6", "skills": "FastAPI, Flask, Django", "stats": [130, 40]},
#     {"name": "user7", "skills": "Scikit-learn, XGBoost, LightGBM", "stats": [90, 28]},
#     {"name": "user8", "skills": "Java, Spring Boot, Microservices", "stats": [105, 32]},
#     {"name": "user9", "skills": "React, Next.js, Tailwind CSS", "stats": [98, 27]},
#     {"name": "user10", "skills": "Node.js, Express, MongoDB", "stats": [115, 29]},
#     {"name": "user11", "skills": "Docker, Kubernetes, CI/CD", "stats": [140, 45]},
#     {"name": "user12", "skills": "AWS, Terraform, Ansible", "stats": [135, 42]},
#     {"name": "user13", "skills": "Figma, Adobe XD, UI/UX Design", "stats": [80, 20]},
#     {"name": "user14", "skills": "Agile, Scrum, Project Management", "stats": [125, 38]},
#     {"name": "user15", "skills": "Cybersecurity, Ethical Hacking, Penetration Testing", "stats": [150, 50]},
# ]



# skills = get_skills("Implement Random Forest")


# print("SKILLS", skills)
# sorted_users = sort_user_skills(skills, tickets)

# print("SORTED:", sorted_users)

# best_user = select_best_user_stats(sorted_users, tickets)

# print(best_user)







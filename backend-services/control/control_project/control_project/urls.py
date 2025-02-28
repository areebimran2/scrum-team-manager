"""
URL configuration for control_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from userprofile_app import views as views_userprofile
from signup_app import views as views_signup
from login_app import views as views_login
from ticket_app import views as views_ticket
from projectControl import views as views_project
from user_projects_app import views as views_userprojects

urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/', views_signup.signup_handler),
    path('login/', views_login.login_handler),
    path('login/recover/', views_login.UserLoginRecoveryView.as_view()),
    path('userprofile/', views_userprofile.userprofile_post_handler),
    path('userprofile/<str:uid_str>', views_userprofile.userprofile_get_handler),
    path('userprojects/', views_userprojects.UserAllProjectsView.as_view()),
    path('project/<int:pid>/tickets/', views_userprojects.ProjectTicketsView.as_view()),
    path('project/<int:pid>/members/', views_userprojects.ProjectMembersView.as_view()),
    path('project/<int:pid>/assign/', views_userprojects.ProjectTicketAssignView.as_view()),
    path('project/<int:pid>/unassign/', views_userprojects.ProjectTicketUnassignView.as_view()),
    path('project/<int:pid>/send-invite/', views_userprojects.ProjectInviteView.as_view()),
    path("invitations/", include('invitations.urls', namespace='invitations')),
    path('project/add/', views_project.createProject),
    path('project/query/<str:pid_str>', views_project.getProject),
    path('project/update/', views_project.updateProject),
    path('project/adminview/<str:pid_str>', views_project.adminView),
    path('ticket/<str:tid_str>', views_ticket.ticket_get_delete_handler),
    path('ticket/update/', views_ticket.ticket_update_handler),
    path('project/editstatus/', views_project.editStatus)
]

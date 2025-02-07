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
from django.urls import path

from userprofile_app import views as views_userprofile
from signup_app import views as views_signup
from login_app import views as views_login


urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/', views_signup.signup_handler),
    path('login/', views_login.login_handler),
    path('login/recover/', UserLoginRecoveryView.as_view()),
    path('userprofile/', views_userprofile.userprofile_handler)
]

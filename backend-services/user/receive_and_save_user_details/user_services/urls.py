from django.urls import path
from . import views

urlpatterns = [
    path("queryand/", views.query_AND, name="query_AND"),
    path("add/",views.add_user, name="add_user"),
    path("update/", views.update_user, name="update_user"),
    path("queryor", views.query_OR, name="query_OR")
]
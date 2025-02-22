from django.urls import path
from . import views

urlpatterns = [
    path("query/<int:key>/", views.query, name="query"),
    path("add/",views.add_project, name="add_project"),
    path("update/", views.update_project, name="update_project"),
]
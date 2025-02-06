from django.urls import path
from . import views

urlpatterns = [
    path("query/<str:case>/<str:input>/", views.query, name="query"),
    path("add/",views.add_user, name="add_user"),
    path("update/", views.update_user, name="update_user"),
]

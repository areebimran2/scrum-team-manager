from django.urls import path
from . import views

urlpatterns = [
    path("query/<int:key>/", views.query, name="query"),
    path("add/",views.add_ticket, name="add_ticket"),
    path("update/", views.update_ticket, name="update_ticket"),
]

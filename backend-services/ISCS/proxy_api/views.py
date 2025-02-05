from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
import requests

class ProxyAPIView(APIView):
    # Note: The current implementation uses a 'catch-all' url. The idea is that the path remains
    # the same as the request travels from the frontend all the way down to the resource.

    def get(self, request):
        # send a GET http request to the resource, repackage this response and return it to the control
        service_response = self._relay_request(request, 'GET')
        return HttpResponse(service_response, status=service_response.status_code)

    def post(self, request):
        # send a POST http request to the resource
        service_response = self._relay_request(request, 'POST')
        return HttpResponse(service_response, status=service_response.status_code)

    def _relay_request(self, request, method):
        # The current implementation assumes that the path provided by the request is a valid
        # endpoint within the service

        # Relay request to resource and return the response
        service = self._get_target_url(request) + request.path
        service_response = requests.request(method, service, data=request.data, headers=request.headers)
        return service_response

    def _get_target_url(self, request):
        # Tentative approach: Assumes the path remains unchanged from frontend -> control -> iscs -> resource.
        # A 'catch-all' url is used to resolve the request from the control.
        # The target url is determined from the path in this implementation, hence the reason it must be unchanged.
        service = request.path.split('/')[0]

        # The '<host>:<port>' of each (resource) microservice is kept in a dictionary in settings.py
        # Currently assumes all services in MICROSERVICES are running
        target_service = settings.MICROSERVICES.get(service)
        return target_service



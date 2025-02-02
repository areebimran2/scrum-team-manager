from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
import requests

class ProxyAPIView(APIView):
    # Note: The current implementation uses a 'catch-all' url. The idea is that the path remains
    # the same as the request travels from the frontend all the way down to the resource (not sure if this
    # is how we planned it, but this was my tentative approach).

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
        service = self._get_target_url() + request.path
        service_response = requests.request(method, service, data=request.data, headers=request.headers)
        return service_response

    def _get_target_url(self):
        # TODO: Determine the correct service to forward this request to

        # Not sure how this should be done as it somewhat depends on how information is received. Will the control
        # provide extra info in the header about where the ISCS should route the request? Or maybe the ISCS decides
        # itself by using the request path?

        # The '<host>:<port>' of each (resource) microservice is kept in a dictionary in settings.py
        target_service = settings.MICROSERVICES.get()
        return target_service



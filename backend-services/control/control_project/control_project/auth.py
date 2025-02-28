import json

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings
from django.utils.translation import gettext_lazy as _

import requests

from login_app.models import UserFullModel


class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError:
            raise InvalidToken(_("Token contained no recognizable user identification"))

        try:
            url = "http://127.0.0.1:8001"
            response = requests.get(url + "/user/query/UID/{0}".format(user_id))
            user = UserFullModel(**response.json()[0])
        except json.decoder.JSONDecodeError:
            raise AuthenticationFailed(_("User not found"), code="user_not_found")

        return user
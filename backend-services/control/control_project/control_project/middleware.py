from control_project import settings

class AuthenticationTransformationLayer:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the header-payload and signature cookies have been provided
        # by the request
        cookie_1 = request.COOKIES.get(settings.JWT_COOKIE_HEADER_PAYLOAD)
        cookie_2 = request.COOKIES.get(settings.JWT_COOKIE_SIGNATURE)

        # If cookies have been provided, rebuild JWT and add it to the headers before
        # reaching the view logic
        if cookie_1 and cookie_2:
            jwt = f'{cookie_1}.{cookie_2}'
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {jwt}'

        # Obtain response from view logic
        response = self.get_response(request)

        if cookie_1 and cookie_2:
            # Refresh the token and send back in header (as a cookie)
            response.set_cookie(
                key='cookie_1',
                value=cookie_1,
                max_age=settings.COOKIE_AGE.total_seconds(),
                secure=True
            )

        return response

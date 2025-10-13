from threading import local

_thread_locals = local()


class ActivityMiddleware:
    """Middleware to store current user in thread local storage"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _thread_locals.user = getattr(request, 'user', None)
        response = self.get_response(request)
        return response

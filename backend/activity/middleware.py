from threading import local

# Global thread local storage
_thread_locals = local()


def get_current_user():
    """Helper function to get current user from thread local"""
    return getattr(_thread_locals, 'user', None)


class ActivityMiddleware:
    """Middleware to store current user in thread local storage"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _thread_locals.user = getattr(request, 'user', None)
        response = self.get_response(request)
        # Clean up after request
        if hasattr(_thread_locals, 'user'):
            del _thread_locals.user
        return response

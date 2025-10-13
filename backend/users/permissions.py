from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Permission check for Admin users only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsStaffUser(permissions.BasePermission):
    """
    Permission check for Staff users
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'staff'
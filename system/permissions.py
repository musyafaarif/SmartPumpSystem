from rest_framework import permissions, renderers

class SuperUserPass(permissions.BasePermission):
    """
    Always allow superuser
    """
    def has_permission(self, request, view):
        return request.user.is_superuser

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        # print(view.perform_content_negotiation(request, force=True))
        if request.method in permissions.SAFE_METHODS:
            return True

    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the owner of the snippet.
        return obj.owner == request.user

class IsOwnerHostOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object host to edit it.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.

        # Write permissions are only allowed to the owner of the snippet.
        return obj.host.owner == request.user

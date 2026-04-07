from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Admin = CRUD 
    Viewer = lecture seule
    """

    def has_permission(self, request, view):
        # GET, HEAD, OPTIONS → autorisés pour tous les utilisateurs connectés
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        # POST, PUT, PATCH, DELETE → admin uniquement
        return (
            request.user.is_authenticated
            and hasattr(request.user, "role")
            and request.user.role == "admin"
        )

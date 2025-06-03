from rest_framework.permissions import BasePermission

"""
* IsPayingUser -> This class is used to determine whether a user is a paying user based on their status in the database. 
*   It gives the user perission to certain view routes based on this status
* 
* FIELDS
*   has_permission(self, request, view) -> This overrides the base has_permission function. It returns a boolean value
"""
class IsPayingUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_paying_user
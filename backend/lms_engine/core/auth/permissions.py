from rest_framework.permissions import BasePermission, SAFE_METHODS

from ..user.models import User, Roles


class ModelPermissionsMixin:
    def student_has_access(self, user: User):
        return (False, False, False)

    def instructor_has_access(self, user: User):
        raise NotImplementedError

    def staff_has_access(self, user: User):
        raise NotImplementedError

    def moderator_has_access(self, user: User):
        raise NotImplementedError

    def admin_has_access(self, user: User):
        raise NotImplementedError

    def superadmin_has_access(self, user: User):
        return (True, True, True)


class RoleBasedPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.role == Roles.STUDENT:
            return request.method in SAFE_METHODS

        # Check access at the object level
        return True

    def has_object_permission(self, request, view, obj: ModelPermissionsMixin):
        role: Roles = request.user.role

        is_read = request.method in SAFE_METHODS
        is_delete = request.method == "DELETE"
        is_write = not is_read and not is_delete

        if role == Roles.STUDENT:
            access = obj.student_has_access(request.user)

        elif role == Roles.INSTRUCTOR:
            access = obj.instructor_has_access(request.user)

        elif role == Roles.STAFF:
            access = obj.staff_has_access(request.user)

        elif role == Roles.MODERATOR:
            access = obj.moderator_has_access(request.user)

        elif role == Roles.ADMIN:
            access = obj.admin_has_access(request.user)

        elif role == Roles.SUPERADMIN:
            access = obj.superadmin_has_access(request.user)

        return access[0] if is_read else access[1] if is_write else access[2]

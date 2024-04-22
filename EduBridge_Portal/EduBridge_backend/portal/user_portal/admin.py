from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from user_portal.models import Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'
    fk_name = 'user'

class CustomUserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, )
    list_display = ('username', 'email', 'is_staff', 'get_role', 'get_is_approved')
    list_select_related = ('profile', )

    def get_role(self, instance):
        return instance.profile.role
    get_role.short_description = 'Role'

    def get_is_approved(self, instance):
        return instance.profile.is_approved
    get_is_approved.short_description = 'Is Approved'
    get_is_approved.boolean = True

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.prefetch_related('profile')
        return queryset

    actions = ["approve_teachers"]

    def approve_teachers(self, request, queryset):
        # Fixed method
        for user in queryset:
            if hasattr(user, 'profile') and user.profile.role == 'teacher':
                user.profile.is_approved = True
                user.profile.save()
        self.message_user(request, "Selected teacher accounts have been approved.")
        
    approve_teachers.short_description = "Approve selected teachers"

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

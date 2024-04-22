from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    USER_ROLES = [
        ('teacher', 'Teacher'),
        ('parent', 'Parent'),
        ('student', 'Student'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=USER_ROLES)
    is_approved = models.BooleanField(default=False, help_text="Indicates if a teacher's account is approved. Ignored for other roles.")
    parent = models.ForeignKey('self', on_delete=models.PROTECT, null=True, blank=True, related_name='children', help_text="Indicates a student's parent user account.")
    
    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    def save(self, *args, **kwargs):
        if self.role != 'teacher':
            self.is_approved = True
        super().save(*args, **kwargs)

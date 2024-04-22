from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.contrib.auth.models import User
from user_portal.models import Profile
from django.dispatch import Signal
from django.core.cache import cache

password_reset_request = Signal()
        
@receiver(post_save, sender=User)
def user_registration_email(sender, instance, created, **kwargs):
    if created:
        subject = 'Welcome to Our Platform'
        message = f"""
        Hello {instance.username}, 
        
        Welcome to the EduBridge Portal!. You have successfully registered.
        
        Your information is as follows:
        Username: {instance.username}
        Email: {instance.email}

        Thank you for joining us!
        
        Sincerely,
        The EduBridge Portal Team"""
        try:
            send_mail(subject, message, "EduBridge Portal Team", [instance.email], fail_silently=False) 
        except Exception as e:
            print("Error sending email: ", e)

@receiver(pre_save, sender=Profile)
def capture_is_approved_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            original = sender.objects.get(pk=instance.pk)
            cache.set(f'is_approved_{instance.pk}', original.is_approved, timeout=60)  
        except sender.DoesNotExist:
            pass
        
@receiver(post_save, sender=Profile)
def teacher_account_status_email(sender, instance, created, **kwargs):
    if created and instance.role == 'teacher':
        send_teacher_account_created_email(instance)
    elif not created:
        original_is_approved = cache.get(f'is_approved_{instance.pk}')
        cache.delete(f'is_approved_{instance.pk}') 
        if instance.is_approved and (instance.is_approved != original_is_approved):
            send_teacher_account_approved_email(instance)
            
def send_teacher_account_created_email(instance):
    subject = 'Teacher Account Pending Approval'
    message = f"""
                Hello {instance.user.username}, 
                
                Welcome to the EduBridge Portal! Your teacher account is pending approval.
                Once the admin approves your account, you will receive an email notification.
                
                Your information is as follows:
                Username: {instance.user.username}
                Email: {instance.user.email}

                Thank you for joining us!
                
                Sincerely,
                The EduBridge Portal Team"""
    send_mail(subject, message, "EduBridge Portal Team", [instance.user.email], fail_silently=False)

def send_teacher_account_approved_email(instance):
    subject = 'Teacher Account Approved'
    message = f"""
                Hello {instance.user.username},

                Your teacher account has been approved. You can now access the teacher dashboard.

                Your information is as follows:
                Username: {instance.user.username}
                Email: {instance.user.email}

                Thank you for joining us!

                Sincerely,
                The EduBridge Portal Team"""
    send_mail(subject, message, "EduBridge Portal Team", [instance.user.email], fail_silently=False)

@receiver(pre_save, sender=User)
def user_update_email(sender, instance, **kwargs):
    if instance.pk:
        old_user = User.objects.get(pk=instance.pk)
        if instance.username != old_user.username or instance.email != old_user.email:
            subject = 'Profile Update Notification'
            message = f"""
                        Hello {instance.username},

                        Your profile has been updated. If you did not make this change, please contact the admin.

                        Your information is as follows:
                        Username: {instance.username}
                        Email: {instance.email}

                        Thank you for joining us!

                        Sincerely,
                        The EduBridge Portal Team"""
            try:
                send_mail(subject, message, "EduBridge Portal Team", [instance.email], fail_silently=False)
            except Exception as e:
                print("Error sending email: ", e)

@receiver(password_reset_request)
def send_password_reset_email(sender, **kwargs):
    email = kwargs['email']
    user = kwargs['user']
    reset_password_link = kwargs['reset_password_link']
    subject = "Reset Password Notification"
    message = f"""
                    Hello {user.username}, 

                    You have requested to reset your password. Please click the link below to reset your password.

                    Reset Password Link: {reset_password_link}

                    If you did not request this, please ignore this email.

                    Sincerely,
                    The EduBridge Portal Team"""
    send_mail(subject, message, 'EduBridge Portal Team', [email], fail_silently=False)
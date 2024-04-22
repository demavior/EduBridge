from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from edubridge_portal.models import *

User = get_user_model()

@receiver(post_save, sender=Classroom)
def send_classroom_creation_email(sender, instance, created, **kwargs):
    if created:
        user = instance.owner
        classroom_name = instance.name
        classroom_creation_date = instance.created_at

        subject = 'Successfully Classroom Created:'
        message = f"""
                    Hi {user.username},
                    
                    You have successfuly created a new classroom. 
                    
                    Please find you classroom details below:
                    
                    your classroom name is: {classroom_name}. 
                    your classroom creation date is: {classroom_creation_date}.
                    
                    You well need to create a sample for the classroom so that the user can start the classroom sections. 
                    
                    Sincerely, 
                    The EduBridge Team. """
                    
        try:
            send_mail(subject, message, 'Edubridge Team', [user.email], fail_silently=False)
        except:
            logger.error('Error sending email')
            
@receiver(post_save, sender=Sample)
def send_sample_creation_email(sender, instance, created, **kwargs):
    if created:
        user = instance.classroom.owner
        sample_name = instance.name
        sample_token = instance.token
        sample_creation_date = instance.created_at

        subject = 'Successfully Sample Created:'
        message = f"""
                    Hi {user.username},
                    
                    You have successfuly created a new sample. 
                    
                    Please find you sample details below:
                    
                    your sample name is: {sample_name}-on-{instance.classroom.name}.
                    your sample token is: {sample_token},
                    
                    Students will need this token to enroll in the classroom.
                    
                    Time sample was created is: {sample_creation_date}.
                    
                    Sincerely, 
                    The EduBridge Team. """
                    
        try:
            send_mail(subject, message, 'Edubridge Team', [user.email], fail_silently=False)
        except:
            logger.error('Error sending email')
            
            
@receiver(post_save, sender=Enrollment)
def send_enrollment_email(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        classroom = instance.classroom
        sample = instance.sample

        subject = 'Successfully Enrolled in Classroom:'
        message = f"""
                    Hi {user.username},
                    
                    You have successfuly enrolled in a classroom. 
                    
                    Please find you classroom details below:
                    
                    your classroom name is: {classroom.name}. 
                    your sample name is: {sample.name}.
                    
                    You can now start the classroom sections. 
                    
                    Sincerely, 
                    The EduBridge Team. """
                    
        try:
            send_mail(subject, message, 'Edubridge Team', [user.email], fail_silently=False)
        except:
            logger.error('Error sending email')
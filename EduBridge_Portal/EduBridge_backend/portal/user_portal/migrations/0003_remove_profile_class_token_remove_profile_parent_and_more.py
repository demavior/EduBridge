# Generated by Django 5.0.2 on 2024-02-26 01:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_portal', '0002_profile_is_approved'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='class_token',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='parent',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='student_id',
        ),
    ]

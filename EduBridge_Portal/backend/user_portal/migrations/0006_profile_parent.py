# Generated by Django 5.0.1 on 2024-04-22 02:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_portal', '0005_remove_profile_class_token_remove_profile_parent_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='parent',
            field=models.ForeignKey(blank=True, help_text="Indicates a student's parent user account.", null=True, on_delete=django.db.models.deletion.PROTECT, related_name='children', to='user_portal.profile'),
        ),
    ]

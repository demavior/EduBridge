# Generated by Django 5.0.1 on 2024-04-19 06:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edubridge_portal', '0004_alter_videoupload_video_upload'),
    ]

    operations = [
        migrations.AddField(
            model_name='userresponse',
            name='grade',
            field=models.IntegerField(blank=True, help_text='Grade for the response', null=True),
        ),
    ]

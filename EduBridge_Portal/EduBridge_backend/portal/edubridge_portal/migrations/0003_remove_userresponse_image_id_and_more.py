# Generated by Django 5.0.1 on 2024-04-04 13:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edubridge_portal', '0002_remove_dataitem_video_data_choice_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userresponse',
            name='image_id',
        ),
        migrations.RemoveField(
            model_name='scalingquestion',
            name='question',
        ),
        migrations.RemoveField(
            model_name='videourl',
            name='classroom',
        ),
        migrations.RemoveField(
            model_name='videourl',
            name='sample',
        ),
        migrations.RemoveField(
            model_name='userresponse',
            name='video_url',
        ),
        migrations.RemoveField(
            model_name='question',
            name='is_contingency',
        ),
        migrations.AlterField(
            model_name='classroom',
            name='data',
            field=models.CharField(choices=[('VDUP', 'Video Upload'), ('TX', 'Text')], default='', max_length=10),
        ),
        migrations.AlterField(
            model_name='dataitem',
            name='data_type',
            field=models.CharField(choices=[('VDUP', 'Video Upload'), ('TX', 'Text')], max_length=5, null=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.CharField(choices=[('MC', 'Multiple Choice'), ('SC', 'Single Choice'), ('CM', 'Comment'), ('DD', 'Dropdown'), ('CB', 'Checkbox')], default='', max_length=3),
        ),
        migrations.DeleteModel(
            name='ImageDataType',
        ),
        migrations.DeleteModel(
            name='ScalingQuestion',
        ),
        migrations.DeleteModel(
            name='VideoUrl',
        ),
    ]

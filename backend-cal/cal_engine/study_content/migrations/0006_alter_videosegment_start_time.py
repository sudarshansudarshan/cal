# Generated by Django 4.2.16 on 2024-12-03 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('study_content', '0005_delete_videoassessment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='videosegment',
            name='start_time',
            field=models.PositiveIntegerField(blank=True, help_text='Start time in seconds', null=True),
        ),
    ]

# Generated by Django 4.1.2 on 2022-12-23 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1782', '0013_alter_a_class_a_class'),
    ]

    operations = [
        migrations.AlterField(
            model_name='q_class',
            name='q_class',
            field=models.CharField(max_length=500, unique=True),
        ),
    ]

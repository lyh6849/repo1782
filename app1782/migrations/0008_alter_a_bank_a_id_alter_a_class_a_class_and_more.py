# Generated by Django 4.1.2 on 2022-12-07 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1782', '0007_rename_a_dup_a_bank_a_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='a_bank',
            name='a_id',
            field=models.CharField(max_length=600, unique=True),
        ),
        migrations.AlterField(
            model_name='a_class',
            name='a_class',
            field=models.CharField(max_length=500, unique=True),
        ),
        migrations.AlterField(
            model_name='q_bank',
            name='q_id',
            field=models.CharField(max_length=500, unique=True),
        ),
        migrations.AlterField(
            model_name='q_class',
            name='q_class',
            field=models.CharField(max_length=500, unique=True),
        ),
    ]

from django.db import models

# Create your models here.

class q_class(models.Model):
    id = models.AutoField(primary_key=True)
    q_class=models.CharField(max_length=500, unique=True)
    q_value = models.CharField(max_length=500)
    q_type = models.CharField(max_length=600)

class a_class(models.Model):
    id = models.AutoField(primary_key=True)
    a_class=models.CharField(max_length=500, unique=True)
    q_class=models.CharField(max_length=500)
    a_value = models.CharField(max_length=500)

class q_bank(models.Model):
    id = models.AutoField(primary_key=True)
    q_id=models.CharField(max_length=500, unique=True)
    q_value = models.CharField(max_length=500)
    q_type = models.CharField(max_length=600)
    q_class=models.CharField(max_length=500)

class a_bank(models.Model):
    a_id= models.CharField(max_length=600, unique=True)
    a_value = models.CharField(max_length=400)
    q_id = models.CharField(max_length=600)
    a_class=models.CharField(max_length=500)
    a_note = models.CharField(max_length=1000,null=True)
    a_lvl = models.CharField(max_length=20,null=True)

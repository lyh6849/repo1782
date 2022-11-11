from django.db import models

# Create your models here.
class train_test_data(models.Model):
    text= models.CharField(max_length=1000)
    pcp= models.CharField(max_length=10)
    alarm= models.CharField(max_length=10)
    result= models.CharField(max_length=10)
    etc= models.CharField(max_length=10)
    class Meta:
        db_table="train_test_data"

class test_data(models.Model):
    data= models.CharField(max_length=1000)


